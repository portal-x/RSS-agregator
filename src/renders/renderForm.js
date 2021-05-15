export default ({ status, availability }, i18n) => {
  const input = document.querySelector('input');
  const feedback = document.querySelector('.feedback');
  const submitButt = document.querySelector('[aria-label=add]');

  const isValid = status === 'success';
  input.classList.toggle('is-invalid', !isValid);
  feedback.classList.toggle('text-success', isValid);
  feedback.classList.toggle('text-danger', !isValid);
  
  switch (availability) {
    case 'busy':
      feedback.textContent = '';
      input.setAttribute('readonly', true);
      submitButt.setAttribute('disabled', 'disabled');
      console.log('feedback.textCont when busy:', feedback.textContent);
      break;
    case 'ready':
      input.removeAttribute('readonly');
      input.value = '';

      submitButt.removeAttribute('disabled');
      break;
    default:
      throw new Error('unexpected formState');
  }

  console.log('feedback.textContent:', feedback.textContent);
  feedback.textContent = i18n.t(status);
};
