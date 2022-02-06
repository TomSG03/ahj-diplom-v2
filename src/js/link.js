export default class Link {
  constructor(server) {
    this.server = server;
  }

  sendMsg(obj, timeStamp, location) {
    this.ws.send(JSON.stringify({
      event: 'message',
      type: obj.type,
      message: obj.content,
      messageName: obj.contentName,
      favorite: 'no',
      date: timeStamp,
      geo: location,
    }));
  }

  sendEvent(obj = { event: '', id: '', value: '' }) {
    this.ws.send(JSON.stringify({
      event: obj.event,
      id: obj.id,
      value: obj.value,
    }));
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
      msg.contentName = obj.file.name;
      msg.type = obj.type;
      this.sendMsg(msg, date, location);
    };
  }
}
