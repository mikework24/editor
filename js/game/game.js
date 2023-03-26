let paused = false;
let gameOptionsData = {};

/* Spiel Engine */
const Game = function () {
  this.alert_errors = true;
  this.log_info = true;
  this.tile_size = 64;
  this.tile_move = 0;
  this.tile_move_speed = 0.8;
  this.limit_viewport = true;
  this.jump_switch = 0;
  this.bottomSolid = false;

  this.last_move = new Date();

  this.bgX, this.bgY = 300;

  this.viewport = {
    x: 200,
    y: 200
  };

  this.camera = {
    x: 0,
    y: 0
  };

  this.key = {
    left: false,
    right: false,
    up: false,
    down: false,
    action: false
  };

  this.player = {
    loc: {
      x: 0,
      y: 0,
      ro: 90,
      side: 'r'
    },

    vel: {
      x: 0,
      y: 0
    },

    can_jump: true,

    objects: {},

    life: 3,
    health: 100,
    oxygen: 100,
    points: 0,
    time: 200,
    stern: 0,
    diamant: 0,
    apfel: 0,
    key: 0
  };

  window.onkeydown = this.keydown.bind(this);
  window.onkeyup = this.keyup.bind(this);
};

Game.prototype.error = function (message) {
  if (this.alert_errors) alert(message);
  if (this.log_info) console.log(message);
};

Game.prototype.log = function (message) {
  if (this.log_info) console.log(message);
};

Game.prototype.set_viewport = function (x, y) {
  this.viewport.x = x;
  this.viewport.y = y;
};

Game.prototype.keydown = function (e) {
  var _this = this;
  //console.log(e);
  
  //console.log(e.code);//---------------------------------------------------------------------Tasten
  this.last_move = new Date();

  if (e.code === "KeyP") { paused = !paused; Loop(); } //Startet und Stoppt das Spiel

  if (e.code == 'KeyW' || e.code == "ArrowUp") _this.key.up = true;
  if (e.code == 'KeyS' || e.code == "ArrowDown") _this.key.down = true;
  if (e.code == 'KeyA' || e.code == "ArrowLeft") _this.key.left = true;
  if (e.code == 'KeyD' || e.code == "ArrowRight") _this.key.right = true;

  if (e.code == "Space") _this.key.action = true;
};

Game.prototype.keyup = function (e) {
  var _this = this;
  this.last_move = new Date();

  if (e.code == 'KeyW' || e.code == "ArrowUp") _this.key.up = false;
  if (e.code == 'KeyS' || e.code == "ArrowDown") _this.key.down = false;
  if (e.code == 'KeyA' || e.code == "ArrowLeft") _this.key.left = false;
  if (e.code == 'KeyD' || e.code == "ArrowRight") _this.key.right = false;

  if (e.code == "Space") {
    _this.key.action = false;
    playerAttackReset();
  }
};


//Level wird geladen
Game.prototype.load_map = function (level, callback) {
  let gameOptions = gameOptionsData;
  //Erste Map -> Beim Neustart oder wenn eine Map nicht gefunden wird
  let mapKey = gameOptions['maps'][0];

  loadJsonFile(
    level,
    function (data) {
      if (data) {
        //daten gültig 
        game.convert_map(data);
        callback();
      }
    },
    function (data) {
      if (data) {
        //ungültig -> erste map wird geladen
        loadJsonFile(
          mapKey,
          function (data2) {
            if (data2) {
              //daten gültig 
              game.convert_map(data2);
              callback();
            }
          },
          function (data2) {
            if (data2) {
              //ungültig -> locale map laden
              game.convert_map(loadData(level));
              callback();
              console.log('Map wurde nicht gefunden.');
            }
          });
      }
    });
};


Game.prototype.convert_map = function (nextMap) {
  //karte wird umgewandelt ind das passende format
  let map = LoadEditorMap(nextMap);

  //console.log(nextMap);

  if (typeof map === 'undefined' || typeof map.data === 'undefined') {
    this.error('Fehler: Ungültige Kartendaten!');
    return false;
  }

  this.current_map = map;
  this.current_map.background = map.background || '#333';
  this.current_map.gravity = map.gravity || { x: 0, y: 0.3 };
  this.tile_size = map.tile_size || 64;

  //Hintergrund
  this.current_map.backgroundImg = new Image();
  if (typeof this.current_map.backgroundI != 'undefined') {
    this.current_map.backgroundImg.src = this.current_map.backgroundI;
  }

  //StyleSheed der Map laden
  this.current_map.grafics = new Image();
  if (typeof this.current_map.styleSheet != 'undefined') {
    this.current_map.grafics.src = this.current_map.styleSheet;
  }

  //Objekte der Map laden
  this.current_map.objectImg = new Image();
  if (typeof this.current_map.objectSheet != 'undefined') {
    this.current_map.objectImg.src = this.current_map.objectSheet;
  }

  var _this = this;

  this.current_map.width_p = this.current_map.width * this.tile_size;
  this.current_map.height_p = this.current_map.height * this.tile_size;

  this.player.loc.x = map.player.x * this.tile_size || 64;
  this.player.loc.y = map.player.y * this.tile_size || 64;

  this.key.up = false;
  this.key.down = false;
  this.key.left = false;
  this.key.right = false;
  this.key.action = false;

  this.camera = {
    x: 0,
    y: 0
  };

  this.player.vel = {
    x: 0,
    y: 0
  };

  // Spieler Startbedingungen werden gesetzt
  this.player.health = 100;
  this.player.time = 200;
  this.player.oxygen = 100;

  this.log('Karte wurde geladen.');

  // Richtet die Kammera auf den Spieler auß
  this.camera.x = Math.round(this.player.loc.x - this.viewport.x / 2);
  this.camera.y = Math.round(this.player.loc.y - this.viewport.y / 2);

  // Verschiebt den Viewport das nichts außerhalb der Map gezeigt wird
  if (this.limit_viewport) {
    this.camera.x = Math.min(this.current_map.width_p - this.viewport.x, this.camera.x);
    this.camera.x = Math.max(0, this.camera.x);
    this.camera.y = Math.min(this.current_map.height_p - this.viewport.y, this.camera.y);
    this.camera.y = Math.max(0, this.camera.y);
    
  }

  //console.log(this.current_map);

  return true;
};

