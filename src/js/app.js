import 'bootstrap/dist/css/bootstrap.min.css';
import { has } from 'lodash';
import axios from 'axios';

import { watchForm } from './watchers';
import validator from './validator';

const getData = async (url) => await axios.get(url);


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
    const validation = validator(url, state);
    if (has(validation, 'url')) {
      watchedState.urls.unshift(url);
      input.value = '';
      console.log('state.urls:', state.urls);
    } else {
      input.classList.add('is-invalid');
    }
  });

  
};
