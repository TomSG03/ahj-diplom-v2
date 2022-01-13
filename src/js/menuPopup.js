export default class MenuPopup {
  constructor(objItem, objPos, objHost, callBack) {
    this.item = objItem;
    this.pos = objPos;
    this.callBack = callBack;
    this.globalDom = objHost.global;
    this.localDom = objHost.local;

    this.pressButton = this.pressButton.bind(this);
  }

  init() {
    this.createMenu();
    this.initEvent();
  }

  createMenu() {
    const div = document.createElement('div');
    div.className = 'menu-upload';
    div.style.top = this.pos.top;
    div.style.left = this.pos.left;
    div.style.right = this.pos.right;
    div.style.bottom = this.pos.bottom;
    const ul = document.createElement('ul');
    div.append(ul);
    for (let i = 0; i < this.item.length; i += 1) {
      ul.innerHTML += `<li><button class="upload-item" data-type="${this.item[i].type}">${this.item[i].title}</button></li>`;
    }
    this.localDom.append(div);
  }

  initEvent() {
    this.localDom.querySelector('.menu-upload').addEventListener('click', this.pressButton.bind());
  }

  remove() {
    this.localDom.querySelector('.menu-upload').remove();
  }

  pressButton(e) {
    // this.remove();
    this.callBack(e);
  }
}
