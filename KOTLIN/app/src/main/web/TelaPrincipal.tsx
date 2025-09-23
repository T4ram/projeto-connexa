import React, { useEffect, useState } from "react";
import "./TelaPrincipal.css";

interface Grupo {
  name: string;
  subject: string;
}

export const TelaPrincipal: React.FC = () => {
  // Simulação: pegue o usuário logado de algum contexto ou localStorage
  const usuarioEmail = localStorage.getItem("usuarioEmail") || "";
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGrupos() {
      setLoading(true);
      try {
        const res = await fetch(`/api/grupos/meus?email=${usuarioEmail}`);
        if (res.ok) {
          const data = await res.json();
          setGrupos(data);
        } else {
          setGrupos([]);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchGrupos();
  }, [usuarioEmail]);

  return (
    <div className="principal-container">
      <header className="principal-header">
        <h1>Connexa</h1>
        <div className="principal-actions">
          <button className="perfil">Perfil</button>
          <button className="config">Configurações</button>
        </div>
      </header>
      <main className="principal-main">
        <button className="criar-grupo">Criar Grupo</button>
        <button className="entrar-grupo">Entrar em Grupo</button>
      </main>
      <section className="grupos-lista">
        <h2>Meus Grupos</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : grupos.length === 0 ? (
          <p>Você não participa de nenhum grupo.</p>
        ) : (
          <ul>
            {grupos.map((grupo, idx) => (
              <li key={idx} className="grupo-item">
                <strong>{grupo.name}</strong> <span>- {grupo.subject}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
