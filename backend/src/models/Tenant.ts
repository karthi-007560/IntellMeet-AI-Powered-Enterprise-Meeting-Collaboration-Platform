
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITenant extends Document {
    name: string;
    code: string;
    status: "active" | "inactive" | "suspended";
    createdBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
            maxlength: 30,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Tenant = mongoose.model<ITenant>(
    "Tenant",
    tenantSchema
);
