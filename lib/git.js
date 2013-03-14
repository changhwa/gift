(function() {
  var Git, exec, fs, options_to_argv;

  fs = require('fs');

  exec = require('child_process').exec;

  module.exports = Git = function(git_dir, dot_git) {
    var git;
    dot_git || (dot_git = "" + git_dir + "/.git");
    git = function(command, options, args, callback) {
      var bash, _ref, _ref1;
      if (!callback) {
        _ref = [args, callback], callback = _ref[0], args = _ref[1];
      }
      if (!callback) {
        _ref1 = [options, callback], callback = _ref1[0], options = _ref1[1];
      }
      if (options == null) {
        options = {};
      }
      options = options_to_argv(options);
      options = options.join(" ");
      if (args == null) {
        args = [];
      }
      if (args instanceof Array) {
        args = args.join(" ");
      }
      bash = "" + Git.bin + " " + command + " " + options + " " + args;
      exec(bash, {
        cwd: git_dir
      }, callback);
      return bash;
    };
    git.list_remotes = function(callback) {
      return fs.readdir("" + dot_git + "/refs/remotes", function(err, files) {
        return callback(err, files || []);
      });
    };
    git.refs = function(type, options, callback) {
      var prefix, _ref;
      if (!callback) {
        _ref = [options, callback], callback = _ref[0], options = _ref[1];
      }
      prefix = "refs/" + type + "s/";
      return git("show-ref", function(err, text) {
        var id, line, matches, name, _i, _len, _ref1, _ref2;
        matches = [];
        _ref1 = (text || "").split("\n");
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          line = _ref1[_i];
          if (!line) {
            continue;
          }
          _ref2 = line.split(' '), id = _ref2[0], name = _ref2[1];
          if (name.substr(0, prefix.length) === prefix) {
            matches.push("" + (name.substr(prefix.length)) + " " + id);
          }
        }
        return callback(err, matches.join("\n"));
      });
    };
    return git;
  };

  Git.bin = "git";

  Git.options_to_argv = options_to_argv = function(options) {
    var argv, key, val;
    argv = [];
    for (key in options) {
      val = options[key];
      if (key.length === 1) {
        if (val === true) {
          argv.push("-" + key);
        } else if (val === false) {

        } else {
          argv.push("-" + key);
          argv.push(val);
        }
      } else {
        if (val === true) {
          argv.push("--" + key);
        } else if (val === false) {

        } else {
          argv.push("--" + key + "=" + val);
        }
      }
    }
    return argv;
  };

}).call(this);