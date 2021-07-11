import http from 'http';
import env from 'dotenv';
import Bot from './bot.js';
import axios from 'axios';
env.config({ path: './config.env' });

const server = http.createServer(async (request, response) => {});

server.listen(80, () => {
  console.log('server started...');
});
