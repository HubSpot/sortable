module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      compile:
        files:
          'js/sortable.js': 'coffee/sortable.coffee'

    watch:
      coffee:
        files: ['coffee/sortable.coffee']
        tasks: ["coffee", "uglify"]

    uglify:
      vex:
        src: 'js/sortable.js'
        dest: 'js/sortable.min.js'
        options:
          banner: "/*! sortable.js <%= pkg.version %> */\n"

    compass:
      dist:
        options:
          sassDir: 'sass'
          cssDir: 'css'

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-compass'

  grunt.registerTask 'default', ['coffee', 'uglify', 'compass']