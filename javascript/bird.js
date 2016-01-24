var Bird = function(){
    var texture = PIXI.Texture.fromImage("static/bird.png");
    PIXI.Sprite.call(this, texture);
    
    this.mass = 2;
    this.scale.set(0.3);
    this.radius = this.width / 2;
    this.anchor.set(0.5, 0.5);
    this.grounded = false;
    this.reset();
}

Bird.prototype = Object.create(PIXI.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.reset = function(){
    this.velocity = { x: 2.1, y: 0 };
    this.x = 0;
    this.y = 0;
}

Bird.prototype.update = function(dt){
    
    this.velocity.x += 0.001 * dt;
    this.velocity.y += 0.003 * dt;
    this.velocity.x *= 0.999;
    this.velocity.y *= 0.999;
    
    this.x += this.velocity.x;
    this.y += this.velocity.y;   
    
    
}