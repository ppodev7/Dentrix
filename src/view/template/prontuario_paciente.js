// Simula nome do paciente (poderia vir por query string)
const nomePaciente = "João Silva";
document.getElementById("nomePaciente").textContent = nomePaciente;

// Carrega prontuário salvo
const prontuarioSalvo = localStorage.getItem(nomePaciente);
if (prontuarioSalvo) {
  document.getElementById("textoProntuario").value = prontuarioSalvo;
}

// Alterna entre modo de leitura e edição
function toggleEdicao() {
  const textarea = document.getElementById("textoProntuario");
  const editarBtn = document.getElementById("editarBtn");
  const salvarBtn = document.getElementById("salvarBtn");

  if (textarea.hasAttribute("readonly")) {
    textarea.removeAttribute("readonly");
    textarea.style.background = "#fff";
    editarBtn.style.display = "none";
    salvarBtn.style.display = "inline-block";
  } else {
    textarea.setAttribute("readonly", true);
    textarea.style.background = "#f0f4fa";
  }
}

// Salva o prontuário no LocalStorage
function salvarProntuario() {
  const texto = document.getElementById("textoProntuario").value;
  localStorage.setItem(nomePaciente, texto);

  alert("Prontuário salvo com sucesso!");
  
  // Volta ao modo de leitura
  const textarea = document.getElementById("textoProntuario");
  textarea.setAttribute("readonly", true);
  textarea.style.background = "#f0f4fa";
  document.getElementById("editarBtn").style.display = "inline-block";
  document.getElementById("salvarBtn").style.display = "none";
}
