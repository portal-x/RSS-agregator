import onChange from 'on-change';

import feedsRender from './renderFeeds';
import postsRender from './renderPosts'

export const watchFeeds = (feeds) => {
  const watchedFeeds = onChange(feeds, () => {
    feedsRender(feeds);
  });
  return watchedFeeds;
};

export const watchPosts = (posts) => {
  const watchedPosts = onChange(posts, () => {
    postsRender(posts)
  });
  return watchedPosts;
};
