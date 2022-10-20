const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    id: ObjectId,
    email: {
        type: String,
        required: [true, "Please provid an email"]
    },
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    picturePath: {
        type: String
    }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);