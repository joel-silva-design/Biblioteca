const svgBusca = document.getElementById("svg-busca");
const inputBusca = document.getElementById("input-busca");
const addLivro = document.getElementById("cadastro-livro");
const addLivroHeader = document.getElementById("adicionar-livro");
const gerenciarConta = document.getElementById("gerenciar-conta");
const criarConta = document.querySelector(".cadastrar-usuario");
const usuarioNome = document.getElementById("nome-usuario");
const usuarioEmail = document.getElementById("email-usuario");
const usuarioSenha = document.getElementById("senha-usuario");
const repeteSenha = document.getElementById("repete-senha");
const btnCaxdastrarUser = document.querySelector(".btn-conta");

svgBusca.addEventListener('click', () =>{
    inputBusca.classList.toggle("visivel");
});

addLivroHeader.addEventListener('click', () =>{
    addLivro.classList.toggle("visivel");
    criarConta.classList.remove("visivel");
    criarConta.classList.add("escondido");
});

gerenciarConta.addEventListener('click', () =>{
    criarConta.classList.toggle("visivel");
    addLivro.classList.remove("visivel");
    addLivro.classList.add("escondido");
});

function validarConta (nome, email, senha, repeteSenha) {
    
}