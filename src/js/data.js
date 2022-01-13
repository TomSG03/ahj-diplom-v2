export default class Data {
  static getTime() {
    const time = new Date().toLocaleString([], {
      hour: '2-digit', minute: '2-digit',
    }).replace(/,/, '');
    const date = new Date().toLocaleString([], {
      day: '2-digit', month: '2-digit', year: '2-digit',
    }).replace(/,/, '');
    return `${date}, ${time}`;
  }

  static findURL(str) {
    // const validURL = /(https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?/ig;
    const validURL = /https?:\/\/\S+/ig;
    const url = str.match(validURL);
    return url;
  }
}
