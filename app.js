const wppconnect = require("@wppconnect-team/wppconnect");
const csv = require("csvtojson");
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
          
          await client.sendText('554197715962@c.us', mensagem);
        });
      });
  }, 10000);
}

function formatarNumero(numero) {
  const regex = /\+?(\d{2})?\s*(\d{2})?\s*(\d{4,5})\s*-*\s*(\d{4})/;

  const match = regex.exec(numero);
  if (match) {
    let codigoPais = match[1] ? match[1] : "55";
    let codigoArea = match[2] ? match[2] : "41";
    let numeroFormatado = `${codigoPais}${codigoArea}${match[3]}${match[4]}@c.us`;
    return numeroFormatado;
  } else {
    return null;
  }
}
