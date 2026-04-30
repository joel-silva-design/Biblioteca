const bodyCartao = document.querySelector(".cartao");
const svgBusca = document.getElementById("svg-busca");
const inputBusca = document.getElementById("input-busca");
const addLivro = document.getElementById("cadastro-livro");
const addLivroHeader = document.getElementById("adicionar-livro");
const grupoUsuario = document.querySelector(".grupo-usuario");
const usuarioInfo = document.getElementById("usuario-info");
const gerenciarConta = document.getElementById("gerenciar-conta");
const criarConta = document.querySelector(".cadastrar-usuario");
const usuarioNome = document.getElementById("nome-usuario");
const usuarioEmail = document.getElementById("email-usuario");
const usuarioSenha = document.getElementById("senha-usuario");
const repeteSenha = document.getElementById("repete-senha");
const btnCadastrarUser = document.querySelector(".btn-conta");
const btnLogin = document.querySelector(".btn-login");
const btnConectar = document.querySelector(".btn-conectar");
const erroLogin = document.querySelector(".erro-login");
const loginForm = document.getElementById("login-form");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const acervoLivros = document.querySelector(".lista-livros");
const emprestimos = document.getElementById("emprestimos");
const listaEmprestimos = document.getElementById("lista-emprestimos");
const livrosEmprestados = document.getElementById("livros-emprestados");
const nenhumLivro = document.getElementById("nenhum-livro");
const mensagem = document.querySelector(".mensagem");
let dataEmprestimo = new Date();
let diasPrazo = 15;
dataEmprestimo.setDate(dataEmprestimo.getDate() + diasPrazo);
let dataDevolucao = dataEmprestimo.toLocaleDateString();


let usuarioLogado = [];
let biblioteca = [];
let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let novoLivro = {};
let livriosEmprestados = [];

function mostrarMensagem(texto, tipo, elemento) {
    elemento.textContent = texto;
    elemento.className = "mensagem";
    elemento.classList.add(tipo);
}

if (svgBusca) {
    svgBusca.addEventListener('click', () =>{
        inputBusca.classList.toggle("visivel");
    });
}

if (addLivroHeader) {
    addLivroHeader.addEventListener('click', () =>{
    addLivro.classList.toggle("visivel");
    usuarioInfo.classList.remove("visivel");
    usuarioInfo.classList.add("escondido");
    listaEmprestimos.classList.remove("visivel");
    listaEmprestimos.classList.add("escondido");
    mensagem.textContent = "";
    mensagem.className = "mensagem";
    });
}

function validarConta (nome, email, senha, repeteSenha) {
    if (nome === "" || email === "" || senha === "" || repeteSenha === "") {
        mostrarMensagem("Preencha todos os campos obrigatórios.", "erro", mensagem);
        return false;
    } else if (!emailRegex.test(email)) {
            mostrarMensagem("Digite um endereço de email válido.", "erro", mensagem);
            return false;
    }else if (senha !== repeteSenha) {
        mostrarMensagem("As senhas não coincidem.", "erro", mensagem);
        return false;
    } else if (!/^\d{6}$/.test(senha)) {
        mostrarMensagem("A senha deve conter exatamente 6 dígitos numéricos.", "erro", mensagem);
        return false;
    } else {
        return true;
        mostrarMensagem("Conta criada com sucesso!", "sucesso", mensagem);
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
        mostrarMensagem("Login realizado com sucesso!", "sucesso", mensagem);
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
        mostrarMensagem("Preencha todos os campos obrigatórios.", "erro", mensagem);
        return;
    }
    const usuarioEncontrado = listaUsuarios.find(usuario => usuario.nome === nome && usuario.senha === senha);
    if (usuarioEncontrado) {
            console.log(`Bem-vindo, ${usuarioEncontrado.nome}!`);
            mostrarMensagem("Login realizado com sucesso!", "sucesso", mensagem);
            let usuarioLogado = [usuarioEncontrado.nome, usuarioEncontrado.email];
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
            window.location.href = "index.html";
            loginForm.reset();
        } else {
            mostrarMensagem("Nome ou senha incorretos.", "erro", mensagem);
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
            mostrarMensagem("Preencha todos os campos obrigatórios.", "erro", mensagem);
            return;
        } else if (!/^\d{4}$/.test(anoPublicacao)) {
            mostrarMensagem("Digite um ano de publicação válido (4 dígitos).", "erro", mensagem);
            return;
        } else if (!/^\d+$/.test(numeroCopias)) {
            mostrarMensagem("Digite um número válido de cópias.", "erro", mensagem);
            return;
        } else {

        novoLivro = {
            id: Date.now(),
            titulo: titulo,
            autor: autor,
            anoPublicacao: anoPublicacao,
            numeroCopias: numeroCopias,
        };
        biblioteca.push(novoLivro);

        localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
        adicionarLivro(titulo, autor, anoPublicacao, numeroCopias);
        return this.novoLivro;
    }
    })
};

