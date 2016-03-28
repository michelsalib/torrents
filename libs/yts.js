var Promise = require("bluebird");
var yts = new (require('yts-client'))();
var bytes = require('pretty-bytes');

module.exports = {};

module.exports.search = function (query) {
    var find = Promise.promisify(yts.find, {
        context: yts
    });

    return find({
        term: query
    })
        .then(function (results) {
            results = results.slice(0, 10);

            results
                .forEach(function (r) {
                    r.torrents.forEach(function (t) {
                        t.size = bytes(t.size);
                        t.magnet = 'magnet:?xt=urn:btih:' + t.hash + '&dn=' + encodeURIComponent(r.name);
                    });
                });

            return results;
        });
};