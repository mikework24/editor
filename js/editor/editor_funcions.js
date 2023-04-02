//_______________________________________  Funktionen  _______________________________________

//__________________________________  Arrays  ___________________________________
// Fügt einem Array die funktion remove hinzu
Array.prototype.remove = function (value) {
   this.splice(this.indexOf(value), 1);
}

// Ineinem Array die positionen anhand des index verschieben
Array.prototype.move = function (fromIndex, toIndex) {
   var element = this[fromIndex];
   this.splice(fromIndex, 1);
   this.splice(toIndex, 0, element);
}


//______________________________  Erstellt die Hash und den prüfwert für jeden nutzer  ______________________________
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


//______________________________     Load & Save Json data       ______________________________
// AJAX-Anfrage an PHP-Datei, zum speichern einer Json
const saveJsonFile = (filename, data, callback) => {
   let xhr = new XMLHttpRequest();
   xhr.open("POST", "game_saver.php?file=" + filename, true);
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



//______________________________  Load & Save Local Storage data  ______________________________
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
   
   saveJsonFile(myKey, myData, response => {
      console.log(response);
   });

   //Inhalt wird local gespeichert
   return window.localStorage.setItem(myKey, JSON.stringify(myData));
}

// Lösche daten
const deleteData = (myKey) => {
   return window.localStorage.removeItem(myKey);
}


//______________________________  Save & Load Map  ______________________________
//-------------- Maps Layers Tab -------------
const saveMap = () => {
   //Autosave & Zurück und Vor
   deleteData(map[0]['key'] + '_a'); //Autosave Lehren
   map[0]['autosave'] = 0;
   autosave.changes = 0;
   autoSave();
   document.querySelector("#btn-editor-back").setAttribute("disabled", "disabled");
   document.querySelector("#btn-editor-forth").setAttribute("disabled", "disabled");
   el.showMapName.innerHTML = "Map: " + map[0]['name'];
   el.showChanges.innerHTML = "Gespeichert!";
   saveData(map[0]['key'], map);
}

const loadMap = (loadMapName, loadAutoSave = true) => {
   //Laden einer anderen Map
   if (loadMapName != "" && loadMapName != null) {
      map = loadData(loadMapName);

      //cleanCamera();//----<<

      if (loadAutoSave) autoLoad();

      //----------------------  UI aktuallisieren  ---------------------
      //Map Layers Tab
      el.showMapName.innerHTML = "Map: " + map[0]['name'];
      let oldActiveMap = document.querySelector(".project-map-tree .map.selected");
      if (oldActiveMap) {
         oldActiveMap.classList.remove("selected");
      }
      document.querySelector(`[mapnamelist="${loadMapName}"]`).firstElementChild.classList.add("selected");

      loadTiles();
   } else {
      if (loadAutoSave == false) {
         map = loadData(gameOptions['lastMap'] || gameOptions['maps'][0]); //Laden der letzen Speicherung

         //Autosave & Zurück und Vor
         deleteData(map[0]['key'] + '_a'); //Autosave Lehren
         autoSave();

         //UI aktuallisieren -> vor und zurück aus
         document.querySelector("#btn-editor-back").setAttribute("disabled", "disabled");
         document.querySelector("#btn-editor-forth").setAttribute("disabled", "disabled");
         el.showChanges.innerHTML = "Geladen!";
         map[0]['autosave'] = 0;
         autosave.changes = 0;

         draw();
      }
   }
   el.runMapLink.href = "./game.html?id=" + gameKeyPublic + "&map=" + loadMapName;

   
   paralaxBg.onload = function () {
      draw();
   }
}

//______________________________  Autosave Map  ______________________________
// Autosave Abrufen nach ID
const autoLoadID = (loadID) => {
   //zurück
   if (loadID > 0) localData.autoSaveID--;
   //vor
   if (loadID < 0) localData.autoSaveID++

   if (localData.autoSaveID < 0) localData.autoSaveID = 0;
   autoLoad(localData.autoSaveID);
}


// Auosave Laden
const autoLoad = (autosavePos = 0) => {
   let autoLoaded = loadData(map[0]['key'] + '_a');
   if (autoLoaded) {
      if (autoLoaded.length <= autosavePos) autosavePos = autoLoaded.length - 1;
      if (autosavePos < 0) autosavePos = 0;
      localData.autoSaveID = autosavePos;

      //UI Buttons Aktuallisieren
      document.querySelector("#btn-editor-back").removeAttribute("disabled");
      document.querySelector("#btn-editor-forth").removeAttribute("disabled");

      if (autoLoaded.length - 1 == localData.autoSaveID) {
         document.querySelector("#btn-editor-back").setAttribute("disabled", "disabled");
      }
      if (0 == localData.autoSaveID) {
         document.querySelector("#btn-editor-forth").setAttribute("disabled", "disabled");
      }

      map = autoLoaded[autosavePos];
      autosave.changes = map[0]['autosave'];
      el.showChanges.innerHTML = "Ungespeichert: " + autosave.changes;
      draw();
   } else {
      //Keine Autosave vorhanden
      document.querySelector("#btn-editor-back").setAttribute("disabled", "disabled");
      document.querySelector("#btn-editor-forth").setAttribute("disabled", "disabled");
      localData.autoSaveID = 0;
   }
}


