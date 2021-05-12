export default (raw) => {
  const parser = new DOMParser();
  const chanal = parser.parseFromString(raw, 'text/xml');

  console.log('chanel:', chanal);

  const titleEl = chanal.querySelector('title');
  const { textContent: title } = titleEl;

  const descriptionEl = chanal.querySelector('description');
  const { textContent: description } = descriptionEl;

  const itemsEls = chanal.querySelectorAll('item');
  const posts = [...itemsEls].map((post) => {
    const itemTitle = post.querySelector('title');
    const itemDescript = post.querySelector('description');
    const link = post.querySelector('link');

    return {
      title: itemTitle.textContent,
      descript: itemDescript.textContent,
      link: link.textContent,
    };
  });

  return { title, description, posts };
};
