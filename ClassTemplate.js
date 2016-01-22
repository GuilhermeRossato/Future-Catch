/*	ClassTemplate.js - Created by GuilhermeRossato 01/2016
 * 
 *  <What this class does, what's it usefull for>
 * 
 *  <Requirements>
 * 
 *  <Basic information about how to use it if it's not evident enough>
 * 
 * Usage Example: <what the next line will do>
 *  = new ClassTemplate();
 * <Indepth explanation of above line, if necessary>
 * 
 * --------------------------------------------------------------------------------------------------------
 * Methods:
 * 	constructor();			Class Constructor ( new ClassTemplate(...) )
 * 		parameter1			Type, whats the parameter for
 * 
 *	.method(interva])		Method that methodizes things
 * 		interval			Type, whats the parameter for
 * 
 * --------------------------------------------------------------------------------------------------------
 * Constant Properties:
 *	.idk				Type, Hold some value
 * 
 * --------------------------------------------------------------------------------------------------------
 * Normal Properties:
 *	.idk				Type, Hold some value
 * 
 * --------------------------------------------------------------------------------------------------------
 * "Private" Properties:
 * 	.actually
 * 	
 */


function ClassTemplate() {
	var truly_private = 1;
}

ClassTemplate.prototype = {
	constructor: ClassTemplate,
	idk: 2,
	
	method: function(interval) {
		console.log(interval);
	}
}
