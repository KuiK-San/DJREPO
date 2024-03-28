const wppconnect = require("@wppconnect-team/wppconnect");
const csv = require("csvtojson");
const { exit } = require("process");
const { rimraf } = require("rimraf");
require("dotenv").config();

rimraf("./tokens");

wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));

async function start(client) {
  await setTimeout(async () => {
    let path = process.env.CSV_FILE;
    await mandarMensagens(path, client)
  }, 10000);
  exit
}

function formatarNumero(numero) {
  const regex = /\+?(\d{2})?\s*(\d{2})?\s*(\d{4,5})\s*-*\s*(\d{4})/;

  const match = regex.exec(numero);
  if (match) {
    let codigoPais = match[1] ? match[1] : "55";
    let codigoArea = match[2] ? match[2] : "41";
    if (match[3].length > 4) {
      match[3] = match[3].slice(1)
    }
    let numeroFormatado = `${codigoPais}${codigoArea}${match[3]}${match[4]}@c.us`;
    return numeroFormatado;
  } else {
    return null;
  }
}

const mandarMensagens = async (path, client) => {
  csv()
      .fromFile(path)
      .then((result) => {
        result.forEach(async (contato)  => {
          
          let nome = contato.Name;
          const fraseCompleta = process.env.MENSAGEM;
          const partesDaFrase = fraseCompleta.split("${nome}");
          let mensagem = "";

          for (frase in partesDaFrase) {
            if (frase == 0) {
              mensagem = partesDaFrase[frase];
            } else {
              mensagem += nome.split(" ")[0] + partesDaFrase[frase];
            }
          }

          //console.log(`você vai enviar mensagem para o numero ${formatarNumero(contato['Phone 1 - Value'])} com a seguinte mensagem ${mensagem}`)

          if (typeof process.env.IMAGEM !== "undefined"){
            console.log(`enviando para o contato ${nome} com imagem`)
            await client.sendImage(formatarNumero(contato['Phone 1 - Value']), process.env.IMAGEM, 'imagemflyer', mensagem);
            
          }else {
            console.log(`enviando para o contato ${nome} sem imagem`)
            await client.sendText(formatarNumero(contato['Phone 1 - Value']), mensagem);

          }
          
        });
      });
}

