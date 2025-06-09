document.addEventListener('DOMContentLoaded', () => {
  fetch('/tarefas')
    .then(res => res.json())
    .then(tarefas => {
      const container = document.getElementById('tarefasContainer');

      tarefas.forEach(tarefa => {
        const box = document.createElement('div');
        box.classList.add('box');

        const titulo = document.createElement('h1');
        titulo.textContent = `Título: ${tarefa.titulo}`;

        const descricao = document.createElement('p');
        descricao.textContent = `Descrição: ${tarefa.descricao}`;

        const status = document.createElement('p');
        status.textContent = `Status: ${tarefa.concluida ? 'Concluída' : 'Pendente'}`;

        const botao = document.createElement('button');
        botao.textContent = 'Marcar como concluída';
        botao.classList.add('btn');
        botao.disabled = tarefa.concluida;

        // botao.addEventListener('click', () => {
        //   fetch(`/tarefas/${tarefa._id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ concluida: true })
        //   })
        //   .then(res => res.json())
        //   .then(() => {
        //     status.textContent = 'Status: Concluída';
        //     botao.disabled = true;
        //   });
        // });

        box.appendChild(titulo);
        box.appendChild(descricao);
        box.appendChild(status);
        box.appendChild(botao);

        container.appendChild(box);
      });
    });
});
