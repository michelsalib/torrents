var got = require('got');
var cheerio = require('cheerio');

var base = "http://eztv.ag";

module.exports = {};

module.exports.search = function search(query) {
    return got(base + '/search/' + encodeURIComponent(query))
        .then(function grabTorrents(data) {
            var $ = cheerio.load(data.body);
            var torrents = [];
            
            $('table.forum_header_border tr.forum_header_border').each(function (i, elem) {
                var el = cheerio.load(elem);
                var epinfo = el(".epinfo");
                
                torrents.push({
                    name: epinfo.text(),
                    magnet: el(".magnet").attr('href'),
                    size: epinfo.attr("title").replace(epinfo.text(), '').match(/\(([^\)]*)\)/)[1]
                });
            });
            
            return torrents;
        });
};