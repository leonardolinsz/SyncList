// Cria container da tarefa
const tarefasContainer = document.createElement('div');
tarefasContainer.classList.add('tarefasContainer');

// Cria o box (conteúdo da tarefa)
const box = document.createElement('div');
box.classList.add('box');

const titulo = document.createElement('h2');
titulo.innerText = "Título: Tarefa teste";

const descricao = document.createElement('p');
descricao.innerText = "Descrição: Tarefa que está sendo testada";

const status = document.createElement('p');
status.innerText = "Status: Concluída";

// Adiciona elementos no box
box.appendChild(titulo);
box.appendChild(descricao);
box.appendChild(status);

// Cria checkbox
const label = document.createElement('label');
label.classList.add('checkbox-container');

const checkbox = document.createElement('input');
checkbox.type = 'checkbox';

label.appendChild(checkbox);

// Junta tudo no container principal
tarefasContainer.appendChild(box);
tarefasContainer.appendChild(label);

// E depois adiciona esse container na sua página
document.body.appendChild(tarefasContainer); // ou o elemento onde você quer colocar
