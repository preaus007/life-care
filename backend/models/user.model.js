import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password:{
        type: String,
        required: true
    },

    profileImage: {
        public_id: { 
            type: String, 
            default: "" 
        },
        url: { 
            type: String, 
            default: "" 
        }
    },

    role: {
        type: String,
        enum: [ "Patient", "Doctor", "Admin" ],
        default: "Patient",
    },
    
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    refreshToken: String
},
{
    timestamps:true
}
);

const User = mongoose.model( "User", userSchema );

export default User;