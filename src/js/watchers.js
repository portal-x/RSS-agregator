import onChange from 'on-change';

export const watchForm = (state) => {
  const watchedState = onChange(state, (path, value, previousValue) => {
    alert('value has changed');
  })
  return watchedState;
};

