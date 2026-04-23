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
const btnCadastrarUser = document.querySelector(".btn-conta");
const erroCadastro = document.querySelector(".erro-cadastro");
const btnLogin = document.querySelector(".btn-login");
const btnConectar = document.querySelector(".btn-conectar");
const erroLogin = document.querySelector(".erro-login");
const loginForm = document.getElementById("login-form");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const acervoLivros = document.querySelector(".lista-livros");
const mensagem = document.querySelector(".mensagem");

let usuarioLogado = [];
let biblioteca = [];
let listaUsuarios = [];

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem";
    mensagem.classList.add(tipo);
}

if (svgBusca) {
    svgBusca.addEventListener('click', () =>{
        inputBusca.classList.toggle("visivel");
    });
}

if (addLivroHeader) {
    addLivroHeader.addEventListener('click', () =>{
    addLivro.classList.toggle("visivel");
    mensagem.textContent = "";
    mensagem.className = "mensagem";
    });
}

function validarConta (nome, email, senha, repeteSenha) {
    if (nome === "" || email === "" || senha === "" || repeteSenha === "") {
        erroCadastro.innerHTML = "Preencha todos os campos obrigatórios.";
        return false;
    } else if (!emailRegex.test(email)) {
            mostrarMensagem("Digite um endereço de email válido.", "erro");
            return false;
    }else if (senha !== repeteSenha) {
        mostrarMensagem("As senhas não coincidem.", "erro");
        return false;
    } else if (!/^\d{6}$/.test(senha)) {
        mostrarMensagem("A senha deve conter exatamente 6 dígitos numéricos.", "erro");
        return false;
    } else {
        return true;
        mostrarMensagem("Conta criada com sucesso!", "sucesso");
    }    
}

if (criarConta) {
criarConta.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nome = usuarioNome.value.trim();
    const email = usuarioEmail.value.trim();
    const senha = usuarioSenha.value;
    const repeteSenhaValue = repeteSenha.value;
    if (validarConta(nome, email, senha, repeteSenhaValue)) {
        mostrarMensagem("Login realizado com sucesso!", "sucesso");
        const novoUsuario = {
            id: Date.now(),
            nome: nome,
            email: email,
            senha: senha,
            criadoEm: new Date(),
        };
        listaUsuarios.push(novoUsuario);
        console.log(`Usuário ${nome} criado com sucesso!`);
        console.log(listaUsuarios);
        criarConta.reset();
        erroCadastro.innerHTML = "";
    }
    salvarUsuarios();
});
}

function salvarUsuarios() {
        localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
    }

function carregarUsuarios() {
    const usuariosSalvos = localStorage.getItem("usuarios");
    if (usuariosSalvos) {
        listaUsuarios = JSON.parse(usuariosSalvos);
    }
};

carregarUsuarios();
if (loginForm) {
loginForm.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nome = usuarioNome.value.trim();
    const senha = usuarioSenha.value;
    if (nome === "" || senha === "") {
        erroLogin.innerHTML = "Preencha todos os campos obrigatórios.";
        return;
    }
    const usuarioEncontrado = listaUsuarios.find(usuario => usuario.nome === nome && usuario.senha === senha);
    if (usuarioEncontrado) {
            console.log(`Bem-vindo, ${usuarioEncontrado.nome}!`);
            loginForm.reset();
            erroLogin.innerHTML = "";
            usuarioLogado = [usuarioNome.value.trim(), usuarioEmail.value];
        } else {
            erroLogin.innerHTML = "Nome ou senha incorretos.";
        }  
    });
}

if (addLivro) {
    addLivro.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const titulo = document.getElementById("nome-livro").value.trim();
        const autor = document.getElementById("nome-autor").value.trim();
        const anoPublicacao = document.getElementById("ano-publicacao").value.trim();
        const numeroCopias = document.getElementById("livro-copias").value.trim();
        if (titulo === "" || autor === "" || anoPublicacao === "" || numeroCopias === "") {
            mostrarMensagem("Preencha todos os campos obrigatórios.", "erro");
            return;
        } else if (!/^\d{4}$/.test(anoPublicacao)) {
            mostrarMensagem("Digite um ano de publicação válido (4 dígitos).", "erro");
            return;
        } else if (!/^\d+$/.test(numeroCopias)) {
            mostrarMensagem("Digite um número válido de cópias.", "erro");
            return;
        } else {

        const novoLivro = {
            id: Date.now(),
            titulo: titulo,
            autor: autor,
            anoPublicacao: anoPublicacao,
            numeroCopias: numeroCopias,
        };
        biblioteca.push(novoLivro);

        localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
        adicionarLivro(titulo, autor, anoPublicacao, numeroCopias);
    }
    })
};

carregarBiblioteca = () => {
    const bibliotecaSalva = localStorage.getItem("biblioteca"); 
    if (bibliotecaSalva) {
        biblioteca = JSON.parse(bibliotecaSalva);
    }
    biblioteca.forEach(livro => {
        adicionarLivro(livro.titulo, livro.autor, livro.anoPublicacao, livro.numeroCopias);
    });
}

window.addEventListener('load', () => {
    carregarUsuarios();
    carregarBiblioteca();
});

function adicionarLivro(titulo, autor, anoPublicacao, numeroCopias) {
   
    let livroItem = document.createElement("li");
        livroItem.innerHTML = `
        <h3>${titulo}</h3>
        <h4>${autor}</h4>
        <p>(${anoPublicacao}) - Cópias: ${numeroCopias}</p>
        <button class="btn-emprestimo">Solicitar Empréstimo</button>
        <small class="mensagem"></small>
        `;
        acervoLivros.appendChild(livroItem);
        addLivro.reset();
        mostrarMensagem("Livro adicionado com sucesso!", "sucesso");
}

const btnEmprestimo = document.querySelectorAll(".btn-emprestimo"); 

function emprestimo() {
   
    if (novoLivro.numeroCopias > 0) {
        novoLivro.numeroCopias--;
        localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
        botao.parentElement.querySelector("p").textContent = `(${novoLivro.anoPublicacao}) - Cópias: ${novoLivro.numeroCopias}`;
        usuarioLogado.push(novoLivro.titulo);
        return true;
        mostrarMensagem("Empréstimo solicitado com sucesso!", "sucesso");
    } else {
        mostrarMensagem("Desculpe, não há cópias disponíveis para empréstimo.", "erro");
        return false;
    }
}

if (btnEmprestimo) {
    btnEmprestimo.forEach(botao => {
        botao.addEventListener('click', emprestimo);
    });
}