Game.prototype.get_tile = function (x, y) {
  return (this.current_map.data[y] && this.current_map.data[y][x]) ? this.current_map.data[y][x] : 0;
};

Game.prototype.draw_tile = function (x, y, tile, context, drawOnlyFront = false) {
  if (!tile) return;

  //Hintergrund
  if (!drawOnlyFront) {
    //Zeichnet Grafik
    if (tile.grafic) {
      tile.grafic.split("|").forEach((graficReturn) => {
        let positionX = Number(graficReturn.split("-")[0]);
        let positionY = Number(graficReturn.split("-")[1]);

        let addX = 0;
        if (positionX == 0 && positionY == 11) {
          addX = this.tile_move;
        }

        ctx.drawImage(
          this.current_map.grafics,
          (positionX * this.tile_size) + addX, //tilesheetX
          positionY * this.tile_size, //tilesheetY
          this.tile_size,
          this.tile_size,
          x, y, this.tile_size, this.tile_size
        );
      });
    }

  } else {
    //vordergrund
    if (tile.graficV) {
      let positionX = Number(tile.graficV.split("-")[0]);
      let positionY = Number(tile.graficV.split("-")[1]);

      ctx.drawImage(
        this.current_map.grafics,
        positionX * this.tile_size,
        positionY * this.tile_size,
        this.tile_size,
        this.tile_size,
        x, y, this.tile_size, this.tile_size
      );
    }
  }
};

Game.prototype.draw_object = function (x, y, tile) {
  if (!tile) return;
  //vordergrund
  if (tile.object) {
    let positionX = Number(tile.object.split("-")[0]);
    let positionY = Number(tile.object.split("-")[1]);
    let objectID = (positionY * 3) + positionX;
    let height_ad = 0;

    //objekte können gesammelt werden? -> hüpfende bewegung
    if ([objectID] in this.current_map.objects) {
      if (this.current_map.objects[objectID].take && !(typeof tile.objectP == 'number')) {
        tile.objectD = true;
        tile.objectP = Math.random() * 90;
      }
    }

    if (tile.objectP) {
      if (tile.objectD) {
        tile.objectP = tile.objectP + 5;
        if (tile.objectP > 180) tile.objectD = false;
      } else {
        tile.objectP = tile.objectP - 5;
        if (tile.objectP < 0) tile.objectD = true;
      }
      //Rundet das hüpfen von Objekten mit der sinuskurve ab.
      height_ad = Math.sin(tile.objectP * Math.PI / 180) * 10;
    }

    //zeichnet das Objekt
    ctx.drawImage(
      this.current_map.objectImg,
      positionX * this.tile_size,
      positionY * this.tile_size,
      this.tile_size,
      this.tile_size,
      x, y - height_ad, this.tile_size, this.tile_size
    );
  }
};

//Zeichnet die Karte
Game.prototype.draw_map = function (context, drawOnlyFront = false) {
  for (var y = 0; y < this.current_map.data.length; y++) {
    for (var x = 0; x < this.current_map.data[y].length; x++) {
      var t_x = (x * this.tile_size) - this.camera.x;
      var t_y = (y * this.tile_size) - this.camera.y;

      //Zeichnen wenn es sich im sichtfeld befindet
      if (t_x < -this.tile_size
        || t_y < -this.tile_size
        || t_x > this.viewport.x
        || t_y > this.viewport.y) continue;

      //Zeichnet den einzelnen Block der Karte
      this.draw_tile(
        t_x,
        t_y,
        this.current_map.data[y][x],
        context,
        drawOnlyFront
      );
    }
  }
};


