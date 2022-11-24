const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Invite = require('../models/Invite');

const wishlistSchema = new Schema({
    id: ObjectId,
    title: {
        type: String,
        required: [true, 'Please provide wishlist title']
    },
    description: {
        type: String,
        required: [true, 'Please provide wishlist description']
    },
    owner: {
        type: ObjectId,
        required: [true, 'Please provide wishlist owner']
    },
    invites: [
        {
            type: Invite.schema
        }
    ]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;