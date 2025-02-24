import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
    },
    picture: {
        type: String, // URL for the user's profile picture
    },
}, { timestamps: true }); // Add createdAt and updatedAt fields automatically

const User = mongoose.model("User", userSchema);
export default User;