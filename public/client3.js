var size, name, row;
var end = 10;
var blob;
class Client {
    constructor() {

    }


    createui() {
        var file = document.createElement('input');
        file.setAttribute("type", "file");
        file.setAttribute("id", "myfile");

        var button = document.createElement("input");
        button.setAttribute("type", "submit");
        button.setAttribute("id", "mybutton");
        button.setAttribute("value", "upload");

        document.body.appendChild(file);
        document.body.appendChild(button);


    }
    sendChunks() {
        var uploadid = document.getElementById("mybutton");
        var fileInput = document.getElementById("myfile");


        uploadid.addEventListener('click', function (e) {
            var oFile = fileInput.files[0];
            var blob = oFile;
            var reader = new FileReader();
            // Ready The Event For When A File Gets Selected
            reader.onload = function (e) {
                var data = e.target.result.split('\n');
                var socket = io.connect('http://localhost:4000');

                socket.on('start', function (e) {
                    console.log(e);
                    socket.emit('metaData', {
                        size: data.length,
                        name: oFile.name,
                        start: 0
                    })
                });

                socket.on('data', obj => {
                    let start = obj['start'];
                    socket.emit('sendingChunk', {
                        data: (data.slice(start, start + end)).join('\n'),
                        start: start + end
                    });
                    start += end;
                });
                socket.on('percent', obj => {
                    let percentage = obj['percentage'];
                    document.writeln(percentage);
                })

                socket.on('complted', function (d) {
                    //socket.end();

                    console.log("completed successfully");
                });

            }
            //reader.readAsBinaryString(oFile);
            reader.readAsBinaryString(blob);
        });

    }

}
var c = new Client();
c.createui();
c.sendChunks();