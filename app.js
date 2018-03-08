const request = require('request');
const cheerio = require('cheerio');
let lounaatData = {};
let lounaatArray = ['sodexo-ict', 'unica-dental', 'unica-delica', 'unica-deli-pharma', 'unica-brygge', 'sodexo-lemminkäisenkatu', 'unica-mikro']

/*request('https://www.lounaat.info/lounas/sodexo-ict/turku', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    let $ = cheerio.load(html);
    $('.item-body').each(function(i, element){
      let a = $(this).find('.dish');
      console.log(a.text());
    });
  }
});*/



async function getLounaatData(lounaatArray) {
    
    for (const item of lounaatArray) {
        let lounasLista = {};
        lounasLista[item] = {};
     
        await request('https://www.lounaat.info/lounas/'+item.replace('ä','a').replace('ö','o')+'/turku', async function (error, response, html) {
            if(!error && response.statusCode == 200) {
            let $ = await cheerio.load(html);
            
            await $('#menu').find('.item').each(function(i,element) {
                
                lounasLista[item][$(this).find('.item-header').text()] = $(this).find('.dish').text();
                
                
            });
            console.log(lounasLista);
           
            } else {
                console.log(error + ' ' + response.statusCode);
            }
        });
        
    }
}

async function runApp() {
    await getLounaatData(lounaatArray);
    
}

runApp();