function adicionarLivro(titulo, autor, anoPublicacao, numeroCopias) {

    if (!acervoLivros) {
        console.warn("A lista de livros não foi encontrada nesta página.");
        return;
    }
   
    const livroItem = document.createElement("li");
    
    livroItem.innerHTML = `
        <h3>${titulo}</h3>
        <h4>${autor}</h4>
        <p>(${anoPublicacao}) - Cópias: ${numeroCopias}</p>
        <button class="btn-emprestimo">Solicitar Empréstimo</button>
        <small class="mensagem2"></small>
    `;
    acervoLivros.appendChild(livroItem);
    addLivro.reset();
    let mensagem2 = livroItem.querySelector(".mensagem2");
    mostrarMensagem("Livro adicionado com sucesso!", "sucesso", mensagem);

    const btnEmprestimo = livroItem.querySelector(".btn-emprestimo");
    btnEmprestimo.addEventListener('click', emprestimoDeLivros.bind(null, titulo, autor, anoPublicacao, numeroCopias, mensagem2));

//     function emprestimo(event) {
//     event.preventDefault();
    
//     if (numeroCopias > 0) {
//         numeroCopias--;
//         localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
//         btnEmprestimo.parentElement.querySelector("p").textContent = `(${anoPublicacao}) - Cópias: ${numeroCopias}`;
//         usuarioLogado.push(titulo);
//         emprestimoDeLivros(titulo, autor);
//         nenhumLivro.style.display = "none";
//         mostrarMensagem("Empréstimo solicitado com sucesso!", "sucesso", mensagem2);
//         return true;
//     } else {
//         mostrarMensagem("Desculpe, não há cópias disponíveis para empréstimo.", "erro", mensagem2);
//         return false;
//     }
// }
}

function emprestimoDeLivros(titulo, autor, anoPublicacao, numeroCopias, mensagem) {
    if (!livrosEmprestados) {
        console.warn("A lista de livros emprestados não foi encontrada nesta página.");
        return;
    } else if (listaEmprestimos.length === 2) {
        mostrarMensagem("Você já tem 2 livros emprestados. Devolva um para solicitar outro.", "erro", mensagem);
        return;
    } else if (numeroCopias <= 0) {
        mostrarMensagem("Desculpe, não há cópias disponíveis para empréstimo.", "erro", mensagem);
        return;
    } else  if (numeroCopias > 0) {
        numeroCopias--;
        localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
        const livroItems = acervoLivros.querySelectorAll("li");
        livroItems.forEach(item => {
            const itemTitulo = item.querySelector("h3").textContent;
            if (itemTitulo === titulo) {
                item.querySelector("p").textContent = `(${anoPublicacao}) - Cópias: ${numeroCopias}`;
            }
        });
        usuarioLogado.push(titulo);
        nenhumLivro.style.display = "none";
        mostrarMensagem("Empréstimo solicitado com sucesso!", "sucesso", mensagem);
    }
    if (livrosEmprestados.children.length === 0) {
        nenhumLivro.style.display = "block";
    }  else {
        const itemEmprestado = document.createElement("li");
        itemEmprestado.innerHTML = `${titulo} - ${autor}
        <br><small>data do empréstimo: ${new Date().toLocaleDateString()}</small>
        <br><small>Devolver até: ${dataDevolucao}</small>`;
        livrosEmprestados.appendChild(itemEmprestado);
    }
}

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
    console.log(new Date().toLocaleDateString());
    console.log(dataDevolucao);
});