// Auosave Speichern
const autoSave = () => {
   let autoLoaded = loadData(map[0]['key'] + '_a');
   let savedData = false;
   if (autoLoaded) {
      //Wurden daten verändert? -> Speichern
      if (JSON.stringify(autoLoaded[0]) != JSON.stringify(map)) {
         //Anzahl der Änderungen werden in der Autosave hinderlegt
         if (map[0]['autosave'] == null) {
            map[0]['autosave'] = autosave.changes;
            autosave.changes = 0;
         }
         else {
            autosave.changes++;
            map[0]['autosave'] = autosave.changes;
         }
         //Die aktuelle Map wird in der Autosave hinterlegt
         autoLoaded.unshift(map);
         //Das Array wird auf maximale speicherungen begrenzt
         if (autoLoaded.length > 5) autoLoaded.pop();
         //Die Daten werden in die Autosave gespeichert
         saveData(map[0]['key'] + '_a', autoLoaded);
         savedData = true;
      }
   } else {
      saveData(map[0]['key'] + '_a', [map]);
      savedData = true;
      autosave.changes = 0;
   }

   //UI Buttons Aktuallisieren
   if (savedData) {
      //if(!autosave.changes) autosave.changes = 0;
      //autosave.changes++;
      el.showChanges.innerHTML = "Ungespeichert: " + autosave.changes;
      document.querySelector("#btn-editor-back").removeAttribute("disabled");
      document.querySelector("#btn-editor-forth").setAttribute("disabled", "disabled");
   }

   localData.autoSaveID = 0;
}


//______________________________  Map Tab Links  ______________________________
//------------------------------ Map Kopieren ------------------------------------

const copyMap = () => {
   //Fortlaufende Nummer für die Maps werden direkt in der gameOptions festgehalten.
   gameOptions['mapKey'] = gameOptions['mapKey'] + 1;
   
   let completeMapKey = gameKeyPublic + "_map" + gameOptions['mapKey'];
   gameOptions['maps'].push(completeMapKey);
   gameOptions['lastMap'] = (completeMapKey);
   saveData(gameKeyPublic, gameOptions);
   
   //Map wird Kopiert
   map[0]['key'] = completeMapKey;
   map[0]['name'] = map[0]['name'] + " Kopie";
   loadTiles();
   saveMap();
   editorContentL('maps');
}


//------------------------------ Map Hoch ------------------------------------
const moveMapUp = () => {
   gameOptions['maps'].move(gameOptions['maps'].indexOf(map[0]['key']), gameOptions['maps'].indexOf(map[0]['key']) - 1);
   saveData(gameKeyPublic, gameOptions);
   editorContentL('maps');
}


//------------------------------ Map Runter ------------------------------------
const moveMapDown = () => {
   gameOptions['maps'].move(gameOptions['maps'].indexOf(map[0]['key']), gameOptions['maps'].indexOf(map[0]['key']) + 1);
   saveData(gameKeyPublic, gameOptions);
   editorContentL('maps');
}


//______________________________  Laden der daten bei Init  ______________________________
// Gespeicherte Daten Laden
const loadSavedGameData = () => {
   //---------- Browser Local Storage Daten laden -------------------
   //gameOptions laden
   let storageGameOptions = loadData(gameKeyPublic);
   if (storageGameOptions) {
      gameOptions = storageGameOptions;
      let getLastMap = gameOptions['lastMap'] || gameOptions['maps'][0];
      let loadMapData = loadData(getLastMap);
      if (loadMapData) {
         map = loadMapData;
         autoLoad();
      } else {
         map = demoMapData;
      }
   } else {
      //Speichert alle daten
      saveData(gameKeyPublic, gameOptions);
      
      map = demoMapData;
      saveMap();
   }

   // Ladet die Play Button Links
   el.runPublicGame.href = "./game.html?id=" + gameKeyPublic;
   el.runMapLink.href = "./game.html?id=" + gameKeyPublic + "&map=" + map[0]['key'];
}



// Viewport wird zurückgesetzt
const cleanCamera = () => {
   camera.startPointX = 0;
   camera.startPointY = 0;
   camera.oldViewportX = 0;
   camera.oldViewportY = 0;
   camera.viewportX = 0;
   camera.viewportY = 0;

   localData.mapZoom = map[0]['tileSize'];
   el.showMapZoom.innerHTML = ~~(100 / localData.tileSize * localData.mapZoom) + "%";
   zoomButtonUi();
   draw();
}



// Bild der Map Exportieren
const exportImage = () => {
   let data = el.canvas.toDataURL();
   let image = new Image();
   image.src = data;

   let w = window.open("");
   w.document.write(image.outerHTML);
}
