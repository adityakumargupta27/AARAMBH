const handleRequest = require('../backend/server.cjs');

module.exports = (req, res) => {
  return handleRequest(req, res);
};
