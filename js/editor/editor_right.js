//_______________________________________  UI - Rechte Seite  _______________________________________
//-------------------------- Rechte Seite des Editors -------------------------------
const editorContentR = (tool) => {
   const allDiv = document.querySelectorAll("#inspector > div");
   for (let allDivdata of allDiv) { allDivdata.classList.add("displayNone"); }

   //Map Layers
   if (gameOptions["curMapTab"] == 'layers') {

      //Auswahl Eigenschaften
      if (gameOptions["curTool"] == "cursor") {
         document.querySelector("#insp-selected").classList.remove("displayNone");
      }

      //Grafische oberfläche
      const brushLayers = [1, 2, 3, 5];
      if (gameOptions["curTool"] == "brush" && brushLayers.includes(gameOptions["curLayer"])) {
         document.querySelector("#insp-tiles").classList.remove("displayNone");
      }

      //Block Eigenschaften
      if (gameOptions["curTool"] == "brush" && gameOptions["curLayer"] == 6) {
         document.querySelector("#insp-block").classList.remove("displayNone");
      }

      //Objekte
      if (gameOptions["curTool"] == "brush" && gameOptions["curLayer"] == 4) {
         document.querySelector("#insp-object").classList.remove("displayNone");
      }
   }
}

//_____________________________________________________ Objekt Auswahl Optionen __________________________________________________
const objectOptionen = (selection) => {
   //tastenkürzel deaktivieren
   eventListenerActiv = false;

   //vordefinierte namen für die demo
   const objectNames = ["Player", "20 Energie", "1 Leben", "Diamant", "Stern", "Schl&uuml;ssel", "Truhe", "Offene Truhe", "Schutzschild"];

   //Id des Objektes
   let objectID = (selection[1] * 3) + selection[0];

   if (objectID == 0) {// Player
      el.objectDescription.innerHTML = "Player<br><br>";

   } else { //Objekt
      //Leert das Dom
      el.objectDescription.innerHTML = null;
      
      // Den objekt eintrag setzen, wenn noch nicht vorhanden
      if (!map[0].hasOwnProperty('objects')) map[0]['objects'] = {};
      if (!map[0]['objects'].hasOwnProperty(objectID)) map[0]['objects'][objectID] = {};
      if (!map[0]['objects'][objectID].hasOwnProperty('name')) map[0]['objects'][objectID]['name'] = objectNames[objectID];

      //Setzt den Objektnamen
      dom.create('Objektname: ', el.objectDescription, 'label', false, { for: "objectName" });
      el.objectName = dom.create(false, el.objectDescription, 'input', false, { id: "objectName", value: map[0]['objects'][objectID]['name'] });
      el.objectName.addEventListener("change", (event) => {
         map[0]['objects'][objectID]['name'] = el.objectName.value;
         autoSave();
         //blockExtraData = el.selMap.value;
      });

      dom.create(false, el.objectDescription, 'br', false);
      dom.create(false, el.objectDescription, 'br', false);

      //Objekt kann eingesammelt werden
      el.objectTake = dom.create(false, el.objectDescription, 'input', false, { id: "objectTake", type: "checkbox", checked: map[0]['objects'][objectID]['take'] });
      dom.create('Kann gesammelt werden.', el.objectDescription, 'label', false, { for: "objectTake" });
      el.objectTake.addEventListener("change", (event) => {
         map[0]['objects'][objectID]['take'] = el.objectTake.checked;
         autoSave();
         //blockExtraData = el.selMap.value;
      });

      dom.create(false, el.objectDescription, 'br', false);

      //Objekt bleibt im Inventar
      el.objectBag = dom.create(false, el.objectDescription, 'input', false, { id: "objectBag", type: "checkbox", checked: map[0]['objects'][objectID]['bag'] });
      dom.create('Bleibt im Inventar.', el.objectDescription, 'label', false, { for: "objectBag" });
      el.objectBag.addEventListener("change", (event) => {
         map[0]['objects'][objectID]['bag'] = el.objectBag.checked;
         autoSave();
         //blockExtraData = el.selMap.value;
      });

      dom.create(false, el.objectDescription, 'br', false);
      dom.create(false, el.objectDescription, 'br', false);

      //Leben
      dom.create('Leben: ', el.objectDescription, 'label', false, { for: "objectLife" });
      el.objectLife = dom.create(false, el.objectDescription, 'input', false, { id: "objectLife", type: "number", value: map[0]['objects'][objectID]['life'] });
      el.objectLife.addEventListener("change", (event) => {
         map[0]['objects'][objectID]['life'] = el.objectLife.value;
         autoSave();
         //blockExtraData = el.selMap.value;
      });

      dom.create(false, el.objectDescription, 'br', false);
      dom.create(false, el.objectDescription, 'br', false);

      //Energie
      dom.create('Energie: ', el.objectDescription, 'label', false, { for: "objectEngergy" });
      el.objectEngergy = dom.create(false, el.objectDescription, 'input', false, { id: "objectEngergy", type: "number", value: map[0]['objects'][objectID]['energy'] });
      el.objectEngergy.addEventListener("change", (event) => {
         map[0]['objects'][objectID]['energy'] = el.objectEngergy.value;
         autoSave();
         //blockExtraData = el.selMap.value;
      });

      dom.create(false, el.objectDescription, 'br', false);
      dom.create(false, el.objectDescription, 'br', false);

      //Punkte
      dom.create('Punkte: ', el.objectDescription, 'label', false, { for: "objectPoints" });
      el.objectPoints = dom.create(false, el.objectDescription, 'input', false, { id: "objectPoints", type: "number", value: map[0]['objects'][objectID]['points'] });
      el.objectPoints.addEventListener("change", (event) => {
         map[0]['objects'][objectID]['points'] = el.objectPoints.value;
         autoSave();
         //blockExtraData = el.selMap.value;
      });

      dom.create(false, el.objectDescription, 'br', false);
      dom.create(false, el.objectDescription, 'br', false);

      //Objekt benötigt
      dom.create('Objekt ben&ouml;tigt: ', el.objectDescription, 'label', false, { for: 'objectKey' });
      el.objectKey = dom.create("Objekt w&auml;hlen", el.objectDescription, 'select', false, { value: 0 });
      dom.create('Objekt w&auml;hlen', el.objectKey, 'option', false, { value: 0 });
      let listObject = map[0]['objects'];
      for (let key in listObject) {
         if (listObject[key]['name'] && key > 0 && objectID != key) dom.create(listObject[key]['name'], el.objectKey, 'option', false, { value: key, selected: map[0]['objects'][objectID]['key'] == key });
      }
      el.objectKey.addEventListener("change", (event) => {
         map[0]['objects'][objectID]['key'] = el.objectKey.value;
         autoSave();
         //blockExtraData = el.selMap.value;
      });

      dom.create(false, el.objectDescription, 'br', false);
      dom.create(false, el.objectDescription, 'br', false);

      //Objekt Tauschen
      dom.create('Objekt &auml;ndern in: ', el.objectDescription, 'label', false, { for: 'objectChange' });
      el.objectChange = dom.create("Objekt w&auml;hlen", el.objectDescription, 'select', false, { id: 'objectChange', value: 0 });
      dom.create('Objekt w&auml;hlen', el.objectChange, 'option', false, { value: 0 });
      let listObject2 = map[0]['objects'];
      for (let key in listObject2) {
         if (listObject2[key]['name'] && key > 0 && objectID != key) dom.create(listObject2[key]['name'], el.objectChange, 'option', false, { value: key, selected: map[0]['objects'][objectID]['changeIn'] == key });
      }
      el.objectChange.addEventListener("change", (event) => {
         map[0]['objects'][objectID]['changeIn'] = el.objectChange.value;
         autoSave();
         //blockExtraData = el.selMap.value;
      });

      dom.create(false, el.objectDescription, 'br', false);
      dom.create(false, el.objectDescription, 'br', false);

      //Objekt erhalten
      dom.create('Objekt erhalten: ', el.objectDescription, 'label', false, { for: 'objectGet' });
      el.objectGet = dom.create("Objekt w&auml;hlen", el.objectDescription, 'select', false, { value: 0 });
      dom.create('Objekt w&auml;hlen', el.objectGet, 'option', false, { value: 0 });
      let listObject3 = map[0]['objects'];
      for (let key in listObject3) {
         if (listObject3[key]['name'] && key > 0 && objectID != key) dom.create(listObject3[key]['name'], el.objectGet, 'option', false, { value: key, selected: map[0]['objects'][objectID]['get'] == key });
      }
      el.objectGet.addEventListener("change", (event) => {
         map[0]['objects'][objectID]['get'] = el.objectGet.value;
         autoSave();
         //blockExtraData = el.selMap.value;
      });

   }
}

