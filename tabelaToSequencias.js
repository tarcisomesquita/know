async function getContent(palavra) {
  try {
    const response = await fetch(`https://tarcisomesquita.github.io/know/tabelas/${palavra}.html`);
    if (! response.ok) throw { 'message': response.status };
    
    const textContent = await response.text();
    return textContent;
  }
  catch (error) {
    console.error("Error fetching content: ", error.message);
    return null;
  }
}

async function htmlToJson(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table = doc.querySelector('table');
  const linhas = table.querySelectorAll('tr');
  const json = {};
  
  for (let i = 1; i < linhas.length; i++) {
    const cells = linhas[i].querySelectorAll('td');
    const key = cells[0].textContent;
    const value = cells[1].textContent;
    json[key] = value;
  }
  
  return json;
}

async function htmlToJsonArray(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table = doc.querySelector('table');
  const linhas = table.querySelectorAll('tr');
  const cells = linhas[0].querySelectorAll('th');
  
  const header = [];
  for (let i = 0; i < cells.length; i++) header.push(cells[i].textContent);
  
  const jsonArray = [];
  
  for (let i = 1; i < linhas.length; i++) {
    const cells = linhas[i].querySelectorAll('td');
    const jsonObject = {};
    for (let j = 0; j < header.length; j++) jsonObject[header[j]] = cells[j].textContent;
    jsonArray.push(jsonObject);
  }
  
  return jsonArray;
}

