"use strict";

var fs = require("fs");
var sass = require("node-sass");
var express = require("express");
var bodyParser = require('body-parser');

var TEMPLATE = "node_modules/reveal.js/css/theme/template/";

var mixins = fs.readFileSync(TEMPLATE + "mixins.scss");
var settings = fs.readFileSync(TEMPLATE + "settings.scss");
var theme = fs.readFileSync(TEMPLATE + "theme.scss");

var app = express();
app.set("port", process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));


var custom = '';

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

app.listen(app.get("port"), function (){
	console.log("Express server listening on port " + app.get("port"));
});
