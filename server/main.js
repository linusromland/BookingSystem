const express = require("express");
const app = express();
const port = 3000;
const dbModule = require("./dbModule");
const clientdir = __dirname + "/client";
const fs = require("fs");
const bodyParser = require("body-parser");

//Connects to MongoDB with DB RomlandAds
connectToMongo("RomlandAds", "mongodb://localhost:27017/");

app.set("view engine", "ejs");
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);


app.get("/", async (req, res) => {
	res.render("index", {});
});

app.get("/booking", async (req, res) => {
	res.render("booking", {
		availableTimes: generateAvailableTimes(),
	});
});

app.get("/iframe", (req, res) => {
	res.sendFile(clientdir + "/index.html");
});

app.post("/book", function (req, res) {
	console.log(req.body.title + req.body.desc + req.body.link + req.body.time);
	res.redirect("https://romland.space/");
});

function generateAvailableTimes() {
	let availableTimes = [];
	let date = new Date();
	let unixTime = new Date().getTime();
	for (let i = 1; i < 24; i++) {
		let tmp = new Date();
		tmp.setHours(date.getHours() + i);
		tmp.setMinutes(0);
		tmp.setSeconds(0);
		tmp.setMilliseconds(0);
		availableTimes.push(tmp);
	}
	return availableTimes;
}

function connectToMongo(dbName, connectURL) {
	if (fs.existsSync("mongoauth.json")) {
		const mongAuth = require("./mongoauth.json");
		dbModule.cnctDBAuth(dbName, connectURL);
	} else {
		dbModule.cnctDB(dbName, connectURL);
	}
}

app.listen(port, () => console.log(`Server listening on port ${port}!`));
