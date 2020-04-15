const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../models/users");
const passport = require("passport");

const router = express.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
	res.send(req.user);
});

router.post("/signUp", async (req, res) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	Users.create({
		login: req.body.login,
		password: hashedPassword
	}).then((user) => {
		res.send(user.login);
	});
});

router.get("/", (req, res) => {
	res.send(req.user);
});

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

module.exports = router;

