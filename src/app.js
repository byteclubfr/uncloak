"use strict";

angular.module("uncloak", [])
.controller("MainCtrl", function ($scope, $http, ThemeSvc) {
	// the following const will wrap the final output in the view
	const HEADER = '@import "../template/mixins";\n@import "../template/settings";\n\n';
	const FOOTER = '\n@import "../template/theme";';

	$scope.themes = [];
	// name
	$scope.selectedTheme = "";
	// scss vars
	$scope.theme = {};

	// outputs
	$scope.scss = "";
	$scope.css = "";

	// helper for inputs
	$scope.getType = function (k = "", v = "") {
		if (~k.toLowerCase().indexOf("color") || v[0] === "#") {
			return "color";
		}
		return "text";
	};

	// init

	// themes bundled with reveal.js
	ThemeSvc.getList().then(function (list) {
		$scope.themes = list;
		// default (see /reveal.js/css/theme/source/black.scss )
		$scope.selectedTheme = "black";
	});

	// watchers

	// reload pristine theme
	$scope.$watch("selectedTheme", function (nv) {
		if (!nv) return;
		ThemeSvc.get(nv).then(theme => $scope.theme = theme);
	});

	// values of the form have change
	$scope.$watch("theme", function () {
		var scss = "";
		for (let k in $scope.theme) {
			scss += "$" + k + ": " + $scope.theme[k] + ";\n";
		}
		// update scss output
		$scope.scss = HEADER + scss + FOOTER;

		$http.post("http://localhost:8080/convert", { scss })
			.success(function (data) {
				// update css output
				$scope.css = data;
				updateIframe();
			})
			.error(console.error);
	}, true);

	// feel the DOM magic
	function updateIframe () {
		var id = "custom-css";
		var previewDoc = document.getElementById("reveal-preview").contentDocument;
		var previewBody = previewDoc.body;
		// iframe not ready
		if (!previewBody) return;

		if (previewDoc.getElementById(id)) {
			previewDoc.getElementById(id).remove();
		}
		var link = document.createElement("link");
		link.href = "/custom.css?" + Math.random();
		link.rel = "stylesheet";
		link.id = id;
		previewBody.appendChild(link);
	}
})
.factory("ThemeSvc", function ($q, $http) {
	// cache
	var themes = [];

	return {
		getList () {
			if (themes.length) return $q.when(themes);

			return $http.get("/themes").then(function (res) {
				themes = res.data;
				return themes;
			});
		},
		get (id) {
			return $http.get("/themes/" + id).then(res => res.data);
		}
	};
});
