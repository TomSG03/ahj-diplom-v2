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
            <svg xml:space="preserve" viewBox="0 0 3200 4525.71" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path fill="currentColor" d="M1600 662.86c-880,0 -1600,720 -1600,1600 0,880 720,1600 1600,1600 880,0 1600,-720 1600,-1600 0,-880 -720,-1600 -1600,-1600zm0 3000c-770,0 -1400,-630 -1400,-1400 0,-770 630,-1400 1400,-1400 770,0 1400,630 1400,1400 0,770 -630,1400 -1400,1400z"/>
              <path fill="currentColor" d="M2231.64 2369.83l-460.78 251.88 -476.09 260.25c-38.84,21.23 -82.58,20.46 -120.65,-2.11 -38.07,-22.58 -59.72,-60.59 -59.72,-104.85l0 -512.13 0 -512.13c0,-44.26 21.65,-82.28 59.72,-104.85 38.07,-22.58 81.81,-23.34 120.65,-2.11l476.09 260.25 460.79 251.88c40.15,21.95 63.43,61.21 63.43,106.97 0,45.76 -23.28,85.02 -63.43,106.97z"/>
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
