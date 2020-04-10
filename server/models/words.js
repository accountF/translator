const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const WordsScheme = new Scheme({
	wordInEnglish: String,
	wordInRussian: String,
	partOfSpeech: String,
	wordGroupId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "wordgroups"
	}
}, {versionKey: false});

const Words = mongoose.model("words", WordsScheme);

module.exports = Words;

