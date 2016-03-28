var kat = require('kat-api-ce');
var bytes = require('pretty-bytes');
var utils = require('./utils');

module.exports = {};

module.exports.search = function (query) {
    return Promise.resolve(kat.search(query))
        .then(function (page) {
            var results = page.results.map(function (r) {
                var result = utils.tryGetShow(r.title);

                if (!result) {
                    result = {
                        name: r.title
                    };
                }

                result.magnet = r.magnet;
                result.size = bytes(r.size);

                return result;
            });

            return utils.groupResults(results).slice(0, 10);
        });
};