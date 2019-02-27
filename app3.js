var express = require('express');
var app = express();
var fs = require("fs");
var server = app.listen(4000, function () {
    console.log("listening to port 4000");
});
var io = require('socket.io').listen(server);
var path = require("path");
app.use(express.static(__dirname + '/public'));

var size, name;
var chunkSize = 0;
var end;

class Server {

    acceptRequest() {
        io.on('connection', function (socket) {
            console.log('connection established');
            socket.emit('start', {
                response: 'iam ready to accept'
            });
            socket.on('metaData', obj => {
                size = obj['size'];
                name = obj['name'];
                var start = obj['start'];
                socket.emit('data', {
                    start: start
                });
                socket.on('sendingChunk', obj => {
                    let data = obj['data'];
                    var start = obj['start'];
                    fs.appendFileSync(path.join(__dirname + "/server/upload/" + name), data, err => {});
                    //console.log((start / size) * 100 + "%");
                    socket.emit("percent", {
                        percentage: ((start / size) * 100 + "% completed")
                    })

                    if (start >= size) {
                        socket.emit('complted', {
                            'msg': "completed"
                        });
                        //socket.end();
                    } else {
                        socket.emit("data", {
                            start: start
                        });
                    }

                });

            })
        })

    }
}
var s = new Server();
s.acceptRequest();