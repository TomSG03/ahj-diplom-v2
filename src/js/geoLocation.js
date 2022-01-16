import WinModal from './winModal';

export default class GeoLocation {
  constructor() {
    this.geo = false;
    this.location = '';

    this.geoOk = this.geoOk.bind(this);
    this.geoError = this.geoError.bind(this);
    this.inputLocation = this.inputLocation.bind(this);
  }

  geoLocation() {
    if (this.geo) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.geoOk.bind(), this.geoError.bind());
      }
    } else this.location = '';
  }

  geoOk(pos) {
    const { latitude, longitude } = pos.coords;
    this.location = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  }

  geoError() {
    const winItems = {
      head: 'Что то пошло не так',
      text: `
        К сожалению, нам не удалось определить ваше местоположение, пожалуйста, 
        дайте разрешение на использование геолокации, либо введите координаты вручную`,
      input: {
        head: 'Широта и долгота через запятую',
        value: '',
        error: 'Введите значение в формате 00.00, 00.00',
      },
      button: {
        ok: 'OK',
        cancel: 'Отмена',
      },
    };

    this.geoAsk = new WinModal(this.domElmt);
    this.geoAsk.eventOk = this.geoAsk.checkCoords;
    this.geoAsk.eventCancel = this.geoAsk.eventBack;
    this.geoAsk.winModalDialog(winItems, this.inputLocation.bind());
  }

  inputLocation(pos) {
    this.geoAsk.closeWinModal();
    if (pos !== null) {
      const { latitude, longitude } = pos;
      this.location = `${latitude}, ${longitude}`;
    } else this.geo = false;
  }
}
