//______________________________  Load & Save data  ______________________________
// Lade daten
const loadData = (myKey) => {
  if (window.localStorage.key(myKey)) {
    return JSON.parse(window.localStorage.getItem(myKey));
  } else {
    return null;
  }
}

// Speichere daten
const saveData = (myKey, myData) => {
  //Inhalt wird local gespeichert
  return window.localStorage.setItem(myKey, JSON.stringify(myData));
}

// Lösche daten
const deleteData = (myKey) => {
  return window.localStorage.removeItem(myKey);
}

//______________________________  Load & Save Json data  ______________________________
// AJAX-Anfrage zum laden einer Json
const loadJsonFile = (filePath, callback, errorback ) => {
  fetch('maps/' + filePath + '.json?v=' + generateHash())
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Spieldaten nicht vorhanden!');
    }
    return response.json();
  })
  .then(function(data) {
    //callback(JSON.parse(xhr.responseText));
    callback(data);
  })
  .catch(function(err) {
    //console.warn(filePath, err);
    errorback(err);
  });
};



//______________________________  Erstellt den prüfwert für eigene spiele  ______________________________
//Generiert eine Zufällige Hash mit 6 Stellen
const generateHash = () => {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var hash = "";
  for (var i = 0; i < 6; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

// erstellt eine 8 stellige Prüfsumme
const generateChecksum = (str) => {
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var checksumAttr = [];
  var checksum = '';
  var count = 0;
  var outputLenght = 8;

  checksumAttr[0] = str.length;
  for (var i = 0; i < str.length; i++) {
    var charIndex = chars.indexOf(str.charAt(i));
    if (charIndex !== -1) {
      if (!checksumAttr[count]) checksumAttr[count] = 0;
      checksumAttr[count] += charIndex;
      if (checksumAttr[count] >= chars.length) checksumAttr[count] -= chars.length
      count++
      if (count == outputLenght) count = 0;
    }
  }
  for (var j = 0; j <= outputLenght; j++) {
    checksum += chars.charAt(checksumAttr[j]);
  }
  return checksum;
}


//______________________________  Wird einmalig beim start geladen  ______________________________
const initGame = (callback) => {
  const runGameAfterLoadKey = (runFrom) => {
    //console.log('gameKeyPublic:', gameKeyPublic, runFrom);
    callback();
  }
  
  //ist ein lokaler key vorhanden?
  var localKey = loadData('gameKey');
  
  // 'get' bevorzugen wenn es übergeben wurde
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('id')) {
    loadJsonFile(urlParams.get('id'), function (data) {
      if (data) {
        //daten gültig 
        gameKeyPublic = urlParams.get('id');
        gameOptionsData = data;
        runGameAfterLoadKey('get');
        //console.log(data);
      }
    }, function (data) {
      if(data){
        //ungültig -> eigenen key laden falls vorhanden
        if(localKey){
          gameKeyPublic = generateChecksum(localKey.hash);
          gameOptionsData = loadData(gameKeyPublic);
          runGameAfterLoadKey('!get -> local');
        }
      }
    });
  }else{
    // eigenen key laden falls vorhanden
    if(localKey){
      gameKeyPublic = generateChecksum(localKey.hash);
      gameOptionsData = loadData(gameKeyPublic);
      runGameAfterLoadKey('local');
    }
  }
}