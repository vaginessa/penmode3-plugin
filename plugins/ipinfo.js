var exec = require('child_process').exec;

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
}

var execute = function (engine, cb) {
  engine.started();
  var input = '[{"param":"address"}]';
  engine.request_io(input);
  engine.once('io', function (obj) {
    obj = JSON.parse(obj);
    if (typeof obj.address != 'undefined' && obj.address != '') {
      engine.setMarkdown(true);
      var r = require('request');
      r.get({
        url: 'http://ipinfo.io/' + obj.address,
        json: true
      }, function (err, resp, body) {
        if (err) {
          engine.fail(err.message);
        } else {
          if (resp.statusCode === 200) {
            var o = body;
            var text = '# IPInfo of ' + obj.address + '\n';
            for(var prop in o) {
              if(o.hasOwnProperty(prop)){
                text += '**' + capitalize(prop) + '**: ' + o[prop] + '\n\n';
              }
            }
            engine.render(text);
            return cb(engine.ended());
          }
        }
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