if (grupoUsuario) {
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    console.log("Usuário logado:", usuarioLogado);
    if (usuarioLogado) {
        let nomeLogado = document.getElementById("nome-logado");
        nomeLogado.innerHTML = `<strong>Bem-vindo, ${usuarioLogado[0]}!</strong>`;

        let emailLogado = document.getElementById("email-logado");
        emailLogado.textContent = usuarioLogado[1];

        const btnLogout = document.getElementById("btn-logout");

        btnLogout.addEventListener('click', () => {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "login.html";
        });
        const usuarioInfo = document.getElementById("usuario-info");
        grupoUsuario.addEventListener('click', () => {
        usuarioInfo.classList.toggle("visivel");
        addLivro.classList.remove("visivel");
        addLivro.classList.add("escondido");
        listaEmprestimos.classList.remove("visivel");
        listaEmprestimos.classList.add("escondido");
        });
    }
}

if (emprestimos) {
    emprestimos.addEventListener('click', () => {
        listaEmprestimos.classList.toggle("visivel");
        addLivro.classList.remove("visivel");
        addLivro.classList.add("escondido");
        usuarioInfo.classList.remove("visivel");
        usuarioInfo.classList.add("escondido");
    });
}


function buscarLivro() {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    const livros = acervoLivros.querySelectorAll("li");

    livros.forEach(livro => {
        const titulo = livro.querySelector("h3").textContent.toLowerCase();
        if (titulo.includes(termoBusca)) {
            livro.style.display = "block";
        } else {
            livro.style.display = "none";
        }
    });
}

inputBusca.addEventListener('input', buscarLivro);

// Listener Global para fechar itens ao clicar fora
window.addEventListener('click', (event) => {
    
    // 1. Fechar a Busca se clicar fora do ícone e do input
    if (inputBusca && inputBusca.classList.contains("visivel")) {
        if (!svgBusca.contains(event.target) && !inputBusca.contains(event.target)) {
            inputBusca.classList.remove("visivel");
        }
    }

    // 2. Fechar Cadastro de Livro se clicar fora do botão do header e do formulário
    if (addLivro && addLivro.classList.contains("visivel")) {
        // Verifica se o clique não foi no botão "Adicionar Livro" nem dentro do próprio formulário
        if (!addLivroHeader.contains(event.target) && !addLivro.contains(event.target)) {
            addLivro.classList.remove("visivel");
            // Opcional: limpar mensagens de erro/sucesso ao fechar
            mensagem.textContent = "";
            mensagem.className = "mensagem";
        }
    }
    
    // 3. Fechar Informações do Usuário (caso você use a mesma lógica)
    if (usuarioInfo && usuarioInfo.classList.contains("visivel")) {
        if (!gerenciarConta.contains(event.target) && !usuarioInfo.contains(event.target)) {
            usuarioInfo.classList.remove("visivel");
            usuarioInfo.classList.add("escondido");
        }
    }

    if (listaEmprestimos && listaEmprestimos.classList.contains("visivel")) {
        if (!emprestimos.contains(event.target) && !listaEmprestimos.contains(event.target)) {
            listaEmprestimos.classList.remove("visivel");
            listaEmprestimos.classList.add("escondido");
        }
    }
});
