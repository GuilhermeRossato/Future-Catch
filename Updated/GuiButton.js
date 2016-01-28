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
 * 	constructor(title[, px, py, width, height]);		Class Constructor ( new GuiButton(...) )
 * 		title					String containing the text to be displayed on the 
 * 		px						Horizontal position in pixels [default 20 ]
 * 		py						Vertical position in pixels [ default 20 ]
 * 		width					Horizontal size of element, zero for automatic size [ default 0 (stretch for text) ]
 * 		height					Vertical size of element [ default 20 ]
 * 
 *	.checkBounds(x, y)			Returns true or false depending whenever the specified parameters are inside the button or not
 * 	.draw(ctx);					Function that a CanvasController calls when it's supposed to draw the button, one parameter: CanvasRenderingContext2D (ctx)
 * 	.onMouseMove(x, y);
 * 	.onMouseDown(btnId, x, y);
 * 	.onMouseUp(btnId, x, y);
 * 
 * --------------------------------------------------------------------------------------------------------
 * Normal Properties:
 *	.px				Holds the horizontal position
 * 	.py				Holds the vertical position
 * 	.anchorX		String that indicates where horizontal position points to, candidates are: "left" (default), "middle", "right"
 * 	.anchorY		String that indicates where vertical position points to, candidates are: "top" (default), "middle", "bottom"
 * 	.isToggle		Boolean that makes button act as a toggle switch
 * 	.isDown			Boolean that tells the user whenever the button is being pressed (or toggled down, if it's the case)
 *  .onClickDown	Function that is fired when the button is pressed with left key
 * 	.onClick		Function that is fired when the left mouse button is released
 * 	.graphic
 * 		{roundness: 5,		 	Margin for Round Corners in pixels (0 = square)
 * 		 shadow: 3,				Shadow dropdown in pixels
 * 		 color:"#33495E",		Color for fillStyle of foreground
 * 		 shadowColor:"#222"		Color for fillStyle of shadow
 *		 overColor:"#2E4154"	Color for fillstyle when the mouse is over the button
 *		 textColor:"#EEE"		Color for fillText for the title of the button
 *		}
 * --------------------------------------------------------------------------------------------------------
 * "Private" Properties:
 * 	.state		Numeric value to hold what state is the button at (0,1,2,3 or 4,5,6,7)
 * 	
 */

// Flat UI Buttons concept and colors from: https://github.com/designmodo/Flat-UI

function GuiButton(title, px, py, width, height) {
	var ancX = "left", ancY = "top";
	
	this.px = px;
	this.py = py;
	this.width = width;
	this.height = height;
	this.text = title;
	
	if ( typeof(this.px) !== "number" || isNaN(this.px) || this.px == 0 )
		this.px = 0;
	if ( typeof(this.py) !== "number" || isNaN(this.py) || this.py == 0 )
		this.py = 0;
	if ( typeof(this.width) !== "number" || isNaN(this.width) || this.width == 0 )
		this.width = 20+this.text.length*4.71;
	if ( typeof(this.height) !== "number" || isNaN(this.height) || this.height == 0 )
		this.height = 20;
			
	Object.defineProperty(this,"anchorX",{
		configurable: false,
		enumerable: false,
		get: function() { return ancX; },
		set: function(value) {
				value = value.toLowerCase();
				if (value === "left" || value === "middle" || value === "right")
					ancX = value;
				else if (value === "center")
					ancX = "middle";
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
				else if (value === "center")
					ancY = "middle";
				else
					console.error("Incorrect parameter to vertical anchor, candidates are: \"top\", \"middle\", \"bottom\".");
			}
	});
	Object.defineProperty(this,"boundingRect",{
		configurable: false,
		enumerable: false,
		get: function() { return {top:this.py, left:this.px, right:this.px+this.width, bottom:this.py+this.height}; },
		set: function(value) { console.error("boundingRect is unassignable. Use .px, .py, .width and .height"); }
	});
	console.log(this.boundingRect);
	Object.defineProperty(this,"isToggle",{
		configurable: false,
		enumerable: false,
		get: function() { return (state >= 3) },
		set: function(value) {
			if (value && (state < 3))
				state += 4;
			else if ((!value) && (state >= 3))
				state -= 4;
		}
	});
}

GuiButton.prototype = {
	constructor: GuiButton,
	state: 0,
	isDown: false,
	graphic: {roundness: 5, shadow: 3, color:"#33495E", shadowColor:"#222", overColor:"#2E4154", textColor:"#EEE"},
	
	onMouseMove: function (x, y) {
		var isInside = this.checkBounds(x, y);
		if ((this.state === 0 || this.state === 4) && isInside) {
			this.state = 1;
		} else if ((this.state === 1 || this.state === 5) && (!isInside)) {
			this.state = 0;
		}
	},
	onMouseDown: function (btnId, x, y) {
		if ((btnId === 0) && (this.state === 1) && this.checkBounds(x, y)) {
			this.state = 2;
			this.isDown = true;
			if (this.onClickDown instanceof Function)
				this.onClickDown(x-this.px, y-this.py);
		}
	},
	onMouseUp: function (btnId, x, y) {
		if (this instanceof GuiButton)
		{
			if (btnId === 0) {
				var isInside = this.checkBounds(x, y);
				if (this.state === 2) {
					if (isInside) {
						this.isDown = false;
						if (this.onClick instanceof Function)
							this.onClick(x-this.px, y-this.py);
					}
				}
				this.state = isInside?1:0;
			}
		} else
			console.error("Method should run from an instance of GuiButton. use .call(instance of GuiButton, rest, of, parameters)");
	},
	clear: function(ctx) {
		var rect = this.boundingRect;
		ctx.clearRect(rect.left-1, rect.top-1, this.width+this.graphic.shadow+2, this.height+this.graphic.shadow+2);
	},
	draw: function(ctx) {
		if (this instanceof GuiButton) {
			if (ctx instanceof CanvasRenderingContext2D) {
				var rect = this.boundingRect;
				function dr(roundness) {
					ctx.beginPath();
					ctx.moveTo(rect.left+roundness, rect.top);
					ctx.lineTo(rect.right-roundness, rect.top);
					ctx.quadraticCurveTo(rect.right, rect.top, rect.right, rect.top+roundness);
					ctx.lineTo(rect.right, rect.bottom-roundness);
					ctx.quadraticCurveTo(rect.right, rect.bottom, rect.right-roundness, rect.bottom);
					ctx.lineTo(rect.left+roundness, rect.bottom);
					ctx.quadraticCurveTo(rect.left, rect.bottom, rect.left, rect.bottom-roundness);
					ctx.lineTo(rect.left, rect.top+roundness);
					ctx.quadraticCurveTo(rect.left, rect.top, rect.left+roundness, rect.top);
				}
				
				ctx.save();
				ctx.fillStyle = this.graphic.shadowColor;
				ctx.translate(this.graphic.shadow, this.graphic.shadow);
				dr.call(this, this.graphic.roundness*1.5);
				ctx.fill();
				
				if (this.state === 0 || this.state === 4) {
					ctx.translate(-this.graphic.shadow, -this.graphic.shadow);
					ctx.fillStyle = this.graphic.color;
				}
				else if (this.state === 1 || this.state === 5) {
					ctx.translate(-this.graphic.shadow, -this.graphic.shadow);
					ctx.fillStyle = this.graphic.overColor;
				} else {
					ctx.translate(-1, -1);
					ctx.fillStyle = this.graphic.overColor;
				}
				dr.call(this, this.graphic.roundness);
				ctx.fill();
				ctx.textAlign="center";
				ctx.textBaseline="middle";
				ctx.fillStyle = this.graphic.textColor;
				ctx.fillText(this.text, (rect.left+rect.right)/2, (rect.top+rect.bottom)/2);
				ctx.restore();
			} else 
				console.error("First parameter is supposed to be instance of CanvasRenderingContext2D:",ctx);
		} else
			console.error("Method should run from an instance of GuiButton. use .call(instance of GuiButton, rest, of, parameters)");
	},
	autosize: function(ctx) {
		if (this instanceof GuiButton) {
			if (ctx instanceof CanvasRenderingContext2D)
				return (this.width = 20+ctx.measureText(this.text).width);
			else
				return (this.width = 20+text.length*4.71); // magic number = approximation
		} else
			console.error("Method should run from an instance of GuiButton. use .call(instance of GuiButton, rest, of, parameters)");
	},
	checkBounds: function(x, y) {
		if (this instanceof GuiButton) {
			var rect = this.boundingRect;
			return ((x > rect.left) && (x < rect.right+this.graphic.shadow) && (y > rect.top) && (y < rect.bottom+this.graphic.shadow)); 
		} else
			console.error("Method should run from an instance of GuiButton. use .call(instance of GuiButton, rest, of, parameters)");
	}
}
