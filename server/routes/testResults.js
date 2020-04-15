const express = require("express");
const TestResults = require("../models/testResults");

const ObjectId = require("mongodb").ObjectID;

const router = express.Router();

router.get("/", (req, res) => {
	let userId = req.user._id;
	TestResults.aggregate([
		{
			$match: {userId: ObjectId(userId)}
		},
		{
			$lookup: {
				from: "wordgroups",
				localField: "wordGroupId",
				foreignField: "_id",
				as: "wordGroupInfo"
			}
		},
		{
			$project: {
				_id: 0,
				id: "$_id",
				result: 1,
				date: 1,
				groupName: "$wordGroupInfo.groupName"
			}
		}
	]).then((testResults) => {
		testResults.map((testResult, index) => {
			testResult.ordinalNumber = index + 1;
		});
		res.send(testResults);
	});
});

router.post("/addResult", (req, res, next) => {
	let userId = req.user._id;
	TestResults.create({
		userId,
		result: req.body.result,
		date: req.body.date,
		wordGroupId: req.body.wordGroup
	}).then((result) => {
		res.send(result);
	}).catch(next);
});

module.exports = router;
