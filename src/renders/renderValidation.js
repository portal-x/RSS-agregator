import i18next from 'i18next';

export default ({ status }) => {
  const [valid] = status;

  const input = document.querySelector('input');
  const feedback = document.querySelector('.feedback');

  const isValid = valid === 'success';
  input.classList.toggle('is-invalid', !isValid);
  feedback.classList.toggle('text-success', isValid);
  feedback.classList.toggle('text-danger', !isValid);

  feedback.textContent = i18next.t(valid);
  if (isValid) {
    input.value = '';
  }
};
