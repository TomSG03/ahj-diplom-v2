export default class MenuPopup {
  constructor(objItem, objPos, objHost, callBack) {
    this.item = objItem;
    this.pos = objPos;
    this.callBack = callBack;
    this.globalDom = objHost.global;
    this.localDom = objHost.local;
    this.name = objHost.name;
  }

  init() {
    this.createMenu();
    this.initEvent();
  }

  createMenu() {
    const div = document.createElement('div');
    div.className = `menu-upload ${this.name}`;
    div.dataset.name = this.name;
    div.style.top = `${this.pos.top}px`;
    div.style.left = `${this.pos.left}px`;
    div.style.right = `${this.pos.right}px`;
    div.style.bottom = `${this.pos.bottom}px`;
    div.style.width = `${this.pos.width}px`;
    const ul = document.createElement('ul');
    div.append(ul);
    for (let i = 0; i < this.item.length; i += 1) {
      if (this.item[i].type === 'submenu') {
        ul.innerHTML += `<li><button class="upload-item" data-type="${this.item[i].type}">${this.item[i].title}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp»`;
      } else ul.innerHTML += `<li><button class="upload-item" data-type="${this.item[i].type}">${this.item[i].title}${this.item[i].state === true ? '&nbsp &nbsp &nbsp✔' : ''}</button></li>`;
    }
    this.localDom.append(div);
    if (this.globalDom.getBoundingClientRect().bottom < div.getBoundingClientRect().bottom) {
      div.style.top = `${this.pos.top - div.clientHeight}px`;
    }
  }

  initEvent() {
    this.localDom.querySelector('.menu-upload').addEventListener('click', this.pressButton.bind(this));
  }

  remove() {
    this.localDom.querySelector('.menu-upload').remove();
  }

  pressButton(e) {
    // this.remove();
    this.callBack(e);
  }
}
