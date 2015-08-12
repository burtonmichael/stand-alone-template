var Handlebars = require('Handlebars');
var glob = require("glob");
var fs = require("fs");
var mkdirp = require('mkdirp');
var UglifyJS = require("uglify-js");
var htmlMinifier = require('html-minifier');

function writeFile(src, template) {
	fileTree = src.split("/");
	file = fileTree[fileTree.length - 1];
	filename = file.split(".")[0];

	var minifiedTemplate = UglifyJS.minify(template, {
		fromString: true
	});

	mkdirp("./compiled/", function (err) {
	    if (err) console.error(err)
	});

	fs.writeFile("./compiled/" + filename + '.js',
		minifiedTemplate.code,
		function(err) {
		    if(err) {
		        return console.log(err);
		    }
		}
	);
}

function minify(html) {
	return htmlMinifier.minify(html, {
		collapseWhitespace: true
	});
}

function compile(src) {
	fs.readFile(src, 'utf8', function (err, html) {
		if (err) {
			return console.log(err);
		}

		var out = ['rcApp.setupTemplate('];

		var htmlMin = minify(html);

		var template = Handlebars.precompile(htmlMin)

		out.push(template);
		out.push(', true);');
		out = out.join('');

		return writeFile(src, out);
	});
}

glob("templates/*.hbs", function (er, files) {
	files.forEach(compile)
})