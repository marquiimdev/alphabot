const Discord = require("discord.js");
const yts = require('youtube-search');
const ytdl = require('ytdl-core');
exports.run = (client, message, args, ops) => {

    var opts = yts.YouTubeSearchOptions = {
        maxResults: 10,
        key: "AIzaSyBES_P0OFzkmqMNDYueY6jebrzLJ-qJjsM"
    };

    yts(args.join(" "), opts, (err, results) => {
        if(err) return console.log(err);
       
        console.dir(results[0]);
        let rVideo = ytdl.getInfo(results[0].id);
        ytdl.getInfo(results[0].id,
        function(err, info) {
            if (err) throw err;
            var songTitle = info.length_seconds //you can store it here
            console.log(songTitle);
        });
    });
};