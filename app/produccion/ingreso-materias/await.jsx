export default async function Await({ promise, children }) {
  const data = await promise;
  
  // Verificamos si data.materiasPrimas existe, si no, pasamos todo el data
  const childrenData =  data;
  
  return <>{children(childrenData)}</>;
}