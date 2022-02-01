import GUI from './gui';
import Link from './link';
import Data from './data';
import MenuPopup from './menuPopup';
import MediaRec from './mediaRec';
import GeoLocation from './geoLocation';
import WinModal from './winModal';
import Search from './search';

export default class Chat {
  constructor(domElmt, server) {
    this.domElmt = domElmt;

    this.gui = new GUI(domElmt);
    this.link = new Link(server);
    this.position = new GeoLocation();

    this.rows = this.domElmt.querySelector('.content-row');
    this.tabRows = this.domElmt.querySelector('.tab-content');
    this.tab = this.domElmt.querySelector('.tab-overlay');
    this.tabTitle = this.domElmt.querySelector('.tab-title');
    this.input = this.domElmt.querySelector('.input-field');
    this.buttonAsk = this.domElmt.querySelector('.buttonAsk');
    this.clip = this.domElmt.querySelector('.clip');

    this.media = new MediaRec(domElmt, this.link, this.position);
    this.searh = new Search(domElmt, this.link);

    // this.eventDomElt = this.eventDomElt.bind(this);

    this.option = null;
    this.upload = null;
    this.popup = null;
    this.popupId = null;
    this.group = null;

    this.message = {};
    this.txtFlag = '';
  }

  begin() {
    // Основной обработчик
    this.domElmt.addEventListener('click', this.eventDomElt.bind(this));

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
          this.tabRows.append(this.gui.createElm(msg.message));
          break;
        case 'getGroup':
          this.tabRows.append(this.gui.createElm(msg.message));
          break;
        case 'search':
          this.tabRows.append(this.gui.createElm(msg.message));
          break;
        case 'funcOut':
          this.executeFunctionByName(msg.value, this, msg.id);
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
            this.message.type = 'txt';
            this.message.content = this.input.value;
          }
          this.link.sendMsg(this.message, Data.getTime(), this.position.location);
          this.resetForm();
        }
        break;
      case 'audio':
        this.media.mediaRecord('audio/wav');
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
    } else if (this.option !== null && this.group === null && e.target.dataset.type !== 'submenu') {
      this.option.remove();
      this.option = null;
    } else if (this.option !== null && this.group !== null && e.target.dataset.type !== 'submenu') {
      this.group.remove();
      this.option.remove();
      this.group = null;
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
    if (e.target.closest('.mess-menu') !== null && this.popupId === e.target.closest('.element').querySelector('.mess-user-body').dataset.id) {
      this.popup.remove();
      this.popup = null;
      this.popupId = null;
    } else if (e.target.closest('.mess-menu') !== null && this.popup === null) {
      this.popupMenu(e);
    } else if (e.target.closest('.mess-menu') !== null && this.popup !== null) {
      this.popup.remove();
      this.popupMenu(e);
    } else if (e.target.closest('.mess-menu') === null && this.popup !== null) {
      this.popup.remove();
      this.popup = null;
      this.popupId = null;
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
    this.tabClose();
    this.tabOpen('Запись видео');
    this.media.mediaRecord('video/mp4');
  }

  // вкладка поиска
  tabFind() {
    this.tabClose();
    this.tabOpen('Поиск');
    this.searh.init();
  }

  tabOpen(title, obj = {}) {
    this.tabTitle.textContent = title;
    this.domElmt.querySelector('.tab-overlay').style.width = '100%';
    this.tabRows.dataset.type = obj.type;
    if (obj.type === 'tabGroup') {
      switch (obj.name) {
        case 'txt':
          this.tabTitle.textContent = `${this.tabTitle.textContent} Текстовые сообщения`;
          break;
        case 'link':
          this.tabTitle.textContent = `${this.tabTitle.textContent} Ссылки`;
          break;
        case 'image':
          this.tabTitle.textContent = `${this.tabTitle.textContent} Картинки`;
          break;
        case 'audio':
          this.tabTitle.textContent = `${this.tabTitle.textContent} Аудио файлы`;
          break;
        case 'video':
          this.tabTitle.textContent = `${this.tabTitle.textContent} Видео файлы`;
          break;
        default:
          this.tabTitle.textContent = `${this.tabTitle.textContent} Прочее`;
          break;
      }
    }
  }

  tabClose() {
    if (this.tab.querySelector('.video-cover') !== null) {
      this.media.cancelRecording();
    }
    if (this.tab.querySelector('.input-field') !== null) {
      this.searh.tabClear();
    }
    this.tabRows.innerHTML = '';
    this.tabRows.dataset.type = 'null';
    this.domElmt.querySelector('.tab-overlay').style.width = '';
  }

  // Меню опции '⋮'
  optionMenu() {
    this.tabClose();
    const menu = [
      { title: 'Геолокация', type: 'geo', state: this.position.geo },
      { title: 'Избранное', type: 'favorite' },
      { title: 'Категории', type: 'submenu', state: 'sub' },
      { title: 'Удалить всё', type: 'delete' },
    ];
    const position = { top: 45, right: 0, width: 155 };
    const host = {
      name: 'options',
      global: this.domElmt,
      local: this.domElmt.querySelector('.menu-option'),
    };
    this.option = new MenuPopup(menu, position, host, this.optionAction.bind(this));
    this.option.init();
  }

  optionAction(e) {
    switch (e.target.dataset.type) {
      case 'geo':
        this.resetOption();
        this.position.geo = !this.position.geo;
        this.position.geoLocation();
        break;
      case 'favorite':
        this.showFavorite();
        break;
      case 'submenu':
        this.groupMenu();
        break;
      case 'delete':
        this.resetOption();
        this.deleteAll();
        break;
      default:
        break;
    }
  }

  resetOption() {
    if (this.option !== null) {
      this.option.remove();
    }
    this.option = null;
    this.group = null;
  }

  showFavorite() {
    this.resetOption();
    this.tabOpen('Избранное', { type: 'tabFavorite' });
    this.link.sendEvent({ event: 'getFavoriteAll' });
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
    if (this.group === null) {
      const menu = [
        { title: 'Картинки', type: 'image' },
        { title: 'Видео', type: 'video' },
        { title: 'Аудио', type: 'audio' },
        { title: 'Текст', type: 'txt' },
        { title: 'Ссылки', type: 'link' },
        { title: 'Остальное', type: 'file' },
      ];
      const position = { top: 68, right: 165 };
      const host = {
        name: 'group',
        global: this.domElmt,
        local: this.domElmt.querySelector('.menu-upload'),
      };
      this.group = new MenuPopup(menu, position, host, this.groupMenuAction.bind(this));
      this.group.init();
    } else {
      this.group.remove();
      this.group = null;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  groupMenuAction(e) {
    this.group = null;
    this.tabOpen('Категории:', { type: 'tabGroup', name: e.target.dataset.type });
    this.link.sendEvent({
      event: 'getGroup',
      value: e.target.dataset.type,
    });
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
    const position = { top: -160, left: 5 };
    const host = {
      name: 'clip',
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
    this.popupId = e.target.closest('.element').querySelector('.mess-user-body').dataset.id;
    const menu = [
      { title: e.target.closest('.element').querySelector('.mess-user-body').dataset.favorite === 'yes' ? 'Удалить из избранного' : 'В избранное', type: 'favorite' },
      // { title: 'Закрепить', type: 'fix' },
      { title: 'Удалить', type: 'delete' },
    ];
    const position = { top: 5, right: 18 };
    const host = {
      name: 'mess-item',
      global: this.rows,
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
    // Основное поле
    const arr = [...this.rows.querySelectorAll('.mess-user-body')];
    const index = arr.findIndex((el) => el.dataset.id === e);
    arr[index].closest('.row').remove();
    // Если вкладка tab открыта
    if (this.tabRows.querySelector('.row') !== null) {
      const arrTab = [...this.tabRows.querySelectorAll('.mess-user-body')];
      const indexTab = arrTab.findIndex((el) => el.dataset.id === e);
      arrTab[indexTab].closest('.row').remove();
    }
  }

  favoriteMessage(e) {
    // Основное поле
    this.setFavorite([...this.rows.querySelectorAll('.mess-user-body')], e);
    // Если вкладка tab открыта и это изранное
    if (this.tabRows.querySelector('.row') !== null && this.tabRows.dataset.type === 'tabFavorite') {
      const arrTab = [...this.tabRows.querySelectorAll('.mess-user-body')];
      const indexTab = arrTab.findIndex((el) => el.dataset.id === e.id);
      arrTab[indexTab].closest('.row').remove();
    }
    // Если вкладка tab открыта и это группа категорий
    if (this.tabRows.querySelector('.row') !== null && this.tabRows.dataset.type === 'tabGroup') {
      this.setFavorite([...this.tabRows.querySelectorAll('.mess-user-body')], e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  setFavorite(domElmt, e) {
    const arr = domElmt;
    const index = arr.findIndex((el) => el.dataset.id === e.id);
    arr[index].closest('.mess-user-body').dataset.favorite = e.value;
    const str = arr[index].closest('.element').querySelector('.time-stp');
    if (str.textContent[0] === '★' && e.value === 'no') {
      str.textContent = str.textContent.slice(2, str.textContent.length);
    } else if (str.textContent[0] !== '★' && e.value === 'yes') {
      str.textContent = `★ ${str.textContent}`;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  executeFunctionByName(functionName, context /* , args */) {
    // eslint-disable-next-line prefer-rest-params
    const args = Array.prototype.slice.call(arguments, 2);
    const namespaces = functionName.split('.');
    const func = namespaces.pop();
    for (let i = 0; i < namespaces.length; i += 1) {
      // eslint-disable-next-line no-param-reassign
      context = context[namespaces[i]];
    }
    // eslint-disable-next-line prefer-spread
    return context[func].apply(context, args);
  }
}