async function tabelaToSequencias(tabela) {
  const palavra = await getContent('palavra');
  if (! palavra) {
    console.error("Failed to fetch palavra.html");
    return;
  }
  
  const genero = await htmlToJson(palavra);
  console.log(JSON.stringify(genero));
  
  const tabelaHtml = await getContent(tabela);
  if (! tabelaHtml) {
    console.error(`Failed to fetch a tabela ${tabela}`);
    return;
  }
  
  const tabelaJson = await htmlToJsonArray(tabelaHtml);
  console.log(JSON.stringify(tabelaJson));
  
  const sequenciasGeral = [];
  
  // Substantivos uniformes: são aqueles que possuem apenas uma forma para os dois gêneros. Eles podem ser comuns-de-dois, epicenos e sobrecomuns.
  
  // falta artigo que atribui significado: a grama e o grama, a cabeça e o cabeça, a radio e o rádio, a capital e o capital
  // falta substantivos de dois gêneros: artista, chefe, motorista, cliente, colega, dentista, estudante, fã, 
  // gerente, imigrante, jornalista, intérprete, jovem, pianista, policial, servente, indígena
  
  for (let i = 0; i < tabelaJson.length; i++) {
    const keys = Object.keys(tabelaJson[i]);
    
    for (let j = 0; j < keys.length; j++) {
      if (genero[keys[j]] === 'feminino')  {
        // Referência com classe feminina. Ex.: a palavra masculino
        sequenciasGeral.push(`a ${keys[j]} ${tabelaJson[i][keys[j]]}`);
        sequenciasGeral.push(  `${keys[j]} ${tabelaJson[i][keys[j]]}`);
        
        if (genero[tabelaJson[i][keys[j]]] === 'feminino') {
          // relação vertical com valor feminino e classe feminina. Ex. a palavra é uma palavra
          sequenciasGeral.push(`a ${tabelaJson[i][keys[j]]} é uma ${keys[j]}`);
          sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é uma ${keys[j]}`);
          
          if (j !== 0) {
            if (genero[keys[0]] === 'feminino')  {
              sequenciasGeral.push(`a ${tabelaJson[i][keys[j]]} é uma ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é uma ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`a ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
            }
            else if (genero[keys[0]] === 'masculino') {
              sequenciasGeral.push(`a ${tabelaJson[i][keys[j]]} é uma ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é uma ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`a ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
            }
            
            if (genero[tabelaJson[i][keys[0]]] === 'feminino') {
              sequenciasGeral.push(`a ${tabelaJson[i][keys[j]]} é uma ${keys[j]} da ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é uma ${keys[j]} da ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`a ${keys[j]} da ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} da ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
            }
            else if (genero[tabelaJson[i][keys[0]]] === 'masculino') {
              sequenciasGeral.push(`a ${tabelaJson[i][keys[j]]} é uma ${keys[j]} do ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é uma ${keys[j]} do ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`a ${keys[j]} do ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} do ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
            }
          }
        }
        else if (genero[tabelaJson[i][keys[j]]] === 'masculino') {
          // relação vertical com valor masculino e classe feminina. Ex. o gênero é uma palavra
          sequenciasGeral.push(`o ${tabelaJson[i][keys[j]]} é uma ${keys[j]}`);
          sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é uma ${keys[j]}`);
          
          if (j !== 0) {
            if (genero[keys[0]] === 'feminino') {
              // Ex.: 
              sequenciasGeral.push(`o ${tabelaJson[i][keys[j]]} é uma ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é uma ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`a ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
            }
            else if (genero[keys[0]] === 'masculino') {
              sequenciasGeral.push(`o ${tabelaJson[i][keys[j]]} é uma ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é uma ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`a ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
            }
            
            if (genero[tabelaJson[i][keys[0]]] === 'feminino') {
              // Ex.: 
              sequenciasGeral.push(`o ${tabelaJson[i][keys[j]]} é uma ${keys[j]} da ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é uma ${keys[j]} da ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`a ${keys[j]} da ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} da ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
            }
            else if (genero[tabelaJson[i][keys[0]]] === 'masculino') {
              sequenciasGeral.push(`o ${tabelaJson[i][keys[j]]} é uma ${keys[j]} do ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é uma ${keys[j]} do ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`a ${keys[j]} do ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} do ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
            }
          }
        }
      }
      else if (genero[keys[j]] === 'masculino') {
        // Referência com classe masculina. Ex.: o gênero masculino
        sequenciasGeral.push(`o ${keys[j]} ${tabelaJson[i][keys[j]]}`);
        sequenciasGeral.push(  `${keys[j]} ${tabelaJson[i][keys[j]]}`);
        
        if (genero[tabelaJson[i][keys[j]]] === 'feminino')  {
          // relação vertical com valor feminino e classe masculina. Ex. 
          sequenciasGeral.push(`a ${tabelaJson[i][keys[j]]} é um ${keys[j]}`);
          sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é um ${keys[j]}`);
          
          if (j !== 0) {
            if (genero[keys[0]] === 'feminino')  {
              sequenciasGeral.push(`a ${tabelaJson[i][keys[j]]} é um ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é um ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`o ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
            }
            else if (genero[keys[0]] === 'masculino') {
              sequenciasGeral.push(`a ${tabelaJson[i][keys[j]]} é um ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é um ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`o ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(`${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
            }
            
            if (genero[tabelaJson[i][keys[0]]] === 'feminino') {
              sequenciasGeral.push(`a ${tabelaJson[i][keys[j]]} é um ${keys[j]} da ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é um ${keys[j]} da ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`o ${keys[j]} da ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} da ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
            }
            else if (genero[tabelaJson[i][keys[0]]] === 'masculino') {
              sequenciasGeral.push(`a ${tabelaJson[i][keys[j]]} é um ${keys[j]} do ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é um ${keys[j]} do ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`o ${keys[j]} do ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} do ${tabelaJson[i][keys[0]]} é a ${tabelaJson[i][keys[j]]}`);
            }
          }
        }
        else if (genero[tabelaJson[i][keys[j]]] === 'masculino') {
          // relação vertical com valor masculino e classe masculina. Ex.: o feminino é um gênero
          sequenciasGeral.push(`o ${tabelaJson[i][keys[j]]} é um ${keys[j]}`);
          sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é um ${keys[j]}`);
          
          if (j !== 0) {
            if (genero[keys[0]] === 'feminino') {
              // Ex.: o feminino é um gênero da palavra palavra
              sequenciasGeral.push(`o ${tabelaJson[i][keys[j]]} é um ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é um ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              
              // Ex.: o gênero da palavra palavra é o feminino
              sequenciasGeral.push(`o ${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} da ${keys[0]} ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
            }
            else if (genero[keys[0]] === 'masculino') {
              sequenciasGeral.push(`o ${tabelaJson[i][keys[j]]} é um ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é um ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`o ${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} do ${keys[0]} ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
            }
            
            if (genero[tabelaJson[i][keys[0]]] === 'feminino') {
              // Ex.: o feminino é um gênero da palavra
              sequenciasGeral.push(`o ${tabelaJson[i][keys[j]]} é um ${keys[j]} da ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é um ${keys[j]} da ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`o ${keys[j]} da ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} da ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
            }
            else if (genero[tabelaJson[i][keys[0]]] === 'masculino') {
              sequenciasGeral.push(`o ${tabelaJson[i][keys[j]]} é um ${keys[j]} do ${tabelaJson[i][keys[0]]}`);
              sequenciasGeral.push(  `${tabelaJson[i][keys[j]]} é um ${keys[j]} do ${tabelaJson[i][keys[0]]}`);
              
              sequenciasGeral.push(`o ${keys[j]} do ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
              sequenciasGeral.push(  `${keys[j]} do ${tabelaJson[i][keys[0]]} é o ${tabelaJson[i][keys[j]]}`);
            }
          }
        }
      }
    }
  }
  
  const sequencias = [...new Set(sequenciasGeral)];
  
  const link = document.createElement('a');
  link.href = 'data:text/plain;charset=UTF-8,' + JSON.stringify(sequencias.sort());
  link.download = tabela + '_seq.json';
  link.click();
}

tabelaToSequencias('grandeza')
