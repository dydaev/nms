import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 3 },
    privilege: { type: Number, default: 0},
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');