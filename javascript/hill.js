var Hill = function(group, left, texture){
    var texture = PIXI.Texture.fromImage(texture);
    PIXI.Sprite.call(this, texture);
    
    this.shader = new PIXI.HillFilter();
    this.shader.start = group.start;
    this.shader.peak = group.peak;
    this.shader.end = group.end;
    
    this.start = group.start;
    this.peak = group.peak;
    this.end = group.end;
    
    this.height = group.height;
    this.width = group.width;
    this.anchor.set(0, 1);
    this.x = left;
    this.y = 500 + group.elevation;
}

Hill.prototype = Object.create(PIXI.Sprite.prototype);
Hill.prototype.constructor = Hill;
