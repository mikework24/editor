//_______________________________________  UI - Mitte  _______________________________________

const editorContentM = (tool) => {
   blockExtraData = '';

   if (activeToolName) {
      if (document.querySelector("#btn-editor-" + activeToolName)) {
         document.querySelector("#btn-editor-" + activeToolName).classList.remove("active");
      }
   }
   //Speicherstand abrufen
   if (tool == "init") {
      tool = gameOptions["curTool"];
   } else if (tool != undefined) {
      gameOptions["curTool"] = tool;
      saveData(gameKeyPublic, gameOptions);
   }

   if (tool) {
      document.querySelector("#btn-editor-" + tool).classList.add("active");
      activeToolName = tool;
   } else {
      activeToolName = "";
      el.canvas.style.cursor = "auto";
   }

   switch (tool) {
      case "cursor":
         el.canvas.style.cursor = "crosshair";
         if (mapSelection[2] == 1) { mapSelection = [0, 0, 0]; }
         draw();
         break;
      case "brush":
         el.canvas.style.cursor = "pointer";
         mapSelection = [0, 0, 0];
         draw();
         break;
      case "eraser":
         el.canvas.style.cursor = "pointer";
         mapSelection = [0, 0, 0];
         draw();
         break;
      case "move":
         el.canvas.style.cursor = "move";
         mapSelection = [0, 0, 0];
         draw();
         break;
      case "getall":
         el.canvas.style.cursor = "crosshair";
         mapSelection = [0, 0, 0];
         draw();
         break;
      case "setall":
         el.canvas.style.cursor = "pointer";
         if (mapSelection[2] == 2) { mapSelection = [0, 0, 0]; }
         draw();
         break;
   }

   //Ladet den Inspektor neu
   editorContentR();
}

//Welche Funktion ist aktuell Aktiv
const editorTool = (event) => {
   if (activeToolName == "cursor") getCursor(event);
   if (activeToolName == "brush") addTile(event);
   if (activeToolName == "eraser") eraserTile(event);
   if (activeToolName == "move") moveTool(event);
   if (activeToolName == "getall") getall(event);
   if (activeToolName == "setall") setall(event);

}

//Zoom Out
const zoomOut = (event) => {
   if (localData.mapZoom > 16) zoomPos(event, -4);
   if (localData.mapZoom > 32) zoomPos(event, -4);
   el.showMapZoom.innerHTML = ~~(100 / localData.tileSize * localData.mapZoom) + "%";
   zoomButtonUi();
   draw();
}

//Zoom In
const zoomIn = (event) => {
   if (localData.mapZoom < map[0]['tileSize']) zoomPos(event, 4);
   if (localData.mapZoom < map[0]['tileSize'] && localData.mapZoom > 32) zoomPos(event, 4);
   el.showMapZoom.innerHTML = ~~(100 / localData.tileSize * localData.mapZoom) + "%";
   zoomButtonUi();
   draw();
}

const zoomButtonUi = () => {
   if (16 >= localData.mapZoom) {
      document.querySelector("#btn-editor-zout").setAttribute("disabled", "disabled");
   } else { document.querySelector("#btn-editor-zout").removeAttribute("disabled"); }

   if (localData.tileSize == localData.mapZoom) {
      document.querySelector("#btn-editor-zin").setAttribute("disabled", "disabled");
   } else { document.querySelector("#btn-editor-zin").removeAttribute("disabled"); }
}

//Berechnet die neue Zoom Position anhand der Maus oder der Bildschirm mitte
const zoomPos = (event, zoomVal) => {
   zoomVal = parseInt(zoomVal);
   if (event) {
      //zoom an der Maus Stelle
      camera.oldViewportX = camera.viewportX = camera.viewportX - Math.floor((event.offsetX - camera.viewportX) / localData.mapZoom * zoomVal);
      camera.oldViewportY = camera.viewportY = camera.viewportY - Math.floor((event.offsetY - camera.viewportY) / localData.mapZoom * zoomVal);
   } else {
      //Zoom durch die Tasten
      camera.oldViewportX = camera.viewportX = camera.viewportX - Math.floor((el.canvas.width / 2 - camera.viewportX) / localData.mapZoom * zoomVal);
      camera.oldViewportY = camera.viewportY = camera.viewportY - Math.floor((el.canvas.height / 2 - camera.viewportY) / localData.mapZoom * zoomVal);
   }
   localData.mapZoom = parseInt(localData.mapZoom + zoomVal);
}

