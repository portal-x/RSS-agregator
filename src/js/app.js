import 'bootstrap/dist/css/bootstrap.min.css';
import { has, uniqueId } from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import { setLocale } from 'yup';

import { watchFeeds, watchPosts, watchValidation } from './watchers';
import validate from './validator';
import RSSparser from './RSSparser';
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
      const raw = getData(validation.url);
      raw
        .then(({ data }) => {
          const parsedData = RSSparser(data);
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

    state.urls.forEach(function postUpdater(url) {
      getData(url)
        .then(({ data }) => {
          const { posts } = RSSparser(data);
          return posts;
        })
        .then((posts) => {
          console.log('🚀 ~ посты с postUpdater', posts);
          setTimeout(() => postUpdater(url), 5000);
        });
    });
  });
};
