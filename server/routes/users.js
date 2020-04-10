const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");

const router = express.Router();

router.get("/users", (req, res) => {
	Users.find({}).then((users) => {
		res.send(users);
	});
});

router.post("/signIn", (req, res, next) => {
	Users.findOne({login: req.body.login}).then((user) => {
		if (!user) {
			res.status(401).json("User doesn't exist");
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
					token: token
				};
				res.send(userInfoForClient);
			} else {
				res.json({success: false, message: "passwords don't match"});
			}
		});
	}).catch(err => res.status(500).json({message: err.message}));
});

router.post("/signUp", (req, res, next) => {
	Users.findOne({login: req.body.login}).then((user) => {
		if (user) {
			res.send();
		} else {
			let userRecord = {};
			userRecord.login = req.body.login;

			bcrypt.genSalt(10, function (err, salt) {
				bcrypt.hash(req.body.password, salt, (err, hash) => {
					userRecord.password = hash;
					Users.create(userRecord).then((user) => {
						res.sendStatus(200);
					}).catch(next);
				});
			});
		}
	}).catch(next);
});

module.exports = router;

