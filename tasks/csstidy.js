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

        // Handle special case
        function preHandleSrc (cssSrc) {

            /* 
             * fix like: .a{ filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#e6529dda', endColorstr='#e6529dda', GradientType=0)\9;}
             * which has two semicolon( : ) will cause parse error.
             */
            cssSrc = cssSrc.replace(/progid(\s)?:(\s)?/g, '#tidy1#');

            /*
             * fix absolute url path like: 
             * .a { background: url("http://www.qq.com/one.png");} 
             *
             */

            cssSrc = cssSrc.replace(/:\/\//g, '#tidy2#');

            /*
             * fix base64 url like: 
             * .a { background: url("data:image/png;base64,iVBOMVEX///////////////+g0jAqu8zdII=");} 
             *
             */
            cssSrc = cssSrc.replace(/(?:data)(.*)(?=\))/g, function(match){
                match = match.replace(/:/g, '#tidy3#');
                match = match.replace(/;/g, '#tidy4#');
                match = match.replace(/\//g, '#tidy5#');
                return match;
            });

            /*
             * fix multiple line comment include single comment //
             * eg: / * sth // another * /
             */
            cssSrc = cssSrc.replace(/\/\*[\s\S]+?\*\//g, function(match){
                // handle single comment //
                match = match.replace(/\/\//g, '#tidy6#');
                return  match;
            });

            /*
             * fix single comment like:  // something 
             * It can't works in IE, and will cause parse error
             *
             */
            cssSrc = cssSrc.replace(/(^|[^:|'|"|\(])\/\/.+?(?=\n|\r|$)/g, function(match){
                var targetMatch;
                //handle first line
                if (match.charAt(0) !== '/' ) {
                    // remove first string and / and \ 
                    targetMatch = match.substr(1).replace(/\\|\//g, '');;
                    return match.charAt(0) + '/*' + targetMatch + '*/';
                } else {
                    targetMatch = match.replace(/\\|\//g, '');
                    return '/*' + targetMatch + '*/';
                }
            });

            return cssSrc;
    }

    // after handle src, recover special string
    function afterHandleSrc (content) {

        content = content.replace(/#tidy1#/g, 'progid:');
        content = content.replace(/#tidy2#/g, '://');
        content = content.replace(/#tidy3#/g, ':');
        content = content.replace(/#tidy4#/g, ';');
        content = content.replace(/#tidy5#/g, '/');
        content = content.replace(/#tidy6#/g, '//');

        return content;
    }


    grunt.log.ok('Start soring css...');
    if (config && grunt.file.exists(config)) {
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
            });
            
            // is empty?
            if ( srcs.length === 0 && file.orig.src.length === 0 ) {
                grunt.fail.warn( 'Destination (' + dest + ') not written because src files were invalid or empty.' );
            } else {

                srcs.forEach(function (src) {
                    var cssSrc = grunt.file.read(src);//get source css file  
                    var syntax = src.split('.').pop();
                    var content = '';
                    
                    try{

                        cssSrc  = preHandleSrc(cssSrc);
                        content = comb.processString(cssSrc, { syntax: syntax });
                        content = afterHandleSrc(content);

                    }catch(e){
                        grunt.log.fail('Some error in : '+ src + '\r' + e);
                        return;
                    }

                    // remove ^M and fix newLine issue in windows
                    if (process.platform === 'win32') {
                        content = content.replace(/\r/g, '');
                        content = content.replace(/\n/g, '\r\n');
                    }

                    grunt.file.write(dest, content);

                    grunt.log.ok('Done! Sorted file "' + src + '"!');

                });
            }
        });
    });
};
