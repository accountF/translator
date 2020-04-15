const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const wordGroupRouter = require("./routes/wordGroups");
const wordRouter = require("./routes/words");
const testResultRouter = require("./routes/testResults");
const mainRouter = require("./routes/mainRouter");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");


const mongoose = require("mongoose");

const initializePassport = require("./passport");

initializePassport(passport);


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(cors());

app.use(flash());
app.use(session({
	secret: "ne vsem",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use(express.static(`${__dirname}/public`));
app.set("views", `${__dirname}/public/views`);
app.engine("html", require("ejs").renderFile);

app.set("view engine", "html");

app.use("/", mainRouter);
app.use("/users", userRouter);
app.use("/wordGroups", wordGroupRouter);
app.use("/words", wordRouter);
app.use("/testResults", testResultRouter);

const url = "mongodb://0.0.0.0:27017/Translator";

mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});

app.listen(3000);
