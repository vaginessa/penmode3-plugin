var spawn = require('child_process').spawn;
var process = null;

var execute = function (engine, cb) {
  engine.started();
  process = spawn('sqlmap', ['--wizard']);
  engine.console('> sqlmap --wizard');
  engine.setInteractive(true);

  process.stdout.on('data', function (data) {
    if (data) {
      engine.console(data, true);
    }
  });

  process.stderr.on('data', function (data) {
    if (data) {
      engine.console(data, true);
    }
  });

  process.on('exit', function () {
    return cb(engine.ended());
  });

  engine.on('command', function (msg) {
    process.stdin.write(msg + '\r');
  });

  engine.on('stop', function () {
    process.kill();
  });
};

module.exports = {
  'execute': execute
};
