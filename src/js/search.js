export default class Search {
  constructor(domElmt, server) {
    this.domElmt = domElmt;
    this.server = server;

    this.tabSearch = this.domElmt.querySelector('.tab-overlay');

    this.onInput = this.onInput.bind(this);
  }

  init() {
    const input = document.createElement('input');
    input.className = 'input-field';
    input.placeholder = '...';
    this.searchPanel = this.tabSearch.querySelector('.tab-head');
    this.searchPanel.querySelector('.tab-title').insertAdjacentElement('afterend', input);
    this.inputSearch = this.tabSearch.querySelector('input');
    setTimeout(() => {
      this.inputSearch.focus();
    }, 500);

    this.inputSearch.addEventListener('input', this.debounce(this.onInput, 500));
  }

  tabClear() {
    this.inputSearch.remove();
  }

  // eslint-disable-next-line class-methods-use-this
  debounce(callback, delay) {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(callback, delay);
    };
  }

  onInput() {
    this.tabSearch.querySelector('.tab-content').innerHTML = '';
    const input = this.tabSearch.querySelector('input');
    this.server.sendEvent({ event: 'search', id: '0', value: input.value });
  }
}
