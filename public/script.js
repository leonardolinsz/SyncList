const filtroSelect = document.getElementById('filtro');
const tarefasContainer = document.querySelector('.tarefasContainer') || criarContainer();
let todasTarefas = [];

function criarContainer() {
  const container = document.createElement('div');
  container.classList.add('tarefasContainer');
  document.body.appendChild(container);
  return container;
}

function salvarTarefasNoLocalStorage() {
  localStorage.setItem('tarefas', JSON.stringify(todasTarefas));
}

function carregarTarefasDoLocalStorage() {
  const salvas = localStorage.getItem('tarefas');
  todasTarefas = salvas ? JSON.parse(salvas) : [];
}

function mostrarTarefas() {
  const filtro = filtroSelect.value;
  sessionStorage.setItem('filtroTarefas', filtro);

  let tarefasFiltradas = todasTarefas;
  if (filtro === 'pendentes') tarefasFiltradas = todasTarefas.filter(t => !t.concluida);
  else if (filtro === 'concluidas') tarefasFiltradas = todasTarefas.filter(t => t.concluida);
  
  tarefasContainer.innerHTML = tarefasFiltradas.map(tarefa => criarHTMLTarefa(tarefa)).join('');
  adicionarEventos();

  atualizarExibicaoConcluidas()
}

function criarHTMLTarefa(tarefa) {
  return `
<div class="box" data-id="${tarefa._id || tarefa.titulo}">
  <div>
    <h2>Título: ${tarefa.titulo}</h2>
    <p>Descrição: ${tarefa.descricao}</p>
    <p>Status: ${tarefa.concluida ? 'Concluída' : 'Pendente'}</p>
  </div>
  <label class="checkbox-container">
    <input type="checkbox" ${tarefa.concluida ? 'checked' : ''}>
  </label>
  <button class="btn-excluir-icon">
    <img src="lixo.gif" alt="Excluir" width="30" height="30">
  </button>
</div>

  `;
}

function adicionarEventos() {
  tarefasContainer.querySelectorAll('.box').forEach(box => {
    const id = box.dataset.id;
    const tarefa = todasTarefas.find(t => (t._id === id) || (t.titulo === id));

    const checkbox = box.querySelector('input[type="checkbox"]');

    checkbox.addEventListener('change', () => {
      atualizarStatus(tarefa, checkbox.checked, box);
    });

    const btnExcluir = box.querySelector('button.btn-excluir-icon');
    btnExcluir.addEventListener('click', () => excluirTarefa(tarefa, box));
  });
}

function atualizarExibicaoConcluidas() {
  const boxes = document.querySelectorAll('.box');

  boxes.forEach(box => {
    const infoDiv = box.querySelector('div');
    const titulo = infoDiv.querySelector('h2');
    const descricao = infoDiv.querySelector('p:nth-child(2)');
    const status = infoDiv.querySelector('p:nth-child(3)');

    const checkbox = box.querySelector('input[type="checkbox"]');
    const concluida = checkbox.checked;

    if (concluida) {
      titulo.style.textDecoration = 'line-through'
      descricao.style.textDecoration = 'line-through';
      status.style.textDecoration = 'line-through';
    } else {
      titulo.style.textDecoration = ''
      descricao.style.textDecoration = '';
      status.style.textDecoration = '';
    }
  });
}

async function atualizarStatus(tarefa, concluida, box) {
  try {
    const res = await fetch(`/tarefas/${tarefa._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concluida }),
    });

    if (!res.ok) throw new Error('Falha ao atualizar tarefa');

    const dataAtualizada = await res.json();
    tarefa.concluida = dataAtualizada.concluida;

    salvarTarefasNoLocalStorage();

    atualizarExibicaoConcluidas()
  } catch (err) {
    alert('Erro ao atualizar tarefa');
    console.error(err);
  }
}

async function excluirTarefa(tarefa, box) {
  try {
    const res = await fetch(`/tarefas/${tarefa._id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir');

    todasTarefas = todasTarefas.filter(t => t._id !== tarefa._id);
    salvarTarefasNoLocalStorage();

    atualizarExibicaoConcluidas()
    
    box.remove();
  } catch (err) {
    alert('Erro ao excluir tarefa');
    console.error(err);
  }
}

async function init() {
  try {
    const res = await fetch('/tarefas');
    todasTarefas = await res.json();
    
    const filtroSalvo = sessionStorage.getItem('filtroTarefas') || 'todas';
    filtroSelect.value = filtroSalvo;

    mostrarTarefas();
  } catch (err) {
    console.error('Erro ao carregar tarefas:', err);
  }
}

async function salvarTarefa() {
  const tituloPop = document.getElementById('titulo').value.trim();
  const descricaoPop = document.getElementById('descricao').value.trim();

  if (!tituloPop || !descricaoPop) {
    alert('Preencha os dois campos.');
    return;
  }

  const response = await fetch(`/tarefas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      titulo: tituloPop,
      descricao: descricaoPop,
      concluida: false 
    })
  });

  if (response.ok) {
    fecharPopUp();
  } else {
    alert('Erro ao criar tarefa.');
  }
}

function abrirPopUp(tarefa, index) {
  const popup = document.getElementById('tarefasPop');
  popup.style.display = 'flex';
};

function fecharPopUp() {
  document.getElementById('tarefasPop').style.display = 'none';
  window.location.reload();
  document.getElementById('inputPopup').value = '';
}

filtroSelect.addEventListener('change', mostrarTarefas);

init();
