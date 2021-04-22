import 'bootstrap/dist/css/bootstrap.min.css';
import { watchForm } from './watchers';
import validator from './validator';

export default () => {
  const state = {
    urls: [],
  };
  const watchedState = watchForm(state);

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    console.log('url:', url, 'state:', state, 'validation:', validator(url, state));
    validator(url, state)
    

    watchedState.urls.push(url);
  });
  console.log('state:', state);
};
