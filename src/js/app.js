import Chat from './chat';

const serverPath = 'ws://localhost:7070';
// const serverPath = 'wss://ahj-chat.herokuapp.com/';

const domElmt = document.querySelector('main');

const chat = new Chat(domElmt, serverPath);
chat.begin();
