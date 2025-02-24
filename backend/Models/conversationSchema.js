import mongoose from 'mongoose';


const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Link to the user
  messages: [{
    sender: { type: String, required: true, enum: ['user', 'bot'] },  // Who sent the message
    text: { type: String, required: true },  // The message content
    timestamp: { type: Date, default: Date.now },  // When the message was sent
  }],
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;