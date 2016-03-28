// load db
var low = require('lowdb');
var storage = require('lowdb/file-sync'); // blocking impl

var db =  low(__dirname + '\\..\\db.json', {storage: storage});

db.object.torrents = db.object.torrents || [];
db.object.settings = db.object.settings || [];

module.exports = {
    db: db
};