export default class Link {
  constructor(server) {
    this.server = server;
  }

  sendMsg(obj, timeStamp, location) {
    this.ws.send(JSON.stringify({
      event: 'message',
      type: obj.type,
      message: obj.content,
      date: timeStamp,
      messageName: obj.contentName,
      geo: location,
    }));
  }

  senDelete(id) {
    this.ws.send(JSON.stringify({
      event: 'delete',
      idDelete: id,
    }));
  }

  // если в тексте есть ссылки то добавлем <a href>
  // eslint-disable-next-line class-methods-use-this
  createLink(str, arrLink) {
    const strArr = str.split(' ');
    for (let i = 0; i < strArr.length; i += 1) {
      const index = arrLink.indexOf(strArr[i]);
      if (index !== -1) {
        const newStr = `<a href="${arrLink[index]}" class="mess-link" target="_blank">${arrLink[index]}</a>`;
        strArr[i] = newStr;
      }
    }
    return strArr.join(' ');
  }

  // eslint-disable-next-line class-methods-use-this
  sendData(arrFiles = [], date, location) {
    const msg = {};
    for (let i = 0; i < arrFiles.length; i += 1) {
      const { type } = arrFiles[i];
      const reader = new FileReader();
      reader.readAsDataURL(arrFiles[i]);
      reader.onloadend = () => {
        msg.content = reader.result;
        msg.contentName = arrFiles[i].name;
        msg.type = type;
        this.sendMsg(msg, date, location);
      };
    }
  }

  sendBlob(obj, date, location) {
    const msg = {};
    const reader = new FileReader();
    reader.readAsDataURL(obj.file);
    reader.onloadend = () => {
      msg.content = reader.result;
      msg.contentName = reader.name;
      msg.type = obj.type;
      this.sendMsg(msg, date, location);
    };
  }
}
