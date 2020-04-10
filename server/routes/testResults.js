const express = require("express");
const TestResults = require("../models/testResults");

const router = express.Router();

router.get("/results", (req, res) => {
	TestResults.aggregate([
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

router.post("/setResult", (req, res, next) => {
	TestResults.create(req.body).then((result) => {
		res.send(result);
	}).catch(next);
});

module.exports = router;
