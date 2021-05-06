import 'bootstrap/dist/css/bootstrap.min.css';
import { has, uniqueId, differenceBy, find } from 'lodash';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import i18next from 'i18next';
import { setLocale } from 'yup';

import { watchFeeds, watchPosts, watchValidation } from './watchers';
import validate from './validator';
import RSSparser from './RSSparser';
import ru from './locales/ru';

const getData = (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com/raw?url=';
  axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });
  return axios.get(`${proxy}${url}`, { params: { disableCache: true } });
};

const handlePostButtonClick = (posts) => {
  const modalHeader = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const linkButton = document.querySelector('a.btn');

  const postsButtons = document.querySelectorAll('[data-bs-toggle=modal]');
  postsButtons.forEach((button) => {
    button.addEventListener('click', ({ target }) => {
      const { id } = target;
      const currentPost = find(posts, { id });
      modalHeader.textContent = currentPost.title;
      modalBody.textContent = currentPost.descript;
      linkButton.setAttribute('href', currentPost.link);
    });
  });
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
    feeds: [],
    chanalPosts: [],
    linkValidation: {},
  };

  console.log('state =>:', state);
  const watchedFeeds = watchFeeds(state.feeds);
  const watchedPosts = watchPosts(state.chanalPosts);
  const watchedValidation = watchValidation(state.linkValidation);

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const validation = validate(url, state.urls);

    if (has(validation, 'url')) {
      state.urls.push(url);
      const raw = getData(validation.url);
      raw
        .then(({ data }) => {
          const parsedData = RSSparser(data);
          const { title, description, posts } = parsedData;
          // const postsWithId = posts.map((post) => ({
          //   id: uniqueId(),
          //   ...post,
          // }));
          watchedFeeds.push({ title, description });
          // watchedPosts.push(...postsWithId);
          watchedValidation.status = ['success'];
          console.log('state:', state);
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

    const postUpdater = (url) => {
      getData(url)
        .then(({ data }) => {
          const { posts } = RSSparser(data);
          return posts;
        })
        .then((posts) => {
          const prewPosts = state.chanalPosts;
          const newPosts = differenceBy(posts, prewPosts, 'title');
          const newPostsWithId = newPosts.map((post) => ({
            id: uniqueId(),
            ...post,
          }));
          watchedPosts.push(...newPostsWithId);
          handlePostButtonClick(state.chanalPosts);
          console.log('state:', state);
        })
        .finally(() => setTimeout(() => postUpdater(url), 5000));
    };

    state.urls.forEach(postUpdater);
  });
};
