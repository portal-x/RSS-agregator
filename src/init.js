import i18next from 'i18next';
import ru from './locales/ru';
import app from './app';

export default () => {
  const i18n = i18next.createInstance();
  return i18n
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru,
      },
    })
    .then(() => app(i18n));
};
