// abrir http://localhost:8080/

async function openFile(file) {
  try {
    const response = await fetch(`http://localhost:8080/base-de-estados/${file}.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading file:', error);
    return null;
  }
}

async function teste() {
  const sequencias = await openFile('sequencias');
  
  const baseEstados = {};
  
  baseEstados['0'] = await openFile('0');
  // 0.json contém o nome do último arquivo de estado. Ex.: ["1"]. Pode completar a lista com nomes disponíveis.
  
  baseEstados['1'] = await openFile('1');
  // 1.json é o primeiro estado. Ex.: {"t": ""}. É obrigatório a existência desse arquivo.
  
  console.log(JSON.stringify(baseEstados, null, 2));
  
  const link = document.createElement('a');
  for (let key in baseEstados) {
    link.href = 'data:text/plain;charset=UTF-8,' + baseEstados[key];
    link.download = key + '.json';
    link.click();
  }
}

teste();