Game.prototype.draw_objects = function (context, drawOnlyFront = false) {
  for (var y = 0; y < this.current_map.data.length; y++) {
    for (var x = 0; x < this.current_map.data[y].length; x++) {
      var t_x = (x * this.tile_size) - this.camera.x;
      var t_y = (y * this.tile_size) - this.camera.y;

      //Zeichnen wenn es sich im sichtfeld befindet
      if (t_x < -this.tile_size
        || t_y < -this.tile_size
        || t_x > this.viewport.x
        || t_y > this.viewport.y) continue;

      //Zeichnet den einzelnen Block der Karte
      this.draw_object(
        t_x,
        t_y,
        this.current_map.data[y][x]
      );
    }
  }
};


Game.prototype.draw_infos = function (context) {
  //Mitte
  this.draw_info(context, (canvas.width / 2) - 60, 0, 2, 0, this.player.life, 'i', false);

  //Links
  this.draw_info(context, 0, 0, 1, 0, 1, 'i', false);
  this.draw_info(context, 55, 18, 0, 0, this.player.health, 'b', false, this.player.health < 30 ? '#CA0400' : 'orange');

  if (this.player.oxygen < 100) {
    this.draw_info(context, 15, 33 + 50, 2, 2, 1, 'i', false, 50);
    this.draw_info(context, 55, 18 + 50, 0, 0, this.player.oxygen, 'b', false, '#0080FF');
  }

  //rechts
  this.draw_info(context, 50, 0, 1, 1, 'Punkte:-' + this.player.points, 't', false, 'white');
  this.draw_info(context, 50, 35, 1, 1, 'Zeit:-' + Math.ceil(this.player.time), 't', false,
    this.player.time < 45 ? this.player.time < 15 ? '#CA0400' : 'orange' : 'white'
  );

  //Gesammelte Objekt rechts aufzählen
  let objPosY = 100;
  for (playerObjects in this.player.objects) {
    if (this.player.objects[playerObjects] > 0) {
      let getObjectId = playerObjects;
      let toObX = 0;
      let toObY = 0;
      while (getObjectId > 2) { toObY += 1; getObjectId -= 3; }
      toObX = getObjectId;

      this.draw_info(context, 22, objPosY, toObX, toObY, this.player.objects[playerObjects], '', false);
      objPosY += 45;
    }
  }

};

Game.prototype.draw_info = function (context, x, y, tx, ty, text, type, side, color) {
  if (type == 'i') {
    for (let forX = 0; forX < text; forX++) {
      ctx.drawImage(
        this.current_map.objectImg,
        tx * this.tile_size,
        ty * this.tile_size,
        this.tile_size,
        this.tile_size,
        (side ? canvas.width - 90 - x : 0 + x) + (forX * 40), y - 25, color ? this.tile_size / 100 * color : this.tile_size, color ? this.tile_size / 100 * color : this.tile_size
      );
    }
  } else if (type == 'b') {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, 102, 16);

    ctx.fillStyle = 'gray';
    ctx.fillRect(x + 1, y + 1, 100, 14);

    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, text, 14);

  } else if (type == 't') {
    ctx.save();
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = "black";

    ctx.shadowBlur = 2;
    ctx.shadowColor = 'black';

    ctx.font = "20px Verdana";
    ctx.fillStyle = color;
    if (text.toString().includes('-')) {
      ctx.fillText(text.split("-")[0], canvas.width - x - 115, y + 30);
      ctx.strokeText(text.split("-")[0], canvas.width - x - 115, y + 30);

      ctx.fillText(text.split("-")[1], canvas.width - x - 30, y + 30);
      ctx.strokeText(text.split("-")[1], canvas.width - x - 30, y + 30);
      ctx.restore();
    } else {
      ctx.fillText(text, canvas.width - x - 30, y + 30);
      ctx.strokeText(text, canvas.width - x - 30, y + 30);
    }
    ctx.restore();
  } else {
    ctx.drawImage(
      this.current_map.objectImg,
      tx * this.tile_size,
      ty * this.tile_size,
      this.tile_size,
      this.tile_size,
      canvas.width - x - 100, y - 25, this.tile_size, this.tile_size
    );

    ctx.save();
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = "black";

    ctx.shadowBlur = 2;
    ctx.shadowColor = 'black';

    ctx.font = "20px Verdana";
    ctx.fillStyle = 'white';

    ctx.fillText(text, canvas.width - x - 30, y + 30);
    ctx.strokeText(text, canvas.width - x - 30, y + 30);

    ctx.restore();
  }
};


