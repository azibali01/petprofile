import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import OpenAI, { toFile } from 'openai';
import { PetsService } from '../pets/pets.service';
import { Log, LogDocument } from '../logs/schemas/log.schema';

export type ChatHistoryItem = { role: 'user' | 'assistant'; content: string };

@Injectable()
export class AiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly petsService: PetsService,
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
  ) {}

  private openai(): OpenAI | null {
    const key = this.configService.get<string>('openai.apiKey');
    if (!key) {
      return null;
    }
    return new OpenAI({ apiKey: key });
  }

  async chatWithPet(
    userId: string,
    petId: string,
    message: string,
    history: ChatHistoryItem[] = [],
  ): Promise<string> {
    const pet = await this.petsService.findOneForUser(petId, userId);
    const recent = await this.logModel
      .find({ petId: new Types.ObjectId(petId) })
      .sort({ loggedAt: -1 })
      .limit(15)
      .exec();

    const system = `You are a helpful pet-care assistant. Pet profile: ${JSON.stringify(
      pet.toObject(),
    )}. Recent logs (newest first): ${JSON.stringify(
      recent.map((l) => ({
        type: l.type,
        loggedAt: l.loggedAt,
        data: l.data,
      })),
    )}. Answer concisely and practically.`;

    const client = this.openai();
    if (!client) {
      return 'OpenAI is not configured.';
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system },
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: 'user', content: message },
      ],
    });
    return completion.choices[0]?.message?.content ?? '';
  }

  async talkAsPet(
    userId: string,
    petId: string,
    message: string,
  ): Promise<string> {
    const pet = await this.petsService.findOneForUser(petId, userId);
    const moodLogs = await this.logModel
      .find({ petId: new Types.ObjectId(petId), type: { $in: ['mood', 'behaviour'] } })
      .sort({ loggedAt: -1 })
      .limit(10)
      .exec();

    const system = `You are ${pet.name}, a ${pet.species}. Stay in character as the pet would "speak" (first person, playful, short). Use mood/behaviour context: ${JSON.stringify(
      moodLogs.map((l) => l.data),
    )}.`;

    const client = this.openai();
    if (!client) {
      return 'OpenAI is not configured.';
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: message },
      ],
    });
    return completion.choices[0]?.message?.content ?? '';
  }

  async validateLog(input: {
    petId: string;
    userId: string;
    type: string;
    data: Record<string, unknown>;
  }): Promise<boolean> {
    if (!input.data || Object.keys(input.data).length === 0) {
      return false;
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const duplicate = await this.logModel.findOne({
      petId: new Types.ObjectId(input.petId),
      userId: new Types.ObjectId(input.userId),
      type: input.type,
      loggedAt: { $gte: fiveMinutesAgo },
    });
    if (duplicate) {
      return false;
    }

    const json = JSON.stringify(input.data);
    if (json.length > 4000) {
      return false;
    }

    return true;
  }

  async generateWeeklySummary(
    userId: string,
    petId: string,
  ): Promise<{ summary: string }> {
    const pet = await this.petsService.findOneForUser(petId, userId);

    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const logs = await this.logModel
      .find({
        petId: new Types.ObjectId(petId),
        loggedAt: { $gte: from },
      })
      .sort({ loggedAt: 1 })
      .exec();

    const dob = pet.dateOfBirth ? new Date(pet.dateOfBirth) : undefined;
    let ageLabel = 'age unknown';
    if (dob && !Number.isNaN(dob.getTime())) {
      const yrs = Math.floor(
        (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      );
      ageLabel = yrs <= 0 ? 'under 1 year' : `${yrs} year(s) old`;
    }

    const petProfile = {
      name: pet.name,
      species: pet.species,
      breed: pet.breed || 'unspecified',
      age: ageLabel,
    };

    const events = logs.map((l) => ({
      type: l.type,
      loggedAt: l.loggedAt.toISOString(),
      data: l.data,
    }));

    const client = this.openai();
    if (!client) {
      const lines =
        logs.length === 0
          ? 'No logs recorded in the past 7 days.'
          : logs
              .map((l) => `- ${l.type} at ${l.loggedAt.toISOString()}`)
              .join('\n');
      return {
        summary: `Weekly recap (OpenAI not configured).\n\nPet: ${pet.name} (${pet.species}, ${petProfile.breed}, ${ageLabel}).\n${lines}`,
      };
    }

    const systemPrompt = `You are a caring veterinary-adjacent assistant for pet owners. Write one concise, friendly paragraph (4–8 sentences) summarizing the pet's wellbeing and patterns from the activity logs. Highlight routines, meals, exercise, mood, health-related entries, and anything notable. Do not diagnose or prescribe medication; suggest seeing a vet when something seems urgent.`;

    const userPrompt = `Pet profile:\n${JSON.stringify(petProfile, null, 2)}\n\nEvents logged in the past 7 days (${events.length} total):\n${JSON.stringify(events, null, 2)}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const summary =
      completion.choices[0]?.message?.content?.trim() ??
      'No summary could be generated.';

    return { summary };
  }

  async transcribeVoice(audioBuffer: Buffer): Promise<string> {
    const client = this.openai();
    if (!client) {
      return '';
    }
    const file = await toFile(audioBuffer, 'audio.m4a');
    const result = await client.audio.transcriptions.create({
      model: 'whisper-1',
      file,
    });
    return result.text ?? '';
  }
}
