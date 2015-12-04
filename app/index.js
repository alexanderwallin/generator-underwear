var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({

  // The name `constructor` is important here
  constructor: function() {

    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);
  },

  prompting: function() {
    var done = this.async();

    this.prompt([{
      type: 'input',
      name: 'name',
      message: 'What\'s fashion nowadays (expressed in snake case)?'
    }, {
      type: 'input',
      name: 'description',
      message: 'And what\'s so cool about it?'
    }, {
      type: 'confirm',
      name: 'gulp',
      message: 'Want a gulp of vernissage wine?'
    }, {
      type: 'confirm',
      name: 'babel',
      message: 'You all fashion week with ES2015 \'n stuff?'
    }, {
      type: 'list',
      name: 'eslint',
      message: 'Js linting too?',
      choices: ['airbnb', 'none'],
      default: 0
    }, {
      type: 'list',
      name: 'sasslint',
      message: '...scss?',
      choices: ['sass-lint', 'none'],
      default: 0
    }], function(answers) {
      this.project = answers;

      this.log('');
      this.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
      this.log('  Tailoring your fashionable underwear:', this.project.name);
      this.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');

      this.log(this.project);

      done();
    }.bind(this));
  },

  configuring: function() {
    this.template('.editorconfig', `.editorconfig`);
    this.template('.gitignore', `.gitignore`);
    this.template('.yo-rc.json', `.yo-rc.json`);
  },

  writing: function() {
    this.templateData = {
      project: this.project,
      scripts: {},
    };

    this.template('README.md', `README.md`, this.templateData);
    this.template('RELEASENOTES.md', `RELEASENOTES.md`, this.templateData);

    if (this.project.babel) {
      this.template('.babelrc', `.babelrc`, this.templateData);
      this.npmInstall(['babel', 'babel-preset-es2015'], { saveDev: true });
    }

    if (this.project.gulp) {
      this.template('gulpfile.js', `gulpfile.js`, this.templateData);
      this.npmInstall(['gulp'], { saveDev: true });
    }

    if (this.project.eslint === 'airbnb') {
      this.template('.eslintrc', `.eslintrc`, this.templateData);
      this.templateData.scripts.eslint = './node_modules/.bin/eslint ./**/*.js';
      this.npmInstall(['eslint', 'eslint-config-airbnb'], { saveDev: true });
    }
    else {
      this.templateData.scripts.eslint = 'echo \"No js linting available\"';
    }

    if (this.project.sasslint === 'sass-lint') {
      this.template('.sass-lint.yml', `.sass-lint.yml`, this.templateData);
      this.templateData.scripts.sasslint = './node_modules/.bin/sass-lint -vq ./**/*.scss';
    }
    else {
      this.templateData.scripts.sasslint = 'echo \"No scss linting available\"';
    }

    this.template('package.json', `package.json`, this.templateData);
  }
});
