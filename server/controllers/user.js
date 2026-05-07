const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const auth = require('../auth.js');


module.exports.registerUser = async (req, res, next) => {
	try {

		if(!req.body.email || !req.body.email.includes("@")){
			return res.status(400).send({message: "Email invalid"});
		}

		if(!req.body.password || req.body.password < 8){
			return res.status(400).send({message: "Password must atleast 8 characters"});
		}

		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10)
		});

		await newUser.save();

		res.status(201).send({message: "Registered Successfully"});

	}catch(err){
		next(err);
	}
}

module.exports.loginUser = async (req, res, next) => {

	try {

		const user = await User.findOne({email: req.body.email});

		if(!user){
			res.status(404).send({message: "Invalid email or password"});
		}

		const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

		if(!isPasswordCorrect){
			res.status(404).send({message: "Invalid email or password"});
		}

		const token = auth.createAccessToken(user);

		return res.status(200).send({access: token});

	}catch(err){
		next(err);
	}

}

module.exports.getProfile = async(req, res, next) => {

	try {

		const user = await User.findById(req.user.id);

		if(!user){
			return res.status(404).send({message: "User not found"});
		}

		user.password = '';

		return res.status(200).json(user);

	}catch(err){
		next(err);
	}

}