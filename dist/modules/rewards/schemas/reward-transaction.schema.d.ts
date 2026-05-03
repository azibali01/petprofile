import { HydratedDocument, Types } from 'mongoose';
export type RewardTransactionDocument = HydratedDocument<RewardTransaction>;
export declare class RewardTransaction {
    userId: Types.ObjectId;
    amountCents: number;
    logId?: Types.ObjectId;
    type: 'award' | 'redeem';
}
export declare const RewardTransactionSchema: import("mongoose").Schema<RewardTransaction, import("mongoose").Model<RewardTransaction, any, any, any, import("mongoose").Document<unknown, any, RewardTransaction, any, {}> & RewardTransaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RewardTransaction, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<RewardTransaction>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<RewardTransaction> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
