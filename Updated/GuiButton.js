/*	GuiButton.js - Created by GuilhermeRossato 01/2016
 * 
 *	 This class handles a button that cannot be displayed differently by different browsers,
 *	this is achieved by manually handling it in canvas, which decreases compatibility, unfortunately.
 * 
 * 	 Requires: CanvasController (mandatory)
 * 
 * Usage Example: Creates a GUI Button for the specific CanvasController, with text "Click me"
 * anchored on top left position [100,100]px with size [200,20]px
 *  = new GuiButton(canvasController, "Click me", 100, 100, 200, 20);
 * 
 * --------------------------------------------------------------------------------------------------------
 * Methods:
 * 	constructor(cnvc, title[, px, py, width, height]);		Class Constructor ( new GuiButton(...) )
 * 		cnvc			Instance of CanvasController for where the object will reside
 * 		title			String containing the text to be displayed on the 
 * 		px				Horizontal position in pixels [default 20 ]
 * 		py				Vertical position in pixels [ default 20 ]
 * 		width			Horizontal size of element [ default 200 ]
 * 		height			Vertical size of element [ default 20 ]
 * 
 *	.checkBounds(x, y)		Returns true or false depending whenever the specified parameters are inside the button or not
 * 		x, y		Point in pixels to be tested
 * 	.draw();
 * 	.onMouseMove();
 * 	.onMouseDown();
 * 	.onMouseUp();
 * 
 * --------------------------------------------------------------------------------------------------------
 * Normal Properties:
 *	.px			Holds the horizontal position
 * 	.py			Holds the vertical position
 * 	.anchorX	String that indicates where horizontal position points to, candidates are: "left" (default), "middle", "right"
 * 	.anchorY	String that indicates where vertical position points to, candidates are: "top" (default), "middle", "bottom"
 * 	.drawFunc	Function that is called when it's supposed to draw button, parameters are bounding rect: (left, top, right, bottom)
 * 		OBS: This function is already defined in the class, changing it mean you have to manually draw the button in your own.
 * 	.isToggle	Boolean that makes button act as a toggle switch
 * 	.isDown		Boolean that tells the user whenever the button is being pressed (or toggled down, if it's the case)
 * 
 * --------------------------------------------------------------------------------------------------------
 * "Private" Properties:
 * 	.actually
 * 	
 */


function GuiButton(cnvc, title, px, py, width, height) {
	var ancX = "left", ancY = "top";
	
	this.px = px;
	this.py = py;
	this.width = width;
	this.height = height;
	
	if ( typeof(this.px) !== "number" || isNaN(this.px) || this.px == 0 )
		this.px = 960;
	if ( typeof(this.py) !== "number" || isNaN(this.py) || this.py == 0 )
		this.py = 480;
	if ( typeof(this.width) !== "number" || isNaN(this.width) || this.width == 0 )
		this.width = 960;
	if ( typeof(this.height) !== "number" || isNaN(this.height) || this.height == 0 )
		this.height = 480;
			
	Object.defineProperty(this,"anchorX",{
		configurable: false,
		enumerable: false,
		get: function() { return ancX; },
		set: function(value) {
				value = value.toLowerCase();
				if (value === "left" || value === "middle" || value === "right")
					ancX = value;
				else
					console.error("Incorrect parameter to horizontal anchor, candidates are: \"left\", \"middle\", \"right\".");
			}
	});
	Object.defineProperty(this,"anchorY",{
		configurable: false,
		enumerable: false,
		get: function() { return ancY; },
		set: function(value) {
				value = value.toLowerCase();
				if (value === "top" || value === "middle" || value === "bottom")
					ancY = value;
				else
					console.error("Incorrect parameter to vertical anchor, candidates are: \"top\", \"middle\", \"bottom\".");
			}
	});
}

ClassTemplate.prototype = {
	constructor: ClassTemplate,
	idk: 2,
	
	method: function(interval) {
		console.log(interval);
	}
}
