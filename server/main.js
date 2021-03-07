const express = require("express");
const app = express();
const port = 3000;
const dbModule = require("./dbModule");
const Ad = require("./Models/Ad");
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
    let event = await getCurrentEvent();
    if(!event){
        event = {
            title: "Show your ad here!",
            desc: "Get you ads here for free",
            link: "https://book.romland.space/booking"
        }
    }
	res.render("index", {
        event: event
    });
});

app.get("/booking", async (req, res) => {
	res.render("booking", {
		availableTimes: await generateAvailableTimes(),
	});
});

app.get("/iframe", (req, res) => {
	res.sendFile(clientdir + "/index.html");
});

app.post("/book", async function (req, res) {
	let date = new Date();
	date.setTime(req.body.time);
	if (!(await checkIfTimeInDB(date))) {
		dbModule.saveToDB(
			createAd(req.body.title, req.body.link, req.body.desc, req.body.time)
		);
	}

	res.redirect("https://romland.space/");
});

async function generateAvailableTimes() {
	let availableTimes = [];
	let date = new Date();
	let unixTime = new Date().getTime();
	for (let i = 1; i < 24; i++) {
		let tmp = new Date();
		tmp.setHours(date.getHours() + i);
		tmp.setMinutes(0);
		tmp.setSeconds(0);
		tmp.setMilliseconds(0);
		if (!(await checkIfTimeInDB(tmp))) {
			availableTimes.push(tmp);
		}
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

async function checkIfTimeInDB(time) {
	return await dbModule.findTime(Ad, time);
}

async function getCurrentEvent() {
	let date = new Date();
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
    console.log(date)
    return await dbModule.findTime(Ad, date)
}

function createAd(titleIN, linkIN, descIN, timeIN) {
	let date = new Date();
	date.setTime(timeIN);
	console.log(date);
	let tmp = new Ad({
		title: titleIN,
		link: linkIN,
		desc: descIN,
		date: date,
	});
	return tmp;
}

app.listen(port, () => console.log(`Server listening on port ${port}!`));
