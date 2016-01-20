/* Usage */
/* 
 * Create the object when then the recipient you want the canvas in is loaded: 
 *  = new CanvasController(document.getElementById("recipient"));
 * 
 * Constant Properties:
 *	.canvas;		instance of HTMLCanvasElement
 *	.ctx;			instanceof CanvasRenderingContext2D 
 * 	
 * Normal Properties:
 * 
 * 
 * Methods:
 * 	constructor(recipient[, width, height]);	Class Constructor ( new CanvasController(...) )
 *		recipient	instance of HTMLDivElement for the canvas to be put at
 * 		width,...	starting size of the canvas element in pixels (default 960x480 px)
 * 
 * 	.addEventListener(type, listener);			Sends a call to 'listener' before processing a specific event
 * 		type (string): "mousemove", "mousedown", "mouseup", "mouseclick", "keydown", "keyup"
 * 			listener (function): function to call when event happens
 * 		WARNING: listener MUST return logicly true value, otherwise the call will be aborted
 *		WARNING: useCapture	(from original addEventListener) IS NOT implemented and WILL be ignored
 * 
 * 	.removeEventListener(type, listener);		Removes a specific listener function from a specific event type
 * 		same as addEventListener
 * 
 * 	.clearEventListener(type)
 * 		type (string): "mousemove", "mousedown", "mouseup", "mouseclick", "keydown", "keyup"
 * 		Nothing
 * "Private" Properties:
 * .events;		instance of Array with keys corresponding to event types (string) to help with event listeners.
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
		this.canvas.oncontextmenu= function () { return false }
		Object.defineProperty(this,"ctx",{
			configurable: false,
			enumerable: false,
			value: this.canvas.getContext("2d"),
			writable: false
		});
		
		recipient.appendChild(this.canvas);
		console.log("Canvas appended to", recipient.id ,"with size",local_width, local_height);
		
		//document.addEventListener("mousemove", this.onMouseMove, false);
		//document.addEventListener("mousedown", this.onMouseDown, false);
		//document.addEventListener("mouseup", this.onMouseUp, false);
	} else
		console.error("Canvas recipient:" , recipient, "should be a HTMLDivElement instance. (CanvasController)");
}

CanvasController.prototype = {
	constructor: CanvasController,
	events: new Array(),
	onMouseMove: function (ev) {
		if (this.events["mousemove"] instanceof Array)
			this.events["mousemove"].forEach(obj => console.log(obj));
		
		//mouse.vec_pos.x = ev.clientX-canvas.offsetLeft;
		//mouse.vec_pos.y = ev.clientY-canvas.offsetTop;
		
	},
	addEventListener: function (type, listener) {
		if (typeof(type) === "string") {
			let id = eventCandidates.indexof(type.toLowerCase());
			if (id !== -1) {
				if (this.events[type.toLowerCase()] === undefined) {
					this.events[type.toLowerCase()] = [listener];
				} else {
					id = this.events[type.toLowerCase()].indexof(listener);
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
		if ((typeof(type) === "string")&&(eventCandidates.indexof(type.toLowerCase()) !== -1)) {
			if (this.events[type.toLowerCase()] instanceof Array) {
				var id = this.events[type.toLowerCase()].indexof(listener); 
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
		if ((typeof(type) === "string")&&(eventCandidates.indexof(type.toLowerCase()) !== -1)) {
			this.events[type.toLowerCase()] = undefined;
		} else
			console.error("No event of type \"" + type.toLowerCase() + "\" in CanvasController");
			//First parameter must be one from the "eventCandidates" variable (global constant)
	}
}