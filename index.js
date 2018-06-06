var fs = require('fs');
var debug = require('debug')('recursive-uglifyjs');
var uglify = require('uglify-js');
var finder = require('finder-on-steroids');

/**
 * Uglifies all JavaScript files in a given folder
 * @param   {string}    directory
 * @param   {function}  callback
 */
function recursiveUglifyJS(directory, callback) {

  //find files
	return finder(directory).files().name('*.js').find(function(err, files) {
    if (err) return callback(err);

    var
      maxProcesses    = 4,
      activeProcesses = 0,
      fileIndex       = 0,
      errors          = []
    ;

    /**
     * Called when a process is finished
     * @param   {String}  [file]    The file that caused the process to finish
     * @param   {Error}   [error]   The error that caused the process to finish
     */
    function finished(file, error) {

      //keep a list of errors
      if (error) {
        error.file = file;
        errors.push(error);
      }

      //end the current process
      --activeProcesses;

      //if there are no more active processes then notify the user we're finished
      if (activeProcesses === 0) {
        callback(errors.length ? errors : null);
      }

    }

    /**
     * Called to process the next file
     */
    function next() {
      var file;

      //check there are more files to uglify
      if (fileIndex >= files.length) {
        return finished();
      }

      //get the file name
      file = files[fileIndex++];

      //get the file source code
      fs.readFile(file, function(error, source) {
        if (error) return finished(file, error);

        //convert the buffer to a string
        source = source.toString();

        //check the file is not empty or only contains whitespace (uglify-js will throw an error)
        if (source.replace(/\S/, '').length === 0) {

          debug('Skipped empty file: ' + file);

          //uglify the next script
          return next();

        }

        //minify the code
        var code;
        try {
           code = uglify.minify(source).code;
        } catch (error) {
          return finished(file, error);
        }

        //write the code back to the file
        fs.writeFile(file, code, function(error) {
          if (error) return finished(file, error);

          debug('Uglified: ' + file);

          //uglify the next script
          next();

        });

      });

		}

    //start processes
    activeProcesses = maxProcesses;
    for (var j=0; j<maxProcesses; ++j) {
      next()
    }

	});

}

module.exports = recursiveUglifyJS;
