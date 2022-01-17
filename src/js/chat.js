import GUI from './gui';
import Link from './link';
import Data from './data';
import MenuPopup from './menuPopup';
import MediaRec from './mediaRec';
import GeoLocation from './geoLocation';
import WinModal from './winModal';

export default class Chat {
  constructor(domElmt, server) {
    this.domElmt = domElmt;

    this.gui = new GUI(domElmt);
    this.link = new Link(server);
    this.position = new GeoLocation();
    this.media = new MediaRec(domElmt, this.link, this.position);

    this.rows = this.domElmt.querySelector('.content-row');
    this.tabRows = this.domElmt.querySelector('.tab-content');
    this.tab = this.domElmt.querySelector('.tab-overlay');
    this.tabTitle = this.domElmt.querySelector('.tab-title');
    this.input = this.domElmt.querySelector('.input-field');
    this.buttonAsk = this.domElmt.querySelector('.buttonAsk');
    this.clip = this.domElmt.querySelector('.clip');

    // this.uploadAction = this.uploadAction.bind(this);
    // this.popupAction = this.popupAction.bind(this);
    // this.optionAction = this.optionAction.bind(this);
    this.eventDomElt = this.eventDomElt.bind(this);
    // this.groupMenuAction = this.groupMenuAction.bind(this);

    this.option = null;
    this.upload = null;
    this.popup = null;
    this.group = null;

    this.message = {};
    this.txtFlag = '';
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
      this.link.sendData(e.dataTransfer.files, Data.getTime(), this.position.location);
    });

    // Текстовый ввод
    this.domElmt.querySelector('.buttonAsk').addEventListener('click', this.onSubmit.bind(this));
    this.domElmt.querySelector('.input-field').addEventListener('input', this.onInput.bind(this));

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
          this.deleteMessage(msg.id);
          break;
        case 'deleteAll':
          this.domElmt.querySelector('.content-row').innerHTML = '';
          break;
        case 'favorite':
          this.favoriteMessage(msg);
          break;
        case 'favoriteAll':
          this.tabOpen('Избранное');
          this.tabRows.append(this.gui.createElm(msg.message));
          this.tabRows.scrollTop = this.tabRows.scrollHeight;
          // this.showFavorite(msg);
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

  // Обработчики событий формы ввода
  onSubmit(e) {
    this.tabClose();
    e.preventDefault();
    switch (this.buttonAsk.querySelector('span').dataset.type) {
      case 'text':
        if (this.input.value !== '') {
          const url = Data.findURL(this.input.value);
          if (url !== null) {
            this.message.type = 'link';
            this.message.content = this.link.createLink(this.input.value, url);
          } else {
            this.message.type = 'text';
            this.message.content = this.input.value;
          }
          this.link.sendMsg(this.message, Data.getTime(), this.position.location);
          this.resetForm();
        }
        break;
      case 'audio':
        this.media.audioRecord();
        break;

      default:
        break;
    }
    this.rows.scrollTop = this.rows.scrollHeight;
  }

  onInput() {
    if (this.input.value.trim() !== '' && this.txtFlag === '') {
      this.txtFlag = 'txt';
      this.buttonAsk.innerHTML = `
        <span span data-type="text">
          <svg viewBox="0 0 24 24" width="24" height="24" class="">
            <path fill="currentColor" d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z">
            </path>
          </svg>
        </span>
      `;
    } else if (this.input.value.trim() === '' && this.txtFlag === 'txt') {
      this.buttonAsk.innerHTML = `
        <span span data-type="audio">
          <svg viewBox="0 0 24 24" width="24" height="24" class="">
            <path fill="currentColor"
              d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z">
            </path>
          </svg>
        </span>
      `;
    }
  }

  resetForm() {
    this.input.value = '';
    this.txtFlag = '';
    this.buttonAsk.innerHTML = `
      <span span data-type="audio">
        <svg viewBox="0 0 24 24" width="24" height="24" class="">
          <path fill="currentColor"
            d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z">
          </path>
        </svg>
      </span>
    `;
  }

  // События в чате
  eventDomElt(e) {
    console.log(e.target);
    // Запись видео
    if (e.target.closest('.rec-video') !== null) {
      this.tabRecVideo();
    }
    // Поиск
    if (e.target.closest('.menu-find') !== null) {
      this.tabFind();
    }
    // Опции '⋮'
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
    // Закрытие шторки
    if (e.target.closest('.tab-closebtn') !== null) {
      this.tabClose();
    }
  }

  // Запись видео
  tabRecVideo() {
    this.tabOpen();
  }

  // вкладка поиска
  tabFind() {
    this.tabOpen();
  }

  tabOpen(title) {
    this.tabTitle.textContent = title;
    this.domElmt.querySelector('.tab-overlay').style.width = '100%';
  }

  tabClose() {
    this.tabRows.innerHTML = '';
    this.domElmt.querySelector('.tab-overlay').style.width = '';
  }

  // Меню опции '⋮'
  optionMenu() {
    this.tabClose();
    const menu = [
      { title: 'Геолокация', type: 'geo', state: this.position.geo },
      { title: 'Избранное', type: 'favorite' },
      { title: 'Категории', type: 'group', state: 'sub' },
      { title: 'Удалить всё', type: 'delete' },
    ];
    const position = { top: '45px', right: '0', width: '155px' };
    const host = {
      global: this.domElmt,
      local: this.domElmt.querySelector('.menu-option'),
    };
    this.option = new MenuPopup(menu, position, host, this.optionAction.bind(this));
    this.option.init();
  }

  optionAction(e) {
    switch (e.target.dataset.type) {
      case 'geo':
        this.option.remove();
        this.option = null;
        this.position.geo = !this.position.geo;
        this.position.geoLocation();
        break;
      case 'favorite':
        this.option.remove();
        this.option = null;
        this.link.sendEvent({ event: 'getFavoriteAll' });
        break;
      case 'group':
        this.groupMenu();
        break;
      case 'delete':
        this.option.remove();
        this.option = null;
        this.deleteAll();
        break;
      default:
        break;
    }
  }

  deleteAll() {
    const winItems = {
      head: 'Внимание',
      text: 'Все сообщения чата будут удалены. Желаете продолжить?',
      button: {
        ok: 'OK',
        cancel: 'Отмена',
      },
    };
    this.deleteWin = new WinModal(this.domElmt);
    this.deleteWin.winModalDialog(winItems, this.deleteAllOk.bind(this));
  }

  deleteAllOk() {
    this.deleteWin.closeWinModal();
    this.link.sendEvent({
      event: 'deleteAll',
    });
  }

  groupMenu() {
    const menu = [
      { title: 'Картинки', type: 'image', state: this.position.geo },
      { title: 'Видео', type: 'video' },
      { title: 'Аудио', type: 'audio' },
      { title: 'Файлы', type: 'file' },
      { title: 'Текст', type: 'text' },
      { title: 'Ссылки', type: 'link' },
    ];
    const position = { top: '115px', right: '170px' };
    const host = {
      global: this.domElmt,
      local: this.domElmt.querySelector('.menu-option'),
    };
    this.group1 = new MenuPopup(menu, position, host, this.groupMenuAction.bind(this));
    this.group1.init();
  }

  // eslint-disable-next-line class-methods-use-this
  groupMenuAction() {
    console.log('ok');
  }

  // Меню скрепки
  uploadMenu() {
    this.tabClose();
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
    this.upload = new MenuPopup(menu, position, host, this.uploadAction.bind(this));
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
      this.link.sendData(i.files, Data.getTime(), this.position.location);
    };
  }

  // Меню элемента
  popupMenu(e) {
    const menu = [
      { title: e.target.closest('.element').querySelector('.mess-user-body').dataset.favorite === 'yes' ? 'Удалить из избранного' : 'В избранное', type: 'favorite' },
      // { title: 'Закрепить', type: 'fix' },
      { title: 'Удалить', type: 'delete' },
    ];
    const position = { top: '25px', right: '18px' };
    const host = {
      global: this.domElmt,
      local: e.target.closest('.mess-menu'),
    };
    this.popup = new MenuPopup(menu, position, host, this.popupAction.bind(this));
    this.popup.init();
  }

  popupAction(e) {
    switch (e.target.dataset.type) {
      case 'delete':
        this.link.sendEvent({
          event: 'delete',
          id: e.target.closest('.element').querySelector('.mess-user-body').dataset.id,
        });
        break;
      case 'favorite':
        this.link.sendEvent({
          event: 'favorite',
          id: e.target.closest('.element').querySelector('.mess-user-body').dataset.id,
          value: e.target.closest('.element').querySelector('.mess-user-body').dataset.favorite === 'no' ? 'yes' : 'no',
        });
        break;
      default:
        break;
    }
    this.popup.remove();
    this.popup = null;
  }

  // eslint-disable-next-line class-methods-use-this
  popupItemRemove(e) {
    e.closest('.row').remove();
  }

  // Функции WEbSocket
  deleteMessage(e) {
    const arr = [...this.rows.querySelectorAll('.mess-user-body')];
    const index = arr.findIndex((el) => el.dataset.id === e);
    arr[index].closest('.row').remove();
  }

  favoriteMessage(e) {
    // Основное поле
    const arr = [...this.rows.querySelectorAll('.mess-user-body')];
    const index = arr.findIndex((el) => el.dataset.id === e.id);
    arr[index].closest('.mess-user-body').dataset.favorite = e.value;
    const str = arr[index].closest('.element').querySelector('.time-stp');
    if (str.textContent[0] === '★' && e.value === 'no') {
      str.textContent = str.textContent.slice(2, str.textContent.length);
    } else if (str.textContent[0] !== '★' && e.value === 'yes') {
      str.textContent = `★ ${str.textContent}`;
    }
    // Если вкладка tab открыта
    if (this.tabRows.querySelector('.row') !== null) {
      const arrTab = [...this.tabRows.querySelectorAll('.mess-user-body')];
      const indexTab = arrTab.findIndex((el) => el.dataset.id === e.id);
      arrTab[indexTab].closest('.row').remove();
    }
  }
}