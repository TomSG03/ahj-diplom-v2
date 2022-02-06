import WinModal from './winModal';
import Data from './data';

export default class MediaRec {
  constructor(domElmt, server, position) {
    this.domElmt = domElmt;
    this.server = server;
    this.position = position;
    this.input = this.domElmt.querySelector('.input-field');
    this.form = this.domElmt.querySelector('form');

    this.tabVideo = this.domElmt.querySelector('.tab-overlay');

    this.timerInterval = null;
  }

  mediaRecord(type) {
    const navigatorDevices = type === 'video/mp4' ? { audio: true, video: true } : { audio: true };
    this.blobType = type;

    if (this.blobType === 'video/mp4') {
      this.videoCap();
    }
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      this.showError();
      return;
    }
    const oldVideo = this.tabVideo.querySelector('.video-cover');
    if (oldVideo !== null) {
      oldVideo.remove();
    }
    try {
      navigator.mediaDevices.getUserMedia(navigatorDevices)
        .then((stream) => {
          this.stream = stream;
          this.recorder = new MediaRecorder(this.stream);
          if (this.blobType === 'video/mp4') {
            if (this.tabVideo.querySelector('.video-cap') !== null) {
              this.tabVideo.querySelector('.video-cap').remove();
            }
            this.videoWindow('muted');
            this.video = this.tabVideo.querySelector('video');
            this.video.srcObject = stream;
            this.video.play();
          }
          this.startRecording();
        }).catch(() => this.showError());
    } catch (error) {
      this.showError();
    }
    if (this.domElmt.querySelector('.rec-panel') !== null) {
      this.recPanel.remove();
    }
    this.createRecordPanel();
    this.recPanel.addEventListener('click', this.eventRecPanel.bind(this));
  }

  videoCap() {
    const divVideo = document.createElement('div');
    divVideo.className = 'video-cap';
    divVideo.innerHTML = 'Получение доступа к камере';
    this.tabVideo.querySelector('.tab-content').append(divVideo);
  }

  videoWindow(muted) {
    const divVideo = document.createElement('div');
    divVideo.className = 'video-cover';
    divVideo.innerHTML = `
      <video ${muted === '' ? '' : 'autoplay'} class="play-video" ${muted}></video>
    `;
    this.tabVideo.querySelector('.tab-content').append(divVideo);
  }

  createRecordPanel() {
    this.form.remove();
    const divRecord = document.createElement('div');
    divRecord.className = 'rec-panel';
    divRecord.append(this.button('delete'));
    divRecord.append(this.button('play'));
    divRecord.append(this.button('time'));
    divRecord.append(this.button('record'));
    divRecord.append(this.button('send'));

    this.domElmt.querySelector('footer .message').append(divRecord);

    this.recPanel = this.domElmt.querySelector('.rec-panel');
    this.timeRec = this.domElmt.querySelector('.rec-time');
  }

  // eslint-disable-next-line class-methods-use-this
  button(type) {
    const div = document.createElement('div');
    div.classList.add(type);
    switch (type) {
      case 'record':
        div.innerHTML = `
        <button class="rec-panel-item stop-btn" data-type="record" aria-label="Стоп" width="24" height="24" >
          <svg width="32px" height="32px" viewBox="0 0 2.15 2.15" xmlns:xlink="http://www.w3.org/1999/xlink">
            <path fill="currentColor" d="M1.45 1.13l-0.25 0.15 -0.24 0.14c-0.02,0.02 -0.05,0.02 -0.07,0 -0.03,-0.01 -0.04,-0.03 -0.04,-0.06l0 -0.29 0 -0.3c0,-0.02 0.01,-0.05 0.04,-0.06 0.02,-0.02 0.05,-0.02 0.07,0 0.08,0.05 0.16,0.09 0.24,0.14l0.25 0.15c0.02,0.01 0.04,0.04 0.04,0.07 0,0.02 -0.02,0.05 -0.04,0.06z"/>
            <path fill="currentColor" d="M1.08 0c-0.6,0 -1.08,0.48 -1.08,1.08 0,0.59 0.48,1.07 1.08,1.07 0.59,0 1.07,-0.48 1.07,-1.07 0,-0.6 -0.48,-1.08 -1.07,-1.08zm0 2.02c-0.52,0 -0.95,-0.42 -0.95,-0.94 0,-0.52 0.43,-0.95 0.95,-0.95 0.52,0 0.94,0.43 0.94,0.95 0,0.52 -0.42,0.94 -0.94,0.94z"/>
          </svg>
        </button>  
      `;
        break;
      case 'stop':
        div.innerHTML = `
          <button class="rec-panel-item stop-btn" data-type="stop" aria-label="Стоп" width="24" height="24" >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
              <path fill="currentColor" d="M16,0C7.2,0,0,7.2,0,16s7.2,16,16,16s16-7.2,16-16S24.8,0,16,0z M16,30C8.3,30,2,23.7,2,16S8.3,2,16,2 s14,6.3,14,14S23.7,30,16,30z"></path>
              <path class="_3aeL4" fill="currentColor" d="M13,11c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h6c1.1,0,2-0.9,2-2v-6c0-1.1-0.9-2-2-2H13z"></path>
            </svg>
          </button>
        `;
        break;
      case 'delete':
        div.innerHTML = `
          <button class="rec-panel-item" data-type="cancel" aria-label="Отменить" width="24" height="24" >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 22">
              <path d="M5,0,3,2H0V4H16V2H13L11,0ZM15,5H1V19.5A2.5,2.5,0,0,0,3.5,22h9A2.5,2.5,0,0,0,15,19.5Z" fill="currentColor"></path>
            </svg>
          </button>
        `;
        break;
      case 'play':
        div.innerHTML = `
          <button class="rec-panel-item" data-type="play" aria-label="Воспроизвести" width="24" height="24">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 18">
              <path d="M15.05,8.39,2,.32a1,1,0,0,0-1.53.85V16.83A1,1,0,0,0,2,17.7L15,10.1A1,1,0,0,0,15.05,8.39Z" fill="currentColor"></path>
            </svg>
          </button>
        `;
        break;
      case 'send':
        div.innerHTML = `
          <button class="rec-panel-item send-btn" data-type="send" aria-label="Отправить" width="35px" height="35px">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" class="">
              <path d="M17.5,0h0A17.51,17.51,0,0,1,35,17.5h0A17.51,17.51,0,0,1,17.5,35h0A17.51,17.51,0,0,1,0,17.5H0A17.51,17.51,0,0,1,17.5,0Z" fill="currentColor"></path><path class="_3aeL4" d="M25.64,18.55,11.2,24.93a.86.86,0,0,1-1.13-.44.83.83,0,0,1-.06-.44l.48-4.11a1.36,1.36,0,0,1,1.24-1.19l7.51-.6a.16.16,0,0,0,.14-.16.16.16,0,0,0-.14-.14l-7.51-.6a1.36,1.36,0,0,1-1.24-1.19L10,12a.84.84,0,0,1,.74-.94.87.87,0,0,1,.45.06l14.44,6.38a.61.61,0,0,1,.31.79A.59.59,0,0,1,25.64,18.55Z" fill="#fff"></path>
            </svg>
          </button>
        `;
        break;
      case 'time':
        div.textContent = '00:00';
        div.className = 'rec-time';
        break;

      default:
        break;
    }
    return div;
  }

  changeButton(from, to) {
    const div = this.domElmt.querySelector(`.${from}`);
    div.replaceWith(this.button(to));
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
        case 'record':
          if (this.blobType === 'video/mp4') {
            this.mediaRecord('video/mp4');
          } else {
            this.mediaRecord('audio/wav');
          }
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

  // Действия по завершению записи
  cancelRecording() {
    clearInterval(this.timerInterval);
    this.recPanel.remove();
    this.domElmt.querySelector('footer .message').append(this.form);
    this.tabVideo.style.width = '';
    if (this.tabVideo.querySelector('.video-cover') !== null) {
      this.tabVideo.querySelector('.video-cover').remove();
    }
  }

  // Старт записи
  startRecording() {
    clearInterval(this.timerInterval);
    this.changeButton('record', 'stop');
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
    this.changeButton('stop', 'record');
    clearInterval(this.timerInterval);
    this.recorder.stop();
    this.stream.getTracks().forEach((track) => track.stop());
  }

  eventStop() {
    const blob = new Blob(this.chunks, { type: this.blobType });
    const fileName = this.blobType === 'video/mp4' ? 'record.mp4' : 'record.wav';
    this.mediaFile = new File([blob], fileName, { type: this.blobType });
    const mediaURL = window.URL.createObjectURL(blob);

    if (this.blobType === 'video/mp4') {
      this.tabVideo.querySelector('.video-cover').remove();
      this.videoWindow('');
      this.video = this.tabVideo.querySelector('video');
      this.video.src = mediaURL;
    } else {
      const audio = document.createElement('audio');
      audio.src = mediaURL;
      this.recPanel.append(audio);
      this.audioPlayer = this.recPanel.querySelector('audio');
    }
  }

  // Воспроизведение видео/аудио
  playRecording() {
    if (this.recorder.state === 'inactive') {
      this.showTime();
      if (this.blobType === 'video/mp4') {
        this.video.play();
        this.video.onended = () => {
          clearInterval(this.timerInterval);
        };
      } else {
        this.audioPlayer.play();
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.onended = () => {
          clearInterval(this.timerInterval);
        };
      }
    }
  }

  // Отправка записи на сервер
  sendRecording() {
    if (this.recorder.state === 'inactive') {
      this.server.sendBlob({
        type: this.blobType,
        file: this.mediaFile,
      },
      Data.getTime(),
      this.position.location);

      this.cancelRecording();
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

  // Окно с ошибкой
  showError() {
    const winItems = {
      head: 'Устройство не найденo',
      text: `
        Вы не можете записать сообщение, так как,
        похоже, что у вас нет устройства для захвата медиа контента.
        Попробуйте подключить микрофон или веб-камеру, если устройство 
        подключенo, перезагрузите браузер`,
      button: {
        cancel: 'Понятно',
      },
    };

    this.cancelRecording();

    this.geoAsk = new WinModal(this.domElmt);
    this.geoAsk.winModalDialog(winItems);
  }
}
