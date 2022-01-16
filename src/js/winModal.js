// V 0.22

// ---------------------------- standart parts ---------------------------------

/* eslint-disable guard-for-in */
export default class WinModal {
  constructor(host) {
    this.host = host;
    this.closeWinModal = this.closeWinModal.bind(this);

    this.eventOk = this.checkValidity;
    this.eventCancel = this.closeWinModal;
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
          if (obj[key].ok !== undefined) {
            winHTML += `<button class="btnOk">${obj[key].ok}</button>`;
          }
          if (obj[key].cancel !== undefined) {
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
      this.ok.addEventListener('click', this.eventOk.bind(this, callback));
    }

    this.cancel = this.winModal.querySelector('.btnCancel');
    if (this.cancel) {
      this.cancel.addEventListener('click', this.eventCancel.bind(this, callback));
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

  // eslint-disable-next-line class-methods-use-this
  eventBack(callback) {
    callback(null);
  }

  closeWinModal() {
    this.winModal.remove();
  }

  // ---------------------------- add parts ---------------------------------

  checkCoords(callback, e) {
    const input = e.target.closest('.window-ask').querySelector('.input-ask');
    const coords = this.checkValidCoords(input.value);
    if (!coords) {
      input.nextElementSibling.style.visibility = 'visible';
      setTimeout(() => {
        input.nextElementSibling.style.visibility = '';
      }, 2000);
      return;
    }
    callback(coords);
  }

  // eslint-disable-next-line class-methods-use-this
  checkValidCoords(input) {
    const position = input.split(',').map((coord) => coord.match(/[+|−|-|—|-]?\d{1,3}\.\d+/));
    if (!position[0] || !position[1]) {
      return false;
    }
    return { latitude: position[0][0], longitude: position[1][0] };
  }
}
