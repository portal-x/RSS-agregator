const renderPost = ({ title, descript, link }, parentNode) => {
  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start'
  );
  li.innerHTML = `<a href=${link} class="font-weight-bold" data-id="2" target="_blank" rel="noopener noreferrer">${title}</a>`;
  parentNode.prepend(li);
};

export default (posts) => {
  const parentDiv = document.querySelector('.posts');
  parentDiv.innerHTML = '<h2>Посты</h2>';
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group');
  parentDiv.append(ulEl);

  for (const prop in posts) {
    posts[prop].forEach((post) => {
      renderPost(post, ulEl);
    });
  }
};
