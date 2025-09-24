const API_URL = "http://localhost:3000";

// ---------------- Cadastro ----------------
const formCadastro = document.getElementById("cadastroForm");
if (formCadastro) {
  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const curso = document.getElementById("curso").value;
    const periodo = document.getElementById("periodo").value;
    const senha = document.getElementById("senha").value;
    const erro = document.getElementById("erro");

    fetch(`${API_URL}/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, curso, periodo, senha })
    })
    .then(res => res.json())
    .then(data => {
      if (data.erro) erro.textContent = data.erro;
      else window.location.href = "login.html";
    });
  });
}

// ---------------- Login ----------------
const formLogin = document.getElementById("loginForm");
if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;
    const erro = document.getElementById("loginErro");

    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    })
    .then(res => res.json())
    .then(data => {
      if (data.erro) erro.textContent = data.erro;
      else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));
        window.location.href = "index.html";
      }
    });
  });
}

// ---------------- Sessão obrigatória ----------------
function verificarLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  fetch(`${API_URL}/validar-sessao`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  .then(res => {
    if (!res.ok) throw new Error("Sessão inválida");
  })
  .catch(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
  });
}

// Chamar apenas em páginas protegidas
if (window.location.pathname.includes("index.html")) {
  verificarLogin();
}

// ---------------- Logout ----------------
function logout() {
  const token = localStorage.getItem("token");
  fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` }
  }).finally(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
  });
}

// ---------------- Grupos ----------------
function criarGrupo() {
  const nome = prompt("Digite o nome do grupo:");
  if (!nome) return;

  const token = localStorage.getItem("token");
  fetch(`${API_URL}/grupo`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ nome })
  })
  .then(res => res.json())
  .then(() => carregarGrupos());
}

function acessarPerfil() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuario) {
    alert(`Perfil\nNome: ${usuario.nome}\nCurso: ${usuario.curso}`);
  }
}

function acessarConfig() {
  alert("Abrindo configurações...");
}

function carregarGrupos() {
  const token = localStorage.getItem("token");
  const lista = document.getElementById("lista-grupos");
  if (lista && token) {
    fetch(`${API_URL}/grupos`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      lista.innerHTML = "";
      data.forEach(grupo => {
        const li = document.createElement("li");
        li.textContent = grupo.nome;
        lista.appendChild(li);
      });
    });
  }
}

// Carrega grupos ao abrir a index
if (window.location.pathname.includes("index.html")) {
  carregarGrupos();
}

