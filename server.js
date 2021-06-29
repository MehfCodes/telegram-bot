import http from 'http';
import https from 'https';

const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/getMe') {
    https.get(
      'https://api.telegram.org/bot1753419991:AAEASVg3clpZqrnAuyRKKTncy5Nbpu3NfW4/getMe',
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode === 200) {
            response
              .writeHead(200, { 'Content-Type': 'application/json' })
              .write(data);
            response.end();
          }
        });
      }
    );
  }
});

server.listen(10000, () => console.log('server started...'));
