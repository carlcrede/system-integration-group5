const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const inviteSchema = new Schema({
    id: ObjectId,
    email: {
        type: String,
        required: [true, 'Please provide email']
    },
    status: {
        type: String,
        required: [true, 'Please provide status']
    },    
    expiresAt: {
        type: Date,
        required: [true, 'Please provide expiration date']
    },
    token: {
        type: String,
        required: [true, 'Please provide token']
    }
});

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;