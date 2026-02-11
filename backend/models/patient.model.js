import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    phone: { type: String },
    address: { type: String },
    bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
  },
  { timestamps: true }
);

const Patient = mongoose.model( "Patient", patientSchema );
export default Patient;