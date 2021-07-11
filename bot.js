import axios from 'axios';
import EventEmitter from 'events';

class Bot {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.startBot();
  }

  async startBot() {
    try {
      const defaultReply =
        'i can send radiojavan mp3 file to you ,so give me a link!';

      let { chatId, sentMessage } = await this.parsReqToJson();
      if (sentMessage === '/start') {
        await this.sendReply({
          chat_id: chatId,
          text: defaultReply,
        });
      } else if (sentMessage === 'hi') {
        const reply = 'hi darling👋🥰';
        await this.sendReply({
          chat_id: chatId,
          text: reply,
        });
      } else if (sentMessage.includes('radiojavan')) {
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
    } catch (error) {
      console.log(error.message);
      this.res.end();
    }
  }

  parsReqToJson() {
    return new Promise((resolve, reject) => {
      let data = '';
      let obj = {};
      this.req
        .on('data', (chunk) => {
          data += chunk;
        })
        .on('end', () => {
          const body = JSON.parse(data);
          try {
            if (body) {
              obj.chatId = body.message.chat.id;
              obj.sentMessage = body.message.text;
              resolve(obj);
            }
          } catch (error) {
            reject(error);
          }
        });
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
