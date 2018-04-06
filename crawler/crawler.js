const request = require('request');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const sqlite3 = require('sqlite3');

	
let db = new sqlite3.Database('db/lounasdb.db');
let lounaatData = {};
let lounaatArray = ["mauno-electrocity", "mauno", "sodexo-ict", "unica-dental", "china-jade", "snack-city", "alabama",
"herkutus", "unica-delica", "unica-deli-pharma", "unica-mikro", "turun-upseerikerho",
"sodexo-old-mill", "sodexo-lemminkaisenkatu", "kupittaan-paviljonki", "unica-brygge", "juvenes-monttu",
"unica-assarin-ullakko", "mauno-deli", "delhi-darbar", "ravintola-kuori", "unica-tottisalmi", "veritas-stadion",
"unica-galilei", "gado-gado-lunch-party", "hus-lindman", "cafe-fanriken", "cafe-karen", "pinella", "m-kitchen-cafe"];

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
  lounaatData = data;
  console.log(data);
  
  console.log('data sent');
  let today = new Date().getDay();
    switch(today){
        case 2:
            deleteDataArray(['Maanantai'],lounaatData);
            break;
        case 3:
            deleteDataArray(['Maanantai', 'Tiistai'],lounaatData);
            break;
        case 4:
            deleteDataArray(['Maanantai', 'Tiistai', 'Keskiviikko'],lounaatData);
            break;
        case 5:
            deleteDataArray(['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai'],lounaatData);
            break;
        case 6:
            deleteDataArray(['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', "Perjantai"],lounaatData);
            break;
        case 0:
            deleteDataArray(['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'],lounaatData);
            break;
    }
    data = JSON.stringify(lounaatData);
    today = new Date();
    //sqllähetä data
    console.log(data);
    let sqlLauseke = "INSERT INTO lounaat(pvm, info) VALUES(" + '"'+today.toString()+'"' + ', ' + "'"+data+"'"+')';
    db.run(sqlLauseke, function(err) {
    if (err) {
      return console.log(err.message);
    }
  });
  db.all("SELECT * FROM lounaat WHERE oid = (SELECT MAX(oid) FROM lounaat)", function(err, rows) {
      if (err) {
          return console.log(err.message);
      }
      rows.forEach((row) => {
    console.log(row.pvm);
  });
  });
  
  
}



function deleteData(date, data) {
    for (var item in data) {
        for(var paiva in data[item]) {
            if(paiva.includes(date)) {
                delete data[item][paiva];
            }
        }
    }
    lounaatData = data;
    data = JSON.stringify(data);
    let today = new Date();
    let sqlLauseke = "INSERT INTO lounaat(pvm, info) VALUES(" + '"'+today.toString()+'"' + ', ' + "'"+data+"'"+')';
    db.run(sqlLauseke, function(err) {
    if (err) {
      return console.log(err.message);
    }
    });
    //lähetä uusi data treactinn
}

function deleteDataArray(date, data){
    for (var i = 0; i < date.length; i++) {
    for (var item in data) {
        for(var paiva in data[item]) {
            if(paiva.includes(date[i])) {
                delete data[item][paiva];
            }
        }
        }
        lounaatData = data;
    }
    console.log(lounaatData);
}

async function runApp() {
    getLounaatData(lounaatArray);
    
    var job = schedule.scheduleJob('00 30 05 * * 1', function () {
       getLounaatData(lounaatArray);
       console.log(job.nextInvocation());
    });
    var deleteMonday = schedule.scheduleJob('00 00 01 * * 2', function() {
        deleteData('Maanantai', lounaatData);
        console.log(deleteMonday.nextInvocation());
    });
    var deleteTuesday = schedule.scheduleJob('00 00 01 * * 3', function() {
        deleteData('Tiistai', lounaatData);
        console.log(deleteTuesday.nextInvocation());
    });
    var deleteWednesday = schedule.scheduleJob('00 00 01 * * 4', function() {
        deleteData('Keskiviikko', lounaatData);
        console.log(deleteWednesday.nextInvocation());
    });
    var deleteThursday = schedule.scheduleJob('00 00 01 * * 5', function() {
        deleteData('Torstai', lounaatData);
        console.log(deleteThursday.nextInvocation());
    });
    var deleteFriday = schedule.scheduleJob('00 00 01 * * 6', function() {
        deleteData('Perjantai', lounaatData);
        console.log(deleteFriday.nextInvocation());
    });
    var deleteSaturday = schedule.scheduleJob('00 00 01 * * 7', function() {
        deleteData('Lauantai', lounaatData);
        console.log(deleteSaturday.nextInvocation());
    });
    console.log(job.nextInvocation());
    console.log(new Date());
        
    
    
    
}

runApp();