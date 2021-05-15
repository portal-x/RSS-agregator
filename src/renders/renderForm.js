export default ({ status, availability }, i18n) => {
  const [valid] = status;

  const input = document.querySelector('input');
  const feedback = document.querySelector('.feedback');
  const submitButt = document.querySelector('[aria-label=add]');

  const isValid = valid === 'success';
  input.classList.toggle('is-invalid', !isValid);
  feedback.classList.toggle('text-success', isValid);
  feedback.classList.toggle('text-danger', !isValid);

  switch (availability) {
    case 'busy':
      input.setAttribute('readonly', true);
      submitButt.setAttribute('disabled', 'disabled');
      break;
    case 'ready':
      input.removeAttribute('readonly');
      input.value = '';

      submitButt.removeAttribute('disabled');
      break;
    default:
      throw new Error('unexpected formState');
  }

  feedback.textContent = i18n.t(valid);
};
