// Abre o modal do prontuário
function abrirProntuario(nome) {
  document.getElementById("modalProntuario").style.display = "flex";
  document.getElementById("pacienteNome").textContent = "Prontuário - " + nome;

  // Recupera prontuário salvo
  const dados = localStorage.getItem(nome);
  document.getElementById("textoProntuario").value = dados ? dados : "";
}

// Fecha o modal
function fecharProntuario() {
  document.getElementById("modalProntuario").style.display = "none";
}

// Salva o prontuário no localStorage
function salvarProntuario() {
  const nome = document.getElementById("pacienteNome").textContent.replace("Prontuário - ", "");
  const texto = document.getElementById("textoProntuario").value;
  localStorage.setItem(nome, texto);
  alert("Prontuário de " + nome + " salvo com sucesso!");
  fecharProntuario();
}

// Fecha o modal ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById("modalProntuario");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

<script>
  function filtrarPacientes() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.paciente-card');

    cards.forEach(card => {
      const nome = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = nome.includes(input) ? 'block' : 'none';
    });
  }
</script>

