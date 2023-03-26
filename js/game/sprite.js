function playerSprite(options) {
  var sprite = {};
  sprite.image = new Image();
  sprite.image.src = options.image;

  sprite.width = options.width ?? 128;
  sprite.height = options.height ?? 128;

  sprite.corX = options.corX ?? -38;
  sprite.corY = options.corY ?? -46;

  sprite.frameIndex = 0;
  sprite.tickCount = 0;
  sprite.ticksPerFrame = options.ticksPerFrame ?? 1;
  sprite.numberOfFrames = options.numberOfFrames ?? 0;

  sprite.mirror = options.mirror ?? false;
  
  if (options.loop == true || options.loop == undefined) {
    sprite.loop = true;
  } else {
    sprite.loop = options.loop;
  }

  sprite.reset = function () {
    sprite.frameIndex = 0;
    sprite.tickCount = 0;
  }

  sprite.end = function () {
    if (sprite.frameIndex >= sprite.numberOfFrames - 1 && sprite.loop == false) {
      //this.reset();
      return true;
    } else {
      return false;
    }
  }

  sprite.render = function (ctx, x, y) {
    //Frames berechnen
    sprite.tickCount++;
    if (sprite.tickCount > sprite.ticksPerFrame) {
      sprite.tickCount = 0;
      if (sprite.frameIndex < sprite.numberOfFrames - 1) {
        sprite.frameIndex++;
      } else {
        if (sprite.loop) sprite.frameIndex = 0;
      }
    }

    //Spiegelung und drehung
    ctx.save();
    ctx.translate(x + (sprite.width / 4), y + (sprite.height / 4)); // sprite.corX, sprite.corY
    ctx.rotate(myPlayerRotate * Math.PI / 180);
    if (sprite.mirror && myPlayerRotate < 180 || !sprite.mirror && myPlayerRotate == 180){
      ctx.scale(-1, 1);
    }

    //zeichnen der Grafik
    ctx.drawImage(
      sprite.image,
      sprite.frameIndex * sprite.width,
      0,
      sprite.width,
      sprite.height,
      -(sprite.width / 4) + (sprite.mirror ? sprite.corX + 10 : sprite.corX),
      -(sprite.height / 4) + sprite.corY,
      sprite.width,
      sprite.height
    );

    ctx.restore();
  };
  return sprite;
}
