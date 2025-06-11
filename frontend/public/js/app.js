document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/formulas')
    .then(res => {
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      return res.json();
    })
    .then(data => {
      const list = document.getElementById('formula-list');
      list.innerHTML = '';
      data.forEach(f => {
        const li = document.createElement('li');
        li.className = 'card mb-3';
        li.innerHTML = `
          <div class="card-body">
            <h2 class="h4 card-title">
              <a href="/formula/${f.id}" class="text-decoration-none text-dark">
                ${f.title}
              </a>
            </h2>
            <p class="card-text"><strong>Область:</strong> ${f.field}</p>
            <p class="card-text">${f.short_description}</p>
            ${
              f.author_photo
                ? `<img src="${f.author_photo}" alt="Фото автора" class="img-thumbnail" style="width:100px;">`
                : `<p class="text-muted">Фото отсутствует</p>`
            }
          </div>
        `;
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById('formula-list').innerHTML =
        `<li class="text-danger">Не удалось загрузить данные.</li>`;
    });
});

document.getElementById('add-formula-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const csrftoken = getCookie('csrftoken');
  
  try {
    const response = await fetch('http://localhost:8000/add/', {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': csrftoken
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("Добавлена формула с ID:", data.id);
      bootstrap.Modal.getInstance(document.getElementById('addFormulaModal')).hide();
      this.reset();
      
      document.dispatchEvent(new Event('DOMContentLoaded'));
    } else {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (error) {
    console.error('Ошибка при добавлении формулы:', error);
    alert('Ошибка при добавлении формулы: ' + error.message);
  }
});

