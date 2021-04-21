import 'bootstrap/dist/css/bootstrap.min.css';
import { watchForm } from './watchers';

export default () => {
  const state = {
    urls: [],
  };
  const watchedState = watchForm(state);

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    watchedState.urls.push(formData.get('url'));
  });
  console.log('state:', state);
};
