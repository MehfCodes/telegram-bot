import axios from 'axios';
import https from 'https';
import { promisify } from 'util';
class Bot {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.eventNames = ['/start', 'hi', 'radiojavan'];
  }

  async onText(ev, reply) {
    let { chatId, sentMessage } = await this.parsReqToJson();
    if (sentMessage === ev) {
      await this.sendReply({
        chat_id: chatId,
        text: reply,
      });
    } else if (
      ev == '*' &&
      !this.eventNames.includes(sentMessage) &&
      !sentMessage.includes('radiojavan') &&
      !sentMessage.includes('rj.app') &&
      !sentMessage.includes('rjapp.app')
    ) {
      await this.sendReply({
        chat_id: chatId,
        text: 'damn man, give me a fucking rj link😡',
      });
    }
    this.res.end();
  }

  async onAudio(msg) {
    let { chatId, sentMessage } = await this.parsReqToJson();
    if (sentMessage.includes(msg)) {
      if (sentMessage.includes('rj.app/m/')) {
        https.get(sentMessage, async (res) => {
          sentMessage = res.headers.location;
          const audio =
            process.env.host_url +
            sentMessage.substring(sentMessage.lastIndexOf('/') + 1) +
            '.mp3';
          await this.sendReply(
            {
              chat_id: chatId,
              audio,
            },
            'sendAudio'
          );
          this.res.end();
        });
      } else {
        if (sentMessage.includes('?')) {
          sentMessage = sentMessage.substring(0, sentMessage.lastIndexOf('?'));
        }
        const audio =
          process.env.host_url +
          sentMessage.substring(sentMessage.lastIndexOf('/') + 1) +
          '.mp3';
        await this.sendReply(
          {
            chat_id: chatId,
            audio,
          },
          'sendAudio'
        );
      }
      this.res.end();
    }
  }

  parsReqToJson() {
    return new Promise((resolve, reject) => {
      if (this.req.method === 'POST' && this.req.url === '/') {
        let data = '';
        let obj = {};
        this.req
          .on('data', (chunk) => {
            data += chunk;
          })
          .on('end', () => {
            // console.log(data);
            if (data != '') {
              const body = JSON.parse(data);
              try {
                if (body) {
                  if (body.message) {
                    obj.chatId = body.message.chat.id;
                    obj.sentMessage = body.message.text;
                    resolve(obj);
                  }
                }
              } catch (error) {
                reject(error);
              }
            }
          });
      } else {
        this.res.end();
      }
    });
  }

  async sendReply(opt, method = 'sendMessage') {
    try {
      const tlgRes = await axios.post(
        `${process.env.telegram_url}/${method}`,
        opt
      );
      if (tlgRes.data.result.text) return tlgRes.data.result.text;
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default Bot;
