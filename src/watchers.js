import onChange from 'on-change';

import feedsRender from './renders/renderFeeds';
import postsRender from './renders/renderPosts';
import FormRender from './renders/renderForm';

export const watchFeeds = (feeds) => {
  const watchedFeeds = onChange(feeds, () => {
    feedsRender(feeds);
  });
  return watchedFeeds;
};

export const watchPosts = (posts) => {
  const watchedPosts = onChange(posts, () => {
    postsRender(posts);
  });
  return watchedPosts;
};

export const FormValidation = (formState, i18n) => {
  const watchedForm = onChange(formState, () => {
    FormRender(formState, i18n);
  });
  return watchedForm;
};
