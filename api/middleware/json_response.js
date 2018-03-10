'use strict;'

module.exports = (req, res, next) => {
    // a middleware which register 2 new
    // functions jsonSucess and jsonError which wrap the response object in another object
    // with the structure
    // {
    //  success: true/false,
    //  payload: the response
    // }
    res.jsonSuccess = (payload) => {
        return res.json({
            success: true,
            payload: payload
        })
    }
    res.jsonError = (payload) => {
        return res.json({
            success: false,
            payload: payload
        })
    }
    next()
}
