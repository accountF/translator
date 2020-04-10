const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const WordGroupsScheme = new Scheme({
	groupName: String,
	date: String,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users"
	}
}, {versionKey: false});

const WordGroups = mongoose.model("wordgroups", WordGroupsScheme);

module.exports = WordGroups;