Game.prototype.move_player = function () {
  var tX = this.player.loc.x + this.player.vel.x;
  var tY = this.player.loc.y + this.player.vel.y;

  var offset = Math.round((this.tile_size / 2) - 1);

  var tile = this.get_tile(
    Math.round(this.player.loc.x / this.tile_size),
    Math.round(this.player.loc.y / this.tile_size)
  );

  //Spieler Springt durch Portale
  if(tile.portalDes){
    this.player.loc.x = tile.portalDes.x;
    this.player.loc.y = tile.portalDes.y-10;
  }
  
  //------------------------------------------------------------------------Objekte-------------------------------------------------
  if (tile.object) {
    //console.log(tile.object);
    let objectID = (Number(tile.object.split("-")[1]) * 3) + Number(tile.object.split("-")[0]);

    // ist der erforderliche gegenstand verfügbar?
    let haveObjectKey = true;
    if (this.current_map.objects[objectID].key) haveObjectKey = false;
    if (this.player.objects[this.current_map.objects[objectID].key] > 0 || this.current_map.objects[objectID].key == 0) haveObjectKey = true;

    //erforderliche gegenstand verfügbar?
    if (haveObjectKey) {
      //gegenstand wird aus dem inventar genommen
      if (this.current_map.objects[objectID].key) this.player.objects[this.current_map.objects[objectID].key] -= 1;
      //console.log(this.player.objects);

      //objekte können gesammelt werden
      if (this.current_map.objects[objectID].take) {
        // Leben, Punkte, Nahrung werden dem Spieler angerechnet
        if (this.current_map.objects[objectID].life) this.player.life += Number(this.current_map.objects[objectID].life);
        if (this.current_map.objects[objectID].points) this.player.points += Number(this.current_map.objects[objectID].points);
        if (this.current_map.objects[objectID].energy) this.player.health += Number(this.current_map.objects[objectID].energy);
        if (this.player.health > 100) this.player.health = 100;

        //objekt wird eingesammelt
        if (!(this.player.objects[objectID] >= 0)) this.player.objects[objectID] = 0;

        //objekt bleibt im inventar
        if (this.current_map.objects[objectID].bag) this.player.objects[objectID] = this.player.objects[objectID] + 1;

        //objekt wird auf der Map gelöscht
        delete tile.object;
      }

      //gegenstand wird übergeben
      if (this.current_map.objects[objectID].get) {
        let getObjectId = this.current_map.objects[objectID].get;
        let obX = Number(tile.id.split("-")[0]) + 1;
        let obY = Number(tile.id.split("-")[1]);

        let toObX = 0;
        let toObY = 0;
        while (getObjectId > 2) { toObY += 1; getObjectId -= 3; }
        toObX = getObjectId;
        this.current_map.data[obY][obX].object = toObX + '-' + toObY;
      }

      //gegenstand wird getauscht
      if (this.current_map.objects[objectID].changeIn) {
        let getObjectId = this.current_map.objects[objectID].changeIn
        let toObX = 0;
        let toObY = 0;
        while (getObjectId > 2) { toObY += 1; getObjectId -= 3; }
        toObX = getObjectId;
        tile.object = toObX + '-' + toObY;
      }
    }
  }

  // Karten Gravitation und wenn vorhanden Block Gravitation
  if (tile.gravity) {
    this.player.vel.x += tile.gravity.x;
    this.player.vel.y += tile.gravity.y;
    if (tile.gravity.y < 0 && myPlayerRotate < 180) myPlayerRotate += 10;
    if (tile.gravity.y > 0 && myPlayerRotate > 0) myPlayerRotate -= 10;
  } else {
    this.player.vel.x += this.current_map.gravity.x;
    this.player.vel.y += this.current_map.gravity.y;
    if (this.current_map.gravity.y < 0 && myPlayerRotate < 180) myPlayerRotate += 10;
    if (this.current_map.gravity.y > 0 && myPlayerRotate > 0) myPlayerRotate -= 10;
  }

  if (tile.friction) {
    this.player.vel.x *= tile.friction.x;
    this.player.vel.y *= tile.friction.y;
  }


  //-----------------------------------------------------Neigung des bodens erstellen
  var t_y_up = Math.floor(tY / this.tile_size);
  var t_y_down = Math.ceil(tY / this.tile_size);
  var t_y_down2 = Math.ceil((tY - 5) / this.tile_size);
  var y_near1 = Math.round((this.player.loc.y - offset) / this.tile_size);
  var y_near2 = Math.round((this.player.loc.y + offset) / this.tile_size);

  var t_x_left = Math.floor(tX / this.tile_size);
  var t_x_right = Math.ceil(tX / this.tile_size);
  var x_near1 = Math.round((this.player.loc.x - offset) / this.tile_size);
  var x_nearMl = Math.round((this.player.loc.x - (offset / 3)) / this.tile_size);
  var x_nearM = Math.round(this.player.loc.x / this.tile_size);
  var x_nearMr = Math.round((this.player.loc.x + (offset / 3)) / this.tile_size);
  var x_near2 = Math.round((this.player.loc.x + offset) / this.tile_size);

  var top1 = this.get_tile(x_near1, t_y_up);
  var topMl = this.get_tile(x_nearMl, t_y_up);//Kopf L
  var topM = this.get_tile(x_nearM, t_y_up);//Kopf M
  var topMr = this.get_tile(x_nearMr, t_y_up);//Kopf R
  var top2 = this.get_tile(x_near2, t_y_up);
  var bottom1 = this.get_tile(x_near1, t_y_down);
  var bottomMl = this.get_tile(x_nearMl, t_y_down);// Stehposition L
  var bottomM = this.get_tile(x_nearM, t_y_down);// Stehposition M
  var bottomMK = this.get_tile(x_nearM, t_y_down2);// Stehposition M
  var bottomMr = this.get_tile(x_nearMr, t_y_down);// Stehposition R
  var bottom2 = this.get_tile(x_near2, t_y_down);
  var left1 = this.get_tile(t_x_left, y_near1);
  var left2 = this.get_tile(t_x_left, y_near2);
  var right1 = this.get_tile(t_x_right, y_near1);
  var right2 = this.get_tile(t_x_right, y_near2);


  if (tile.jump && this.jump_switch > 15) {
    this.player.can_jump = true;
    this.jump_switch = 0;
  } else this.jump_switch++;

  this.player.vel.x = Math.min(Math.max(this.player.vel.x, -this.current_map.vel_limit.x), this.current_map.vel_limit.x);
  this.player.vel.y = Math.min(Math.max(this.player.vel.y, -this.current_map.vel_limit.y), this.current_map.vel_limit.y);

  this.player.loc.x += this.player.vel.x;
  this.player.loc.y += this.player.vel.y;

  this.player.vel.x *= .9;

  //Player wird links und rechts gehindert das spielfeld zu verlassen
  if (this.player.loc.x < 0) this.player.loc.x = 0;
  if (this.player.loc.x + this.tile_size > this.current_map.width_p) this.player.loc.x = this.current_map.width_p - this.tile_size;

  //Player wird unten gehindert das spielfeld zu verlassen und stirbt
  if (this.player.loc.y + this.tile_size > this.current_map.height_p) {
    this.player.loc.y = this.current_map.height_p - this.tile_size;

    this.player.health = 0;
  }



  //---------------------------------------------------------Tile Height --------------------------------
  if (bottomM.height || bottomMK.height) {
    //nachbarfelder eines Height bodens werden von static in height umgewandelt das wir nicht seitlich gegen eine wand laufen
    if (bottomM) {
      let cx = Number(bottomM.id.split("-")[0]);
      let cy = Number(bottomM.id.split("-")[1]);

      if (0 < cx) {
        if (this.current_map.data[cy][cx - 1]['solid']) {
          this.current_map.data[cy][cx - 1]['solid'] = false;
          this.current_map.data[cy][cx - 1]['height'] = '64,64';
        }
        if (this.current_map.data[cy][cx + 1]['solid']) {
          this.current_map.data[cy][cx + 1]['solid'] = false;
          this.current_map.data[cy][cx + 1]['height'] = '64,64';
        }
      }
    }

    //Height aktiv
    this.spriteFallDown = true;

    //genaue seitliche position auf einem tile
    this.playerTilePosX = ~~(this.player.loc.x - x_nearM * this.tile_size) + 32;
    this.playerTilePosX = 1 / 64 * this.playerTilePosX;

    //wenn der spieler mit den unerkörper eine erhöhung hat kann er hoch laufen
    if (bottomMK.height) {
      let heightL = Number(bottomMK.height.split(",")[0]);
      let heightR = Number(bottomMK.height.split(",")[1]);
      let tileBottom = Number(bottomMK.id.split("-")[1]);
      tileBottom = (tileBottom) * this.tile_size;

      //Position des spielers
      let playerHeightFromTile = Math.floor(heightL + (this.playerTilePosX * (heightR - heightL)));
      let distanceToTileBottom = tileBottom - playerHeightFromTile;

      if (distanceToTileBottom <= this.player.loc.y) {
        this.player.loc.y = distanceToTileBottom;
        this.player.vel.y = 0;
        this.player.on_floor = true;
        this.player.can_jump = true;
      }

      this.spriteFallDown = distanceToTileBottom - this.player.loc.y > 13;
    } else {
      // wenn der spieler auf einem tile ist kann er weiterlaufen
      let heightL = Number(bottomM.height.split(",")[0]);
      let heightR = Number(bottomM.height.split(",")[1]);
      let tileBottom = Number(bottomM.id.split("-")[1]);
      tileBottom = (tileBottom) * this.tile_size;

      //Position des spielers
      let playerHeightFromTile = Math.floor(heightL + (this.playerTilePosX * (heightR - heightL)));
      let distanceToTileBottom = tileBottom - playerHeightFromTile;

      if (distanceToTileBottom <= this.player.loc.y) {
        this.player.loc.y = distanceToTileBottom;
        this.player.vel.y = 0;
        this.player.on_floor = true;
        this.player.can_jump = true;
      }
      this.spriteFallDown = distanceToTileBottom - this.player.loc.y > 13;
    }
  }


  //Eine Fester Gegenstand hindert den Spieler am durchdringen (Rechts und Links)
  if (left1.solid || left2.solid || right1.solid || right2.solid) {
    /* fix overlap */
    while (this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near1).solid
      || this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near2).solid)
      this.player.loc.x += 0.1;

    while (this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near1).solid
      || this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near2).solid)
      this.player.loc.x -= 0.1;

    /* Soll der Spieler hüpfen beim abprallen */
    var bounce = 0;
    if (left1.solid && left1.bounce > bounce) bounce = left1.bounce;
    if (left2.solid && left2.bounce > bounce) bounce = left2.bounce;
    if (right1.solid && right1.bounce > bounce) bounce = right1.bounce;
    if (right2.solid && right2.bounce > bounce) bounce = right2.bounce;
    this.player.vel.x *= -bounce || 0;
  }


  //Eine Fester Gegenstand hindert den Spieler am durchdringen (Oben und Unten)
  if (top1.solid || top2.solid || bottomMl.solid || bottomMr.solid) {
    this.spriteFallDown = true;
    /* fix overlap */
    while (this.get_tile(x_nearMl, Math.floor(this.player.loc.y / this.tile_size)).solid
      || this.get_tile(x_nearMr, Math.floor(this.player.loc.y / this.tile_size)).solid)
      this.player.loc.y += 0.1;

    while (this.get_tile(x_nearMl, Math.ceil(this.player.loc.y / this.tile_size)).solid
      || this.get_tile(x_nearMr, Math.ceil(this.player.loc.y / this.tile_size)).solid)
      this.player.loc.y -= 0.1;

    /* Soll der Spieler abprallen */
    var bounce = 0;
    if (top1.solid && top1.bounce > bounce) bounce = top1.bounce;
    if (top2.solid && top2.bounce > bounce) bounce = top2.bounce;
    if (bottomMl.solid && bottomMl.bounce > bounce) bounce = bottomMl.bounce;
    if (bottomMr.solid && bottomMr.bounce > bounce) bounce = bottomMr.bounce;
    this.player.vel.y *= -bounce || 0;

    //Spieler kann Springen wenn er in entgegengesetzer schwerkraft an der decke hängt
    if ((topM.solid || topM.solid) && !tile.jump && tile.gravity) if (tile.gravity.y < 0) {
      this.player.on_floor = true;
      this.player.can_jump = true;
    }

    //spieler kann springen wenn er auf dem boden steht
    if ((bottomMl.solid || bottomMr.solid) && !tile.jump) {
      this.player.on_floor = true;
      this.player.can_jump = true;
    }
  }


  // Sichtfeld ausrichten
  var c_x = Math.round(this.player.loc.x - this.viewport.x / 2);
  var c_y = Math.round(this.player.loc.y - this.viewport.y / 2);
  var x_dif = Math.abs(c_x - this.camera.x);
  var y_dif = Math.abs(c_y - this.camera.y);

  if (x_dif > 5) {
    var mag = Math.round(Math.max(1, x_dif * 0.1));

    if (c_x != this.camera.x) {
      this.camera.x += c_x > this.camera.x ? mag : -mag;

      if (this.limit_viewport) {
        //this.camera.x = Math.min(this.current_map.width_p - this.viewport.x + this.tile_size, this.camera.x);
        this.camera.x = Math.min(this.current_map.width_p - this.viewport.x, this.camera.x);
        this.camera.x = Math.max(0, this.camera.x);
      }
    }
  }

  if (y_dif > 5) {
    var mag = Math.round(Math.max(1, y_dif * 0.1));

    if (c_y != this.camera.y) {
      this.camera.y += c_y > this.camera.y ? mag : -mag;

      if (this.limit_viewport) {
        //this.camera.y = Math.min(this.current_map.height_p - this.viewport.y + this.tile_size, this.camera.y);
        this.camera.y = Math.min(this.current_map.height_p - this.viewport.y, this.camera.y);
        this.camera.y = Math.max(0, this.camera.y);
      }
    }
  }

  //Ausführen der eigenen scripte wenn ein neues feld auf der Karte berührt wird.
  if (this.last_tile != tile.id) {
    if (tile.script) eval(this.current_map.script[tile.script]);
    if (tile.loadMap) eval(game.load_map(tile.loadMap, () => { }));
    //xxxxxxxxxxxxxxxx
  }

  //block eigenschaft--------------------------------------------------- kann später wieder entfernt werden---------------------------
  /*
  if (this.last_tile != tile.id && tile.block) {
    console.log(tile.block);
  }
  */

  this.last_tile = tile.id;
};


