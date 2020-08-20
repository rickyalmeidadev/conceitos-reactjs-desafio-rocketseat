import React, { useState, useEffect } from "react";

import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchRepositoriesError, setFetchRepositoriesError] = useState("");
  const [addRepositoryError, setAddRepositoryError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("repositories");
        setRepositories(response.data);
      } catch (error) {
        if (error.response) {
          setFetchRepositoriesError(error.response.data.message);
        } else {
          setFetchRepositoriesError("Falha ao obter repositórios.");
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function handleAddRepository() {
    try {
      const response = await api.post("repositories", {
        url: "https://github.com/rickyalmeidadev",
        title: "Desafio ReactJS",
        techs: ["React", "Node.js"],
      });

      setRepositories([...repositories, response.data]);
    } catch (error) {
      if (error.response) {
        setAddRepositoryError(error.response.data.message);
      } else {
        setAddRepositoryError("Falha ao adicionar repositório.");
      }

      setTimeout(() => {
        setAddRepositoryError("")
      }, 2500);
    }

  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);
    setRepositories(repositories.filter(repository => repository.id !== id));
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {isLoading ? (
          <p>Carregando...</p>
        ) : fetchRepositoriesError ? (
          <p>{fetchRepositoriesError}</p>
        ) : repositories.map(repository => (
          <li key={repository.id}>
            {repository.title}
  
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
      {addRepositoryError && <p>{addRepositoryError}</p>}
    </div>
  );
}

export default App;
