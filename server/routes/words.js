const express = require("express");
const Words = require("../models/words");

const ObjectId = require("mongodb").ObjectID;

const router = express.Router();

router.get("/words/:id", (req, res) => {
	Words.aggregate([
		{
			$match: {wordGroupId: ObjectId(req.params.id)}
		},
		{
			$project: {
				_id: 0,
				id: "$_id",
				wordInEnglish: 1,
				wordInRussian: 1,
				partOfSpeech: 1,
			}
		}
	]).then((words) => {
		res.send(words);
	});
});

router.get("/wordsForTest/:id", (req, res) => {
	let promises = [];
	Words.aggregate([
		{
			$match: {
				wordGroupId: ObjectId(req.params.id)
			}
		},
		{
			$sample: {size: 10}
		}
	]).then((words) => {
		let cards = [];
		words.map((word) => {
			let card = {};
			card.wordInRussian = word.wordInRussian;
			card.wordsInEnglish = [];
			card.wordsInEnglish.push(word.wordInEnglish);

			promises.push(Words.aggregate([
				{
					$match: {
						wordGroupId: ObjectId(req.params.id),
						_id: {$nin: [word._id]},
						partOfSpeech: word.partOfSpeech
					}
				},
				{
					$sample: {size: 3}
				}]).then((words) => {
				words.map((word) => {
					card.wordsInEnglish.push(word.wordInEnglish);
				});
				cards.push(card);
			}));

		});
		Promise.all(promises).then(() => {
			let cardForClient = [];
			cards.map((card) => {
				let result = {};
				card.wordsInEnglish.sort(function () {
					return Math.random() - 0.5;
				});

				card.wordsInEnglish.map((wordInEnglish, index) => {
					result[`version${index}`] = wordInEnglish;
				});

				result.wordInRussian = card.wordInRussian;
				cardForClient.push(result);
			});
			res.send(cardForClient);
		});
	});
});

router.post("/words", (req, res, next) => {
	Words.create(req.body).then((word) => {
		let result = {
			id: word._id.toString(),
			wordInEnglish: word.wordInEnglish,
			wordInRussian: word.wordInRussian
		};
		console.log(result);
		res.send(result);
	}).catch(next);
});

router.post("/getResult", (req, res, next) => {
	let point = 0;
	let promises = [];
	req.body.testResult = JSON.parse(req.body.testResult);
	req.body.testResult.map((result) => {
		promises.push(Words.findOne({
			wordGroupId: req.body.groupId,
			wordInRussian: result.wordInRussian,
			wordInEnglish: result.wordInEnglish
		}).then((word) => {
			if (word) {
				if (word.partOfSpeech.toLowerCase() === "verb" || word.partOfSpeech.toLowerCase() === "noun") {
					point = point + 2;
				} else {
					point++;
				}
			}
		}));
	});
	Promise.all(promises).then(() => {
		console.log(point);
		res.send({point: point});
	});
});

router.put("/words/:id", (req, res) => {
	Words.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
		Words.findOne({_id: req.params.id}).then((word) => {
			console.log(word);
			res.send(word);
		});
	});
});

module.exports = router;
