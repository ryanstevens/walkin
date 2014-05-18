var _ = require('underscore')._,
    path = require('path'),

    DEFAULT_CONFIG = {
      COPY: {
        expand: true,
        cwd: 'src/html/',
        src: ['**/*.html'],
        dest: 'build/html/'
      },
      REPLACE: {
        options: {
          patterns: [{
            match: /\{% extends '/g,
            replacement: function (match) {
              return match + __dirname + '/build/html';
            }
          }]
        },
        expand: true,
        cwd: 'build/html/',
        src: ['**/*.html'],
        dest: 'build/html/'
      },
      CONCAT_IN_ORDER: {
        options: {
          extractRequired: function (filepath, filecontent) {
            var deps = this.getMatches(/\*\s*@depend\s\/(.*\.js)/g, filecontent);
            return deps.map(function (dep, i) {
              return path.join.apply(null, [__dirname, 'src', 'js', dep]);
            });
          },
          extractDeclared: function (filepath) {
            return [filepath];
          },
          onlyConcatRequiredFiles: true
        },
        expand: true,
        cwd: 'src/js/',
        src: [
          // Start with all .js files.
          '**/*.js',
          // Filter out lib and third-party files, which are meant to be
          // included via @depend.
          '!lib/**/*.js',
          '!third-party/**/*.js'
        ],
        dest: 'build/js/',
        ext: '.js'
      },
      LESS: {
        options: {
          paths: ['src/css'],
          ieCompat: false
        },
        expand: true,
        cwd: 'src/css/',
        src: [
          // Start with all .less files.
          '**/*.less',
          // Filter out lib and third-party files, which are meant to be
          // included via @import.
          '!lib/**/*.less',
          '!third-party/**/*.less'
        ],
        dest: 'build/css/',
        ext: '.css'
      }
    },

    DEV_CONFIG = {
      COPY: DEFAULT_CONFIG.COPY,
      REPLACE: DEFAULT_CONFIG.REPLACE,
      CONCAT_IN_ORDER: DEFAULT_CONFIG.CONCAT_IN_ORDER,
      LESS: DEFAULT_CONFIG.LESS
    },

    PROD_CONFIG = {
      COPY: DEFAULT_CONFIG.COPY,
      REPLACE: {
        options: {
          patterns: [{
            match: /\{% extends '/g,
            replacement: function (match) {
              return match + '/app/build/html';
            }
          },{
            match: /\{% include '/g,
            replacement: function (match) {
              return match + '/app/build/html';
            }
          }]
        },
        expand: true,
        cwd: 'build/html/',
        src: ['**/*.html'],
        dest: 'build/html/'
      },
      CONCAT_IN_ORDER: DEFAULT_CONFIG.CONCAT_IN_ORDER,
      LESS: (function () {
            var config = _.clone(DEFAULT_CONFIG.LESS);
            config.options = _.defaults({ yuicompress: true }, config.options);
            return config;
          })()
    },

    DEFAULT_TASKS = {
      dev: ['copy', 'replace', 'concat_in_order', 'less'],
      prod: ['copy', 'replace', 'concat_in_order', 'less']
    };

function getTaskList (env, tasks) {
  return tasks.map(function (task) { return task + ':' + env; });
}

module.exports = function (grunt) {
  var env = grunt.option('env') || 'dev',
      defaultTasks = getTaskList(env, DEFAULT_TASKS[env]);

  if (env !== 'prod') {
    defaultTasks = defaultTasks.concat('watch');
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dev: DEV_CONFIG.COPY,
      prod: PROD_CONFIG.COPY
    },

    replace: {
      dev: DEV_CONFIG.REPLACE,
      prod: PROD_CONFIG.REPLACE
    },

    concat_in_order: {
      dev: DEV_CONFIG.CONCAT_IN_ORDER,
      prod: PROD_CONFIG.CONCAT_IN_ORDER
    },


    less: {
      dev: DEV_CONFIG.LESS,
      prod: PROD_CONFIG.LESS
    },

    // TODO: Use watch event to update `files` array on the fly, so we only
    // recompile files in the affected dependency subtrees. Hopefully less and
    // concat_in_order expose their dependency graphs for this purpose.
    watch: {
      html: {
        files: 'src/html/**/*.html',
        tasks: getTaskList(env, ['copy', 'replace'])
      },
      css: {
        files: 'src/css/**/*.less',
        tasks: getTaskList(env, ['less'])
      },
      js: {
        files: 'src/js/**/*.js',
        tasks: getTaskList(env, (function () {
              switch (env) {
                case 'dev':
                  return ['concat_in_order'];
                case 'prod':
                  return ['concat_in_order'];
              }
            })())
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-concat-in-order');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', defaultTasks);
};
