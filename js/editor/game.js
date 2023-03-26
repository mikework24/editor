//_______________________________________  KONSTANTEN / VARIABLEN  _______________________________________
let gameData = [];

const getallIcon = new Image();
getallIcon.src = "./img/getall.png";

const emptyGridImage = new Image();
emptyGridImage.src = "./img/grid.png";

const selectedImage = new Image();
selectedImage.src = "./img/selected.png";

const paralaxBg = new Image();

//Prüft den vorhandenen gameKey ansonsten wird ein neuer erstellt
let gameKey = loadData('gameKey');
let gameKeyPublic = '';

if (gameKey) {
   //vorhandener Public Key wird geladen um die weiteren daten laden zu können
   gameKeyPublic = generateChecksum(gameKey.hash);
} else {
   //neuer GameKey Wird erstellt
   gameKey = { 'hash': generateHash() };
   gameKeyPublic = generateChecksum(gameKey.hash);
   saveData('gameKey', gameKey);
}

//console.log(gameKey);
//console.log(gameKeyPublic);

//_______________________________________  Map Laden  _______________________________________
//Map auslesen und Zeichnen
const draw = () => {
   el.canvas.width = el.editorBorder.offsetWidth;
   el.canvas.height = el.editorBorder.offsetHeight;

   if (!localData.mapZoom) { localData.mapZoom = 64; }

   let ctx = el.canvas.getContext("2d");
   //Canvas Leeren
   ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);

   //Paralax Hintergrund
   ctx.save();
   ctx.translate(camera.viewportX, camera.viewportY);
   let zoomBG = 1.5 / Number(map[0]['tileSize']) * localData.mapZoom;
   ctx.scale(zoomBG, zoomBG);
   //ctx.translate(-this.player.loc.x/5, -this.player.loc.y/5);
   paralaxBg.src = map[0]['backgroundImg'];
   const pattern = ctx.createPattern(paralaxBg, "repeat");
   ctx.fillStyle = pattern;
   ctx.fillRect(0, 0, localData.mapZoom * Number(map[0]['width']) / zoomBG, localData.mapZoom * Number(map[0]['height']) / zoomBG );
   ctx.restore();

   //Raster setzen in Canvas Editor
   drowcontent = emptyGridImage;
   drowcontentSize = 64;
   for (let x = 0; x < map[0]['width']; x++) {
      for (let y = 0; y < map[0]['height']; y++) {
         ctx.drawImage(
            drowcontent, 0, 0, 64, 64,
            x * localData.mapZoom + camera.viewportX,
            y * localData.mapZoom + camera.viewportY,
            localData.mapZoom,
            localData.mapZoom
         );
      }
   }


   let layerID = 0;
   map.forEach((layer) => {
      //Layer werden auf sichtbarkeit geprüft
      if (showLayer[layerID] && layerID != 0) {
         Object.keys(layer).forEach((key) => {
            let positionX = Number(key.split("-")[0]);
            let positionY = Number(key.split("-")[1]);
            let [tilesheetX, tilesheetY] = layer[key];

            //Standardwert setzen
            let drowcontent = el.tilesetImage;
            let drowcontentSize = localData.tileSize;

            //Layer 6 -> Grid Grafik
            if (layerID == 6) {
               drowcontent = el.gridImage;
               drowcontentSize = 32;
            }

            //Layer 4 -> Spielobjekte
            if (layerID == 4) {
               drowcontent = el.objectImage;
               drowcontentSize = 64;
            }

            //Inhalt Zeichnen
            ctx.drawImage(
               drowcontent,
               tilesheetX * drowcontentSize,
               tilesheetY * drowcontentSize,
               drowcontentSize,
               drowcontentSize,
               positionX * localData.mapZoom + camera.viewportX, //viewport wird einbezogen
               positionY * localData.mapZoom + camera.viewportY, //viewport wird einbezogen
               localData.mapZoom,
               localData.mapZoom
            );
         });
      }

      //Layer durchzählen
      layerID++

   });

   //Editor Daten
   let gameEditor = true;
   if (gameEditor) {
      if (mapSelection[2] == 1 || mapSelection[2] == 2) {
         let drowcontentSize = 64;
         let tilesheetX = 0;
         let tilesheetY = 0;

         let positionX = mapSelection[0];
         let positionY = mapSelection[1];
         //zeichnen
         ctx.drawImage(
            mapSelection[2] == 1 ? getallIcon : selectedImage,
            tilesheetX * drowcontentSize,
            tilesheetY * drowcontentSize,
            drowcontentSize,
            drowcontentSize,
            positionX * localData.mapZoom + camera.viewportX, //viewport wird einbezogen
            positionY * localData.mapZoom + camera.viewportY, //viewport wird einbezogen
            localData.mapZoom,
            localData.mapZoom
         );
      }
   }
}
