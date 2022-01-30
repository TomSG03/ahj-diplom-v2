// import Link from './link';

export default class Search {
  constructor(domElmt, server) {
    this.domElmt = domElmt;
    this.server = server;

    // this.link = new Link(server);
    this.tabSearch = this.domElmt.querySelector('.tab-overlay');
  }

  init() {
    const input = document.createElement('input');
    input.className = 'input-field';
    input.placeholder = '...';
    this.searchPanel = this.tabSearch.querySelector('.tab-head');
    this.searchPanel.querySelector('.tab-title').insertAdjacentElement('afterend', input);
    this.inputSearch = this.tabSearch.querySelector('input');
    this.inputSearch.focus();

    this.inputSearch.addEventListener('input', this.onInput.bind(this));
  }

  tabClear() {
    this.inputSearch.remove();
  }

  onInput(e) {
    this.tabSearch.querySelector('.tab-content').innerHTML = '';
    this.server.sendEvent({ event: 'search', id: '0', value: e.target.value });
  }

  searchShow(msg) {
    this.tabRows.append(this.gui.createElm(msg.message.message));
    this.tabRows.scrollTop = this.tabRows.scrollHeight;
  }
}
