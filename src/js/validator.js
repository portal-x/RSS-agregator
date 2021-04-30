import * as yup from 'yup';

export default (url, urls) => {
  const urlsList = Object.values(urls);
  const shema = yup.object().shape({
    url: yup.string().url().notOneOf(urlsList),
  });
  try {
    const validate = shema.validateSync({ url })
    return validate;
  } catch (e) {
    console.log('--------- not valid, error:', e.errors);
    return ({
    type: 'error',
    errorKeys: e.errors,
  })
  }
};
