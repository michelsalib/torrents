module.exports = {};

module.exports.tryGetShow = function (name) {
    var titleRegex = name.match(/(.+) s?(\d+)[ex](\d+)(.?(\d+)p?)?(.*)/i);
    if (!titleRegex) {
        return null;
    }

    var episode = {};

    var seasonNumber = ('00' + parseInt(titleRegex[2])).slice(-2);
    var episodeNumber = ('00' + parseInt(titleRegex[3])).slice(-2);
    var show = titleRegex[1];

    episode.name = show + ' S' + seasonNumber + 'E' + episodeNumber;
    episode.quality = (parseInt(titleRegex[5]) || '420') + 'p';
    episode.extra = titleRegex[6].trim();

    return episode;
};

module.exports.groupResults = function(results) {
    var res = [];

    results.forEach(function (item) {
        var group = res.filter(function (g) {
            return g.name == item.name;
        })[0];

        if (!group) {
            group = {
                name: item.name,
                torrents: []
            };
            
            res.push(group);
        }

        group.torrents.push(item);
    });

    return res;
};