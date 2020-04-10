const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const TestResultsScheme = new Scheme({
	date: String,
	ordinalNumber: String,
	result: String,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users"
	},
	wordGroupId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "wordgroups"
	}
}, {versionKey: false});

const TestResults = mongoose.model("testresults", TestResultsScheme);

module.exports = TestResults;

