import http from 'http';
import env from 'dotenv';
import Bot from './bot.js';
import axios from 'axios';
env.config({ path: './config.env' });

const server = http.createServer(async (request, response) => {
  const bot = new Bot(request, response);
  bot.onText(
    '/start',
    'hi darling👋🥰\ni can send radiojavan mp3 file to you ,so give me a link!'
  );
  bot.onText('hi', 'hi darling👋🥰');
  bot.onAudio('radiojavan');
  bot.onText('*');
});

server.listen(80, () => {
  console.log('server started...');
});
