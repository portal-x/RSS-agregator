import 'bootstrap/dist/css/bootstrap.min.css';
import {
  has,
  uniqueId,
  differenceBy,
  find,
  findIndex,
} from 'lodash';
import { setLocale } from 'yup';

import { watchFeeds, watchPosts, FormValidation } from './watchers';
import validate from './validator';
import RSSparser from './RSSparser';
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

export default (i18n) => {
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
    formState: { availability: 'ready', status: '' },
  };

  const watchedFeeds = watchFeeds(state.feeds);
  const watchedPosts = watchPosts(state.chanalPosts);
  const watchedForm = FormValidation(state.formState, i18n);

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedForm.availability = 'busy';

    const formData = new FormData(e.target);
    const url = formData.get('url');
    const validation = validate(url, state.urls);

    if (has(validation, 'url')) {
      state.urls.push(url);
      getData(validation.url)
        .then(({ data }) => {
          const parsedData = RSSparser(data.contents);
          const { title, description, posts } = parsedData;
          const postsWithId = posts
            .map((post) => ({
              id: uniqueId(),
              ...post,
            }))
            .reverse();
          watchedFeeds.push({ title, description });
          watchedPosts.push(...postsWithId);
          watchedForm.status = 'success';
          watchedForm.availability = 'ready';

          handleClickPost(state.chanalPosts, watchedPosts);
        })
        .catch((err) => {
          if (err.message === 'networkErr') {
            watchedForm.status = 'networkErr';
          } else {
            watchedForm.status = 'invalidRSS';
          }
        })
        .finally(() => {
          watchedForm.availability = 'ready';
        });
    } else {
      const [errMess] = validation.errorKeys;
      watchedForm.status = errMess;

      watchedForm.availability = 'ready';
    }

    const postUpdater = (link) => {
      getData(link)
        .then(({ data }) => {
          const { posts } = RSSparser(data.contents);
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
        .finally(() => setTimeout(() => postUpdater(link), 5000));
    };

    setTimeout(() => {
      state.urls.forEach(postUpdater);
    }, 5000);
  });
};