//Spieler bewegung wird durch Tastatureingaben berechnet
Game.prototype.update_player = function () {
  //Spieler Tot = Bewegungsunfähig
  if (this.player.health > 0) {
    //Spieler Lebt = Bewegungsunfähig
    if (this.key.up) {
      this.spriteFallDown = true;

      var tile = this.get_tile(
        Math.round(this.player.loc.x / this.tile_size),
        Math.round(this.player.loc.y / this.tile_size)
      );

      //console.log(tile);

      //sprungrichgung
      let jumpSide = 'up';
      if (tile.gravity) if (tile.gravity.y < 0) jumpSide = 'down';

      //spieler kann erst springen wenn die y geschwindigkeit nachgelassen hat
      if (this.player.vel.y > 1 || this.player.vel.y < -1) jumpSide = '';
      //console.log(this.player.vel.y);

      //von boden abspringen
      if (this.player.can_jump && this.player.vel.y > -this.current_map.vel_limit.y && jumpSide == 'up') {
        this.player.vel.y -= this.current_map.movement_speed.jump;
        this.player.can_jump = false;
      }

      //von der decke abspringen
      if (this.player.can_jump && this.player.vel.y < this.current_map.vel_limit.y && jumpSide == 'down') {
        this.player.vel.y += this.current_map.movement_speed.jump;
        this.player.can_jump = false;
      }
    }

    if (this.key.down) {
      //ducken
    }

    if (this.key.left) {
      if (this.player.vel.x > -this.current_map.vel_limit.x)
        this.player.vel.x -= this.current_map.movement_speed.left;
    }

    if (this.key.right) {
      if (this.player.vel.x < this.current_map.vel_limit.x)
        this.player.vel.x += this.current_map.movement_speed.left;
    }

    if (this.key.action) {
      //event beim leertaste drücken
    }

  } else {
    //Spieler Tod
    this.player.vel.x = 0;
    if (this.player.side == 'l') {
      this.key.left = true;
    } else {
      this.key.right = true;
    }
  }

  this.move_player();
};

