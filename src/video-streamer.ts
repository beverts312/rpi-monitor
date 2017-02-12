import http = require('http');
import fs = require('fs');

let proc;
const spawn = require('child_process').spawn;

const imagePath = __dirname + '/stream_image.jpg';

class VideoStreamer {
    io: any;
    sockets: any[];
    watching: boolean;

    constructor(http: http.Server) {
        this.io = require('socket.io')(http);
        this.sockets = [];
    }

    initialize() {
        this.io.on('connection', (socket) => {
            this.sockets[socket.id] = socket;

            socket.on('disconnect', () => {
                delete this.sockets[socket.id];

                if (Object.keys(this.sockets).length === 0) {
                    this.stopSteaming();
                }
            });

            socket.on('start-stream', () => {
                this.startStreaming();
            });
        });
    }

    private emitImage() {
        fs.readFile(imagePath, (err, buf) => {
            this.io.sockets.emit('image', { image: true, buffer: buf.toString('base64') });
        });
    }

    private startStreaming() {
        if (this.watching) {
            this.emitImage();
        } else {
            const args = ['-w', '640', '-h', '480', '-o', imagePath, '-t', '999999999', '-tl', '100'];
            proc = spawn('raspistill', args);
            proc.stdout.on('data', (data) => {
                console.log(data.toString());
            });
            this.watching = true;
            fs.watchFile(imagePath, (current, previous) => {
                this.emitImage();
            });
        }
    }

    private stopSteaming() {
        this.watching = false;
        if (proc) {
            proc.kill();
        }
        fs.unwatchFile(imagePath);
    }
}
export = VideoStreamer;
