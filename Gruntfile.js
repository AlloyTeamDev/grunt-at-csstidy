
'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    csstidy: {
        dynamic_mappings: {
            expand: true, //  Enable dynamic expansion
            cwd: 'test/css/', //Src matches are relative to this path. 
            src: ['*.css', '!*.special.css'], // Actual pattern(s) to match.
            dest: 'test/css/', //Destination path prefix.
            ext: '.resorted.css', //Dest filepaths will have this extension
            extDot: 'first'   // Extensions in filenames begin after the first dot
        }
    }   

  });
  
  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');
  
  grunt.registerTask('test', ['csstidy']);
  // By default
  grunt.registerTask('default', ['test']);
  
};