//_____________________________________________________ Block Auswahl Optionen _____________________________________________________
const blockOptionen = (ausgewaehlterBlock) => {
   eventListenerActiv = false;

   const gridNames = ["Leer", "Solide hoch", "Solide", "Solide runter", "Plattform", "Eigener Code", "Solide hoch", "Solide hoch", "Solide runter", "Solide runter", "Tod", "Map Laden", "Wasser", "Klettern", "Schwerelos", "Umgekehrte Schwerkraft", "Portal Start", "Portal Ziel"];

   let gridID = (ausgewaehlterBlock[1] * 6) + ausgewaehlterBlock[0];
   el.gridDescription.innerHTML = gridNames[gridID] + "<br><br>";


   //------------------ Eigener Code ------------------
   if (gridID == 5) {

      el.customCode = dom.create(false, el.gridDescription, 'textarea', false, { name: "text", rows: "4", style: "width: 100%;" });

      //Eigener Code wird in die blockExtraData
      el.customCode.addEventListener("input", (event) => {
         blockExtraData = el.customCode.value;
         console.log(blockExtraData);
      });
   }

   //----------------- Lade Map ------------------
   if (gridID == 11) {
      //Selectfeld
      el.selMap = dom.create(false, el.gridDescription, 'select', false, { id: "selMap" });

      //Map wählen
      dom.create("Map w&auml;hlen", el.selMap, 'option', false, { value: 0 });

      //Liste der vorhandenen Maps
      let maps = gameOptions['maps'];
      for (const mapList of maps) {
         let mapData = loadData(mapList);
         dom.create(mapData[0]['name'], el.selMap, 'option', false, { value: mapList });
      }

      //Map wird in blockExtraData hinterlegt und beim Malen in das element gespeichert
      el.selMap.addEventListener("change", (event) => {
         blockExtraData = el.selMap.value;
      });
   }

   //----------------- Portale -----------------------------------------------------------------------------------------------------------
   if (gridID == 16) {
      //Selectfeld
      el.selPort = dom.create(false, el.gridDescription, 'select', false, { id: "selPort" });

      //Map wählen
      dom.create("Portal Ziel", el.selPort, 'option', false, { value: 0 });

      //Liste der vorhandenen Portal Ziele
      let mapBlock = map[6];
      Object.entries(mapBlock).forEach(([key, value]) => {
         if(value.length > 2){
            //Portal Ziele Filtern
            if(value[0] == 5 && value[1] == 2 ) {
               dom.create(value[2], el.selPort, 'option', false, { value: key });
               console.log(value[2]) ;
            } 
         }
      })

      //Map wird in blockExtraData hinterlegt und beim Malen in das element gespeichert
      el.selPort.addEventListener("change", (event) => {
         blockExtraData = el.selPort.value;
      });
   }
   //----------------- Portal Ziel ------------------
   if (gridID == 17) {
      //Portal Ziel Name
      el.targetPort = dom.create(false, el.gridDescription, 'input', false, { });

      //Eigener Code wird in die blockExtraData
      el.targetPort.addEventListener("input", (event) => {
         blockExtraData = el.targetPort.value;
      });
   }
}

