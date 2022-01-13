import GUI from './gui';
import Link from './link';
import Data from './data';
import MenuPopup from './menuPopup';

export default class Chat {
  constructor(domElmt, server) {
    this.domElmt = domElmt;
    this.gui = new GUI(domElmt);
    this.link = new Link(server);
    this.message = {};
    this.rows = this.domElmt.querySelector('.content-row');
    this.input = this.domElmt.querySelector('.input-field');
    this.clip = this.domElmt.querySelector('.clip');

    this.uploadAction = this.uploadAction.bind(this);
    this.popupAction = this.popupAction.bind(this);
    this.optionAction = this.optionAction.bind(this);

    this.eventDomElt = this.eventDomElt.bind(this);

    this.option = null;
    this.upload = null;
    this.popup = null;
  }

  begin() {
    // Основной обработчик
    this.domElmt.addEventListener('click', this.eventDomElt.bind());

    // DnD
    this.domElmt.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    this.domElmt.addEventListener('drop', (e) => {
      e.preventDefault();
      this.link.sendData(e.dataTransfer.files, Data.getTime());
    });

    // Текстовый ввод
    this.domElmt.querySelector('.buttonAsk').addEventListener('click', (e) => {
      const ask = document.querySelector('.input-field');
      if (ask.value !== '') {
        const url = Data.findURL(ask.value);
        if (url !== null) {
          this.message.type = 'link';
          this.message.content = this.link.createLink(ask.value, url);
        } else {
          this.message.type = 'text';
          this.message.content = ask.value;
        }
        this.link.sendMsg(this.message, Data.getTime());
        ask.value = '';
        e.preventDefault();
      }
      this.rows.scrollTop = this.rows.scrollHeight;
    });

    // WebSocket
    this.link.ws = new WebSocket(this.link.server);
    this.link.ws.addEventListener('open', () => {
      this.link.ws.send(JSON.stringify({
        event: 'connected',
      }));
    });

    this.link.ws.addEventListener('message', (e) => {
      const msg = JSON.parse(e.data);
      switch (msg.event) {
        case 'connect':
          // this.nikName = msg.message;
          this.gui.log(`ws connect: ${msg.message}`);
          break;
        case 'system':
          // this.gui.showAside(msg.message.users, this.nikName);
          break;
        case 'message':
          this.rows.append(this.gui.createElm(msg.message));
          this.rows.scrollTop = this.rows.scrollHeight;
          break;
        case 'delete':
          this.deleteMessage(msg.idDelete);
          break;
        default:
          break;
      }
    });

    this.link.ws.addEventListener('close', (e) => {
      this.gui.log(`ws close: ${e}`);
      if (e.reason) {
        this.gui.log(e);
      }
    });

    this.link.ws.addEventListener('error', (e) => {
      this.gui.log(`ws error: ${e}`);
    });
  }

  eventDomElt(e) {
    // Опции
    if (e.target.closest('.menu-option') !== null && this.option === null) {
      this.optionMenu();
    } else if (this.option !== null) {
      this.option.remove();
      this.option = null;
    }
    // Скрепка
    if (e.target.closest('.upload') !== null && this.upload === null) {
      this.uploadMenu();
    } else if (this.upload !== null) {
      this.upload.remove();
      this.upload = null;
    }
    // Элемент
    if (e.target.closest('.mess-menu') !== null && this.popup === null) {
      this.popupMenu(e);
    } else if (this.popup !== null) {
      this.popup.remove();
      this.popup = null;
    }
    // Увеличение картинки или видеопроигрывателя при клике на них
    if (e.target.classList.contains('mess-img') && (e.target.dataset.type.match(/image/) || e.target.dataset.type.match(/video/))) {
      e.target.classList.toggle('big-img');
    }
  }

  // Меню опции '⋮'
  optionMenu() {
    const menu = [
      { title: 'Удалить все', type: 'delete' },
      { title: 'Выделить', type: 'select' },
    ];
    const position = { top: '45px', right: '0' };
    const host = {
      global: this.domElmt,
      local: this.domElmt.querySelector('.menu-option'),
    };
    this.option = new MenuPopup(menu, position, host, this.optionAction.bind());
    this.option.init();
  }

  optionAction(e) {
    this.option.remove();
    this.option = null;
    console.log(e.target);
  }

  // Меню скрепки
  uploadMenu() {
    const menu = [
      { title: 'Картинка', type: 'image' },
      { title: 'Видео', type: 'video' },
      { title: 'Аудио', type: 'audio' },
      { title: 'Файл', type: 'file' },
    ];
    const position = { top: '-160px', left: '5px' };
    const host = {
      global: this.domElmt,
      local: this.domElmt.querySelector('.upload'),
    };
    this.upload = new MenuPopup(menu, position, host, this.uploadAction.bind());
    this.upload.init();
  }

  uploadAction(e) {
    this.upload.remove();
    this.upload = null;
    this.gui.log(e.target.dataset.type);
    const i = document.createElement('input');
    i.type = 'file';
    i.accept = `${e.target.dataset.type}/*`;
    i.click();
    i.oninput = () => {
      this.link.sendData(i.files, Data.getTime());
    };
  }

  // Меню элемента
  popupMenu(e) {
    const menu = [
      { title: 'В избранное', type: 'favourite' },
      { title: 'Закрепить', type: 'fix' },
      { title: 'Удалить', type: 'delete' },
    ];
    const position = { top: '25px', right: '18px' };
    const host = {
      global: this.domElmt,
      local: e.target.closest('.mess-menu'),
    };
    this.popup = new MenuPopup(menu, position, host, this.popupAction.bind());
    this.popup.init();
  }

  popupAction(e) {
    switch (e.target.dataset.type) {
      case 'delete':
        // this.popupItemRemove(e.target);
        this.link.senDelete(e.target.closest('.element').querySelector('.mess-user-body').dataset.id);
        break;

      default:
        break;
    }
    this.popup.remove();
    this.popup = null;
  }

  popupItemRemove(e) {
    e.closest('.row').remove();
  }

  deleteMessage(e) {
    const arr = [...this.rows.querySelectorAll('.mess-user-body')];
    const index = arr.findIndex((el) => el.dataset.id === e);
    arr[index].closest('.row').remove();
  }
}
