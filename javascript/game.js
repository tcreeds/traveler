

// create an new instance of a pixi stage with a grey background
var stage = new PIXI.Stage(0xCCCCFF);

// create a renderer instance width=640 height=480
var renderer = PIXI.autoDetectRenderer(640,480);

var assets = ["static/hill.png", "static/bird.png", "static/button.png", "static/square.png", "static/portal.png"];
for (var island in islands)
    assets.push(islands[island].texture);
// create a new loader
var loader = new PIXI.AssetLoader(assets);

// create an empty container
var gameContainer = new PIXI.DisplayObjectContainer();


// add the container to the stage
stage.addChild(gameContainer);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

// use callback
loader.onComplete = init;


var bird;
var hills = [];
var currentHill;
var input;
var time;
var canvasHeight = 480;
var cameraZoom = 1;
var levelWidth = 0;

//begin load
loader.load();



function update(){
    
    var currentTime = Date.now();
    var dt = currentTime - time;
    if (dt > 40)
        dt = 10;
    time = currentTime;
    var inputState = input.inputState;
    
    if ((inputState.space || input.mousePressed) && gameRunning){
        bird.velocity.y += 0.008 * dt;
    }
    
    bird.update(dt);
    ui.update();
    
    if (!gameRunning){
        return;   
    }
    
    if (bird.x > hills[currentHill].x + hills[currentHill].width){
        currentHill++;   
        if (currentHill >= hills.length){
            clearInterval(gameLoop);
            bird.alpha = 0;
            if (currentLevel == unlockLevel)
                unlockLevel++;
            setTimeout(function(){
                gameRunning = false;
                toMenu();
            }, 1000);
            return;
        }
    }
    
    var hill = hills[currentHill];
    var middle = (hill.peak.x - hill.start.x) / (hill.end.x - hill.start.x);
    var hillHeight = getHillHeight(hill, bird.x);
    
    //if bird is colliding with hill
    if (bird.y + bird.radius > hillHeight){       
        
        var slope = getSlopeAt(hill, bird.x);
        var velocity = normalize(bird.velocity.x, bird.velocity.y);            
        var dotProduct = dot(velocity, slope);
        var multiplier = Math.max(0, dotProduct);
        var mag = magnitude(bird.velocity);

        //if bird is going down the hill
        if (slope.y > 0){
            bird.y = hillHeight-bird.radius;
            if (dotProduct > 0.7){
                //entrance vector is good, stick to hill
                var newVector = vectorByScalar(slope, mag * multiplier);
                bird.velocity.x = newVector.x;
                bird.velocity.y = newVector.y;
            }
            else {
                //entrance vector is bad, bounce   
                bird.velocity = reflect(bird.velocity, slope);
            }
        }
        //if bird is going up the hill
        else {
            bird.y = hillHeight-bird.radius;
            if (getHillHeight(hill, bird.x + bird.velocity.x) <= bird.y + bird.velocity.y){

                var newVector = vectorByScalar(slope, mag * multiplier);
                bird.velocity.x = newVector.x;
                bird.velocity.y = newVector.y;
                if (magnitude(bird.velocity) < 0.3){
                    bird.velocity.x += slope.x / 4;
                    bird.velocity.y += slope.y / 4;
                }
            }

        }

        //align bird's velocity to slope of hill
        var newVector = vectorByScalar(slope, mag * multiplier);

        bird.velocity.x = newVector.x;
        bird.velocity.y = newVector.y;
        
        //if bird has very little velocity (e.g. crashed into a hill) gives the bird a hand
        if (magnitude(bird.velocity) < 0.3){
            bird.velocity.x += slope.x / 4;
            bird.velocity.y += slope.y / 4;
        }      
    }    
    if (Date.now() - levelStartTime >= islands[currentLevel].duration && gameRunning){
        //YOU LOSE
        gameRunning = false;
        setTimeout(function(){
            clearInterval(gameLoop);
            toMenu();
        }, 2000);
    }
    setCamera(hill, gameContainer, true);
    
}

function setCamera(hill, gameContainer, interpolate){
    var dist = (hill.y - bird.y);
    scale = dist * 1.2 / canvasHeight;
    if (scale < 1)
        scale = 1;
    scale = 1/scale;
    
    if (interpolate)
        cameraZoom = (cameraZoom + scale) / 2;
    else 
        cameraZoom = scale;
    
    gameContainer.scale.set(cameraZoom);
    
    gameContainer.x = Math.min(0, -(bird.x * cameraZoom) + 50);
    gameContainer.y = canvasHeight * (1 - cameraZoom);   
}
    
//calculates curve height with parametric function
//returns curve height in game space
// x^a / (x^a + (1-x)^a
// a = 2
function getHillHeight(hill, t){
    var x = (t - hill.x) / hill.width;
    var h = hill.height;
    var baseHeight = hill.height;
    
    var data = getNormalizedFunctionValue(hill, x);
    x = data.x;
    if (data.decline){
        h = h * (hill.peak.y - hill.end.y);
        baseHeight *= hill.end.y;
    }
    else{
        h = h * (hill.peak.y - hill.start.y);
        baseHeight *= hill.start.y;
    }
    var percent = x * x / (x * x + (1 - x) * (1 - x));
    return hill.y - h * percent - baseHeight;
}

//iteratively evaluates slope of hill until point at which hill is perp to bird is found - contact point
// lowHeight: lower bound of search
// highHeight: upper bound of search
// i: recursive levels
function findPointOfContact(hill, lowHeight, highHeight, i){
    
    //calculate slope at low and high bounds
    //if either are 
}

//gets slope of parameterized function used for hills
function getSlopeAt(hill, t){
    var ratio = hill.height / hill.width;
    var x = (t - hill.x) / hill.width;
    
    var data = getNormalizedFunctionValue(hill, x);
    x = data.x;
    //adjust for non-centered peak
    if (data.decline){
        ratio *= (hill.peak.y - hill.end.y) / (hill.end.x - hill.peak.x);   
    }
    else {
        ratio *= (hill.start.y - hill.peak.y) / (hill.peak.x - hill.start.x);   
    }
    
    var num = -2 * (x - 1) * x;
    var den = (2*x*x - 2 * x + 1) * (2*x*x - 2 * x + 1);
    var result = num/den;
    result *= ratio;
    
    var vec = slopeToVector(result);
    vec = normalize(vec);
    return vec;
}

function getNormalizedFunctionValue(hill, x){
    var peak = hill.peak;
    var start = hill.start;
    var end = hill.end;
    
    var decline = x > ((peak.x - start.x) / (end.x - start.x));
    if (decline)
        x = ((end.x - peak.x) - (x - peak.x)) / (end.x - peak.x);
    else
        x = 1 - (peak.x - x) / peak.x;
    
    return { decline: decline, x: x };
}

function animate() {
	requestAnimFrame(animate);
    
    if (bird){
        //bird angle based on velocity
        var angle = Math.atan2(bird.velocity.y, bird.velocity.x);
        var diff = bird.rotation - angle;
        bird.rotation = angle + diff/2;
    }
    
	renderer.render(stage);
}