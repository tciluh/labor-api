'use strict;'

// a middleware which logs the request parameter to the default logger
module.exports = (req, res, next) => {
    log.debug(`got ${req.method} request on route: ${req.url}`)
    log.debug(`params: ${req.body.params}`)
    log.debug(`body: ${JSON.stringify(req.body, null, '\t')}`)
    next()
}
