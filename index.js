var fs = require('fs');
var uglify = require('uglify-js');
var finder = require('finder-on-steroids');
var Promise = require('promise');

var writefile = Promise.denodeify(fs.writeFile);

/**
 * Uglifies all JavaScript files in a given folder
 * @param   {string} directory
 * @return  {Promise}
 */
function recursiveUglifyJS(directory) {

	return finder(directory).files().name('*.js').find().then(function(scripts) {
		return Promise.all(scripts.map(function(script) {
			return writefile(script, uglify.minify(script, {}).code).then(function() {
				console.log('Uglified '+script);
			});
		}));
	});

}

module.exports = recursiveUglifyJS;
