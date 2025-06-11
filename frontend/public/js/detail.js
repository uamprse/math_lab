document.addEventListener('DOMContentLoaded', () => {
  const id = window.location.pathname.split('/').pop();
  const container = document.getElementById('formula-detail');
  const deleteBtn = document.getElementById('delete-btn');

  // Создаем кнопку удаления, если её нет в HTML
  if (!deleteBtn) {
    const newDeleteBtn = document.createElement('button');
    newDeleteBtn.id = 'delete-btn';
    newDeleteBtn.className = 'btn btn-danger mt-3 mb-4';
    newDeleteBtn.textContent = 'Удалить формулу';
    newDeleteBtn.style.display = 'none';
    container.insertAdjacentElement('afterend', newDeleteBtn);
  }

  const currentDeleteBtn = deleteBtn || document.getElementById('delete-btn');

  fetch(`/api/formulas/${id}/`)
    .then(res => {
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      return res.json();
    })
    .then(f => {
      container.innerHTML = `
        <div class="mb-4">
          <h2>${f.title}</h2>
          <p><strong>Область:</strong> ${f.field}</p>
          <p><strong>Категория:</strong> ${f.category?.name || 'Не указано'}</p>
        </div>

        <div class="mb-4">
          <h3>Авторы:</h3>
          <ul class="list-group">
            ${f.authors.length > 0
              ? f.authors.map(a => `<li class="list-group-item">${a.name}</li>`).join('')
              : '<li class="list-group-item">Авторы не указаны.</li>'
            }
          </ul>
        </div>

        <div class="mb-4">
          <h3>Курсы:</h3>
          <ul class="list-group">
            ${f.courses.length > 0
              ? f.courses.map(c => `<li class="list-group-item">${c.title}</li>`).join('')
              : '<li class="list-group-item">Курсы не указаны.</li>'
            }
          </ul>
        </div>

        <div class="mb-4">
          <h3>Описание:</h3>
          <p>${f.full_description}</p>
        </div>

        <section class="mb-4">
          <h3>История</h3>
          <p>${f.history}</p>
          ${
            f.author_photo
              ? `<img src="${f.author_photo}" alt="Фото автора" class="img-fluid rounded" style="max-width: 200px;">`
              : `<p>Фото отсутствует</p>`
          }
        </section>
      `;
      
      // Показываем кнопку удаления
      currentDeleteBtn.style.display = 'block';
      
      // Обработчик удаления
      currentDeleteBtn.onclick = () => {
        if (confirm('Вы уверены, что хотите удалить эту формулу?')) {
          fetch(`/api/formulas/${id}/`, {
            method: 'DELETE'
          })
          .then(response => {
            if (response.ok) {
              window.location.href = '/';
            } else {
              alert('Ошибка при удалении формулы');
            }
          })
          .catch(err => {
            console.error(err);
            alert('Ошибка сети');
          });
        }
      };
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = `<p class="text-danger">Ошибка при загрузке формулы.</p>`;
    });
});