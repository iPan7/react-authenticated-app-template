const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String
});

// Defines the range of possible information within each instance in the collection. Add or remove info at will.

mongoose.model('users', userSchema)

// Defines the name of the model collection. users is the name in this example.