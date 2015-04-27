

var SCREEN_Z = -100;
var SCREEN_X = -100;
var SCREEN_Y = -100;

// x y z
var SCREEN_TOP_LEFT = [100, 
		       -100, 
		       SCREEN_Z];

var SCREEN_BOTTOM_RIGHT = [-100, 
			   100, 
			   SCREEN_Z];

var EYE_POS = [0, 
	       0, 
	       -200];


// env

// sphere  x,y,z,R
var s1 = [0,0,0,50];
var s2 = [0,0,0,20];


function debug(obj){
    console.log(obj);
}

function getContext(){
    var canvas = document.getElementById('raycanvas');
    var ctx = canvas.getContext('2d');

    return {
	context : ctx,
	canvas  : canvas
    };
}

function createImage(ctx, width, height){
    return ctx.createImageData(width, height);
}

function getImage(ctx, width, height){
    return ctx.getImageData(0, 0, width, height);
}

function updateCanvas(ctx, img) {
    ctx.putImageData(img, 0, 0);
}

function drawPixel (img, width, x, y, r, g, b, a) {
    var index = (x + y * width) * 4;

    img.data[index + 0] = r;
    img.data[index + 1] = g;
    img.data[index + 2] = b;
    img.data[index + 3] = a;
}

function fillRect(ctx){
    ctx.fillStyle = 'red';
    ctx.fillRect(30, 30, 50, 50);
}

// la sphere ne peut etre qu'en position 0,0,0
function intersectionSphere(point, vector, sphere)
{
    ret = false;
    
    var a = Math.pow(vector[0], 2) + 
	Math.pow(vector[1], 2) + 
	Math.pow(vector[2], 2);

    var b = 2 * (vector[0] * point[0] +
		      vector[1] * point[1] +
		      vector[2] * point[2]);

    // b += 2 * ()

    var c = Math.pow(point[0], 2) +
	Math.pow(point[1], 2) +
	Math.pow(point[2], 2) -
	Math.pow(sphere[3], 2);

    
    // debug(a + " x2 + " + b + " x + " + c);

    // discriminant
    var d = Math.pow(b,2) - 4 * a * c;

    // debug(d);

    // if d < 0   no solution
    if (d == 0) // une solution
    {
	// var x = -1 * b / 2a;
	ret = true;
	
	debug("coucou");
    }
    else if (d > 0)  // deux solutions
    {
	//var x1 = (-1 * b - Math.sqrt(d)) / (2 * a);
	//var x2 = (-1 * b + Math.sqrt(d)) / (2 * a);
	
	debug("coucou");
	ret = true
    }

    return ret;
}


function trace(){
    context = getContext();
    img = createImage(context.context, context.canvas.width, context.canvas.height);

    for (var x = 0; x < context.canvas.width; x++)
    {
	for (var y = 0; y < context.canvas.height; y++)
	{
	    r = 0;
	    g = 0;
	    b = 0;
	    a = 255;
	    
	    // console.log(x , y);

	    // vecteur
	    vx = EYE_POS[0] - x + SCREEN_X;
	    vy = EYE_POS[1] - y + SCREEN_Y;
	    vz = EYE_POS[2] - SCREEN_Z;

	    vvx = x - EYE_POS[0] + SCREEN_X;
	    vvy = y - EYE_POS[1] + SCREEN_Y;
	    vvz = SCREEN_Z - EYE_POS[2];


	    var point = [x + SCREEN_X, y + SCREEN_Y, SCREEN_Z];
	    var vector = [vvx, vvy, vvz];

	    //debug(EYE_POS + " -> " + point + " => " + vector);

	    if  (intersectionSphere(EYE_POS, vector, s1)){
		r = 255;
	    }

	    drawPixel (img, context.canvas.width, x, y, r, g, b, a)
	    
	}
    }
    updateCanvas(context.context, img);

}
