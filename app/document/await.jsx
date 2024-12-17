// app/Await.jsx (Server Component)
export default async function Await({ promise, children }) {
  const data = await promise; // Ahora podemos usar await

  return <>{children({ documents: data })}</>;
  return <>{children(data)}</>; // Renderizamos los children con los datos
}
