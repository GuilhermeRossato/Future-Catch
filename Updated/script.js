"use strict";

var cnvc;

window.addEventListener("load",function() {
	cnvc = new CanvasController(document.getElementById("canvasRecipient"));
	cnvc.addEventListener("mousemove", function(x, y) { console.log("got1", x, y); return true; });
	cnvc.addEventListener("mousemove", function(x, y) { console.log("got2", x, y); return false; });
	cnvc.addEventListener("mousemove", function(x, y) { console.log("got3", x, y); return false; });
});
