var webpackConfig = require('./webpack.test.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'static/test/**/*.ts'
    ],
    exclude: [
    ],
    preprocessors: {
      'static/test/**/*.ts': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    reporters: ['progress', 'mocha', 'coverage', 'junit'],
    junitReporter: {
      outputFile: '../../../target/surefire-reports/TESTS-jasmine.xml',
      useBrowserName: false
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  })
};
