import 'bootstrap/dist/css/bootstrap.min.css';
import { has, uniqueId } from 'lodash';
import axios from 'axios';

import { watchFeeds, watchPosts } from './watchers';
import validate from './validator';
import XMLparser from './XMLparser';

const getData = (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/raw?url=';
  return axios.get(`${proxy}${url}`);
};

export default () => {
  const state = {
    urls: [],
    // chanals: {},
    feeds: {},
    chanalPosts: {},
  };
  const watchedFeeds = watchFeeds(state.feeds);
  const watchedPosts = watchPosts(state.chanalPosts);

  const form = document.querySelector('form');
  const input = document.querySelector('input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const validation = validate(url, state.urls);

    if (has(validation, 'url')) {
      state.urls.push(url);
      input.value = '';
      const raw = getData(validation.url);
      raw
        .then(({ data }) => {
          const parsedData = XMLparser(data);
          const { title, description, posts } = parsedData;
          const id = uniqueId();
          watchedFeeds[id] = { title, description };
          watchedPosts[id] = posts;
          console.log('state:', state);
          // return data;
        })
        .catch((e) => console.error(e));
    } else {
      input.classList.add('is-invalid');
    }
  });
};
