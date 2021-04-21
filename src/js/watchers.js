import onChange from 'on-change';

export const watchForm = (state) => {
  const watchedState = onChange(state, (path, value, previousValue) => {
    alert('value has changed');
    console.log('path:', path);
    console.log('value:', value);
    console.log('previousValue:', previousValue);
    
  })
  return watchedState;
};

