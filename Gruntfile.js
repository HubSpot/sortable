module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
          // define the files to lint
          files: ['gruntfile.js', 'sorttable.js'],
          // configure JSHint (documented at http://www.jshint.com/docs/)
          options: {
              // more options here if you want to override JSHint defaults
            globals: {
              console: true,
              module: true
            }
          }
        },
        casperjs: {
            options: {
                async: {
                    parallel: false
                }
            },
            files: ['tests/casperjs/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build-tests',
        'Actually build the HTML test files', function() {
        var fs = require("fs"), Mustache=require("mustache");
        var rootdir = __dirname + "/tests/";
        var done = this.async();
        grunt.log.write("Deleting existing tests\n");
        fs.readdirSync(rootdir).forEach(function(fn) {
            if (fn.match(/^test-.*\.html$/)) {
                fs.unlinkSync(rootdir + fn);
            }
        });

        grunt.log.write("Reading JSON description of tests\n");
        fs.readFile(rootdir + "test-definitions.json", "utf8", function(err, data) {
            if (err) { return done(false); }
            fs.readFile(rootdir + "template.html", "utf8", function(err, template) {
                if (err) { return done(false); }
                var testdata = JSON.parse(data);
                var suitelist = [];
                for (var suite in testdata.tests) {
                    suitelist.push(suite);
                }

                function next() {
                    var suite = suitelist.shift();
                    if (!suite) {
                        done();
                        return;
                    }

                    console.log("Processing suite", suite);
                    var suite_rows = testdata.tests[suite].rows;
                    var sortresults = testdata.tests[suite].expected_column_1_after_sort_by_column_n;
                    
                    var columns = []; // should be range(0, columncount)
                    for (var i=0; i<sortresults.length; i++) {
                        columns.push(i);
                    }

                    var rows = [];
                    suite_rows.forEach(function(suite_row) {
                        rows.push({row: suite_row});
                    });

                    var template_data = {
                        columns: columns,
                        rows: rows,
                        suite: suite,
                        json_sortresults: JSON.stringify(sortresults)
                    };

                    var html = Mustache.render(template, template_data);

                    fs.writeFile(rootdir + "test-" + suite + ".html", html, function(err) {
                        if (err) throw(err);
                        next();
                    });
                }

                next();
            });
        });
    });

    grunt.registerTask('run-tests-with-wru',
        'Execute all the test files with wru', function() {
        var fs = require("fs"),
            rootdir = __dirname + "/tests/";
        var done = this.async();

        fs.readdir(rootdir, function(err, files) {
            files.forEach(function(fn) {
                if (fn.match(/^test-.*\.html$/)) {
                    console.log("teeeeesting", fn);
                    var ffn = rootdir + fn;
                    grunt.util.spawn({
                        cmd: "phantomjs",
                        args: [
                            rootdir + "wru-phantom.js",
                            ffn
                        ]
                    }, function(err, result, code) {
                        console.log(result.stdout);
                        if (err) {
                            console.log("TESTS FAILED");
                            throw(err);
                        }
                        done();
                    });
                }
            });
        });
    });

    // Default task(s).
    grunt.registerTask('test', [
        'build-tests',
        'run-tests-with-wru',
        'jshint'
    ]);

    grunt.registerTask('default', ['test']);
};