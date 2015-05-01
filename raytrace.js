
function debug(obj){
    console.log(obj);
}

function getContext(){
    var canvas = document.getElementById('raycanvas');
    var ctx = canvas.getContext('2d');

    debug(canvas);
    debug(ctx);

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

function testIntersectionPlan()
{

    point = intersectionPlan([2,1,2],
			     [3,-1,2],
			     {
				 type: OBJECT.PLAN,
				 equation: [1,1,2,-5],
				 color: WHITE
			     });

    debug(point); // t == -1/3,  [1,4/3,4/3]
}

function intersectionPlan(point, vector, plan){
    var t = 	-(plan.equation[0] * point[0] +
		  plan.equation[1] * point[1] +
		  plan.equation[2] * point[2] +
		  plan.equation[3]) /
	(plan.equation[0] * vector[0] + 
	 plan.equation[1] * vector[1] +
	 plan.equation[2] * vector[2]);
    
    if (plan.equation[0] * (point[0] + vector[0] * t) +
	plan.equation[1] * (point[1] + vector[1] * t) +
	plan.equation[2] * (point[2] + vector[2] * t) +
	plan.equation[3] == 0)
    {
	var x = point[0] + vector[0] * t;
	var y = point[1] + vector[1] * t;
	var z = point[2] + vector[2] * t;


	if (true/*z > SCREEN_Z*/){
	    return {
		point: [x,y,z],
		t: t,
		color: plan.color,
		z:1
	    };
	} 
    }
    return {
	color: BLACK,
	z: -1
    };
}

/**
 * @brief   checks the intersection(s) of the ray with a sphere 
 *          on cherche les coefficients de l'equation ax²+bx+c=0
 *	    the algebric way
 * @return  the color of the targeted object, black otherwise
 */
function intersectionSphere(point, vector, sphere){
    var a = Math.pow(vector[0], 2) + 
	Math.pow(vector[1], 2) + 
	Math.pow(vector[2], 2);

    var b = 2 * (vector[0] * point[0] 
		 - vector[0] * sphere.center[0]
		 + vector[1] * point[1]
		 - vector[1] * sphere.center[1]
		 + vector[2] * point[2]
		 - vector[2] * sphere.center[2]);

    var c = Math.pow(point[0], 2)
	- 2 * sphere.center[0] * point[0]
	+ Math.pow(sphere.center[0], 2)
	+ Math.pow(point[1], 2) 
	- 2 * sphere.center[1] * point[1]
	+ Math.pow(sphere.center[1], 2)
	+ Math.pow(point[2], 2) 
	- 2 * sphere.center[2] * point[2]
	+ Math.pow(sphere.center[2], 2)
	- Math.pow(sphere.radius, 2);
    
    // debug(a + " x2 + " + b + " x + " + c);

    // discriminant
    var d = Math.pow(b,2) - 4 * a * c;

    // if d < 0   no solution
    if (d == 0) // une solution rayon tangeant
    {
	// var x = -1 * b / 2a;
	return {
	    color: sphere.color,
	    z:1
	};
    }
    else if (d > 0)  // deux solutions qui sont les deux intersections
    {
	//var x1 = (-1 * b - Math.sqrt(d)) / (2 * a);
	//var x2 = (-1 * b + Math.sqrt(d)) / (2 * a);
	return {
	    color: sphere.color,
	    z:1
	};
    }

    return {
	color: BLACK,
	z: -1
    };
}

function intersectionCylinder(point, vector, cylinder){
    var a = Math.pow(vector[0], 2) + 
	Math.pow(vector[1], 2);

    
    // debug(a + " x2 + " + b + " x + " + c);

    // discriminant
    var d = Math.pow(b,2) - 4 * a * c;

    // if d < 0   no solution
    if (d == 0) // une solution rayon tangeant
    {
	// var x = -1 * b / 2a;
	return {
	    color: cylinder.color,
	    z:1
	};
    }
    else if (d > 0)  // deux solutions qui sont les deux intersections
    {
	//var x1 = (-1 * b - Math.sqrt(d)) / (2 * a);
	//var x2 = (-1 * b + Math.sqrt(d)) / (2 * a);
	return {
	    color: cylinder.color,
	    z:1
	};
    }

    return {
	color: BLACK,
	z: -1
    };
}

/**
 * @brief fire a ray 
 */
function fireRay(world, context, img, x, y){
   
    var color = BLACK;
    
    // vecteur
    vx = x - EYE_POS[0] + SCREEN_X;
    vy = y - EYE_POS[1] + SCREEN_Y;
    vz = SCREEN_Z - EYE_POS[2];
 
    var vector = [vx, vy, vz];
    
    world.some(function(obj) {
	
	if (obj.type == OBJECT.SPHERE){
	    point = intersectionSphere(EYE_POS, vector, obj);
	}
	else if (obj.type == OBJECT.PLAN){
	    point = intersectionPlan(EYE_POS, vector, obj);
	}
	
	// break if we touch a sphere otherwise continue
	return (point.z > 0);
    });
    
    drawPixel (img, context.canvas.width, 
	       x, 
	       y, 
	       point.color[0], point.color[1], point.color[2], point.color[3]);
}

/**
 * @brief iterate each screen point to fire a ray from the eye coordinates
 */
function trace(){
    context = getContext();
    img = createImage(context.context, context.canvas.width, context.canvas.height);
    
    for (var x = 0; x < context.canvas.width; x++)
    {
	for (var y = 0; y < context.canvas.height; y++)
	{
	    fireRay(_world, context, img, x, y);
	}
    }
    updateCanvas(context.context, img);
}

var _world = null;
function init()
{
    _world = createWorld();
    trace();
}

function test()
{
    testIntersectionPlan();
}

