"use strict";

var fs = require("fs");
var sass = require("node-sass");
var express = require("express");
var bodyParser = require('body-parser');

var THEME = "node_modules/reveal.js/css/theme/";
var SOURCE = THEME + "source/";
var TEMPLATE = THEME + "template/";

var mixins = fs.readFileSync(TEMPLATE + "mixins.scss");
var settings = fs.readFileSync(TEMPLATE + "settings.scss");
var theme = fs.readFileSync(TEMPLATE + "theme.scss");

var app = express();
app.set("port", process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(__dirname));

// generated css
var custom = "";

// called by the angular app
app.post("/convert", function (req, res) {
	var scss = mixins + settings + req.body.scss + theme;
	sass.render({
		data: scss,
		success: function (result) {
			custom = result.css;
			res.send(result.css);
		},
		error: function (err) {
			console.error("sass error", err);
			res.send("sass error");
		}
	});
});

// called by the reveal iframe
app.get("/custom.css", function (req, res) {
	res.type("css");
	res.send(custom);
});

app.get("/themes/:id", function (req, res) {
	fs.readFile(SOURCE + req.params.id + ".scss", "utf-8", function (err, file) {
		if (err) console.error(err);

		res.send(mapScss(file));
	});
});

app.get("/themes", function (req, res) {
	fs.readdir(SOURCE, function (err, files) {
		if (err) console.error(err);
		// extension irrelevant
		files = files.map(function (file) {
			return file.split(".")[0];
		});
		res.send(files);
	});
});

app.listen(app.get("port"), function () {
	console.log("Express server listening on port " + app.get("port"));
});

// convert a scss into a map of vars/value
function mapScss (file) {
	return file
	.split("\n")
	// only vars
	.filter(function (line) {
		return line[0] === "$";
	})
	// trim $ and ;
	.map(function (line) {
		return line.slice(1, -1);
	})
	.reduce(function (o, v) {
		v = v.split(":");
		o[v[0].trim()] = v[1].trim();
		return o;
	}, {});
}
