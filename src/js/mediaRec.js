import WinModal from './winModal';
import Data from './data';

export default class MediaRec {
  constructor(domElmt, server, position) {
    this.domElmt = domElmt;
    this.server = server;
    this.position = position;
    this.input = this.domElmt.querySelector('.input-field');
    this.form = this.domElmt.querySelector('form');

    this.audioRecord = this.audioRecord.bind(this);
    this.startRecording = this.startRecording.bind(this);
  }

  audioRecord() {
    const navigatorDevices = { audio: true };
    this.blobType = 'audio/wav';

    if (!navigator.mediaDevices || !window.MediaRecorder) {
      this.showError();
      return;
    }
    try {
      navigator.mediaDevices.getUserMedia(navigatorDevices)
        .then((stream) => {
          this.stream = stream;
          this.recorder = new MediaRecorder(this.stream);
          this.startRecording();
        }).catch(() => this.showError());
    } catch (error) {
      this.showError();
    }
    this.createRecordPanel();
    this.recPanel.addEventListener('click', this.eventRecPanel.bind(this));
  }

  createRecordPanel() {
    this.form.remove();
    const divRecord = document.createElement('div');
    divRecord.className = 'rec-panel';
    const divDel = document.createElement('div');
    divDel.innerHTML = `
      <button class="rec-panel-item" data-type="cancel" aria-label="Отменить" width="24" height="24" >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 22">
          <path d="M5,0,3,2H0V4H16V2H13L11,0ZM15,5H1V19.5A2.5,2.5,0,0,0,3.5,22h9A2.5,2.5,0,0,0,15,19.5Z" fill="currentColor">
          </path>
        </svg>
      </button>
    `;
    const divPlay = document.createElement('div');
    divPlay.innerHTML = `
      <button class="rec-panel-item" data-type="play" aria-label="Воспроизвести" width="24" height="24">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 18">
          <path d="M15.05,8.39,2,.32a1,1,0,0,0-1.53.85V16.83A1,1,0,0,0,2,17.7L15,10.1A1,1,0,0,0,15.05,8.39Z" fill="currentColor">
          </path>
        </svg>
      </button>
    `;
    const divStop = document.createElement('div');
    divStop.innerHTML = `
      <button class="rec-panel-item stop-btn" data-type="stop" aria-label="Стоп" width="24" height="24" >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path fill="currentColor" d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16S24.8,0,16,0z M16,30C8.3,30,2,23.7,2,16S8.3,2,16,2 s14,6.3,14,14S23.7,30,16,30z"></path><path class="_3aeL4" fill="currentColor" d="M13,11c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h6c1.1,0,2-0.9,2-2v-6c0-1.1-0.9-2-2-2H13z">
          </path>
        </svg>
      </button>
    `;
    const divSend = document.createElement('div');
    divSend.innerHTML = `
      <button class="rec-panel-item send-btn" data-type="send" aria-label="Отправить" width="35px" height="35px">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" class="">
          <path d="M17.5,0h0A17.51,17.51,0,0,1,35,17.5h0A17.51,17.51,0,0,1,17.5,35h0A17.51,17.51,0,0,1,0,17.5H0A17.51,17.51,0,0,1,17.5,0Z" fill="currentColor"></path><path class="_3aeL4" d="M25.64,18.55,11.2,24.93a.86.86,0,0,1-1.13-.44.83.83,0,0,1-.06-.44l.48-4.11a1.36,1.36,0,0,1,1.24-1.19l7.51-.6a.16.16,0,0,0,.14-.16.16.16,0,0,0-.14-.14l-7.51-.6a1.36,1.36,0,0,1-1.24-1.19L10,12a.84.84,0,0,1,.74-.94.87.87,0,0,1,.45.06l14.44,6.38a.61.61,0,0,1,.31.79A.59.59,0,0,1,25.64,18.55Z" fill="#fff">
          </path>
        </svg>
      </button>
    `;

    const divClock = document.createElement('div');
    divClock.textContent = '00:00';
    divClock.className = 'rec-time';
    divRecord.append(divDel);
    divRecord.append(divPlay);
    divRecord.append(divClock);
    divRecord.append(divStop);
    divRecord.append(divSend);

    this.domElmt.querySelector('footer .message').append(divRecord);

    this.recPanel = this.domElmt.querySelector('.rec-panel');
    this.timeRec = this.domElmt.querySelector('.rec-time');
  }

