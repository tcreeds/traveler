function dot(a, b){
    return a.x * b.x + a.y * b.y;   
}

function normalize(x, y){
    if (y === undefined || y === null){
        y = x.y;
        x = x.x;
    }
    var mag = Math.sqrt(x * x + y * y);
    return { x: x / mag, y: y/mag };
}

function slopeToVector(num){
    return normalize(1, num);   
}

function magnitude(vec){
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

function vectorByScalar(vec, scalar){
    return { x: vec.x * scalar, y: vec.y * scalar };   
}

function project(u, v){
    var dotProduct = dot(normalize(u), v);
    var mag = magnitude(v);
    var vec = vectorByScalar(v, 1/mag);
    vec = vectorByScalar(vec, dotProduct/mag);
    return vec;
}

function scalarProject(u, v){
    return dot(u, v) / magnitude(v);
}

function reflect(vector, over){
    var minus = vectorByScalar(vector, dot(over, vector) * 2);
    return subtractVector(vector, minus);
}

function addVector(v1, v2){
    return { x: v1.x + v2.x, y: v1.y + v2.y };
}

function subtractVector(v1, v2){
    return { x: v1.x - v2.x, y: v1.y - v2.y };   
}