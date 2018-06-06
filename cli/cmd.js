#!/usr/bin/env node

var recursiveUglifyJS = require('../index');

if (process.argv.length != 3) {
	console.log('recursive-uglifyjs: Please enter a (single) directory of scripts to uglify.');
	process.exit(1);
}

recursiveUglifyJS(process.argv[2], function(err) {
	if (err) {
		console.log('Errors:', err);	
		process.exit(1); //error exit code
	} else {
		console.log('Finished.');	
		process.exit(0); //success exit code
	}
});

