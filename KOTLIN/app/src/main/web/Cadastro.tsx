import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css";

export const Cadastro: React.FC = () => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    curso: "",
    periodo: "",
    senha: "",
  });
  const [touched, setTouched] = useState({
    nome: false,
    email: false,
    curso: false,
    periodo: false,
    senha: false,
  });
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validators
  const nomeValido = form.nome.trim().length >= 3;
  const emailValido = form.email.endsWith("@universidade.com");
  const cursoValido = form.curso.trim().length > 0;
  const periodoInt = Number(form.periodo);
  const periodoValido =
    Number.isInteger(periodoInt) && periodoInt >= 1 && periodoInt <= 12;
  const senhaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.senha);

  const isFormValido =
    nomeValido && emailValido && cursoValido && periodoValido && senhaValida;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Exemplo de chamada à API
    try {
      const response = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.status === 201) {
        setSucesso(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome completo"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
          onBlur={() => setTouched({ ...touched, nome: true })}
        />
        {touched.nome && !nomeValido && (
          <span className="erro">
            Nome completo obrigatório (mín. 3 caracteres).
          </span>
        )}
        <input
          type="email"
          placeholder="E-mail institucional"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          onBlur={() => setTouched({ ...touched, email: true })}
        />
        {touched.email && !emailValido && (
          <span className="erro">
            E-mail deve terminar com @universidade.com.
          </span>
        )}
        <input
          type="text"
          placeholder="Curso"
          value={form.curso}
          onChange={e => setForm({ ...form, curso: e.target.value })}
          onBlur={() => setTouched({ ...touched, curso: true })}
        />
        {touched.curso && !cursoValido && (
          <span className="erro">Curso obrigatório.</span>
        )}
        <input
          type="number"
          placeholder="Período/Semestre"
          value={form.periodo}
          onChange={e => setForm({ ...form, periodo: e.target.value })}
          onBlur={() => setTouched({ ...touched, periodo: true })}
        />
        {touched.periodo && !periodoValido && (
          <span className="erro">
            Semestre deve ser número inteiro entre 1 e 12.
          </span>
        )}
        <input
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={e => setForm({ ...form, senha: e.target.value })}
          onBlur={() => setTouched({ ...touched, senha: true })}
        />
        {touched.senha && !senhaValida && (
          <span className="erro">
            Senha deve ter 8+ caracteres, 1 maiúscula, 1 minúscula, 1 número.
          </span>
        )}
        <button type="submit" disabled={!isFormValido || loading}>
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
        {sucesso && (
          <span className="sucesso">
            Cadastro realizado! Verifique seu e-mail.
          </span>
        )}
      </form>
    </div>
  );
};
