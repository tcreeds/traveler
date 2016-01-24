var UI = function(){
    PIXI.DisplayObjectContainer.call(this);   
    
    this.portal1 = new PIXI.Sprite.fromImage("static/portal.png");
    this.portal1.anchor.set(0.2, 0.5);
    this.portal1.width = 25;
    this.portal1.height = 60;
    this.portal1.x = 0;
    this.portal1.y = 20;
    this.addChild(this.portal1);
    
    this.portal2 = new PIXI.Sprite.fromImage("static/portal.png");
    this.portal2.anchor.set(0.8, 0.5);
    this.portal2.width = 25;
    this.portal2.height = 60;
    this.portal2.x = 640;
    this.portal2.y = 20;
    this.addChild(this.portal2);
    
    this.progressBar = new PIXI.Sprite.fromImage("static/square.png");
    this.progressBar.anchor.set(0.5, 0.5);
    this.progressBar.height = 3;
    this.progressBar.width = 625;
    this.progressBar.x = 320;
    this.progressBar.y = 20;
    this.progressBar.tint = 0x333333;
    this.addChild(this.progressBar);
    
    this.progressIndicator = new PIXI.Sprite.fromImage("static/bird.png");
    this.progressIndicator.anchor.set(0.5, 0.5);
    this.progressIndicator.height = 25;
    this.progressIndicator.width = 25;
    this.progressIndicator.x = 0;
    this.progressIndicator.y = 20;
    this.addChild(this.progressIndicator);
    
    this.oxygenBar = new PIXI.Sprite.fromImage("static/square.png");
    this.oxygenBar.anchor.set(0.5, 1);
    this.oxygenBar.x = 620;
    this.oxygenBar.y = 460;
    this.oxygenBar.height = 130;
    this.oxygenBar.width = 20;
    this.addChild(this.oxygenBar);
    
    this.oxygenIndicator = new PIXI.Sprite.fromImage("static/square.png");
    this.oxygenIndicator.anchor.set(0.5, 1);
    this.oxygenIndicator.x = this.oxygenBar.x;
    this.oxygenIndicator.y = this.oxygenBar.y;
    this.oxygenIndicator.width = this.oxygenBar.width;
    this.oxygenIndicator.height = this.oxygenBar.height;
    this.oxygenIndicator.tint = 0xff0000;
    this.addChild(this.oxygenIndicator);
    
}

UI.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
UI.prototype.constructor = UI;

UI.prototype.update = function(){
    
    var progress = bird.x / levelWidth;
    this.progressIndicator.x = progress * 620 + 10;  
    this.progressIndicator.width = 25 + progress * 15;
    this.progressIndicator.height = 25 + progress * 15;
    
    
    var timeSpent = Date.now() - levelStartTime;
    var percentRemaining = 1 - timeSpent / islands[currentLevel].duration;
    percentRemaining = Math.max(0, percentRemaining);
    this.oxygenIndicator.height = this.oxygenBar.height * percentRemaining;
    
}