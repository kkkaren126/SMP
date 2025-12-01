function login() {
    // Usuário e senha pré-definidos (simulação)
    const pass = "rodriguesbianca123";

    // Pegando os valores digitados
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Verificando se o login está correto
    if (password === pass) {
        window.location.href = "main"; // Redireciona para outra página
    } else {
        errorMessage.textContent = "Senha incorreta!";
    }
}

// Pegando os elementos
const modal = document.getElementById("myModal");
const btn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");
    
// Abrir modal
btn.onclick = function () {
    modal.style.display = "block";
    btn.style.display = "none";
}
    
// Fechar modal ao clicar no "X"
closeBtn.onclick = function () {
    modal.style.display = "none";
    btn.style.display = "block";
}