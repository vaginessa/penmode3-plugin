var spawn = require('child_process').spawn;
var process = null
var execute = function (engine, cb) {
  engine.started();
  var input = '[{"param":"address"}]';
  engine.request_io(input);
  engine.once('io', function (obj) {
    obj = JSON.parse(obj);
    if (typeof obj.address != 'undefined' && obj.address != '') {
      process = spawn('golismero', ['scan', 'localhost', '-vvvv']);
      engine.console('> golismero scan localhost -vvvv');
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
    } else {
      engine.fail('\'address\' parameter can\'t be empty');
      return cb(engine.ended());
    }
  });
};

module.exports = {
  'execute': execute
};
