const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		require: [true, 'Username is required']
	},
	email: {
		type: String,
		require: [true, 'Email is required']
	},
	password: {
		type: String,
		require: [true, 'Password is required']
	},
	isAdmin: {
		type: Boolean,
        default: false
	}
})

module.exports = mongoose.model('User', userSchema);