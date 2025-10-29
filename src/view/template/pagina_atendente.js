let consultas = JSON.parse(localStorage.getItem("consultas")) || [];

// Carrega consultas na tabela
function carregarConsultas() {
  const tbody = document.querySelector("#tabelaConsultas tbody");
  tbody.innerHTML = "";

  consultas.forEach((c, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.data}</td>
      <td>${c.hora}</td>
      <td>${c.paciente}</td>
      <td>${c.dentista}</td>
      <td>
        <button onclick="editarConsulta(${i})">✎</button>
        <button onclick="excluirConsulta(${i})">🗑</button>
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