  eventRecPanel(e) {
    const btn = e.target.closest('button');
    if (btn !== null) {
      switch (btn.dataset.type) {
        case 'cancel':
          this.cancelRecording();
          break;
        case 'stop':
          this.stopRecording();
          break;
        case 'play':
          this.playRecording();
          break;
        case 'send':
          this.sendRecording();
          break;

        default:
          break;
      }
    }
  }

  cancelRecording() {
    clearInterval(this.timerInterval);
    this.recPanel.remove();
    this.domElmt.querySelector('footer .message').append(this.form);
  }

  // Старт записи
  startRecording() {
    this.chunks = [];
    this.recorder.addEventListener('dataavailable', (event) => {
      this.chunks.push(event.data);
    });
    this.recorder.addEventListener('stop', () => {
      this.eventStop();
    });
    this.recorder.start();
    this.showTime();
  }

  // Остановка записи
  stopRecording() {
    if (this.recorder.state === 'inactive') {
      if (this.audioPlayer.duration > 0 && !this.audioPlayer.paused) {
        clearInterval(this.timerInterval);
        this.audioPlayer.pause();
      }
      return;
    }
    clearInterval(this.timerInterval);
    this.recorder.stop();
    this.stream.getTracks().forEach((track) => track.stop());
  }

  eventStop() {
    const blob = new Blob(this.chunks, { type: this.blobType });
    this.mediaFile = new File([blob], 'record.wav', { type: this.blobType });
    const audioURL = window.URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = audioURL;
    this.recPanel.append(audio);
    this.audioPlayer = this.recPanel.querySelector('audio');
  }

  playRecording() {
    if (this.recorder.state === 'inactive') {
      this.showTime();
      this.audioPlayer.play();
      this.audioPlayer.currentTime = 0;
      this.audioPlayer.onended = () => {
        clearInterval(this.timerInterval);
      };
    }
  }

  sendRecording() {
    if (this.recorder.state === 'inactive') {
      this.server.sendBlob({
        type: this.blobType,
        file: this.mediaFile,
      },
      Data.getTime(),
      this.position.location);

      this.recPanel.remove();
      this.domElmt.querySelector('footer .message').append(this.form);
    }
  }

  // Отображение времени записи
  showTime() {
    let timer = 0;
    this.timeRec.innerText = `${this.formatTime(timer)}`;
    this.timerInterval = setInterval(() => {
      timer += 1000;
      this.timeRec.innerText = `${this.formatTime(timer)}`;
    }, 1000);
  }

  // eslint-disable-next-line class-methods-use-this
  formatTime(sec) {
    const d = new Date(sec);
    const m = d.getMinutes();
    const mm = m < 10 ? `0${m}` : m;
    const s = d.getSeconds();
    const ss = (s < 10) ? `0${s}` : s;
    const ret = `${mm}:${ss}`;
    return ret;
  }

  showError() {
    const winItems = {
      head: 'Микрофон не найден',
      text: `
        Вы не можете записать голосовое сообщение, так как,
        похоже, на вашем устройстве не установлен микрофон.
        Попробуйте подключить микрофон или, если он 
        подключен, перезагрузите браузер`,
      button: {
        cancel: 'Понятно',
      },
    };

    this.recPanel.remove();
    this.domElmt.querySelector('footer .message').append(this.form);

    this.geoAsk = new WinModal(this.domElmt);
    this.geoAsk.winModalDialog(winItems);
  }
}
