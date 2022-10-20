const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inviteSchema = new Schema({
    invitee_email: {
        type: String,
        required: [true, 'Please provide invitee email']
    },
    invited_email: {
        type: String,
        required: [true, 'Please provide invited email']
    },
    token: {
        type: String,
    },
    expiration: {
        type: Date
    }
});

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;