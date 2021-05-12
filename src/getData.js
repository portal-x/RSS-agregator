import axios from 'axios';

const allOrigins = (url) => {
  const result = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  result.searchParams.set('url', url);
  result.searchParams.set('disableCache', 'true');
  return result.toString();
};

export default (url, watchedValidation) =>
  axios.get(allOrigins(url)).catch((e) => {
    console.log('ошибка сети..............');
    watchedValidation.status = ['networkErr'];
    console.error(e);
  });
