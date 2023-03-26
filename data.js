
//Generiert eine Zufällige Hash mit 16 Stellen
const generateHash = () => {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var hash = "";
    for (var i = 0; i < 16; i++) {
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
        if(!checksumAttr[count]) checksumAttr[count] = 0;
        checksumAttr[count] += charIndex;
        if(checksumAttr[count] >= chars.length) checksumAttr[count] -= chars.length
        count++
        if(count == outputLenght) count = 0;
      }
    }
    for (var j = 0; j <= outputLenght; j++) {
      checksum += chars.charAt(checksumAttr[j]);
    }
    return checksum;
  }
  
  myHash = generateHash();

  var myChecksum = generateChecksum(myHash);
  console.log(myChecksum);


// AJAX-Anfrage an PHP-Datei, zum speichern einer Json
const saveJsonFile = (data, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "game_saver.php", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
    
    // Antwort der PHP-Datei empfangen
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            //console.log(xhr.responseText);
            callback(xhr.responseText);
        }
    };
}


// Daten, die gesendet werden sollen
let data = {
    filename: myChecksum + "_mapname",
    name: "Max",
    email: "max@example.com",
    message: "Hallo Welt!"
};

saveJsonFile(data, response => {
    console.log(response);
});


// AJAX-Anfrage zum laden einer Json
const loadJsonFile = (filePath, callback) => {
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", "maps/" + filePath + ".json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
};


loadJsonFile("DSJxIDijA_mapname", function(data) {
    console.log(data);
});
