
var recursiveUglifyJS = require('../index');

if (process.argv.length != 3) {
	console.log('recursive-uglifyjs: Please enter a (single) directory of scripts to uglify.');
	process.exit();
}

recursiveUglifyJS(process.argv[2]).then(function() {
	console.log('done!');
}, function() {
	console.log('error!');
});

