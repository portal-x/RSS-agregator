import 'bootstrap/dist/css/bootstrap.min.css';
import { has, uniqueId, differenceBy, find, findIndex } from 'lodash';
import i18next from 'i18next';
import { setLocale } from 'yup';

import { watchFeeds, watchPosts, FormValidation } from './watchers';
import validate from './validator';
import RSSparser from './RSSparser';
import ru from './locales/ru';
import getData from './getData';

const handleClickPost = (posts, watchedPosts) => {
  const modalHeader = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const linkButton = document.querySelector('a.btn');

  const postsButtons = document.querySelectorAll('[data-bs-toggle=modal]');
  postsButtons.forEach((button) => {
    button.addEventListener('click', ({ target }) => {
      const { id } = target;

      const postIndex = findIndex(posts, { id });
      watchedPosts[postIndex].visited = true;
      handleClickPost(posts, watchedPosts);

      const currentPost = find(posts, { id });
      modalHeader.textContent = currentPost.title;
      modalBody.textContent = currentPost.descript;
      linkButton.setAttribute('href', currentPost.link);
    });
  });

  const postsLinks = document.querySelectorAll('[data-id]');
  postsLinks.forEach((postLink) => {
    postLink.addEventListener('click', ({ target }) => {
      const id = target.getAttribute('data-id');
      const postIndex = findIndex(posts, { id });
      watchedPosts[postIndex].visited = true;
      handleClickPost(posts, watchedPosts);
    });
  });
};

export default () => {
  console.log('Инициализация...');
  const i18n = i18next.createInstance();
  i18n
    .init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
    })
    .then(() => {
      setLocale({
        mixed: {
          default: 'validationError',
          notOneOf: 'duplicateURL',
        },
        string: {
          url: 'invalidURL',
        },
      });
    });

  const state = {
    urls: [],
    feeds: [],
    chanalPosts: [],
    formState: { availability: 'ready', status: [] },
  };

  const watchedFeeds = watchFeeds(state.feeds);
  const watchedPosts = watchPosts(state.chanalPosts);
  const watchedForm = FormValidation(state.formState, i18n);

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedForm.availability = 'busy';
    console.log('клик по кнопке, state:', state);

    const formData = new FormData(e.target);
    const url = formData.get('url');
    const validation = validate(url, state.urls);

    if (has(validation, 'url')) {
      state.urls.push(url);
      console.log('обновленный стейт c новым URL:', state);
      getData(validation.url)
        .then(({ data }) => {
          const parsedData = RSSparser(data.contents); // add .contents
          const { title, description, posts } = parsedData;
          const postsWithId = posts.map((post) => ({
            id: uniqueId(),
            ...post,
          }));
          watchedFeeds.push({ title, description });
          watchedPosts.push(...postsWithId);
          watchedForm.status = ['success'];
        })
        .catch((e) => {
          if (e.message === 'networkErr') {
            watchedForm.status = [e.message];
          } else {
            watchedForm.status = ['invalidRSS'];
            console.log('текст ошибки: invalidRSS');
          }
        })
        .finally(() => {
          watchedForm.availability = 'ready';
        });
    } else {
      watchedForm.status = validation.errorKeys;
      console.log('ошибка валидации');

      watchedForm.availability = 'ready';
    }

    const postUpdater = (url) => {
      getData(url)
        .then(({ data }) => {
          const { posts } = RSSparser(data.contents); // add .contents
          return posts;
        })
        .then((posts) => {
          const prewPosts = state.chanalPosts;
          const newPosts = differenceBy(posts, prewPosts, 'title');
          const newPostsWithId = newPosts.map((post) => ({
            id: uniqueId(),
            visited: false,
            ...post,
          }));
          watchedPosts.push(...newPostsWithId);
          handleClickPost(state.chanalPosts, watchedPosts);
        })
        .finally(() => setTimeout(() => postUpdater(url), 5000));
    };

    setTimeout(() => {
      state.urls.forEach(postUpdater);
    }, 5000);
  });
};
