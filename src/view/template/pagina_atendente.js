let consultas = JSON.parse(localStorage.getItem("consultas")) || [
  // Dados de exemplo se o localStorage estiver vazio
  { data: "2024-05-10", hora: "10:00", paciente: "Ana Souza", dentista: "Dra. Camila" },
  { data: "2025-11-15", hora: "11:30", paciente: "Carlos Lima", dentista: "Dr. Lucas" }
];

// Carrega consultas na tabela
function carregarConsultas() {
  const tbody = document.querySelector("#tabelaConsultas tbody");
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
function abrirModal() {
  document.getElementById("modalConsulta").style.display = "flex";
  document.getElementById("formConsulta").reset();
  editIndex = null;
}

// Fecha o modal
function fecharModal() {
  document.getElementById("modalConsulta").style.display = "none";
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

// Inicializa a página
document.addEventListener("DOMContentLoaded", carregarConsultas);
