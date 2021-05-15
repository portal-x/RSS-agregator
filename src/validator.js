import * as yup from 'yup';

export default (url, prewUrls) => {
  const shema = yup.object().shape({
    url: yup.string().url().notOneOf(prewUrls),
  });
  try {
    const validate = shema.validateSync({ url })
    return validate;
  } catch (e) {
    return ({
    type: 'error',
    errorKeys: e.errors,
  })
  }
};
