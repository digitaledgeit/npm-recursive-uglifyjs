var fs = require('fs');
var uglify = require('uglify-js');
var Promise = require('promise');

var readdir = Promise.denodeify(require('readdir-on-steroids'));
var writefile = Promise.denodeify(fs.writeFile);

/**
 * Uglifies all JavaScript files in a given folder
 * @param   {string} directory
 */
function recursiveUglifyJS(directory) {

	var options = {

		//filter files ending in '.js'
		filter: function(file) {
			return file.substr(-3, 3) === '.js';
		}

	};

	return readdir(directory, options).then(function(scripts) {
		return Promise.all(scripts.map(function(script) {
			return writefile(script, uglify.minify(script, {}).code).then(function() {
				console.log('Uglified '+script);
			});
		}));
	});

}

module.exports = recursiveUglifyJS;
