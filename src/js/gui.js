export default class GUI {
  constructor(host) {
    this.host = host;
  }

  // eslint-disable-next-line class-methods-use-this
  log(str) {
    console.log(str);
  }

  // ---------------------------- add parts ---------------------------------

  // eslint-disable-next-line class-methods-use-this
  createElm(obj) {
    const divRow = document.createElement('div');
    divRow.className = 'row mess-user';
    const divElmt = document.createElement('div');
    divElmt.className = 'element el-user';
    const divMess = document.createElement('div');
    divMess.className = 'mess-user-body';
    divMess.dataset.type = obj.type;
    divMess.style.paddingRight = '0';
    divMess.dataset.id = obj.id;
    const divTime = document.createElement('div');
    divTime.className = 'time-stp';
    divTime.innerHTML = obj.date;
    const divGeo = document.createElement('div');
    divGeo.className = 'time-stp';
    divGeo.innerHTML = obj.geo;

    if (obj.type.match(/text/)) {
      divMess.append(obj.message);
    } else if (obj.type.match(/link/)) {
      divMess.innerHTML = obj.message;
    } else if (obj.type.match(/image/)) {
      divMess.append(this.crateImgItem(obj));
    } else if (obj.type.match(/audio/) || obj.type.match(/video/)) {
      divMess.append(this.crateMediaItem(obj));
    } else {
      divMess.append(this.crateFileItem(obj));
    }

    const divMenu = document.createElement('div');
    divMenu.className = 'mess-menu';
    divMenu.innerHTML = `
        <span class="">
          <svg viewBox="0 0 18 18" width="18" height="18" class="menu-down" data-menu="popup">
            <path fill="currentColor" d="M3.3 4.6 9 10.3l5.7-5.7 1.6 1.6L9 13.4 1.7 6.2l1.6-1.6z"></path>
          </svg>
        </span>
    `;
    divElmt.append(divMenu);
    divElmt.append(divMess);
    divElmt.append(divGeo);
    divElmt.append(divTime);
    divRow.append(divElmt);

    return divRow;
  }

  // eslint-disable-next-line class-methods-use-this
  crateImgItem(obj) {
    const item = document.createElement('img');
    item.className = 'mess-img';
    item.dataset.type = obj.type;
    item.src = obj.message;
    return item;
  }

  // eslint-disable-next-line class-methods-use-this
  crateMediaItem(obj) {
    const item = document.createElement(obj.type.slice(0, 5));
    item.className = 'mess-img';
    item.dataset.type = obj.type;
    item.src = obj.message;
    item.controls = true;
    return item;
  }

  // eslint-disable-next-line class-methods-use-this
  crateFileItem(obj) {
    const item = document.createElement('a');
    item.className = 'mess-img';
    item.dataset.type = obj.type;
    item.href = obj.message;
    item.textContent = obj.messageName;
    return item;
  }
}
