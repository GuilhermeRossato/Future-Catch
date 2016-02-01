"use strict";

var cnvc;

window.addEventListener("load",function() {
	cnvc = new CanvasController(document.getElementById("canvasRecipient"));
	//cnvc.addEventListener("mousemove", function() { return false; });
	console.log(cnvc.ctx,'out');
	cnvc.addButton(new GuiButton("Click", 10, 0, 0, 0, cnvc.ctx)).box.bottom = cnvc.height-10;
	cnvc.addButton(new GuiButton("Testing", cnvc.objects[0].box.left+cnvc.objects[0].box.width+10, cnvc.objects[0].box.top, 0, 0, cnvc.ctx));
	cnvc.addButton(new GuiButton("My", cnvc.objects[1].box.left+cnvc.objects[1].box.width+10, cnvc.objects[1].box.top, 0, 0, cnvc.ctx));
	cnvc.addButton(new GuiButton("Greantes", cnvc.objects[2].box.left+cnvc.objects[2].box.width+10, cnvc.objects[2].box.top, 0, 0, cnvc.ctx));
	//cnvc.addButton(new GuiButton("Sofisticated buttons", cnvc.objects[0].x+cnvc.objects[0].width+10, cnvc.height-30));
	//cnvc.addButton(new GuiButton("Testing things", cnvc.objects[1].x+cnvc.objects[1].width+10, cnvc.height-30));
	//cnvc.objects.push({draw:function(ctx) { ctx.fillStyle = "#000"; ctx.fillRect(100,100,cnvc.objects[3].width+15,34); }});
	//cnvc.addButton(new GuiButton("This button tests bounding box clear!", 105, 105));
	
});
