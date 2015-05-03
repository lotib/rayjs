// screen bottom left position
var SCREEN_X = -200;
var SCREEN_Y = -200;
var SCREEN_Z = 50;

// eye of the scene
var EYE_POS = [0,
	       0, 
	       0];

/* declaring our world diversity */
var OBJECT = {
    SPHERE: 1,
    PLAN: 2,
}
function get_object_name(obj){
    for (var property in OBJECT)
    {
	if (obj.type == OBJECT[property])
	    return property;
    }
    return 'unknown object';
}

// colors  r,g,b,a
var BLACK= [0,0,0,255];
var WHITE= [255,255,255,255];
var RED  = [255,0,0,255];
var BLUE = [0,0,255,255];
var GREEN = [0,255,0,255];

/* object ids */
var _next_obj_id = 1;
function getNextId(){
    return _next_obj_id++;
}
function getObjectId(obj){
    if (obj == null) 
	return null;
    if (obj.id==null)
	obj.id= getNextId();
    return obj.id;
}

/**
 * @brief constructs a 3d world with objects ans coordinates 
 */
function createWorld(){
    
    var world = [];
    
    world.push({
	id: getNextId(),
	type: OBJECT.SPHERE, 
	center: [0,50,100],
	radius: 20,
	color: BLUE
    });

    world.push({
	id: getNextId(),
	type: OBJECT.SPHERE, 
	center: [50,50,300],
	radius: 40,
	color: RED
    });

    world.push({
	id: getNextId(),
	type: OBJECT.SPHERE, 
	center: [200,-50,300],
	radius: 50,
	color: GREEN
    });

    world.push({
	id: getNextId(),
	type: OBJECT.PLAN,
	equation: [1,1,1,100],
	color: WHITE
    });
    
    world.forEach(function(obj) {
	//debug(obj);
	dump_world_object(obj);
    });

    return world;
}


/**
 * @brief modifies the object using the div inputs 
 */
function on_save_object(obj, div){

    for (var child in div.childNodes){	
	
	/* iterates div childs searching for html input object 
	   if an input is found it corresponds to a object property
	*/
	if (typeof(div.childNodes[child].tagName) != 'undefined' &&
	    div.childNodes[child].tagName.toLowerCase() === "input"){
	    
	    /* if property is an array */
	    if (obj[div.childNodes[child].id] instanceof Array){
		
		obj[div.childNodes[child].id] = div.childNodes[child].value.split(/,/);
	    }
	    else // it s an integer
	    {
		obj[div.childNodes[child].id] = parseInt(div.childNodes[child].value);
	    }
	}
    }

    // print modified object
    // debug(obj);
    trace();

}

/**
 * @brief creates a div with a list of the object properties
 */
function dump_world_object(obj){
    var main_div = document.createElement('div');
    main_div.id = obj.id;
    main_div.className = 'dump_world_object';
    main_div.innerHTML = get_object_name(obj) + " (" + obj.id + ')';
    
    document.getElementById('objects').appendChild(main_div);

    for (var property in obj) {
	if (obj.hasOwnProperty(property)) {

	    /* filter some properties  */
	    if (['type', 'id'].indexOf(property) < 0)
	    {
		var property_name = document.createElement('div');
		property_name.innerHTML = property;
		var property_value = document.createElement('input');
		property_value.id = property;
		property_value.type = 'text';
		property_value.value = obj[property];
		property_value.addEventListener("keyup", function() {
		    on_save_object(obj, main_div);
		});
		
		main_div.appendChild(property_name);
		main_div.appendChild(property_value);
	    }
	}
    }

    
    /* no need call by input keyup
    var save_button = document.createElement('button');
    save_button.innerHTML = 'save';
    save_button.addEventListener("click", function() {
	on_save_object(obj, main_div);
    });
    main_div.appendChild(save_button);
    */
}
