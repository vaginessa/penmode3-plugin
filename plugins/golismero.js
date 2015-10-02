var exec = require('child_process').exec;

var execute = function (engine, cb) {
  engine.started();
  var input = '[{"param":"address"}]';
  engine.request_io(input);
  engine.once('io', function (obj) {
    obj = JSON.parse(obj);
    exec('python ~/Dev/golismero-master/golismero.py scan ' + obj.address + ' -vvvv', function (error, stdout, stderr) {
      if (error) {
        throw error;
      }
      engine.console('> python golismero.py scan ' + obj.address + ' -vvvv');
      
      engine.on('command', function (msg) {
        process.stdin.write(msg + '\r');
      });
     
      engine.console(stdout);
      engine.console(stderr);
      return cb(engine.ended());
    });
  });
};

module.exports = {
  'execute': execute
};

