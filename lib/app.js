"use strict";

angular.module("uncloak", []).controller("MainCtrl", function ($scope, $http) {
	// the following const will wrap the final output in the view
	var HEADER = "@import \"../template/mixins\";\n@import \"../template/settings\";\n\n";
	var FOOTER = "\n@import \"../template/theme\";";

	// black theme default (see /reveal.js/css/theme/source/black.scss )
	$scope.theme = {
		backgroundColor: "#222",
		mainColor: "#fff",
		headingColor: "#fff",

		mainFontSize: "38px",
		mainFont: "'Source Sans Pro', Helvetica, sans-serif",
		headingFont: "'Source Sans Pro', Helvetica, sans-serif",
		headingTextShadow: "none",
		headingLetterSpacing: "normal",
		headingTextTransform: "uppercase",
		headingFontWeight: 600,
		linkColor: "#42affa",
		linkColorHover: "lighten( $linkColor, 15% )",
		selectionBackgroundColor: "lighten( $linkColor, 25% )",

		heading1Size: "2.5em",
		heading2Size: "1.6em",
		heading3Size: "1.3em",
		heading4Size: "1.0em"
	};

	// outputs
	$scope.scss = "";
	$scope.css = "";

	$scope.getType = function () {
		var k = arguments[0] === undefined ? "" : arguments[0];

		if (~k.toLowerCase().indexOf("color")) {
			return "color";
		}
		return "text";
	};

	$scope.$watch("theme", function () {
		var scss = "";
		for (var k in $scope.theme) {
			scss += "$" + k + ": " + $scope.theme[k] + ";\n";
		}
		// update scss output
		$scope.scss = HEADER + scss + FOOTER;

		$http.post("http://localhost:8080/convert", { scss: scss }).success(function (data) {
			// update css output
			$scope.css = data;
			updateIframe();
		}).error(console.error);
	}, true);

	// feel the magic
	function updateIframe() {
		var id = "custom-css";
		var previewDoc = document.getElementById("reveal-preview").contentDocument;
		var previewBody = previewDoc.body;
		// iframe not ready
		if (!previewBody) {
			return;
		}if (previewDoc.getElementById(id)) {
			previewDoc.getElementById(id).remove();
		}
		var link = document.createElement("link");
		link.href = "/custom.css?" + Math.random();
		link.rel = "stylesheet";
		link.id = id;
		previewBody.appendChild(link);
	}
});
//# sourceMappingURL=app.js.map