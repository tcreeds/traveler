var gameLoop;
var menuFont = { 
    font: "30px Helvetica",
    fill: "white"
};
var menuColor = 0x000000;
var hoverObject;
var ui;
var gameState = 0;
var GameStates = { MENU: 0, GAME: 1 };
var unlockLevel = 0;
var currentLevel;
var levelStartTime;
var gameRunning;

function init(){
    
    input = new InputManager(document.querySelector("canvas"));
    input.subscribe("mouseup", onClick, window);
    input.subscribe("touchstart", onClick, window)
    input.subscribe("mousemove", onMouseMove, window);
    requestAnimFrame(animate);
    toMenu();
}

function toMenu(){
    stage.setBackgroundColor(menuColor);
    if (ui){
        ui.removeChildren();
        stage.removeChild(ui);
        ui = undefined;
    }
    if (gameLoop)
        clearInterval(gameLoop);
    gameState = 0;
    currentLevel = undefined;
    gameContainer.removeChildren();
    gameContainer.scale.set(1);
    gameContainer.x = 0;
    gameContainer.y = 0;
    bird = undefined;
    var scale = Math.ceil(Math.sqrt(islands.length));
    var leftMargin = 60;
    var topMargin = 40;
    var bottomMargin = 140 + (unlockLevel < islands.length ? 20 : 0);
    var buttonSpacing = 10;
    var buttonWidth = (640 - leftMargin * 2) / scale;
    var buttonHeight = (480 - topMargin - bottomMargin) / scale;
    
    for (var i = 0; i < islands.length; i++){
        var button = new PIXI.Sprite.fromImage("static/button.png");
        button.x = leftMargin + i % scale * buttonWidth + buttonSpacing;
        button.y = topMargin + Math.floor(i / scale) * buttonHeight;
        button.width = buttonWidth - buttonSpacing * 2;
        button.height = buttonHeight - buttonSpacing * 2;
        gameContainer.addChild(button);
        if (i <= unlockLevel){
            (function(button, x){
            button.func = function(){ playLevel(x) };
            })(button, i);
            var number = new PIXI.Text(i + 1, menuFont);
            number.x = button.x + button.width / 2;
            number.y = button.y + button.height / 2;
            number.anchor.set(0.5, 0.5);
            gameContainer.addChild(number);
        }
        else {
            button.tint = 0xcccccc;   
        }
    }
    
    if (unlockLevel < islands.length){
        var cheat = new PIXI.Sprite.fromImage("static/button.png");
        cheat.x = leftMargin + buttonSpacing;
        cheat.y = 480 - bottomMargin;
        cheat.width = 100;
        cheat.height = 40;
        cheat.func = function(){
            unlockLevel = 100;
            toMenu();
        };
        gameContainer.addChild(cheat);
        
        var cheatText = new PIXI.Text("Cheat!", { font: "24px Helvetica", fill: "white" });
        cheatText.x = cheat.x + cheat.width / 2;
        cheatText.y = cheat.y + cheat.height / 2 + 2;
        cheatText.anchor.set(0.5, 0.5);
        gameContainer.addChild(cheatText);
    }
    
    var callToAction = new PIXI.Text("Get to the next portal before your oxygen runs out!", { font: "18px Helvetica", fill: "#eee" });
    callToAction.x = leftMargin + buttonSpacing;
    callToAction.y = 380;
    gameContainer.addChild(callToAction);
    var instructions = new PIXI.Text("Hold spacebar to fold your wings and drop. If you land at the \nright angle, you'll go faster!", { font: "18px Helvetica", fill: "#eee" });
    instructions.x = leftMargin + buttonSpacing;
    instructions.y = 410;
    gameContainer.addChild(instructions);
    
}


//loads and begins specified level
function playLevel(levelIndex){
    currentLevel = levelIndex;
    gameState = 1;
    gameContainer.removeChildren();
    hills = [];
    cameraZoom = 1;
    hoverObject = undefined;
    
    var portal = new PIXI.Sprite.fromImage("static/portal.png");
    portal.height = 2000;
    portal.width = 150;
    portal.anchor.set(0.5, 1);
    gameContainer.addChild(portal);
    
    levelWidth = 0;
    var island = islands[levelIndex];
    stage.setBackgroundColor(island.backgroundColor);
    for (var i = 0; i < island.hills.length; i++){
        var group = island.hills[i];
        for (var k = 0; k < group.groupSize; k++){
            var hill = new Hill(group, levelWidth, island.texture);
            levelWidth += hill.width;
            hills.push(hill);
            gameContainer.addChild(hill);
        }
    }
    portal.x = levelWidth;
    portal.y = hills[hills.length-1].y;
    
    var startPortal = new PIXI.Sprite.fromImage("static/portal.png");
    startPortal.height = 2000;
    startPortal.width = 150;
    startPortal.anchor.set(0.5, 1);
    startPortal.x = 0;
    startPortal.y = 500;
    gameContainer.addChild(startPortal);
    
    bird = new Bird();
    gameContainer.addChild(bird);
    
    ui = new UI();
    stage.addChild(ui);
    
    currentHill = 0;
    
    bird.alpha = 0;
    setCamera(hills[0], gameContainer);
    setTimeout(function(){
        gameRunning = true;
        levelStartTime = Date.now();
        time = levelStartTime;
        bird.alpha = 1;
        gameLoop = setInterval(update, 10);
    }, 1000);
}

function onClick(e, x, y){
    if (gameState == GameStates.MENU){
        for (var i = 0; i < gameContainer.children.length; i++){
            var button = gameContainer.children[i];
            if (x > button.x && x < button.x + button.width && y > button.y && y < button.y + button.height){
                if (button.func !== undefined){
                    button.func();
                    break;
                }
            }
        }
    }
    else if (gameState == GameStates.GAME){
        
    }
}

function onMouseMove(e){
    if (gameState == GameStates.MENU){
        var x = input.mousePosition.x;
        var y = input.mousePosition.y;
        var found = false;
        for (var i = 0; i < gameContainer.children.length; i++){
            var button = gameContainer.children[i];
            if (x > button.x && x < button.x + button.width && y > button.y && y < button.y + button.height && button.func){
                if (hoverObject !== undefined){
                    hoverObject.tint = 0xffffff;
                }
                hoverObject = button;
                hoverObject.tint = 0xcccccc;
                found = true;
                break;
            }
        }
        if (!found && hoverObject){
            hoverObject.tint = 0xffffff;
            hoverObject = undefined;
        }
    }
}