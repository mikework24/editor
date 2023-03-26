const LoadEditorMap = mapData => {
  //Größe wird geladen
  //console.log([...mapData]);
  
  mapData.height = Number(mapData[0]['height']) || 8;
  mapData.width = Number(mapData[0]['width']) || 8;

  //Mapstrucktur wird generiert
  mapData.data = [];
  for (let x = 0; x < mapData.height; x++) {
    if (!mapData.data[x]) mapData.data[x] = [];//Y Arrays generieren
    for (let y = 0; y < mapData.width; y++) {
      mapData.data[x].push({ id: y + '-' + x });//X Objekte generieren
    }
  }

  //Objekteigenschaften werden verarbeitet
  if(mapData[0]['objects']){
    mapData['objects'] = mapData[0]['objects'];
  }else{
    mapData['objects'] = {};
  }

  //Editor Map wird geladen und umgewandelt
  let layerID = 0;
  mapData.forEach((layer) => {
    //Hintergrund von layer 1 bis 3
    if (layerID > 0 && layerID < 4) { //0  4
      Object.keys(layer).forEach((key) => {
        let positionX = Number(key.split("-")[0]);
        let positionY = Number(key.split("-")[1]);
        if (positionX == NaN) console.log(positionX);
        let [tilesheetX, tilesheetY] = layer[key];

        //Tiles Setzen
        if (positionY >= 0 && positionX >= 0) {
          if (!mapData.data[positionY][positionX].grafic) mapData.data[positionY][positionX].grafic = tilesheetX + '-' + tilesheetY;
          else mapData.data[positionY][positionX].grafic += '|' + tilesheetX + '-' + tilesheetY;
        }
      });
    }

    // Layer 4 -> Spielobjekte
    if (layerID == 4) {
      Object.keys(layer).forEach((key) => {
        let positionX = Number(key.split("-")[0]);
        let positionY = Number(key.split("-")[1]);
        let [tilesheetX, tilesheetY] = layer[key];
        let objectID = (tilesheetY * 3) + tilesheetX;

        // Player, Apfel, Herz, Diamant, Stern, Schlüssel, Truhe, Truhe geöffnet, Schild, etz
        if (objectID == 0) mapData[0]['player'] = { x: positionX, y: positionY };
        else {
          //Object
          if (positionY >= 0 && positionX >= 0) {
            mapData.data[positionY][positionX].object = tilesheetX + '-' + tilesheetY;

            //Hüpfen von Objekten die gesammelt werden können
            if([objectID] in mapData['objects']){
              if('take' in  mapData['objects'][objectID]){
                if(mapData['objects'][objectID]['take']){
                  mapData.data[positionY][positionX].objectD = true;
                  mapData.data[positionY][positionX].objectP = Math.random() * 90;
                }
              }
            }
          }
        }
      });
    }

    // Vordergrund durch layer 5
    if (layerID == 5) {
      Object.keys(layer).forEach((key) => {
        let positionX = Number(key.split("-")[0]);
        let positionY = Number(key.split("-")[1]);
        let [tilesheetX, tilesheetY] = layer[key];

        //Vordergrund Tiles Setzen
        if (positionY >= 0 && positionX >= 0) {
          mapData.data[positionY][positionX].graficV = tilesheetX + '-' + tilesheetY;
        }
      });
    }

    // Blockeigenschaften
    if (layerID == 6) {
      Object.keys(layer).forEach((key) => {
        let positionX = Number(key.split("-")[0]);
        let positionY = Number(key.split("-")[1]);

        let [tilesheetX, tilesheetY, myCode] = layer[key];
        let blockID = (tilesheetY * 6) + tilesheetX;

        //Blockeigenschaften
        if (positionY >= 0 && positionX >= 0) {
          mapData.data[positionY][positionX].block = blockID;
        }

        // Neigung des Bodens
        if (blockID == 1) mapData.data[positionY][positionX].height = '0,64';
        if (blockID == 2) mapData.data[positionY][positionX].solid = 1;
        if (blockID == 3) mapData.data[positionY][positionX].height = '64,0';
        if (blockID == 4) mapData.data[positionY][positionX].height = '64,64';

        if (blockID == 6) mapData.data[positionY][positionX].height = '0,32';
        if (blockID == 7) mapData.data[positionY][positionX].height = '32,64';
        if (blockID == 8) mapData.data[positionY][positionX].height = '64,32';
        if (blockID == 9) mapData.data[positionY][positionX].height = '32,0';

        // eigener code
        if (blockID == 5 && myCode) {
          myCode.split(";").forEach((eintag) => {
            if (eintag != '') {
              mapData.data[positionY][positionX][eintag.split(":")[0]] = eintag.slice(eintag.split(":")[0].length + 1);
              console.log(eintag.slice(eintag.split(":")[0].length + 1));
            }
          });
        }

        // death
        if (blockID == 10) mapData.data[positionY][positionX].script = 'death';

        //Level Laden
        if (blockID == 11 && myCode != undefined) mapData.data[positionY][positionX].loadMap = myCode;

        // wasser
        if (blockID == 12) {
          mapData.data[positionY][positionX].friction = { x: 0.9, y: 0.9 };
          mapData.data[positionY][positionX].gravity = { x: 0, y: 0.1 };
          mapData.data[positionY][positionX].jump = 1;
        }

        // jump
        if (blockID == 13) mapData.data[positionY][positionX].jump = 1;

        //schwerelos
        if (blockID == 14) mapData.data[positionY][positionX].gravity = { x: 0, y: 0 };

        //negative schwerkraft
        if (blockID == 15) mapData.data[positionY][positionX].gravity = { x: 0, y: -0.3 };

        // Start Portal
        if (blockID == 16 && myCode != undefined) {
          let portDesX = Number(myCode.split("-")[0]);
          let portDesY = Number(myCode.split("-")[1]);
          mapData.data[positionY][positionX].portalDes = { x: portDesX * mapData[0]['tileSize'], y: portDesY * mapData[0]['tileSize'] };
        }

        //________________________________Neue BlockID hier____________________________________
      });
    }
    layerID++
  });

  mapData.background = mapData[0]['background'] || "#87E0FE";
  mapData.backgroundI = mapData[0]['backgroundImg'] || "./img/backgroundImg.jpg";
  mapData.backgroundParalax = mapData[0]['backgroundParalax'] || true;

  mapData.mapName = mapData[0]['key'] || "map";
  mapData.styleSheet = mapData[0]['mapTile'] || "./img/demo_tiles.png";
  mapData.objectSheet = mapData[0]['objectTile'] || "./img/objects.png";

  mapData.tile_size = Number(mapData[0]['tileSize']) || 64;
  mapData.width_p = Number(mapData[0]['width']) * mapData.tile_size || 1000;
  mapData.height_p = Number(mapData[0]['height']) * mapData.tile_size || 1000;

  mapData.player = mapData[0]['player'] || { x: 2, y: 3 };
  mapData.gravity = mapData[0]['gravity'] || { x: 0, y: 0.3 };
  mapData.vel_limit = mapData[0]['vel_limit'] || { x: 5, y: 18 };
  mapData.movement_speed = mapData[0]['movement_speed'] || { jump: 11.4, left: 0.5, right: 0.5 };

  mapData.script = mapData[0]['script'] || {
    next_level: 'game.load_map(map);',
    death: 'game.player.health = 0;',
    unlock: 'game.current_map.keys[20].solid = 0;game.current_map.keys[20].farbe = "#87E0FE";',
    grav0: 'mapData.gravity:{ x: 0, y: 0.3 };'
  };

  //Unnötigen Inhalt aus dem Editor entfernen
  for (let x = 0; x < 7; x++) {
    mapData.shift();
  }

  return Object.assign({}, mapData);
}
