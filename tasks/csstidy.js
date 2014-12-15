/*
 * grunt-at-csstidy
 * Soring css files form the code-guide of Alloyteam.
 * https://github.com/lightingtgc/grunt-at-csstidy
 *
 * Author: gctang
 * Plugin for CSScomb
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  
    var csscomb = require('csscomb');
    var comb = new csscomb();
    var path = require('path');
    var HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

    grunt.registerMultiTask('csstidy', 'Sorting CSS flies,and make it tidy.', function () {
      
        var config = grunt.task.current.options().config || path.join(__dirname, '/config/config.json');

        if (config && grunt.file.exists(config)) {
            grunt.log.ok('Using Alloyteam config file...');
            config = grunt.file.readJSON(config);
        } else {
            grunt.log.ok('Using csscomb config file...');
            config = csscomb.getConfig('csscomb');
        }

        // Configure csscomb:
        comb.configure(config);

        this.files.forEach(function (file) {
            var dest = file.dest || '';

            var srcs = file.src.filter(function (filepath) {

                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            })
            
            // is empty?
            if ( srcs.length === 0 || file.orig.src.length === 0 ) {
                grunt.fail.warn( 'Destination (' + dest + ') not written because src files were invalid or empty.' );
            } else {

                srcs.forEach(function (src) {

                    var cssSrc = grunt.file.read(src);//get source css file
                    var syntax = src.split('.').pop();
                    var content = comb.processString(cssSrc, { syntax: syntax });
                    
                    grunt.log.ok('Sorting file "' + src + '"...');

                    // remove ^M and fix newLine issue in windows
                    if (process.platform === 'win32') {
                        content = content.replace(/\r/g, '');
                        content = content.replace(/\n/g, '\r\n');
                    }

                    grunt.file.write(dest, content);
                });
            }
        });
    });
};

