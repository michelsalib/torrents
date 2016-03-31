function formatEpisodeNumber(number) {
    return ('00' + parseInt(number)).slice(-2)
}

module.exports = {};

module.exports.formatEpisodeNumber = formatEpisodeNumber;

module.exports.tryGetShow = name => {
    var titleRegex = name.match(/(.+) s?(\d+)[ex](\d+)(.?(\d+)p?)?(.*)/i);
    if (!titleRegex) {
        return null;
    }

    var episode = {};

    var seasonNumber = formatEpisodeNumber(titleRegex[2]);
    var episodeNumber = formatEpisodeNumber(titleRegex[3]);
    var show = titleRegex[1];

    episode.name = show + ' S' + seasonNumber + 'E' + episodeNumber;
    episode.quality = (parseInt(titleRegex[5]) || '420') + 'p';
    episode.extra = titleRegex[6].trim();
    episode.groupable = true;

    return episode;
};

module.exports.groupResults = results => {
    var res = [];

    results.forEach(item => {
        if (!item.groupable) {
            res.push(item);

            return;
        }

        var group = res.filter(g => g.name == item.name)[0];

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
