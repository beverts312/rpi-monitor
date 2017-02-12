import express = require('express');
import path = require('path');

import VideoStreamer = require('./video-streamer');

const app = express();
const http = require('http').Server(app);

app.use('/', express.static(path.join(__dirname, 'stream')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/health', (req, res) => {
  res.send('alive');
});

(new VideoStreamer(http)).initialize();

http.listen(3000, () => {
  console.log('listening on *:3000');
});
