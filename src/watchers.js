import onChange from 'on-change';

import feedsRender from './renders/renderFeeds';
import postsRender from './renders/renderPosts';
import validationRender from './renders/renderValidation';

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

export const watchValidation = (linkValidation, i18n) => {
  const watchedValidation = onChange(linkValidation, () => {
    validationRender(linkValidation, i18n);
  });
  return watchedValidation;
};
