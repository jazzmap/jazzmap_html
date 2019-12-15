// javascript optimizer
/* global module, require, __dirname */
(function() {
  var path = require('path');

  module.exports = Optipng;

  function Optipng(options) {
    this.options = options || {};
  }

  Optipng.prototype.apply = function(compiler) {
    compiler.plugin('emit', function(compilation, callback) {
      var me = this;

      var spawn = require('child_process').spawn;
      spawn(path.join(__dirname, 'bin/optipng.exe'), [
        path.join(compiler.outputPath, '/*.png')
      ]);

      callback();
    });
  };
})();
