/**
 * @author Trevor Creed http://trevorcreed.com
 */

/**
 * The HillFilter squashes a texture under a curve.
 *
 * @class HillFilter
 * @extends AbstractFilter
 * @constructor
 */
PIXI.HillFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        start: {type: '2f', value: {x:0, y:0.1}},
        peak: {type: '2f', value: {x:0.5, y:0.5}},
        end: {type: '2f', value: {x:1, y:0.1}}
        
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'uniform vec2 start;',
        'uniform vec2 peak;',
        'uniform vec2 end;',
        
        'float lerp(float t){',
        '   float x = t * t;',
        '   return x / (x + (1.0-t)*(1.0-t));',
        '}',
        
        'void main(void) {',
        '   //vec4 sum = vec4(vTextureCoord.y, 0.0, 0.0, 0.0);',
        '   vec4 sum = vec4(0.0);',
        '   float ty = 1.0 - vTextureCoord.y;',
        '   float mid = (peak.x - start.x) / (end.x - start.x);',
        '   float height = vTextureCoord.x > mid ? lerp(((end.x - peak.x) - (vTextureCoord.x-peak.x)) / (end.x - peak.x)) : lerp(1.0 - (peak.x -vTextureCoord.x) / peak.x);', 
        '   float yPos = vTextureCoord.x > mid ? end.y + (peak.y - end.y) * height : start.y + (peak.y - start.y) * height;',
        '   sum += (yPos >= ty) ? texture2D(uSampler, vec2(vTextureCoord.x, 1.0 - (ty / yPos))) : vec4(0.0);',
        '   //sum = vec4(ty / yPos, 0, 0, 0);',    
        '   gl_FragColor = sum;',
        '}'
    ];
};

PIXI.HillFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.HillFilter.prototype.constructor = PIXI.HillFilter;

/**
 * Sets the strength of the first control point of the curve.
 *
 * @property p0
 * @type position of first control point
 * @default 0, 0
 */
Object.defineProperty(PIXI.HillFilter.prototype, 'start', {
    get: function() {
        return this.uniforms.start.value;
    },
    set: function(value) {
        this.uniforms.start.value = value;
    }
});
/**
 * Sets the strength of the second control point of the curve.
 *
 * @property p0
 * @type position of second control point
 * @default 0, 0
 */
Object.defineProperty(PIXI.HillFilter.prototype, 'peak', {
    get: function() {
        return this.uniforms.peak.value;
    },
    set: function(value) {
        this.uniforms.peak.value = value;
    }
});
/**
 * Sets the strength of the third control point of the curve.
 *
 * @property p0
 * @type position of third control point
 * @default 0, 0
 */
Object.defineProperty(PIXI.HillFilter.prototype, 'end', {
    get: function() {
        return this.uniforms.end.value;
    },
    set: function(value) {
        this.uniforms.end.value = value;
    }
});