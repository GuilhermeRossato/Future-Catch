/*	CanvasController.js - Created by GuilhermeRossato 01/2016
 * 
 * Create the object when then the recipient you want the canvas in is loaded: 
 *  = new CanvasController(document.getElementById("recipient"));
 * --------------------------------------------------------------------------------------------------------
 * Constant Properties:
 *	.canvas;		instance of HTMLCanvasElement (HTML5)
 *	.ctx;			instanceof CanvasRenderingContext2D
 * --------------------------------------------------------------------------------------------------------
 * Normal Properties:
 * 	.mouse.x		Number, mouse's horizontal position in pixels relative to the canvas, 0 is left, canvas width is right
 * 	.mouse.y		Number, mouse's vertical position in pixels relative to the canvas, 0 is top, canvas height is bottom
 *  .timestamper	Instance of Timestamper if it is declared, for usage see Timestamper.js
 * --------------------------------------------------------------------------------------------------------
 * Methods:
 * 	constructor(recipient[, width, height]);	Class Constructor ( new CanvasController(...) )
 *		recipient	Instance of HTMLDivElement for the canvas to be put at
 * 		width,...	starting size of the canvas element in pixels (default 960x480 px)
 * 
 * 	.print(...)									Output/Debug helper, shows text in canvas at bottom right
 * 
 * 	.addEventListener(type, listener);			Sends a call to 'listener' before processing a specific event
 * 		type (string): "mousemove", "mousedown", "mouseup", "mouseclick", "keydown", "keyup"
 * 		listener (function): function to call when event happens
 * 		WARNING: listener MUST return logicly true value, otherwise the call will be aborted
 *		WARNING: useCapture	(from original addEventListener) IS NOT implemented and WILL be ignored
 * 
 * 	.removeEventListener(type, listener);		Removes a specific listener function from a specific event type
 * 		same as addEventListener
 * 
 * 	.clearEventListener(type)
 * 		type (string): "mousemove", "mousedown", "mouseup", "mouseclick", "keydown", "keyup"
 * 		Nothing
 * --------------------------------------------------------------------------------------------------------
 * "Private" Properties:
 *		.events;		Instance of Array with keys corresponding to event types (string) to help with event listeners.
 * 		.prints;		Instance of Array with objects corresponding to debug information displayed on screen
 */

var eventCandidates = ["mousemove", "mousedown", "mouseup", "mouseclick", "keydown", "keyup"];

function CanvasController(recipient, width, height) {
	console.log("Canvas Controller Instance Created");
	if (recipient instanceof HTMLDivElement) {
		var local_width = width, local_height = height;
		if ( typeof(local_width) !== "number" || isNaN(local_width) )
			local_width = 960;
		if ( typeof(local_height) !== "number" || isNaN(local_height) )
			local_height = 480;
		
		Object.defineProperty(this,"canvas",{
			configurable: false,
			enumerable: false,
			value: document.createElement('canvas'),
			writable: false
		});
		this.canvas.setAttribute('id','canvas');
		this.canvas.width = local_width;
		this.canvas.height = local_height;
		this.canvas.oncontextmenu = function () { return false; };
		recipient.appendChild(this.canvas);
		console.log("Canvas appended to", recipient.id ,"with size",local_width, local_height);
		
		Object.defineProperty(this,"ctx",{
			configurable: false,
			enumerable: false,
			value: this.canvas.getContext("2d"),
			writable: false
		});
		
		var holdThis = this;
		document.addEventListener("mousemove", function(ev) { CanvasController.prototype.onMouseMove.call(holdThis, ev); }, false);
		document.addEventListener("mousedown", function(ev) { CanvasController.prototype.onMouseDown.call(holdThis, ev); }, false);
		document.addEventListener("mouseup", function(ev) { CanvasController.prototype.onMouseUp.call(holdThis, ev); }, false);
		
		if (Timestamper) {
			this.timestamper = new Timestamper(60,delta => console.log("elapsed!",delta));
		}
		
	} else
		console.error("Canvas recipient:" , recipient, "should be a HTMLDivElement instance. (CanvasController)");
}

CanvasController.prototype = {
	constructor: CanvasController,
	events: new Array(),
	prints: new Array(),
	mouse: {x:960/2, y:480/2},
	
	onMouseMove: function (ev) {
		if (!(this.events["mousemove"] instanceof Array)||(this.events["mousemove"].every(obj => obj.call(this, ev.clientX - this.canvas.offsetLeft, ev.clientY - this.canvas.offsetTop))))
			console.log("Process Mouse Move");
	},
	onMouseDown: function (ev) {
		if (!(this.events["mousedown"] instanceof Array)||(this.events["mousedown"].every(obj => obj.call(this, ev.clientX - this.canvas.offsetLeft, ev.clientY - this.canvas.offsetTop))))
			console.log("Process Mouse Down");
	},
	onMouseUp: function (ev) {
		if (!(this.events["mouseup"] instanceof Array)||(this.events["mouseup"].every(obj => obj.call(this, ev.clientX - this.canvas.offsetLeft, ev.clientY - this.canvas.offsetTop))))
			console.log("Process Mouse Up");
	},
	print: function() {
		if (this.prints instanceof Array) {
			var i;
			for (i=0;i<this.prints.length;i++)
				if (!this.prints[i].enabled)
					break;
			if (i > 9) i = 9;
			this.prints[i] = {enabled: true, life:10000, text:""};
			for (i=0;i<arguments.length;i++) {
				text += toString(arguments[i]);
			}
		} else 
			console.error("Error: This instance doesn't have a valid \".prints\" property");
	},
	addEventListener: function (type, listener) {
		if (typeof(type) === "string") {
			var id = eventCandidates.indexOf(type.toLowerCase());
			if (id !== -1) {
				if (this.events[type.toLowerCase()] === undefined) {
					this.events[type.toLowerCase()] = [listener]; // Create if it's empty
				} else {
					id = this.events[type.toLowerCase()].indexOf(listener);
					if (id === -1) {
						this.events[type.toLowerCase()].push(listener);
					} else
						console.error("Specified listener is already connected to the event of type \""+type.toLowerCase()+"\"");
						// You should not add the same function to the same event, it's looked down upon.
				}
			} else
				console.error("No event of type \"" + type.toLowerCase() + "\" in CanvasController");
				//First parameter must be one from the "eventCandidates" variable (global constant)
		} else
			console.error("First argument (",typeof(type),") is supposed to be a string");
	},
	removeEventListener: function (type, listener) {
		if ((typeof(type) === "string")&&(eventCandidates.indexOf(type.toLowerCase()) !== -1)) {
			if (this.events[type.toLowerCase()] instanceof Array) {
				var id = this.events[type.toLowerCase()].indexOf(listener); 
				if (id !== -1) {
					console.log("deleting id ",id);
					delete this.events[type.toLowerCase()][id];
				}
			}
		} else
			console.error("No event of type \"" + type.toLowerCase() + "\" in CanvasController");
			//First parameter must be one from the "eventCandidates" variable (global constant)
	},
	clearEventListener: function (type) {
		if ((typeof(type) === "string")&&(eventCandidates.indexOf(type.toLowerCase()) !== -1)) {
			this.events[type.toLowerCase()] = undefined;
		} else
			console.error("No event of type \"" + type.toLowerCase() + "\" in CanvasController");
			//First parameter must be one from the "eventCandidates" variable (global constant)
	}
}