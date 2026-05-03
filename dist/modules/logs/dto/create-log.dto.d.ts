export declare class CreateLogDto {
    petId: string;
    type: 'meal' | 'walk' | 'mood' | 'behaviour' | 'symptom' | 'medication' | 'vet_visit' | 'grooming' | 'expense' | 'weight' | 'training';
    data: Record<string, unknown>;
    voiceTranscript?: string;
    attachments?: string[];
    loggedAt?: string;
}
