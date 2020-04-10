const express = require("express");
const Users = require("../models/users");

const router = express.Router();

router.get("/users", (req, res) => {
	Users.find({}).then((users) => {
		res.send(users);
	})
});

router.post("/signIn", (req, res, next) => {
	Users.findOne({login: req.body.login, password: req.body.password}).then((user) => {
		console.log(user);
		if (user) res.send(user.login);
		else if (!user) res.send();
	}).catch(next);
});

router.post("/signUp", (req, res, next) => {
	Users.findOne({login: req.body.login, password: req.body.password}).then((user) => {
		console.log(user);
		if (user) {
			res.send();
		}
		else if (!user) {
			Users.create(req.body).then((user) => {
				res.send(user.login);
			}).catch(next);
		}
	}).catch(next);
});

module.exports = router;

