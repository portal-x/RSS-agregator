const renderPost = ({ id, title, link, visited }, parentNode) => {
  // const modalHeader = document.querySelector('.modal-title');
  // const modalBody = document.querySelector('.modal-body');
  // const linkButton = document.querySelector('a.btn');

  const li = document.createElement('li');
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start'
  );

  const fontWeight = visited ? 'fw-normal' : 'fw-bold';

  li.innerHTML = `<a href=${link} class=${fontWeight} data-id=${id} target="_blank" rel="noopener noreferrer">${title}</a>`;
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-primary', 'btn-sm');
  button.id = id;
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = 'Просмотр';
  li.append(button);

  // button.addEventListener('click', () => {
  //   console.log('нажатие на кнопку из рендера');
  //   modalHeader.textContent = title;
  //   modalBody.textContent = descript;
  //   linkButton.setAttribute('href', link);
  // });

  parentNode.prepend(li);
};

export default (posts) => {
  const parentDiv = document.querySelector('.posts');
  parentDiv.innerHTML = '<h2>Посты</h2>';
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group');
  parentDiv.append(ulEl);

  posts.forEach((post) => {
      renderPost(post, ulEl);
  });
};
