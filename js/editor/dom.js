'use strict';

const dom = {
    create(content, parent, type, classes, attributes) {
        const newEl = document.createElement(type);
        if (content) newEl.innerHTML = content;
        if (classes) newEl.className = classes;
        if (parent) parent.append(newEl);

        if (attributes) {
            if (attributes.id) newEl.id = attributes.id;
            if (attributes.src) newEl.src = attributes.src;
            if (attributes.align) newEl.align = attributes.align;
            if (attributes.width) newEl.width = attributes.width;
            if (attributes.height) newEl.height = attributes.height;
            if (attributes.type) newEl.type = attributes.type;
            if (attributes.for) newEl.htmlFor = attributes.for;
            //if (attributes.for) newEl.setAttribute('for', attributes.for);
            if (attributes.href) newEl.href = attributes.href;
            if (attributes.value || attributes.value == 0) newEl.value = attributes.value;
            if (attributes.style) newEl.style = attributes.style;
            if (attributes.name) newEl.name = attributes.name;
            if (attributes.rows) newEl.rows = attributes.rows;
            if (attributes.checked) newEl.checked = attributes.checked;
            if (attributes.selected) newEl.selected = attributes.selected;
        }
        return newEl;
    },

    $(selector) {
        return document.querySelector(selector);
    },

    $$(selector) {
        return Array.from(document.querySelectorAll(selector));
    },
} 

//_______________________________________  DOM - Elemente Verbinden  _______________________________________
const domMapping = () => {
    el.runPublicGame = document.querySelector("#publicGame");
    
    //-------------  Linke Seite  ------------
    el.mapTree = document.querySelector(".project-map-tree"); //Maps Verwalten liste
    el.showMapName = document.querySelector("#showMapName"); //Aktueller Map Name wird in layers gezeigt
    el.showChanges = document.querySelector("#showChanges"); //Aktueller Map Name wird in layers gezeigt

    //-------------     Mitte     -------------
    el.runMapLink = document.querySelector("#runMap");
    el.showMapZoom = document.querySelector("#showMapZoom");
    el.editorBorder = document.querySelector(".editor-border"); //Map Editor border
    el.canvas = document.querySelector("canvas"); //Map Editor

    //-------------  Rechte Seite  ------------

    //Map Auswahl
    el.selectedDescription = document.querySelector("#selected-description");

    //Map Grafik
    el.showTileZoom = document.querySelector("#showTileZoom");
    el.tilesetContainer = document.querySelector(".tileset-container"); //Tile Grafiken Container der Map
    el.tilesetImage = document.querySelector("#tileset-source"); //Tile Grafiken der Map
    el.tilesetSelection = document.querySelector(".tileset-container_selection");  //Ausgewähle Grafik

    //Map Block
    el.gridContainer = document.querySelector(".grid-container"); //Tile Block Container der Map
    el.gridImage = document.querySelector("#grid-source"); //Tile Block der Map
    el.gridSelection = document.querySelector(".grid-container_selection");  //Ausgewähler Block
    el.gridDescription = document.querySelector("#grid-description");  //Ausgewähle Block

    //Map Objekte
    el.objectContainer = document.querySelector(".object-container"); //Objekt Grafiken Container der Map
    el.objectImage = document.querySelector("#object-source"); //Objekt Grafiken der Map
    el.objectSelection = document.querySelector(".object-container_selection");  //Ausgewähle Grafik
    el.objectDescription = document.querySelector("#object-description");  //Ausgewähle Grafik
    
    //------------  Für alle Fenster  ----------
    el.windowBackgroundTint = document.querySelector(".window-tint"); //Grauer Overlay
 
    //------------  Fenster - Neue Map  ----------
    el.createMapWindowID = document.querySelector("#create-map-window");
    el.inputMapName = document.querySelector("#input-map-name");
    el.inputMapWidth = document.querySelector("#input-map-width");
    el.inputMapHeight = document.querySelector("#input-map-height");
    el.inputStylesheetName = document.querySelector("#input-stylesheet-name");
    el.inputStylesheetWidth = document.querySelector("#input-stylesheet-width");
    el.inputParalaxName = document.querySelector("#input-paralax-name");
 
    //------------  Fenster - Map bearbeiten  ----------
    el.editMapWindowID2 = document.querySelector("#edit-map-window");
    el.inputMapName2 = document.querySelector("#input-map-name2");
    el.inputMapWidth2 = document.querySelector("#input-map-width2");
    el.inputMapHeight2 = document.querySelector("#input-map-height2");
    el.inputStylesheetName2 = document.querySelector("#input-stylesheet-name2");
    el.inputStylesheetWidth2 = document.querySelector("#input-stylesheet-width2");
    el.inputParalaxName2 = document.querySelector("#input-paralax-name2");

    //------------  Fenster - Map löschen  ----------
    el.deleteMapWindowID = document.querySelector("#delete-map-window");
 }