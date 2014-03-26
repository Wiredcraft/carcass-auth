module.exports = ->
    return sendSession = (req, res) ->
        sess = {}
        sess.sid = req.encodedSID if req.encodedSID?
        res.json(sess)
