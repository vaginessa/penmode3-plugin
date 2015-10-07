var exec = require('child_process').exec;

var execute = function (engine, cb) {
  engine.started();
  var input = '[{"param":"address"}]';
  engine.request_io(input);
  engine.once('io', function (obj) {
    obj = JSON.parse(obj);
    if (typeof obj.address != 'undefined' && obj.address != '') {
      engine.console('> whois -H ' + obj.address);
      exec('whois ' + obj.address, function (error, stdout, stderr) {
        if (error) {
          engine.fail(error.message);
        }
        engine.console(stdout);
        engine.console(stderr);
        return cb(engine.ended());
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
