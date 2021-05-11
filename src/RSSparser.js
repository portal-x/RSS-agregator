export default (raw) => {
  const parser = new DOMParser();
  const chanel = parser.parseFromString(raw, 'text/xml');

  const titleEl = chanel.querySelector('title');
  const { textContent: title } = titleEl;

  const descriptionEl = chanel.querySelector('description');
  const { textContent: description } = descriptionEl;

  const itemsEls = chanel.querySelectorAll('item');
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
