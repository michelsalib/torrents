// load db
var low = require('lowdb');
var storage = require('lowdb/lib/file-sync'); // blocking impl

var db =  low(__dirname + '\\..\\db.json', {storage: storage});

db.getState().torrents = db.getState().torrents || [];
db.getState().settings = db.getState().settings || [];

module.exports = {
    db: db
};