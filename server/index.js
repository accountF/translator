const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const wordGroupRouter = require("./routes/wordGroups");
const wordRouter = require("./routes/words");
const testResultRouter = require("./routes/testResults");

const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());
app.use("/", userRouter);
app.use("/", wordGroupRouter);
app.use("/", wordRouter);
app.use("/", testResultRouter);

const url = "mongodb://0.0.0.0:27017/Translator";

mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

app.listen(3000);
