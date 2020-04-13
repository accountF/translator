const express = require("express");
const WordGroups = require("../models/wordGroups");
const AuthManager = require("../authManager");

const ObjectId = require("mongodb").ObjectID;

const router = express.Router();

router.get("/", (req, res) => {
	let userToken = req.headers.auth;
	let userId = AuthManager.getCurrentUser(userToken);
	WordGroups.aggregate([
		{
			$match: {userId: ObjectId(userId)}
		},
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

router.post("/", (req, res, next) => {
	let userToken = req.headers.auth;
	let userId = AuthManager.getCurrentUser(userToken);
	WordGroups.create({
		userId,
		groupName: req.body.groupName,
		date: req.body.date
	}).then((wordGroup) => {
		let result = {
			id: wordGroup._id.toString(),
			groupName: wordGroup.groupName,
			date: wordGroup.date
		};
		res.send(result);
	}).catch(next);
});

router.put("/:id", (req, res) => {
	WordGroups.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
		WordGroups.findOne({_id: req.params.id}).then((wordGroup) => {
			res.send(wordGroup);
		});
	});
});

module.exports = router;
