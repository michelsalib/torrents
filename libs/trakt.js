var Trakt = require('trakt.tv');
var utils = require('./utils');
var Promise = require('bluebird');
var db = require('./db').db;

var clientId = '45c2123b81d80846f5fee59c1f0f921a2d6ab9738ae0a28597ac164f2b0a1ad6';
var clientSecret = '6e1da19f42213d8cc1800828a73e0e2d732e39f3ba1f6098165f432b413b6f28';

var trakt = new Trakt({
    client_id: clientId,
    client_secret: clientSecret,
    plugins: ['ondeck']
});

var authenticated = false;
var savedToken = db('settings').find({name: 'trakt_token'});
if (savedToken) {
    authenticated = true;
    trakt.import_token(savedToken.value);
}

module.exports = {};

module.exports.deck = function () {
    return trakt.ondeck
        .getAll()
        .then(function (r) {
            r.shows.forEach(function (show) {
                show.next_episode.query = 'S' + utils.formatEpisodeNumber(show.next_episode.season) +
                    'E' + utils.formatEpisodeNumber(show.next_episode.number);
            });

            r.shows.sort(function (a, b) {
                return new Date(a.show.updated_at) < new Date(b.show.updated_at);
            });

            return r;
        });
};

module.exports.markEpisodeWatched = function (ids) {
    return trakt.sync.history.add({
        episodes: [{
            watched_at: new Date(),
            ids: ids
        }]
    });
};

module.exports.isAuthenticated = function() {
    return authenticated;
};

module.exports.getAuthUrl = function() {
    return trakt.get_url();
};

module.exports.authenticate = function(code) {
    return trakt.exchange_code(code)
        .then(function(r) {
            authenticated = true;

            db('settings').push({
                name: 'trakt_token',
                value: r
            });
            
            return null;
        });
};