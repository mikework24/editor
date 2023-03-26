//_______________________________________  Event Listeners  _______________________________________
let backToolName = undefined;
const appendEventlisteners = () => {
   //rechklickmenü im Editor unterbinden
   //window.addEventListener('contextmenu', event => event.preventDefault());
   
   window.addEventListener("keydown", event => {
      //event Listener Deaktivieren, in speziellen situationen
      if (!eventListenerActiv) return;

      event.stopPropagation();
      //event.preventDefault(); //deaktiviert eingaben in testfeldern
      if (event.key == '1') editorContentM('cursor');
      if (event.key == '2') editorContentM('brush');
      if (event.key == '3') editorContentM('eraser');
      if (event.key == '4') editorContentM('move');
      if (event.key == '5') editorContentM('getall');
      if (event.key == '6') editorContentM('setall');

      if (event.key == 'z' && event.ctrlKey) autoLoadID(-1);
      if (event.key == 'y' && event.ctrlKey) autoLoadID(1);

      if (event.key == '+') zoomIn();
      if (event.key == '-') zoomOut();
      if (event.altKey) {
         if (activeToolName !== "move") {
            backToolName = activeToolName;
            editorContentM("move");
         }
      }
   }, false);

   window.addEventListener("keyup", event => {
      event.stopPropagation();
      //event.preventDefault();
      
      //event Listener Deaktivieren, in speziellen situationen
      if (!eventListenerActiv) return;

      if (!event.altKey && backToolName !== undefined) {
         editorContentM(backToolName);
         backToolName = undefined;
      }
   }, false);

   window.addEventListener("resize", event => {
      draw();
   }, false);

   //Grid Map (Grafik auswählen und Markierung setzen) im Inspektor
   el.gridContainer.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      selection = getCoords(event, 32, 0, 0, el.gridImage.width, el.gridImage.height);
      el.gridSelection.style.left = (selection[0] * 32 + 3) + "px";
      el.gridSelection.style.top = (selection[1] * 32 + 3) + "px";
      el.gridSelection.style.width = "32px";
      el.gridSelection.style.height = "32px";
      el.gridSelection.style.outline = "3px solid cyan";
      
      //Leert die Blockdaten beim verändern des Blockes
      blockExtraData = '';

      //Laden die Passenden Daten in der Inpektoransicht
      blockOptionen(selection);
   });

   //Objekte Map (Grafik auswählen und Markierung setzen) im Inspektor
   el.objectContainer.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      selection = getCoords(event, 64, 0, 0, el.objectImage.width, el.objectImage.height);
      el.objectSelection.style.left = (selection[0] * 64 + 3) + "px";
      el.objectSelection.style.top = (selection[1] * 64 + 3) + "px";
      el.objectSelection.style.width = "64px";
      el.objectSelection.style.height = "64px";
      el.objectSelection.style.outline = "3px solid cyan";

 
      //event.preventDefault();

      objectOptionen(selection);
   });

   //Tile Map (Grafik auswählen und Markierung setzen) im Inspektor
   el.tilesetContainer.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      selection = getCoords(event, localData.tileZoom, 0, 0, el.tilesetImage.width, el.tilesetImage.height);
      el.tilesetSelection.style.left = (selection[0] * localData.tileZoom + 3) + "px";
      el.tilesetSelection.style.top = (selection[1] * localData.tileZoom + 3) + "px";
      el.tilesetSelection.style.width = localData.tileZoom + "px";
      el.tilesetSelection.style.height = localData.tileZoom + "px";
      el.tilesetSelection.style.outline = "3px solid cyan";
   });

   //Canvas (Maus Funktionen im  Map Editor)
   //rechklickmenü im Canvas unterbinden
   el.canvas.addEventListener('contextmenu', event => event.preventDefault());

   //Mausrad zum Zoomen
   el.canvas.addEventListener('mousewheel', event => {
      if (event.wheelDelta > 0) {
         zoomIn(event);
      } else {
         zoomOut(event);
      }
   });

   el.canvas.addEventListener("mousedown", () => {
      isMouseDown = true;
      //Mittlere Maustaste
      if (event.button == 1) {
         backToolName = activeToolName;
         editorContentM("move");
      }
      //Rechte Maustaste
      if (event.button == 2 && activeToolName == "brush") {
         backToolName = activeToolName;
         editorContentM('eraser');
      }
   });

   el.canvas.addEventListener("mouseup", () => {
      if(isMouseDown) autoSave(); //AutoSave
      isMouseDown = false;

      if (backToolName !== undefined) {
         editorContentM(backToolName);
         backToolName = undefined;
      }

      //aktuallisiert den alten viewport
      camera.oldViewportX = camera.viewportX;
      camera.oldViewportY = camera.viewportY;
   });
   
   el.canvas.addEventListener("mouseleave", () => {
      if(isMouseDown) autoSave(); //AutoSave
      isMouseDown = false;

      if (backToolName !== undefined) {
         editorContentM(backToolName);
         backToolName = undefined;
      }

      //aktuallisiert den alten viewport
      camera.oldViewportX = camera.viewportX;
      camera.oldViewportY = camera.viewportY;
   });
   el.canvas.addEventListener("mousedown", editorTool );
   el.canvas.addEventListener("mousemove", (event) => {
      if (isMouseDown) editorTool(event);
   });

}