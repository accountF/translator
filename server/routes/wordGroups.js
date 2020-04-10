const express = require("express");
const WordGroups = require("../models/wordGroups");

const router = express.Router();

router.get("/wordGroups", (req, res) => {
	WordGroups.aggregate([
		{
			$lookup: {
				from: "words",
				localField: "_id",
				foreignField: "wordGroupId",
				as: "words"
			}
		}
	]).then((wordGroups) => {
		let results = wordGroups.map((wordGroup) => {
			let result = {
				id: wordGroup._id.toString(),
				groupName: wordGroup.groupName,
				date: wordGroup.date,
				numberOfWords: wordGroup.words.length
			};
			return result;
		});
		res.send(results);
	});
});

router.post("/wordGroups", (req, res, next) => {
	WordGroups.create(req.body).then((wordGroup) => {
		let result = {
			id: wordGroup._id.toString(),
			groupName: wordGroup.groupName,
			date: wordGroup.date
		};
		res.send(result);
	}).catch(next);
});

router.put("/wordGroups/:id", (req, res) => {
	WordGroups.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
		WordGroups.findOne({_id: req.params.id}).then((wordGroup) => {
			res.send(wordGroup);
		});
	});
});

module.exports = router;
