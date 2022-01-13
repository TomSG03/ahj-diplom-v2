// V 0.2

// ---------------------------- standart parts ---------------------------------
/* eslint-disable guard-for-in */
export default class GUI {
  constructor(host) {
    this.host = host;
    this.closeWinModal = this.closeWinModal.bind(this);
    this.chatBody = host.querySelector('.chat-body');
  }

  // eslint-disable-next-line class-methods-use-this
  createMenu(item, pos) {
    const div = document.createElement('div');
    div.className = 'menu-upload';
    div.style.top = pos.top;
    div.style.left = pos.left;
    div.style.right = pos.right;
    div.style.bottom = pos.bottom;
    const ul = document.createElement('ul');
    div.append(ul);
    for (let i = 0; i < item.length; i += 1) {
      ul.innerHTML += `<li><button class="upload-item" data-type="${item[i].type}">${item[i].title}</button></li>`;
    }
    return div;
  }

  winModalDialog(obj = {}, callback) {
    this.winModal = document.createElement('div');
    this.winModal.className = 'windowAsk-wrapper';
    const divWindow = document.createElement('div');
    divWindow.className = 'window-ask';

    let winHTML = '';
    for (const key in obj) {
      switch (key) {
        case 'head':
          winHTML += `<div class="head-ask">${obj[key]}</div>`;
          break;
        case 'input':
          winHTML += `
            <div class="input-ask-block">
              <div class="head-input-ask">${obj[key].head}</div>
              <input class="input-ask" type="text" value="${obj[key].value}" required>
              <p class="input-err">${obj[key].error}</p>
            </div>
          `;
          break;
        case 'textArea':
          winHTML += `
            <div class="input-ask-block">
              <div class="head-textarea-ask">${obj[key].head}</div>
              <textarea class="input-ask textarea-ask" required>${obj[key].value}</textarea>
            </div>
          `;
          break;
        case 'text':
          winHTML += `<div class="body-ask">${obj[key]}</div>`;
          break;
        case 'button':
          winHTML += '<div class="btn-ask">';
          if (obj[key].ok !== '') {
            winHTML += `<button class="btnOk">${obj[key].ok}</button>`;
          }
          if (obj[key].cancel !== '') {
            winHTML += `<button class="btnCancel">${obj[key].cancel}</button>`;
          }
          winHTML += '</div>';
          break;

        default:
          break;
      }
    }

    divWindow.innerHTML = winHTML;

    this.winModal.appendChild(divWindow);
    document.body.appendChild(this.winModal);

    const canFocus = document.querySelector('.input-ask');
    if (canFocus) {
      canFocus.focus();
    }

    this.ok = this.winModal.querySelector('.btnOk');
    if (this.ok) {
      this.ok.addEventListener('click', this.checkCoords.bind(this, callback));
    }

    this.cancel = this.winModal.querySelector('.btnCancel');
    if (this.cancel) {
      this.cancel.addEventListener('click', this.closeWinModal);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  checkValidity(callback, e) {
    const arr = e.target.closest('.window-ask').querySelectorAll('.input-ask');
    for (let i = 0; i < arr.length; i += 1) {
      if (!arr[i].checkValidity()) {
        arr[i].style.outline = 'solid red';
        arr[i].style.borderColor = 'red';
        setTimeout(() => {
          arr[i].style.outline = '';
          arr[i].style.borderColor = '';
        }, 1000);
        return;
      }
    }
    callback();
  }

  eventKey(callback, e) {
    if (typeof e !== 'undefined') {
      if (e.key === 'Enter' && e.target.classList.contains('btnOk')) {
        const arr = e.target.closest('.window-ask').querySelectorAll('.input-ask');
        for (let i = 0; i < arr.length; i += 1) {
          if (!arr[i].checkValidity()) {
            arr[i].style.outline = 'solid red';
            arr[i].style.borderColor = 'red';
            setTimeout(() => {
              arr[i].style.outline = '';
              arr[i].style.borderColor = '';
            }, 1000);
            return;
          }
        }
        callback();
      }
      if (e.target.classList.contains('btnCancel')) {
        this.closeWinModal();
      }
    }
  }

  closeWinModal() {
    this.winModal.remove();
  }

  // eslint-disable-next-line class-methods-use-this
  log(str) {
    console.log(str);
  }

  // ---------------------------- add parts ---------------------------------

  showConnect(msg) {
    const div = document.createElement('div');
    div.className = 'chat-msg-block';
    div.style.justifyContent = 'center';
    div.innerHTML = `
      <div class="block-msg">
        <p class"msg-body">${msg}</p>  
      </div>
      `;
    this.chatBody.appendChild(div);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

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
