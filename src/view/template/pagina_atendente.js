let consultas = JSON.parse(localStorage.getItem("consultas")) || [
  // Dados de exemplo se o localStorage estiver vazio
  { data: "2024-05-10", hora: "10:00", paciente: "Ana Souza", dentista: "Dra. Camila" },
  { data: "2025-11-15", hora: "11:30", paciente: "Carlos Lima", dentista: "Dr. Lucas" }
];

// Carrega consultas na tabela
function carregarConsultas() {
  const tbody = document.querySelector("#tabelaCorpo") || document.querySelector("#tabelaConsultas tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  consultas.forEach((c, i) => {
    const tr = document.createElement("tr");

    // Lógica para definir o status da consulta
    const dataConsulta = new Date(c.data + "T00:00:00");
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data

    let statusClass = '';
    let statusText = '';

    if (dataConsulta < hoje) {
      statusClass = 'realizada';
      statusText = 'Realizada';
    } else if (dataConsulta.getTime() === hoje.getTime()) {
      statusClass = 'hoje';
      statusText = 'Hoje';
    } else {
      statusClass = 'agendada';
      statusText = 'Agendada';
    }

    tr.innerHTML = `
      <td>${c.paciente}</td>
      <td>${c.data}</td>
      <td>${c.hora}</td>
      <td>${c.dentista}</td>
      <td><span class="status ${statusClass}">${statusText}</span></td>
      <td class="acoes">
        <button onclick="editarConsulta(${i})" title="Editar">✏️</button>
        <button onclick="excluirConsulta(${i})" title="Excluir">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Abre o modal
function abrirModal(modalId) {
  if (!modalId) modalId = "modalConsulta";
  document.getElementById(modalId).style.display = "flex";
  if (modalId === "modalConsulta") {
    document.getElementById("formConsulta").reset();
    editIndex = null;
  } else if (modalId === "modalAgenda") {
    carregarAgendaDentista();
  } else if (modalId === "modalChat") {
    carregarMensagensRecepcionista();
    // Auto-refresh a cada 2 segundos
    if (window.chatIntervalRecepcionista) clearInterval(window.chatIntervalRecepcionista);
    window.chatIntervalRecepcionista = setInterval(carregarMensagensRecepcionista, 2000);
  }
}

// Fecha o modal
function fecharModal(modalId) {
  if (!modalId) modalId = "modalConsulta";
  document.getElementById(modalId).style.display = "none";
  if (modalId === "modalChat" && window.chatIntervalRecepcionista) {
    clearInterval(window.chatIntervalRecepcionista);
  }
}

// Salva nova consulta ou edita existente
let editIndex = null;

function salvarConsulta(event) {
  event.preventDefault();

  const novaConsulta = {
    data: document.getElementById("data").value,
    hora: document.getElementById("hora").value,
    paciente: document.getElementById("paciente").value,
    dentista: document.getElementById("dentista").value
  };

  if (editIndex !== null) {
    consultas[editIndex] = novaConsulta;
  } else {
    consultas.push(novaConsulta);
  }

  localStorage.setItem("consultas", JSON.stringify(consultas));
  carregarConsultas();
  fecharModal();
}

// Editar consulta
function editarConsulta(index) {
  const c = consultas[index];
  document.getElementById("data").value = c.data;
  document.getElementById("hora").value = c.hora;
  document.getElementById("paciente").value = c.paciente;
  document.getElementById("dentista").value = c.dentista;

  editIndex = index;
  document.getElementById("modalConsulta").style.display = "flex";
}

// Excluir consulta
function excluirConsulta(index) {
  if (confirm("Tem certeza que deseja excluir esta consulta?")) {
    consultas.splice(index, 1);
    localStorage.setItem("consultas", JSON.stringify(consultas));
    carregarConsultas();
  }
}

// Funções de Agenda
function carregarAgendaDentista() {
  const disponibilidades = JSON.parse(localStorage.getItem('agendaDentista')) || [];
  const container = document.getElementById('agendaDisponibilidades');
  
  if (disponibilidades.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px;">Nenhuma disponibilidade cadastrada pelo dentista ainda.</p>';
    return;
  }

  // Ordena por data
  disponibilidades.sort((a, b) => new Date(a.data) - new Date(b.data));

  container.innerHTML = disponibilidades.map(disp => {
    const dataFormatada = new Date(disp.data + 'T00:00:00').toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return `
      <div style="background: #f8fbff; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid var(--secondary);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <div>
            <strong style="font-size: 18px; color: var(--primary);">${dataFormatada}</strong>
            <p style="margin: 8px 0; color: var(--muted); font-size: 16px;">⏰ ${disp.horaInicio} - ${disp.horaFim}</p>
            ${disp.observacoes ? `<p style="font-size: 14px; color: var(--text); margin-top: 10px; padding: 10px; background: white; border-radius: 6px;">📝 ${disp.observacoes}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Funções de Chat
function enviarMensagemRecepcionista(event) {
  event.preventDefault();
  const input = document.getElementById('mensagemInputRecepcionista');
  const mensagem = input.value.trim();
  
  if (!mensagem) return;

  const mensagemData = {
    remetente: 'Recepcionista',
    texto: mensagem,
    data: new Date().toISOString(),
    id: Date.now()
  };

  const mensagens = JSON.parse(localStorage.getItem('chatDentistaRecepcionista')) || [];
  mensagens.push(mensagemData);
  localStorage.setItem('chatDentistaRecepcionista', JSON.stringify(mensagens));

  input.value = '';
  carregarMensagensRecepcionista();
}

function carregarMensagensRecepcionista() {
  const mensagens = JSON.parse(localStorage.getItem('chatDentistaRecepcionista')) || [];
  const container = document.getElementById('chatMessagesRecepcionista');
  
  if (mensagens.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--muted);">Nenhuma mensagem ainda. Inicie a conversa!</p>';
    return;
  }

  container.innerHTML = mensagens.map(msg => {
    const dataFormatada = new Date(msg.data).toLocaleString('pt-BR');
    const isRecepcionista = msg.remetente === 'Recepcionista';
    return `
      <div style="display: flex; ${isRecepcionista ? 'justify-content: flex-end' : 'justify-content: flex-start'};">
        <div style="max-width: 70%; background: ${isRecepcionista ? 'var(--secondary)' : 'white'}; color: ${isRecepcionista ? 'white' : 'var(--text)'}; padding: 12px 16px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-weight: 600; font-size: 12px; margin-bottom: 5px; opacity: 0.9;">${msg.remetente}</div>
          <div style="font-size: 15px;">${msg.texto}</div>
          <div style="font-size: 11px; margin-top: 5px; opacity: 0.7;">${dataFormatada}</div>
        </div>
      </div>
    `;
  }).join('');
  
  container.scrollTop = container.scrollHeight;
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    if (event.target.id === 'modalChat' && window.chatIntervalRecepcionista) {
      clearInterval(window.chatIntervalRecepcionista);
    }
  }
};

// Inicializa a página
document.addEventListener("DOMContentLoaded", carregarConsultas);
