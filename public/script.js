const filtroSelect = document.getElementById('filtro');
let tarefasContainer = document.querySelector('.tarefasContainer');

let todasTarefas = [];

if (!tarefasContainer) {
  tarefasContainer = document.createElement('div');
  tarefasContainer.classList.add('tarefasContainer');
  document.body.appendChild(tarefasContainer);
}

function salvarTarefasNoLocalStorage() {
    localStorage.setItem('tarefas', JSON.stringify(todasTarefas));
}

function carregarTarefasDoLocalStorage() {
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
      todasTarefas = JSON.parse(tarefasSalvas);
    } else {
      todasTarefas = [];
    }
}
  
fetch('/tarefas')
    .then(async response => {
        const text = await response.text();
        return JSON.parse(text); 
    })
    .then(data => {
        data.forEach(tarefa => {
        listarTarefas(tarefa);
        });
});
  
function abrirPopUp() {
    const popup = document.querySelector('.tarefas');
    if (popup) popup.style.display = 'flex';
}
    
function fecharPopUp() {
    const popup = document.querySelector('.tarefas');
    if (popup) popup.style.display = 'none';
}

function salvarTarefa() {
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
  
    if (!titulo || !descricao) {
      alert('Por favor, preencha título e descrição.');
      return;
    }
  
    const novaTarefa = {
      titulo,
      descricao,
      concluida: false
    };
  
    todasTarefas.push(novaTarefa);
    salvarTarefasNoLocalStorage();
  
    mostrarTarefas();
  
    fecharPopUp();
    document.getElementById('titulo').value = '';
    document.getElementById('descricao').value = '';
}

function mostrarTarefas() {
    const filtro = filtroSelect.value;
    sessionStorage.setItem('filtroTarefas', filtro);
  
    let tarefasFiltradas;
    if (filtro === 'pendentes') {
      tarefasFiltradas = todasTarefas.filter(t => !t.concluida);
    } else if (filtro === 'concluidas') {
      tarefasFiltradas = todasTarefas.filter(t => t.concluida);
    } else {
      tarefasFiltradas = todasTarefas;
    }
  
    tarefasContainer.innerHTML = '';
  
    tarefasFiltradas.forEach(tarefa => {
      listarTarefas(tarefa);
    });
}

fetch('/tarefas')
  .then(res => res.json())
  .then(data => {
    todasTarefas = data;
    const filtroSalvo = sessionStorage.getItem('filtroTarefas') || 'todas';
    filtroSelect.value = filtroSalvo;
    mostrarTarefas();
  });

  function listarTarefas(tarefa) {
    const box = document.createElement('div');
    box.classList.add('box'); 

    const textoDiv = document.createElement('div');

    const titulo = document.createElement('h2');
    titulo.innerText = `Título: ${tarefa.titulo}`;

    const descricao = document.createElement('p');
    descricao.innerText = `Descrição: ${tarefa.descricao}`;

    const status = document.createElement('p');
    status.innerText = `Status: ${tarefa.concluida ? 'Concluída' : 'Pendente'}`;

    textoDiv.appendChild(titulo);
    textoDiv.appendChild(descricao);
    textoDiv.appendChild(status);

    box.appendChild(textoDiv); 

    const label = document.createElement('label');
    label.classList.add('checkbox-container');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tarefa.concluida;

    checkbox.addEventListener('change', () => {
        tarefa.concluida = checkbox.checked;

        const index = todasTarefas.findIndex(t => t._id === tarefa._id);
        if (index > -1) {
            todasTarefas[index].concluida = checkbox.checked;
            salvarTarefasNoLocalStorage();
            status.innerText = `Status: ${checkbox.checked ? 'Concluída' : 'Pendente'}`;
        }
    });

    label.appendChild(checkbox);
    box.appendChild(label);

    const botaoExcluir = document.createElement('button');
    botaoExcluir.innerHTML = '🗑️'; 
    botaoExcluir.classList.add('btn-excluir-icon');

    botaoExcluir.addEventListener('click', () => {
        try {
            const resposta = fetch(`/tarefas/${tarefa._id}`, {
                method: 'DELETE',
            });
    
            if (resposta.ok) {
                const index = todasTarefas.findIndex(t => t._id === tarefa._id);
                if (index > -1) {
                    todasTarefas.splice(index, 1);
                    salvarTarefasNoLocalStorage();
                    box.remove();
                }
            } else {
                console.error('Erro ao excluir a tarefa no servidor');
            }
        } catch (erro) {
            console.error('Erro server:', erro);
        }
    });

    box.appendChild(botaoExcluir); 

    tarefasContainer.appendChild(box); 
}


function init() {
    carregarTarefasDoLocalStorage();
    const filtroSalvo = sessionStorage.getItem('filtroTarefas') || 'todas';
    filtroSelect.value = filtroSalvo;
    mostrarTarefas();
}

filtroSelect.addEventListener('change', mostrarTarefas);

init();

