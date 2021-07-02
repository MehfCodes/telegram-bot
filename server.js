import http from 'http';
import https from 'https';
import env from 'dotenv';
import axios from 'axios';
env.config({ path: './config.env' });

const server = http.createServer((request, response) => {
  let data = '';
  request
    .on('data', (chunk) => {
      data += chunk;
    })
    .on('end', () => {
      let body = JSON.parse(data);
      const chatId = body.message.chat.id;
      const sentMessage = body.message.text;

      if (sentMessage === 'hi') {
        axios
          .post(`${process.env.telegram_url}/sendMessage`, {
            chat_id: chatId,
            text: 'hello back 👋',
          })
          .then((tlgRes) => {
            response.write(tlgRes.data.result.text);
            response.end();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
});

server.listen(80, () => {
  console.log('server started...');
});
