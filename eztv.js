var got = require('got');
var cheerio = require('cheerio');
var utils = require('./utils');

var base = "http://eztv.ag";

module.exports = {};

module.exports.search = function search(query) {
    return got(base + '/search/' + encodeURIComponent(query))
        .then(function grabTorrents(data) {
            var $ = cheerio.load(data.body);
            var res = [];
            
            $('table.forum_header_border tr.forum_header_border').each(function (i, elem) {
                var el = cheerio.load(elem);
                var epinfo = el(".epinfo");
                var name = epinfo.text();
                
                var episode = utils.tryGetShow(name);

                if (!episode) {
                    episode = {
                        name: name
                    };
                }
                
                episode.magnet = el(".magnet").attr('href');
                episode.size = epinfo.attr("title").replace(epinfo.text(), '').match(/\(([^\)]*)\)/)[1];

                res.push(episode);
            });
            
            return utils.groupResults(res).slice(0, 10);
        });
};