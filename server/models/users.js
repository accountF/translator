const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const UsersScheme = new Scheme({
	name: String,
	login: String,
	password: String
}, {versionKey: false});

const Users = mongoose.model("users", UsersScheme);

module.exports = Users;

