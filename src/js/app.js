import 'bootstrap/dist/css/bootstrap.min.css';
import { has } from 'lodash';
import axios from 'axios';

import { watchForm } from './watchers';
import validate from './validator';

const getData = (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/raw?url=';
  return axios.get(`${proxy}${url}`);
};


export default () => {
  const state = {
    urls: [],
    rssRaws: {},
  };
  const watchedState = watchForm(state);

  const form = document.querySelector('form');
  const input = document.querySelector('input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const validation = validate(url, state);
    if (has(validation, 'url')) {
      watchedState.urls.push(url);
      input.value = '';
      console.log('validation.url:', validation.url);
      const raw = getData(validation.url);
      raw.then((data) => {
        console.log('data:', data);
        return data;
      }).catch((e) => console.error(e));
      console.log('state.urls:', state.urls);
    } else {
      input.classList.add('is-invalid');
    }
  });

  
};
