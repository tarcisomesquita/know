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

(async () => {
  const palavra = await getContent('palavra');
  if (! palavra) {
    console.error("Failed to fetch palavra.html");
    return;
  }
  
  const genero = await htmlToJson(palavra);
  console.log(JSON.stringify(genero));
})();
