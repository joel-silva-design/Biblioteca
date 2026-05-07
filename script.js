const bodyCartao = document.querySelector(".cartao");
const svgBusca = document.getElementById("svg-busca");
const inputBusca = document.getElementById("input-busca");
const busca = document.getElementById("container-busca");
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
const mensagem = document.querySelector(".mensagem");
const todosOsMenus = document.querySelectorAll('.animacao-suave');
let dataEmprestimo = new Date();
let diasPrazo = 15;
dataEmprestimo.setDate(dataEmprestimo.getDate() + diasPrazo);
let dataDevolucao = dataEmprestimo.toLocaleDateString();


let usuarioLogado = [];
let biblioteca = JSON.parse(localStorage.getItem("biblioteca")) || [];
let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let novoLivro = {};
let livriosEmprestados = [];

function mostrarMensagem(texto, tipo, elemento) {
    elemento.textContent = texto;
    elemento.className = "mensagem";
    elemento.classList.add(tipo);
}



function gerenciarMenus(idParaAbrir) {
    const menuAlvo = document.getElementById(idParaAbrir);
    const jaEstavaAberto = menuAlvo.classList.contains('aberto');

    // 1. Fecha TODOS os menus primeiro
    todosOsMenus.forEach(menu => {

       if (menu.id !== 'container-busca' && !menu.contains(event.target)) {
            menu.classList.remove('aberto');
        }
    });

    // 2. Se o menu clicado NÃO estava aberto, abre ele agora
    // (Isso permite que o usuário clique no mesmo botão para fechar)
    if (!jaEstavaAberto) {
        menuAlvo.classList.add('aberto');
    }

    if (idParaAbrir === "cadastro-livro"){
        mensagem.textContent = "";
        mensagem.className = "mensagem";
    }
}

if (svgBusca) {
    svgBusca.addEventListener('click', () =>{
        event.stopPropagation(); // Evita que o clique suba para o window
        busca.classList.toggle('aberto');

        if (busca.classList.contains('aberto')) {
        // Um pequeno delay opcional para garantir que o elemento esteja visível
        setTimeout(() => {
            inputBusca.focus();
        }, 100); 
    }
    });

    window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        busca.classList.remove('aberto');
    }
});
}

window.addEventListener('click', (event) => {
    // 1. Seleciona todos os containers de menu
    // const todosOsMenus = document.querySelectorAll('.animacao-suave');
    
    // 2. Verifica se o clique foi em algum botão que abre os menus
    // (Adicione a classe 'btn-header' nos seus botões para isso funcionar)
    const clicouNoBotao = event.target.closest('.btn-header');

    // 3. Se o clique NÃO foi num botão...
    if (!clicouNoBotao) {
        todosOsMenus.forEach(menu => {
            // ...e o clique também NÃO foi dentro do menu aberto...
            if (!menu.contains(event.target)) {
                // ...então fecha o menu!
                menu.classList.remove('aberto');
            }
        });
    }
});


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
            let usuarioLogado = [usuarioEncontrado.nome, usuarioEncontrado.email,];
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
            window.location.href = "index.html";
            loginForm.reset();
            return usuarioLogado;
        } else {
            mostrarMensagem("Nome ou senha incorretos.", "erro", mensagem);
        }  
    });
}

function renderizarTudo(){
    renderizarAcervo();
    renderizarEmprestimos();
}

usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || { 
    nome: "", 
    email: "", 
    livrosEmprestados: [] 
};

if (!usuarioLogado.livrosEmprestados) {
    usuarioLogado.livrosEmprestados = [];
}

