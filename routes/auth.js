const auth = require('basic-auth');

const admins = { 'evo': { password: 'calize' } };

module.exports = function(request, response, next) {
  var user = auth(request);
  if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
    response.set('WWW-Authenticate', 'Need basic authorization');
    return response.status(401).send();
  }
  return next();
};
