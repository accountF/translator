const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const wordGroupRouter = require("./routes/wordGroups");
const wordRouter = require("./routes/words");
const testResultRouter = require("./routes/testResults");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(cors());
app.use("/users", userRouter);
app.use("/wordGroups", wordGroupRouter);
app.use("/words", wordRouter);
app.use("/testResults", testResultRouter);

const url = "mongodb://0.0.0.0:27017/Translator";

mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

app.listen(3000);
