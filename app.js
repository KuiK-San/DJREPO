const wppconnect = require('@wppconnect-team/wppconnect')
const cstojson = require('csvtojson')

wppconnect
  .create()
  .then((client) => start(client))
  .catch((error) => console.log(error));

async function start(client){ 
    await setTimeout(async () => {
        process.env('CSV_FILE')
    }, 10000)
}

function formatarNumero(numero) {
    const regex = /\+?(\d{2})?\s*(\d{2})?\s*(\d{4,5})\s*-*\s*(\d{4})/;

    const match = regex.exec(numero);
    if (match) {
        let codigoPais = match[1] ? match[1] : "55";
        let codigoArea = match[2] ? match[2] : "41";
        let numeroFormatado = `+${codigoPais}${codigoArea}${match[3]}${match[4]}@c.us`;
        return numeroFormatado;
    } else {
        return null;
    }
}