//----------------------------------------------------------------------animation des tod wird nicht immer richtig abgespielt
Game.prototype.player_dead = function () {
  this.player.health = 100;
  this.player.life -= 1;
  if (this.player.life <= 0) {
    //Neustart
    console.log('Sie Haben keine Leben mehr! Das Spiel Startet neu');
    game.load_map(gameOptionsData['maps'][0], () => { });
    this.player.life = 3;
    this.player.stern = 0;
    this.player.diamant = 0;
    this.player.apfel = 0;
  } else {
    //Map wird neu gestartet
    console.log('Gestorben');

    this.key.up = false;
    this.key.down = false;
    this.key.left = false;
    this.key.right = false;
    this.key.action = false;

    this.player.loc.x = this.current_map.player.x * this.tile_size;
    this.player.loc.y = this.current_map.player.y * this.tile_size;
    this.player.vel.x = 0;
    this.player.vel.y = 0;
  }
}

//Player Zeichnen
Game.prototype.draw_player = function (context) {
  this.drowX = this.player.loc.x - this.camera.x;
  this.drowY = this.player.loc.y - this.camera.y;

  //Verhindert die Animation beim Springen wenn kein platz ist
  if (this.player.vel.y < 0.45 && this.player.vel.y > -0.45) {
    playerJumpReset();
  }

  //Spieler Steht
  if (this.player.vel.x < 0.05 && this.player.vel.x > -0.05 && this.player.vel.y <= 0.1) {
    this.player.side = 'i';
    this.player.sprite = 'Idle';
    this.player.vel.x = 0;
  }

  if (this.player.vel.y >= 0.45 || ~this.player.vel.y >= 0.45) {
    this.player.side = this.player.lastSide;
  }

  //Links
  if (this.key.left || this.player.side == 'l') {
    this.player.side = 'l';
    this.player.lastSide = 'l';
    if (this.player.vel.x < -2.2) this.player.sprite = 'RunLeft';//Laufen
    else this.player.sprite = 'WalkLeft';//Gehen
    if (this.player.vel.y <= -0.45) this.player.sprite = 'JumpUpLeft';
    if (this.player.vel.y >= 0.45 && this.spriteFallDown) this.player.sprite = 'JumpDownLeft';

    if (this.key.action && !playerAttackLeft.end()) { this.player.sprite = 'AttackLeft'; }

    //Tod Animation und level Neustart
    if (this.player.health <= 0) { this.player.sprite = 'DeathLeft'; }
    if (this.player.health <= 0 && playerDeathLeft.end()) {
      this.player_dead();
      playerDeathLeft.reset();
    }
  }

  //Rechts
  if (this.key.right || this.player.side == 'r') {
    this.player.side = 'r';
    this.player.lastSide = 'r';
    if (this.player.vel.x > 2.2) this.player.sprite = 'RunRight';//Laufen
    else this.player.sprite = 'WalkRight';//Gehen
    if (this.player.vel.y <= -0.45) this.player.sprite = 'JumpUpRight';
    if (this.player.vel.y >= 0.45 && this.spriteFallDown) this.player.sprite = 'JumpDownRight';

    if (this.key.action && !playerAttackRight.end()) { this.player.sprite = 'AttackRight'; }

    //Tod Animation und level Neustart
    if (this.player.health <= 0) { this.player.sprite = 'DeathRight'; }
    if (this.player.health <= 0 && playerDeathRight.end()) {
      this.player_dead();
      playerDeathRight.reset();
    }
  }

  //die passende animation rendern
  var playerSprites = {
    'RunLeft': playerRunLeft,
    'WalkLeft': playerWalkLeft,
    'RunRight': playerRunRight,
    'WalkRight': playerWalkRight,
    'JumpDownLeft': playerJumpDownLeft,
    'JumpDownRight': playerJumpDownRight,
    'JumpUpLeft': playerJumpUpLeft,
    'JumpUpRight': playerJumpUpRight,
    'AttackRight': playerAttackRight,
    'AttackLeft': playerAttackLeft,
    'DeathRight': playerDeathRight,
    'DeathLeft': playerDeathLeft
  };

  var sprite = playerSprites[this.player.sprite] || playerIdle;
  sprite.render(ctx, this.drowX, this.drowY);
};

