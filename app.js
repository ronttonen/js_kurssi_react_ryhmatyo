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
    
    let o = 0;    
    let lounasLista = {};
    for (const item of lounaatArray) {
        
        lounasLista[item] = {};
     
        request('https://www.lounaat.info/lounas/'+item.replace('ä','a').replace('ö','o')+'/turku', async function (error, response, html) {
            if(!error && response.statusCode == 200) {
            let $ = await cheerio.load(html);
            
            await $('#menu').find('.item').each(function(i,element) {
                
                lounasLista[item][$(this).find('.item-header').text()] = $(this).find('.dish').text();
                
                
            });
            
            
            o++;
            if (o == lounaatArray.length) {
                console.log(lounasLista);
                lounaatData = lounasLista;
                formatAndSendData(lounaatData);
            }
            } else {
                console.log(error + ' ' + response.statusCode);
            }
        });
        
    }
    
    
   
}


function formatAndSendData(data) {
 for (var item in data) {
     
     for (var subItem in data[item]) {
         if (data[item][subItem] == '') {
         delete data[item][subItem];
         }
     }
     
 }
  data = JSON.stringify(data);
  console.log(data);
  console.log('data sent');
};

async function runApp() {
        getLounaatData(lounaatArray);
    
    
    
}

runApp();