//_______________________________________  UI - Linke Seite  _______________________________________
//--------------  Tabs verwalten  -------------
const editorContentL = (tool) => {
   if (tool) {
      gameOptions["curMapTab"] = tool;
      saveData(gameKeyPublic, gameOptions);
   } else {
      tool = gameOptions["curMapTab"];
   }

   switch (tool) {
      case "maps":
         eventListenerActiv = false;
         loadMapsTabContent();
         document.querySelector("#mapsTab").classList.add("active");
         document.querySelector("#mapVerwaltenTab").classList.remove("displayNone");
         document.querySelector("#layersTab").classList.remove("active");
         document.querySelector("#mapLayersTab").classList.add("displayNone");

         break;
      case "layers":
         eventListenerActiv = true;
         if (gameOptions["curTool"]) editorContentM(gameOptions["curTool"]);
         el.showMapName.innerHTML = "Map: " + map[0]['name'];
         document.querySelector("#mapsTab").classList.remove("active");
         document.querySelector("#mapVerwaltenTab").classList.add("displayNone");
         document.querySelector("#layersTab").classList.add("active");
         document.querySelector("#mapLayersTab").classList.remove("displayNone");
         break;
   }
}

//--------------  Maps Verwalten Tab  -------------

//------------------------------ Maps und Button auflisten -------------------------
const loadMapsTabContent = (tool) => {
   if (el.mapTree) {
      el.mapTree.innerHTML = "";
   }

   let maps = gameOptions['maps'];
   let mapName = null;
   let mapID = 0;

   if (maps.length == 0) {
      //Buttons off
      document.querySelector("#btn-map-remove").setAttribute("disabled", "disabled");
      document.querySelector("#btn-map-duplicate").setAttribute("disabled", "disabled");
      document.querySelector("#btn-map-up").setAttribute("disabled", "disabled");
      document.querySelector("#btn-map-down").setAttribute("disabled", "disabled");
      document.querySelector("#btn-map-settings").setAttribute("disabled", "disabled");
   } else {
      //buttons on
      document.querySelector("#btn-map-remove").removeAttribute("disabled");
      document.querySelector("#btn-map-duplicate").removeAttribute("disabled");
   }

   for (let mapOfMaps of maps) {
      if (loadData(mapOfMaps)) {
         mapName = loadData(mapOfMaps);
         addMapElement(mapOfMaps, mapName[0]['name'], map[0]['key'] == mapOfMaps ? 'selected' : '')

         //Aktive Map Buttons
         if (mapOfMaps == map[0]['key'] && tool == undefined || mapOfMaps == tool) {
            //Button Up
            if (mapID == 0) {
               document.querySelector("#btn-map-up").setAttribute("disabled", "disabled");
            } else { document.querySelector("#btn-map-up").removeAttribute("disabled"); }
            //Button Down
            if (mapID == mapOfMaps.length - 1) {
               document.querySelector("#btn-map-down").setAttribute("disabled", "disabled");
            } else { document.querySelector("#btn-map-down").removeAttribute("disabled"); }

         }
         mapID++;
      }
   }
}


//Maps Verwalten Tab - Elemente hinzufügen
const addMapElement = (mapKey, mapName, selected) => {
   var parent = el.mapTree;

   const type = 'map';
   let layerElementWrapper = document.createElement("li");
   layerElementWrapper.classList.add(type);
   layerElementWrapper.setAttribute("mapnamelist", mapKey);
   layerElementWrapper.setAttribute("onclick", `setAktivMap('${mapKey}')`);

   let itemNameElement = document.createElement("div");
   itemNameElement.classList.add("item-name");
   itemNameElement.classList.add(type);
   if (selected) { itemNameElement.classList.add(selected); }
   itemNameElement.innerHTML = mapName;
   layerElementWrapper.appendChild(itemNameElement);

   parent.appendChild(layerElementWrapper);
}


//wird beim wechel von Maps aufgerufen
const setAktivMap = (selectedMap) => {
   loadMapsTabContent(selectedMap);
   //Map wird ausgewählt - bei Doppelklick wird sofort die Layer Seite geladen
   if (gameOptions['lastMap'] == selectedMap) {
      //wenn die zeit unter 500ms ist -> Doppelklick
      if (Date.now() - localData.lastClick < 500) {
         editorContentL('layers');
      }
      localData.lastClick = Date.now();
   } else {
      loadMap(selectedMap);

      el.runMapLink.href = "./game.html?id=" + gameKeyPublic + "&map=" + selectedMap;

      //Speichert welche Map zuletzt geöffnet wurde
      gameOptions['lastMap'] = selectedMap;
      saveData(gameKeyPublic, gameOptions);
      localData.lastClick = Date.now();
   }
}


//Layer wird festgelegt
const setLayer = (newLayer) => {
   if (newLayer) {
      gameOptions["curLayer"] = newLayer;
      saveData(gameKeyPublic, gameOptions);
   }

   let oldActiveLayer = document.querySelector(".layer.selected");
   if (oldActiveLayer) {
      oldActiveLayer.classList.remove("selected");
   }
   //document.querySelector(`[tile-layer="${gameOptions["curLayer"]}"]`).firstChild.classList.add("selected");
   //document.querySelector(`[tile-layer="${gameOptions["curLayer"]}"] div`).classList.add("selected");
   document.querySelector(`[tile-layer="${gameOptions["curLayer"]}"]`).firstElementChild.classList.add("selected");
   //ladet den inhalt des Inspektors neu
   editorContentR();
}


//Sichtbarkeit der einzelnen Layer im Editor ändern
const showLayerChange = (show_Layer_Change) => {
   showLayer[show_Layer_Change] = !showLayer[show_Layer_Change];
   draw();

   if (showLayer[show_Layer_Change]) {
      document.querySelector(`[show-layer="${show_Layer_Change}"]`).classList.remove("not-visible");
      document.querySelector(`[show-layer="${show_Layer_Change}"]`).classList.add("visible");
   } else {
      document.querySelector(`[show-layer="${show_Layer_Change}"]`).classList.remove("visible");
      document.querySelector(`[show-layer="${show_Layer_Change}"]`).classList.add("not-visible");
   }
}