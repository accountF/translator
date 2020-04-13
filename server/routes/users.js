const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const AuthManager = require("../authManager");

const router = express.Router();

const ObjectId = require("mongodb").ObjectID;

router.get("/users", (req, res) => {
	Users.find({}).then((users) => {
		res.send(users);
	});
});

router.post("/signIn", (req, res) => {
	Users.findOne({login: req.body.login}).then((user) => {
		if (!user) {
			res.send();
			return;
		}
		bcrypt.compare(req.body.password, user.password, (err, result) => {
			if (err) {
				console.log(err);
			}
			if (result) {
				const token = jwt.sign(user._id.toString(), "ne vsem");
				let userInfoForClient = {
					userLogin: user.login,
					token
				};
				AuthManager.startSession(user._id, token);
				res.send(userInfoForClient);
			}
			else {
				res.json({success: false, message: "passwords don't match"});
			}
		});
	}).catch(err => res.status(500).json({message: err.message}));
});

router.post("/signUp", (req, res, next) => {
	Users.findOne({login: req.body.login}).then((user) => {
		if (user) {
			res.send();
		}
		else {
			let userRecord = {};
			userRecord.login = req.body.login;

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(req.body.password, salt, (err, hash) => {
					userRecord.password = hash;
					Users.create(userRecord).then((user) => {
						res.send(user.login);
					}).catch(next);
				});
			});
		}
	}).catch(next);
});

router.get("/getUser", (req, res) => {
	let userToken = req.headers.auth;
	let userId = AuthManager.getCurrentUser(userToken);
	Users.findOne({_id: ObjectId(userId)}).then((user) => {
		if (user) {
			let result = {userLogin: user.login};
			res.send(result);
			return;
		}
		res.send();
	});
});

module.exports = router;

