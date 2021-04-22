import * as yup from 'yup';

export default (url, { urls }) => {
  const shema = yup.object().shape({
    url: yup.string().url().notOneOf(urls),
  });
  try {
    const a = shema.validateSync({ url })
    console.log('is valid', 'a:', a);
    return a;
  } catch (e) {
    console.log('not valid, error:', e);
    return ({
    type: 'error',
    errorKeys: e.errors,
  })
  }
  // return shema.validateSync({ url }).catch((err) => ({
  //   type: 'error',
  //   errorKeys: err.errors,
  // }));
};