//_______________________________________  Zeichnen - Brush  _______________________________________
//Zoom Out
const zoomTileOut = () => {
   if (localData.tileZoom > 16) localData.tileZoom = localData.tileZoom - 4;
   if (localData.tileZoom > 32) localData.tileZoom = localData.tileZoom - 4;
   zoomTileChange();
}

//Zoom In
const zoomTileIn = () => {
   if (localData.tileZoom < map[0]['tileSize']) localData.tileZoom = localData.tileZoom + 4;
   if (localData.tileZoom < map[0]['tileSize'] && localData.tileZoom > 32) localData.tileZoom = localData.tileZoom + 4;
   zoomTileChange();
}

//Berechnet die Tile Grafik neu
const zoomTileChange = () => {
   el.tilesetImage.width = el.tilesetImage.naturalWidth / localData.tileSize * localData.tileZoom;
   el.tilesetImage.height = el.tilesetImage.naturalHeight / localData.tileSize * localData.tileZoom;

   el.showTileZoom.innerHTML = ~~(100 / localData.tileSize * localData.tileZoom) + "%";

   el.tilesetSelection.style.left = (selection[0] * localData.tileZoom + 3) + "px";
   el.tilesetSelection.style.top = (selection[1] * localData.tileZoom + 3) + "px";
   el.tilesetSelection.style.width = localData.tileZoom + "px";
   el.tilesetSelection.style.height = localData.tileZoom + "px";
}

//Bildmaterial Laden (und Map Zeichnen)
const loadTiles = () => {
   try {
      el.gridImage.src = "./img/grid_type.png";
      el.objectImage.src = "./img/objects.png";
      el.tilesetImage.src = map[0]['mapTile'];
      el.tilesetImage.addEventListener("error", (ev) => {
         el.tilesetImage.src = "./img/demo_tiles.png";
         alert('Die in der Map angegebene Grafik wurde nicht gefunden: "' + map[0]['mapTile'] + '"');
      });
   } catch (error) {
      el.tilesetImage.src = "./img/demo_tiles.png";
   }

   localData.tileSize = map[0]['tileSize'];
   if (localData.mapZoom == undefined) localData.mapZoom = map[0]['tileSize'];
   localData.tileZoom = map[0]['tileSize'];

   //Malt die Grafik erneut nachdem die bilddaten geladen wurden
   el.tilesetImage.onload = function () {
      el.tilesetImage.width = el.tilesetImage.naturalWidth;
      el.tilesetImage.height = el.tilesetImage.naturalHeight;

      //Berechnet den Zoom Faktor für die Rechte Seitenleiste
      let maxDisplayTileWidth = 196;
      while (el.tilesetImage.width > maxDisplayTileWidth) {
         //Zoom Out
         if (localData.tileZoom > 16) localData.tileZoom = localData.tileZoom - 4;
         if (localData.tileZoom > 32) localData.tileZoom = localData.tileZoom - 4;
         el.tilesetImage.width = el.tilesetImage.naturalWidth / localData.tileSize * localData.tileZoom;
         el.tilesetImage.height = el.tilesetImage.naturalHeight / localData.tileSize * localData.tileZoom;
      }
      zoomTileChange();

      draw();
   }
}
