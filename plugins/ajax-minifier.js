// javascript optimizer
/* global module, require, __dirname */
(function() {
  var path = require('path');
  var fs = require('fs');

  module.exports = AjaxMinifier;

  function AjaxMinifier(options) {
    this.options = options || {};
  }

  AjaxMinifier.prototype.apply = function(compiler) {
    var me = this;
    compiler.plugin('emit', function(compilation, callback) {
      var unit = compiler;

      var files = Object.keys(compilation.assets);
      files.forEach(function(file) {
        var mode;
        var asset = compilation.assets[file];
        var output = path.join(unit.outputPath, file);
        var original = output + '.orig';

        if (file.match(/\.js$/i)) {
          mode = '-js';
          original += '.js';
        }
        if (file.match(/\.css$/i)) {
          mode = '-css';
        }
        if (!mode) {
          return;
        }

        var spawn = require('child_process').spawn;
        var params = [
          mode, '-nosize', '-enc:in', 'utf-8', '-enc:out', 'utf-8', '-braces:same',
          '-out', output
        ];

        if (me.options.map) {
          fs.writeFileSync(original, asset.source());
          params.push('-map:v3');
          params.push(output + '.map');
          params.push(original);
        }

        var exec = spawn(path.join(__dirname, 'bin/AjaxMinifier.exe'), params);

        if (!me.options.map) {
          exec.stdin.write(asset.source());
          exec.stdin.end();
        }

      });
      callback();
    });
  };
})();
