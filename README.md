# Torrents

This is a prototype torrent client. Based on [electron](http://electron.atom.io/) and [polymer](https://www.polymer-project.org).

### Features

- Download torrents, with high priority for blocks at the beginning of files
- .torrent files and magnet protocol
- Drag and drop .torrent files and magnet links
- Trakt.tv connection
- Video torrent streaming video player
- Search into EZTV, YTS and KAT

## Install

```
npm install
```

## Run

Double click on `torrents.cmd` executable or:

```
npm start
```

## Register .torrent files and magnet links

The app will attempt to make itself as the default for .torrent files and magnet protocol, though it needs to be ran as admin for it to work.

## Build the app

```
npm run-script package
```
