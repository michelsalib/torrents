var Promise = require("bluebird");
var yts = new (require('yts-client'))();
var bytes = require('pretty-bytes');

module.exports = {};

module.exports.search = query => {
    var find = Promise.promisify(yts.find, {
        context: yts
    });

    return find({
        term: query
    })
        .then(results => {
            results = results.slice(0, 10);

            results.forEach(r => {
                r.torrents.forEach(t => {
                    t.size = bytes(t.size);
                    t.magnet = 'magnet:?xt=urn:btih:' + t.hash + '&dn=' + encodeURIComponent(r.name);
                });
            });

            return results;
        });
};
