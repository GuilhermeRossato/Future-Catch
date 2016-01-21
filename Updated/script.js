"use strict";

var cnvc;

window.addEventListener("load",function() {
	cnvc = new CanvasController(document.getElementById("canvasRecipient"));
	//cnvc.addEventListener("mousemove", function(x, y) { console.log("got1", x, y); return false; });
});
