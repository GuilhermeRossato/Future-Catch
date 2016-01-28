"use strict";

var cnvc;

window.addEventListener("load",function() {
	cnvc = new CanvasController(document.getElementById("canvasRecipient"));
	//cnvc.addEventListener("mousemove", function() { return false; });
	cnvc.addButton(new GuiButton("Click this fancy button", 10, 10));
	cnvc.addButton(new GuiButton("Sofisticated buttons", 10, 50));
	cnvc.objects.push({draw:function(ctx) { ctx.fillStyle = "#000"; ctx.fillRect(100,100,cnvc.objects[3].width+15,34); }});
	cnvc.addButton(new GuiButton("This button tests bounding box clear!", 105, 105));
	
});
