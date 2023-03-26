//_______________________________________  KONSTANTEN / VARIABLEN  _______________________________________
const el = {};
let activeToolName = "cursor";
let eventListenerActiv = true;
let isMouseDown = false;
let localData = [];
let camera = [];
let autosave = [];
autosave.changes = 0;
camera.oldViewportX = 0;
camera.oldViewportY = 0;
camera.viewportX = 0;
camera.viewportY = 0;

let mapSelection = [0, 0, 0]; //Auswählen, Eigenschaften laden und setzen
let blockExtraData = ''; //Kann zusatzdaten in die Blöcke schreiben
let selection = [0, 0];

let map = []; // -> map
let showLayer = [false, true, true, true, true, true, true];

//startwert der optionen
let gameOptions = { "maps":[gameKeyPublic + "_map0"],"mapKey":0,"curMapTab":"maps","curLayer":1 };


//_______________________________________ Lade Editor Inhalt _______________________________________
const editorContent = (editorL, editorM, editorR) => {
   //-------------------------- Linke Seite des Editors -------------------------------
   switch (editorL) {
      case "leer":
         editorContentL();
         break;
      case "maps":
         editorContentL("maps");
         break;
      case "layers":
         editorContentL("layers");
         break;
   }

   //-------------------------- Mitte des Editors -------------------------------
   switch (editorM) {
      case "leer":
         editorContentM();
         break;
      case "cursor":
         editorContentM("cursor");
         break;
      case "brush":
         editorContentM("brush");
         break;
      case "eraser":
         editorContentM("eraser");
         break;
      case "move":
         editorContentM("move");
         break;
         case "getall":
            editorContentM("getall");
            break;
         case "setall":
            editorContentM("setall");
            break;
   }

   //-------------------------- Rechte Seite des Editors -------------------------------
   switch (editorR) {
      case "leer":
         editorContentR();
         break;
      case "block":
         editorContentR("block");
         break;
      case "object":
         editorContentR("object");
         break;
      case "tiles":
         editorContentR("tiles");
         break;
   }

}


//_______________________________________ Init _______________________________________
const init = () => {
   domMapping();
   loadSavedGameData();
   appendEventlisteners();
   
   editorContentL();
   setLayer();

   loadTiles();
}

//startet den Editor nachdem der DOM inhalt fertig geladen wurde
document.addEventListener('DOMContentLoaded', init);