//Inhalt einer Map position wiedergeben im Inspector
getCursor = (event) => {
   let clicked = getCoords(event, localData.mapZoom, camera.viewportX, camera.viewportY, map[0]['width'] * localData.mapZoom, map[0]['height'] * localData.mapZoom);
   if (event.button == 2) {
      mapSelection = [0, 0, 0];
   } else if (event.button == 0 && event.type == "mousedown") {
      if (0 <= clicked[0] && 0 <= clicked[1] && clicked[0] <= map[0]['width'] && clicked[1] <= map[0]['height'] && clicked[0] != null && clicked[1] != null) {
         mapSelection = [clicked[0], clicked[1], 2];
      } else {
         mapSelection = [0, 0, 0];
      }
   }

   let LayerNames = ['', 'Hintergrund (Ebene -2)', 'Hintergrund (Ebene -1)', 'Hintergrund (Ebene 0)', 'Objekte (Ebene 0)', 'Vordergrund (Ebene 1)', 'Block Eigenschaften'];
   let htmlInahlt = "";
   if (mapSelection[2] == 2) {
      htmlInahlt = "<b>Belegte Layer</b><br><br>";
      let key = mapSelection[0] + "-" + mapSelection[1];
      for (let i = 1; i < 7; i++) {
         let getData = map[i][key];
         if (map[i][key] != undefined) {
            htmlInahlt += LayerNames[i] + ": " + getData + "<br>";

            //-------------------------------------------Kann genauer außgebaut werden um eine augewählte Position zu bearbeiten
         }
      }
   }

   el.selectedDescription.innerHTML = htmlInahlt;
   draw();
}


//Fügt auf der Map etwas hinzu (malen)
const addTile = () => {
   let clicked = getCoords(event, localData.mapZoom, camera.viewportX, camera.viewportY, map[0]['width'] * localData.mapZoom, map[0]['height'] * localData.mapZoom);
   let key = clicked[0] + "-" + clicked[1];

   if (0 <= clicked[0] && 0 <= clicked[1] && clicked[0] <= map[0]['width'] && clicked[1] <= map[0]['height'] && clicked[0] != null && clicked[1] != null) {
      if (blockExtraData) map[gameOptions["curLayer"]][key] = [selection[0], selection[1], blockExtraData];
      else map[gameOptions["curLayer"]][key] = [selection[0], selection[1]];

      draw();
   }
}

//entfernt auf der Map (löschen)
const eraserTile = () => {
   let clicked = getCoords(event, localData.mapZoom, camera.viewportX, camera.viewportY, map[0]['width'] * localData.mapZoom, map[0]['height'] * localData.mapZoom);
   let key = clicked[0] + "-" + clicked[1];

   if (0 <= clicked[0] && 0 <= clicked[1] && clicked[0] <= map[0]['width'] && clicked[1] <= map[0]['height'] && clicked[0] != null && clicked[1] != null) {
      delete map[gameOptions['curLayer']][key];
      draw();
   }
}

//Map verschieben mit dem move Tool
const moveTool = (event) => {
   const { x, y } = event.target.getBoundingClientRect();
   const mouseX = ~~(event.clientX - x);
   const mouseY = ~~(event.clientY - y);
   if (event.type == "mousedown") {
      camera.startPointX = mouseX;
      camera.startPointY = mouseY;
   }

   if (event.type == "mousemove") {
      camera.movePointX = mouseX;
      camera.movePointY = mouseY;

      camera.viewportX = camera.oldViewportX + ~(camera.startPointX - camera.movePointX);
      camera.viewportY = camera.oldViewportY + ~(camera.startPointY - camera.movePointY);
      draw();
   }
}

//Ladet alle eigenschaften von einem feld
const getall = (event) => {
   let clicked = getCoords(event, localData.mapZoom, camera.viewportX, camera.viewportY, map[0]['width'] * localData.mapZoom, map[0]['height'] * localData.mapZoom);
   if (event.button == 2) {
      mapSelection = [0, 0, 0];
   } else if (event.button == 0 && event.type == "mousedown") {
      if (0 <= clicked[0] && 0 <= clicked[1] && clicked[0] <= map[0]['width'] && clicked[1] <= map[0]['height'] && clicked[0] != null && clicked[1] != null) {
         mapSelection = [clicked[0], clicked[1], 1];
         editorContentM('setall');
      } else {
         mapSelection = [0, 0, 0];
      }
   }
   draw();

}

//Fügt auf der ausgewählten stelle alle Eigenschaften ein, welche durch die Pipette geladen wurde!
const setall = () => {
   if (mapSelection[2] == 1) {
      let key = mapSelection[0] + "-" + mapSelection[1];
      for (let i = 1; i < 7; i++) {
         let getData = map[i][key];
         let clicked = getCoords(event, localData.mapZoom, camera.viewportX, camera.viewportY, map[0]['width'] * localData.mapZoom, map[0]['height'] * localData.mapZoom);
         let key2 = clicked[0] + "-" + clicked[1];
         if (map[i][key] != undefined) {
            map[i][key2] = getData;
         } else {
            delete map[i][key2];
         }
      }
      draw();
   }
}


//Kordinaten des Klicks berechnen
const getCoords = (e, s, vpX, vpY, maxWidth, maxHeight) => {
   const { x, y } = e.target.getBoundingClientRect();
   const mouseX = (e.clientX - x - vpX);
   const mouseY = (e.clientY - y - vpY);

   if (mouseX <= maxWidth && mouseY <= maxHeight && mouseX >= 0 && mouseY >= 0) {
      return [Math.floor(mouseX / s), Math.floor(mouseY / s)];
   } else {
      return [null, null];
   }
}


