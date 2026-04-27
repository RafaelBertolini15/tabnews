import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.uptade_At).toLocaleString("pt-BR");
  }

  let infosDatabase = "Carregando...";

  if (!isLoading && data) {
    infosDatabase = (
      <>
        <div>Versao: {data.dependencies.database.version}</div>
        <div>
          Conexoes abertas: {data.dependencies.database.opened_conections}
        </div>
        <div>
          Conexoes disponiveis: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <div>{infosDatabase}</div>
      <div> Ultima atualizacao: {updatedAtText}</div>
    </>
  );
}