function renderizarAcervo(){

    if (!acervoLivros) {
        console.warn("A lista de livros não foi encontrada nesta página.");
        return;
    }

    acervoLivros.innerHTML = "";

    biblioteca.forEach((livro, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h3>${livro.titulo}</h3>
            <h4>${livro.autor}</h4>
            <p>(${livro.anoPublicacao}) - Cópias: ${livro.numeroCopias}</p>
            <button class="btn-emprestar" ${livro.numeroCopias <= 0 ? 'disabled' : ''}>
                ${livro.numeroCopias > 0 ? 'Solicitar Empréstimo' : 'Esgotado'}
            </button>
            <div class="status-mensagem" id="msg-${index}"></div>
        `;

        const btn = li.querySelector(".btn-emprestar");
        const msgLocal = li.querySelector(".status-mensagem");

        btn.addEventListener("click", () => {
            emprestarLivro(livro.titulo, msgLocal);
        });

        acervoLivros.appendChild(li);
    });
}


function renderizarEmprestimos() {
    if (!livrosEmprestados) return;
    livrosEmprestados.innerHTML = "";

    // Verifica se a lista existe E se tem itens
    const lista = usuarioLogado.livrosEmprestados || [];

    if (lista.length === 0) {
        // Tente usar um elemento visível, como um parágrafo ou span, caso o CSS do <li> esteja oculto
        const aviso = document.createElement("p");
        // Estilizamos direto no JS para garantir que apareça
        aviso.textContent = "Nenhum empréstimo realizado no momento.";
        aviso.style.color = "#666"; 
        aviso.style.listStyle = "none"; // Tira a bolinha da lista, se for <li>
        aviso.style.textAlign = "center";
        aviso.style.padding = "20px";
        
        livrosEmprestados.appendChild(aviso);
        return;
    }
    lista.forEach(titulo => {
        const livro = biblioteca.find(l => l.titulo === titulo);
        if (!livro) return;

        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${livro.titulo}</strong> - ${livro.autor}
            <small>data do empréstimo: ${new Date().toLocaleDateString()}</small>
            <small>Devolver até: ${dataDevolucao}</small>
            <button class="btn-devolver" onclick="devolverLivro('${titulo}')">Devolver</button>
            <small id="mensagem-devolvido"></small>
        `;
        livrosEmprestados.appendChild(li);
    });
}

function emprestarLivro(titulo, elementoMensagem) {
    const livro = biblioteca.find(l => l.titulo === titulo);
    
    if (usuarioLogado.livrosEmprestados.length >= 2) {
         mostrarMensagem("Você já tem 2 livros emprestados. Devolva um primeiro.", "erro", elementoMensagem);
        return;
    }

    if (!livro || livro.numeroCopias <= 0) {
        mostrarMensagem("Desculpe, não há cópias disponíveis.", "erro", elementoMensagem);
        return;
    }

    if (livro && livro.numeroCopias > 0) {
        livro.numeroCopias--; // Diminui no dado
        usuarioLogado.livrosEmprestados.push(titulo); // Adiciona ao usuário
        
        mostrarMensagem(`Empréstimo realizado com sucesso!`, "sucesso", elementoMensagem);
        salvarEAtualizar(1500);
    }
}

function devolverLivro(titulo) {
    const livro = biblioteca.find(l => l.titulo === titulo);
    // const mensagemDevolvido = document.getElementById("mensagem-devolvido")
    
    if (livro) {
        livro.numeroCopias++; // Aumenta no dado

        usuarioLogado.livrosEmprestados = usuarioLogado.livrosEmprestados.filter(t => t !== titulo);
        salvarEAtualizar();
        
    }
}


function salvarEAtualizar(delay = 0) {
    // 1. Salva sempre de imediato no LocalStorage para não perder dados
    localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

    // 2. Se houver delay (em milisegundos), espera antes de redesenhar a tela
    if (delay > 0) {
        setTimeout(() => {
            renderizarTudo();
        }, delay);
    } else {
        // Se não houver delay, atualiza instantaneamente
        renderizarTudo();
    }
}

// Inicialização
renderizarTudo();

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
        } else if (biblioteca.some(livro => livro.titulo === titulo)) {
            mostrarMensagem("Cópia adicionada com sucesso.", "sucesso", mensagem);
            const livroExistente = biblioteca.find(livro => livro.titulo === titulo);
                livroExistente.numeroCopias += parseInt(numeroCopias);
                localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
                const livroItems = acervoLivros.querySelectorAll("li");
                livroItems.forEach(item => {
                    const itemTitulo = item.querySelector("h3").textContent;
                    if (itemTitulo === titulo) {
                        const itemCopias = item.querySelector("p").textContent;
                        item.querySelector("p").textContent = itemCopias.replace(/Cópias: \d+/, `Cópias: ${livroExistente.numeroCopias}`);
                    }
                });
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
        mostrarMensagem("Livro adicionado com sucesso.", "sucesso", mensagem)
        localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
        renderizarAcervo();
        return;
    }
    })
};

window.addEventListener('load', () => {
    carregarUsuarios();   
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
    }
}

function buscarLivro() {
    const termoBusca = inputBusca.value.trim().toLowerCase();
    const livros = acervoLivros.querySelectorAll("li");

    livros.forEach(livro => {
        const titulo = livro.querySelector("h3").textContent.toLowerCase();
        const autor = livro.querySelector("h4").textContent.toLowerCase();
        if (titulo.includes(termoBusca) || autor.includes(termoBusca)) {
            livro.style.display = "block";
        } else {
            livro.style.display = "none";
        }
    });
}

if (inputBusca) {
inputBusca.addEventListener('input', buscarLivro);
}