Game.prototype.PlayerDeath = function () {
  this.player.health = 0;
  this.player.time = 200;
  this.player.oxygen = 100;
}

Game.prototype.ticker = function () {
  //Spieler Lebt
  if (this.player.health > 0) {
    //Hunger
    this.player.health -= 0.5;
    this.player.time -= 0.3334;

    //Position des Kopfes
    var tile = this.get_tile(
      Math.round(this.player.loc.x / this.tile_size),
      Math.round((this.player.loc.y - 30) / this.tile_size)
    );

    //Sauerstoff unter wasser
    if (tile.friction) {
      this.player.oxygen -= 2;
    } else {
      if (this.player.oxygen < 100) this.player.oxygen += 3;
    }
    if (this.player.oxygen > 100) this.player.oxygen = 100;
    if (this.player.oxygen < 0) this.player.oxygen = 0;

    //bedingungen für den Tod
    if (this.player.time <= 0 || this.player.oxygen <= 0) {
      game.PlayerDeath();
    }
  }

};

Game.prototype.update = function () {
  timestampNow = ~~(Date.now() / 333);
  if (timestamp != timestampNow) {
    timestamp = timestampNow;
    game.ticker();
  }

  this.update_player();
};

Game.prototype.draw = function (context) {
  //Außerhalb der Karte alles Schwarz darstellen
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  
  
  
  //Hintergrund der Map wird gesetzt
  context.fillStyle = this.current_map.background || '#333';
  context.fillRect(-this.camera.x, -this.camera.y, this.current_map.width_p || canvas.width, this.current_map.height_p || canvas.height);

  //Hintergrund Paralax
  this.current_map.backgroundImg.onload = () => {
    this.bgX = this.current_map.backgroundImg.width;
    this.bgY = this.current_map.backgroundImg.height;
  };
  ctx.save();
  
  let horPaY = (this.bgY - this.viewport.y) / (this.current_map.height_p - this.viewport.y) * this.camera.y
  
  ctx.translate(-(this.camera.x/3), -horPaY);
  //ctx.translate(-this.player.loc.x/5, -this.player.loc.y/5);
  const pattern = ctx.createPattern(this.current_map.backgroundImg, "repeat");
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, this.bgX, this.bgY);
  ctx.restore();

  //Karte wird Gezeichnet
  this.draw_map(context);

  //Karte wird Gezeichnet
  this.draw_objects(context);

  //Spieler wird Gezeichnet
  this.draw_player(context);

  //Vordergrund der Karte wird Gezeichnet
  this.draw_map(context, true);

  //Oberfäche Zeichnen
  this.draw_infos(context);

  //bewegungsgeschwindigkeit von tiles --------------------------------------------------------------------------------------------------
  this.tile_move = this.tile_move + this.tile_move_speed;
  if (this.tile_move > this.tile_size) { this.tile_move = this.tile_move - this.tile_size; }
};

