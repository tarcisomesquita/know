// abrir http://localhost:8080/

async function openFile(file) {
  try {
    const response = await fetch(`http://localhost:8080/base-de-estados/${file}.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Não carregou o arquivo ' + file + '.json');
    return null;
  }
}

async function sequenciasToEstados() {
  const sequencias = await openFile('sequencias');
  if (! sequencias) return;
  
  const baseEstados = {};
  
  baseEstados['0'] = await openFile('0'); // nome do último arquivo de estado. Ex.: ["1"]. Pode completar a lista com nomes disponíveis.
  
  baseEstados['1'] = await openFile('1'); // primeiro estado. Ex.: {"t": ""}.
  
  let idEstado = '1';
  for (let l = 0; l < sequencias.length; l++) {
    sequencias[l] = sequencias[l].replace(/á/g,'´a').replace(/é/g,'´e').replace(/í/g,'´i').replace(/ó/g,'´o').replace(/ú/g,'´u')
                                 .replace(/ã/g,'~a').replace(/õ/g,'~o')
                                 .replace(/â/g,'\u21E7~a').replace(/ê/g,'\u21E7~e').replace(/ô/g,'\u21E7~o')
                                 .replace(/à/g,'\u21E7´a');
    for (let c = 0; c < sequencias[l].length; c++) {
      if (baseEstados[idEstado][sequencias[l][c]] === undefined) {
        baseEstados[idEstado][sequencias[l][c]] = '';
        
        if (c === (sequencias[l].length - 1)) break;
        
        const idEstadoOld = idEstado;
        idEstado = String(parseInt(baseEstados['0'][0]) + 1);
        baseEstados['0'] = [idEstado];
        
        baseEstados[idEstado] = {};
        
        baseEstados[idEstadoOld][sequencias[l][c]] = idEstado;
      }
      else if (baseEstados[idEstado][sequencias[l][c]] === '') {
        if (c === (sequencias[l].length - 1)) break;
        
        const idEstadoOld = idEstado;
        idEstado = String(parseInt(baseEstados['0'][0]) + 1);
        baseEstados['0'] = [idEstado];
        
        baseEstados[idEstado] = {};
        
        baseEstados[idEstadoOld][sequencias[l][c]] = idEstado;
      }
      else {
        idEstado = baseEstados[idEstado][sequencias[l][c]];
        if (baseEstados[idEstado] === undefined) baseEstados[idEstado] = await openFile(idEstado);
      }
    }
    idEstado = '1';
  }
  
  const link = document.createElement('a');
  for (let key in baseEstados) {
    link.href = 'data:text/plain;charset=UTF-8,' + JSON.stringify(baseEstados[key]);
    link.download = key + '.json';
    link.click();
  }
}

sequenciasToEstados();
