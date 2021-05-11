export default (feeds) => {
  const parentDiv = document.querySelector('.feeds');
  parentDiv.innerHTML = '<h2>Фиды</h2>';
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'mb-5');
  parentDiv.append(ulEl);

  const renderFeed = ({ title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `<h3>${title}</h3>`;
    const pEl = document.createElement('p');
    pEl.textContent = description;
    li.append(pEl);
    ulEl.prepend(li);
  };

  feeds.forEach(renderFeed);
};