/* Wiedergabe fequenz des spiels (loop)*/
window.requestAnimFrame =
  window.requestAnimationFrame ||
  function (callback) {
    return window.setTimeout(callback, 1000 / 60);
  };


/*
//zeitlupe
window.requestAnimFrame = function (callback) {
  return window.setTimeout(callback, 1000 / 15);
};*/


var canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

//Spiel wird in Maximaler größe dargestellt 100%
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Wenn das fenster in der größe verändert wird passt sich das Canvas an
window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}, false);


var game = new Game();
game.set_viewport(canvas.width, canvas.height);

/* Beschränkt das Ansichtsfenster auf die Grenzen der Karte */
game.limit_viewport = true;

var Loop = function () {
  if (!paused) {
    //Aktives Spiel Loop
    game.update();
    game.draw(ctx);

    window.requestAnimFrame(Loop);
  } else {
    //Pausenbox
    ctx.fillStyle = 'yellow';
    ctx.fillRect((canvas.width / 2) - 42, (canvas.height / 2) - 17, 84, 34);

    ctx.fillStyle = 'black';
    ctx.fillRect((canvas.width / 2) - 40, (canvas.height / 2) - 15, 80, 30);

    ctx.font = "20px Verdana";
    ctx.fillStyle = 'yellow';
    ctx.fillText("Pause", (canvas.width / 2) - 30, (canvas.height / 2) + 8);
  }
};


// Key des Spiels laden
let gameKey = '';
let gameKeyPublic = '';
let timestamp = 0;
let timestampNow = (Date.now() / 333);
initGame(() => {
  document.querySelector(".dpad-right").addEventListener("touchstart", (e) => { game.key.right = true; });
  document.querySelector(".dpad-right").addEventListener("touchend", (e) => { game.key.right= false; });

  document.querySelector(".dpad-left").addEventListener("touchstart", (e) => { game.key.left = true; });
  document.querySelector(".dpad-left").addEventListener("touchend", (e) => { game.key.left= false; });

  document.querySelector(".dpad-up").addEventListener("touchstart", (e) => { game.key.up = true; });
  document.querySelector(".dpad-up").addEventListener("touchend", (e) => { game.key.up= false; });
  
  //console.log('geladen');
  const urlParams = new URLSearchParams(window.location.search);
  game.load_map(urlParams.get('map') ? urlParams.get('map') : gameOptionsData['maps'][0], () => {
    Loop();
  });
});
