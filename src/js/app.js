import 'bootstrap/dist/css/bootstrap.min.css';
import { has, uniqueId } from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import { setLocale } from 'yup';

import { watchFeeds, watchPosts, watchValidation } from './watchers';
import validate from './validator';
import XMLparser from './XMLparser';
import ru from './locales/ru';

const getData = (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/raw?url=';
  return axios.get(`${proxy}${url}`);
};

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  setLocale({
    mixed: {
      default: 'validationError',
      notOneOf: 'duplicateURL',
    },
    string: {
      url: 'invalidURL',
    },
  });

  const state = {
    urls: [],
    // chanals: {},
    feeds: {},
    chanalPosts: {},
    linkValidation: {},
  };
  const watchedFeeds = watchFeeds(state.feeds);
  const watchedPosts = watchPosts(state.chanalPosts);
  const watchedValidation = watchValidation(state.linkValidation);

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const validation = validate(url, state.urls);
    console.log('🚀 ~ form.addEventListener ~ validation', validation);

    if (has(validation, 'url')) {
      state.urls.push(url);
      // watchedValidation.status = ['success'];
      const raw = getData(validation.url);
      raw
        .then(({ data }) => {
          const parsedData = XMLparser(data);
          const { title, description, posts } = parsedData;
          const id = uniqueId();
          watchedFeeds[id] = { title, description };
          watchedPosts[id] = posts;
          watchedValidation.status = ['success'];
          console.log('state:', state);
          // return data;
        })
        .catch((e) => {
          watchedValidation.status = ['invalidRSS'];
          console.error(e);
          console.log('state:', state);
        });
    } else {
      watchedValidation.status = validation.errorKeys;
      console.log('state:', state);
    }
  });
};
