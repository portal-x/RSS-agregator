import * as yup from 'yup';

export default (url, urls) => {
  const shema = yup.object().shape({
    url: yup.string().url().notOneOf(urls),
  });
  try {
    const validate = shema.validateSync({ url })
    return validate;
  } catch (e) {
    console.log('not valid, error:', e);
    return ({
    type: 'error',
    errorKeys: e.errors,
  })
  }
};
