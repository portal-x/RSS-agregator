const renderFeed = ({ title, description }, parentNode) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  li.innerHTML = `<h3>${title}</h3>`;
  const pEl = document.createElement('p');
  pEl.textContent = description;
  li.append(pEl);
  parentNode.prepend(li);
};

export default (feeds) => {
  const parentDiv = document.querySelector('.feeds');
  parentDiv.innerHTML = '<h2>Фиды</h2>';
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'mb-5');
  parentDiv.append(ulEl);

  for (const prop in feeds) {
    renderFeed(feeds[prop], ulEl);
  }
};
