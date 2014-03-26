module.exports = function() {
  var sendSession;
  return sendSession = function(req, res) {
    var sess;
    sess = {};
    if (req.encodedSID != null) {
      sess.sid = req.encodedSID;
    }
    return res.json(sess);
  };
};
