function abrirModal() {
    document.getElementById('modalEscola').style.display = 'block';
    
    if (dados) {
        document.getElementById('nome').value = dados.nome;
        document.getElementById('telefone').value = dados.telefone;
        document.getElementById('endereco').value = dados.endereco;
        document.getElementById('bairro').value = dados.bairro;
        document.getElementById('vagas').value = dados.vagas;
    } else {
        document.getElementById('formEscola').reset();
    }
}

function fecharModal() {
    document.getElementById('modalEscola').style.display = 'none';
}

document.getElementById('formEscola').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = new FormData(document.getElementById('formEscola'));
    const dados = Object.fromEntries(form.entries());

    const url = dados.id?.trim() ? `/editar_vagas/${dados.id}` : '/adicionar';

    const resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
});

    if (resposta.ok) {
      fecharModal();
      location.reload(); // ou atualiza a tabela com JS
    } else {
      alert("Erro ao salvar escola.");
    }
});  

function openEditar(id){
    var modal = document.getElementById("modalEditar_" + id);
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("Modal não encontrado para o id:", id);
    }
}

function closeEditar(id){
    var modal = document.getElementById("modalEditar_" + id);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Modal não encontrado para o id:", id);
    }
}

function enviarEdicao(id) {
    const vagasInput = document.getElementById(`vagasEdit_${id}`);
    const vagas = vagasInput.value;

    fetch(`/editar_vagas/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            vagas: vagas
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert('Vagas atualizadas com sucesso!');
            // Atualiza na UI (você ainda precisa colocar um span com id correspondente)
            const vagaElemento = document.getElementById(`vagaTexto_${id}`);
            if (vagaElemento) {
                vagaElemento.textContent = `${vagas} vagas`;
            }
            window.location.reload(); 
            // Fecha o modal
            closeEditar(id);
        } else {
            alert('Erro ao atualizar vagas');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
const telefoneInput = document.getElementById('telefone');

telefoneInput.addEventListener('input', function (e) {
let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número

if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

if (value.length > 2) {
    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
} else if (value.length > 0) {
    value = `(${value}`;
}

e.target.value = value;
  });
});