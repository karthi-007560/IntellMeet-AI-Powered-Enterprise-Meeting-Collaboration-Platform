import mongoose, {Schema, type Document} from "mongoose";

export type EmployeeStatus = "active" | "inactive" | "on-leave";


export interface IEmployee extends Document {
    userId: mongoose.Types.ObjectId;
    tenantId: mongoose.Types.ObjectId;
    employeeId: string;
    department?: string;
    designation?: string;
    phone?: string;
    dateOfJoining?: Date;
    status: EmployeeStatus;
}

const employeeSchema = new Schema<IEmployee>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "Tenant",
            required: true,
            index: true,
        },
        employeeId: {
            type: String,
            required: true,
            trim: true,
        },
        department: {
            type: String,
            trim: true,
        },
        designation: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        dateOfJoining: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "on-leave"],
            default: "active",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

employeeSchema.index(
    { tenantId: 1, employeeId: 1 },
    { unique: true }
);

const Employee =
    mongoose.models.Employee ||
    mongoose.model<IEmployee>("Employee", employeeSchema);

export default Employee;

