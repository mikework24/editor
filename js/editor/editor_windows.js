//_______________________________________  Fenster - Neue Map  _______________________________________
//Fenster - Neue Map öffnen
const createMapWindow = () => {
    el.createMapWindowID.setAttribute("style", "display: block;");
    el.windowBackgroundTint.setAttribute("style", "display: block;");
    
    el.inputMapWidth.value = map[0]['width'];
    el.inputMapHeight.value = map[0]['height'];
    el.inputStylesheetName.value = map[0]['mapTile'];
    el.inputStylesheetWidth.value = map[0]['tileSize'];
    el.inputParalaxName.value = map[0]['backgroundImg'];
 }
 
 //Fenster - Neue Map schließen
 const cancelCreateMap = () => {
    el.createMapWindowID.removeAttribute("style", "display: block;");
    el.windowBackgroundTint.removeAttribute("style", "display: block;");
 }
 
 //Fenster - Neue Map Speichern
 const createMapSave = (saveMapBeforOpen) => {
    if (saveMapBeforOpen) {
       //speichern der aktuellen map bevor eine neue Map erstellt wird
       saveMap();
    }
 
    //neue map erstellen
    if (el.inputMapName.value != '' && el.inputMapWidth.value != '' && el.inputMapHeight.value != '') {
       //Fortlaufende Nummer für die Maps werden direkt in der gameOptions festgehalten.
       gameOptions['mapKey'] = gameOptions['mapKey'] + 1;

       let completeMapKey = gameKeyPublic + "_map" + gameOptions['mapKey'];
       gameOptions['maps'].push(completeMapKey);
       gameOptions['lastMap'] = (completeMapKey);
       saveData(gameKeyPublic, gameOptions);

       //Map wird erstellt
       map = [{ 'width': el.inputMapWidth.value, 'height': el.inputMapHeight.value, 'key':completeMapKey, 'name': el.inputMapName.value,'mapTile': el.inputStylesheetName.value,'tileSize': el.inputStylesheetWidth.value,'backgroundImg': el.inputParalaxName.value }, {}, {}, {}, {}, {}, {}];
       el.showMapName.innerHTML = "Map: " + map[0]['name'];
       cleanCamera();
       loadTiles();
       cancelCreateMap();
       saveMap();
       editorContentL('maps');
    } else {
       alert("Bitte Namen und Gr&ouml;&szlig;e der Map eingeben!");
    }
 }
 

 //_______________________________________  Fenster - Map bearbeiten  _______________________________________
 //Fenster - Map bearbeiten öffnen
 const editMapWindow = () => {
    el.editMapWindowID2.setAttribute("style", "display: block;");
    el.windowBackgroundTint.setAttribute("style", "display: block;");
 
    //werte im Fenster richtig anzeigen
    el.inputMapName2.value = map[0]['name'];
    el.inputMapWidth2.value = map[0]['width'];
    el.inputMapHeight2.value = map[0]['height'];
    el.inputStylesheetName2.value = map[0]['mapTile'];
    el.inputStylesheetWidth2.value = map[0]['tileSize'];

    el.inputParalaxName2.value = map[0]['backgroundImg'];

    console.log(map);
 }
 
 //Fenster - Map bearbeiten schließen
 const cancelEditMap = () => {
    el.editMapWindowID2.removeAttribute("style", "display: block;");
    el.windowBackgroundTint.removeAttribute("style", "display: block;");
 }
 
 //Fenster - Map bearbeiten Speichern
 const editMapSave = () => {
    let mapName = el.inputMapName2.value;
    let mapV = el.inputMapWidth2.value;
    let mapH = el.inputMapHeight2.value;
    let mapStyleWidth = el.inputStylesheetWidth2.value;

    map[0]['mapTile'] = el.inputStylesheetName2.value;
    map[0]['backgroundImg'] = el.inputParalaxName2.value;

   //Abmessungen werden geprüft und geändert
   if (mapStyleWidth > 7 && mapStyleWidth <= 64) {
      map[0]['tileSize'] = mapStyleWidth;
      loadTiles();
   } else {
      alert(`Die Stylesheet aufl&ouml;sung mu&szlig; zwischen 8 und 64 liegen: ${mapStyleWidth}`);
   }

    //Abmessungen werden geprüft und geändert
    if (mapV > 7 && mapV <= 64 && mapH > 7 && mapH <= 64) {
       map[0]['width'] = mapV;
       map[0]['height'] = mapH;
 
       //el.canvas.width = localData.mapZoom * mapV;
       //el.canvas.height = localData.mapZoom * mapH;
       draw();
    } else {
       alert(`Level Gr&ouml;&szlig;e mu&szlig; zwischen 8 und 64 liegen!\nDeine eingabe war: ${mapV} X ${mapH}`);
    }
 
    //Name darf nicht leer sein 
    if (mapName != "") {
       map[0]['name'] = mapName;
       el.showMapName.innerHTML = "Map: " + map[0]['name'];
    } else {
       alert(`Level Name darf nicht leer sein!`);
    }
 
    saveMap();
    //saveData(map[0]['key'], map);
    cancelEditMap();
    editorContentL('maps');
 }


 //_______________________________________  Fenster - Map Löschen  _______________________________________
//Fenster - Map bearbeiten öffnen
 const deleteMapWindow = () => {
    el.deleteMapWindowID.setAttribute("style", "display: block;");
    el.windowBackgroundTint.setAttribute("style", "display: block;");
 }
 
 //Fenster - Map Löschen schließen
 const closeDeleteMap = () => {
    el.deleteMapWindowID.removeAttribute("style", "display: block;");
    el.windowBackgroundTint.removeAttribute("style", "display: block;");
 }
 
 //Fenster - Map Löschen bestätigen
 const deleteMapConfirm = () => {
   //erst löschen wenn bestätigt wurde
   if (gameOptions['maps'].includes(map[0]['key'])) {
      gameOptions['maps'].remove(map[0]['key']);
      saveData(gameKeyPublic, gameOptions);
      deleteData(map[0]['key']);
      setAktivMap(gameOptions['maps'][0]);
   }
   closeDeleteMap();
   editorContentL('maps'); 
 }