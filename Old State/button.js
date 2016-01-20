// button primitive: text, int_fontheight, vec_pos, vec_size, int_type (0 = normal, 1 = toggleable, 2 = checkmark) , int_state (-2 = invisible; -1 = blocked; 0 = normal; 1 = hover; 2 = pressed; 3 = selected)
// mouse variable: vec_pos, button {left, middle, right}
var canvasButton = [], canvas, mouse = {vec_pos:vec2d(-1,-1), button:{ left: false, middle: false, right: false } }, button_targetId = -1, button_hoverId = -1;
var button_colorPallete = ["#1D2C1D", "#00773E", "#005B30"], isMobile = mobileAndTabletcheck();

var event_canvasButtonPress = function (obj, i) { console.log(a); }; // PLACE HOLDER!

//Call this function after drawing!
var drawButtons = function (ctx) { if (typeof(ctx)==="object"){ canvasButton.forEach(function (obj, i) {
	var wedgeVoid = 0.1;
	ctx.fillStyle = button_colorPallete[0]; // Background
	ctx.beginPath();
	ctx.moveTo((obj.vec_pos.x),(obj.vec_pos.y+obj.vec_size.y/2));
	ctx.lineTo((obj.vec_pos.x+obj.vec_size.x),(obj.vec_pos.y+obj.vec_size.y/2));
	ctx.lineTo((obj.vec_pos.x+obj.vec_size.x),(obj.vec_pos.y+obj.vec_size.y*(1-wedgeVoid)));
	ctx.lineTo((obj.vec_pos.x+obj.vec_size.x-obj.vec_size.y*(wedgeVoid)),(obj.vec_pos.y+obj.vec_size.y));
	ctx.lineTo((obj.vec_pos.x+obj.vec_size.y*(wedgeVoid)),(obj.vec_pos.y+obj.vec_size.y));
	ctx.lineTo((obj.vec_pos.x),(obj.vec_pos.y+obj.vec_size.y*(1-wedgeVoid)));
	ctx.fill();
	var depthPixel = (obj.int_state===2||obj.int_state===3)*(obj.vec_size.y*0.05)|0;
	if (obj.int_state===0) // Normal
		ctx.fillStyle = button_colorPallete[1];
	else if ((obj.int_state===1)||(obj.int_state===2)) // Hover or Down
		ctx.fillStyle = button_colorPallete[2];
	else
		ctx.fillStyle = "#fff";
	ctx.beginPath();
	ctx.moveTo((obj.vec_pos.x+obj.vec_size.y*(wedgeVoid)),(obj.vec_pos.y+depthPixel)|0);
	ctx.lineTo((obj.vec_pos.x+obj.vec_size.x-obj.vec_size.y*(wedgeVoid)),(obj.vec_pos.y+depthPixel)|0);
	ctx.lineTo((obj.vec_pos.x+obj.vec_size.x),(obj.vec_pos.y+depthPixel+obj.vec_size.y*(wedgeVoid))|0);
	ctx.lineTo((obj.vec_pos.x+obj.vec_size.x),(obj.vec_pos.y+depthPixel+obj.vec_size.y*(1-wedgeVoid*2))|0);
	ctx.lineTo((obj.vec_pos.x+obj.vec_size.x-obj.vec_size.y*(wedgeVoid)),(obj.vec_pos.y+depthPixel+obj.vec_size.y*(1-wedgeVoid))|0);
	ctx.lineTo((obj.vec_pos.x+obj.vec_size.y*(wedgeVoid)),(obj.vec_pos.y+depthPixel+obj.vec_size.y*(1-wedgeVoid))|0);
	ctx.lineTo((obj.vec_pos.x),(obj.vec_pos.y+depthPixel+obj.vec_size.y*(1-wedgeVoid*2))|0);
	ctx.lineTo((obj.vec_pos.x),(obj.vec_pos.y+depthPixel+obj.vec_size.y*wedgeVoid)|0);
	ctx.fill();
	ctx.textAlign = "center";
	ctx.font = (obj.int_fontheight|0)+"px Arial";
	ctx.fillStyle = "#fff";
	ctx.fillText(obj.text,obj.vec_pos.x+obj.vec_size.x/2,obj.vec_pos.y+obj.vec_size.y*0.62+depthPixel);
});}}

var mouseOverButton = function () // Returns ID if mouse is over a button, otherwise -1.
{
	for (var i=0;i<canvasButton.length;i++)
	{
		if ((canvasButton[i].int_state>=0)&&(canvasButton[i].int_state<=2)&&
		(mouse.vec_pos.x > canvasButton[i].vec_pos.x)&&(mouse.vec_pos.x < canvasButton[i].vec_pos.x+canvasButton[i].vec_size.x)&&
		(mouse.vec_pos.y > canvasButton[i].vec_pos.y)&&(mouse.vec_pos.y < canvasButton[i].vec_pos.y+canvasButton[i].vec_size.y))
			return i;
	}
	return -1;
}

function createButton(text, vec_posIn, vec_size, int_type)
{
	if (int_type == 2) vec_size.y = vec_size.x; // Checkmarks are circular
	return (canvasButton.push({text:text, vec_pos:vec_posIn, vec_size:vec_size, int_type: int_type, int_fontheight:((vec_size.y*0.6)|0), int_state:0})-1);
}

function button_checkPress(isPressing)
{
	var i = mouseOverButton();
	
	if (i!==-1)
	{
		if (isPressing)
		{
		if (canvasButton[i].int_type == 0)
			canvasButton[i].int_state = 2;
		else
			canvasButton[i].int_state = ((canvasButton[i].int_state==2)?1:2);
		event_canvasButtonPress(canvasButton[i],i);
		button_targetId = i;
		}
		return i;
	}
	return canvasButton.length;
}

function button_mouseMove(ev)
{
	mouse.vec_pos.x = ev.clientX-canvas.offsetLeft;
	mouse.vec_pos.y = ev.clientY-canvas.offsetTop;
	var i = button_checkPress(false);
	if ((!mouse.button.left)&&(i === canvasButton.length)&&(button_hoverId != -1)&&(canvasButton[button_hoverId].int_type===0))
	{
		canvasButton[button_hoverId].int_state = 0;
		button_hoverId = -1;
	} else if ((i<canvasButton.length)&&(button_hoverId === -1))
	{
		button_hoverId = i;
		canvasButton[button_hoverId].int_state = 1;
	} else if ((i<canvasButton.length)&&(button_hoverId >= 0)&&(button_hoverId != i)&&(button_targetId===-1))
	{
		canvasButton[button_hoverId].int_state = 0;
		button_hoverId = i;
		canvasButton[button_hoverId].int_state = 1;
	}
}

function button_mouseDown(ev)
{
	button_mouseMove(ev);
	if ((ev.buttons===1)&&(!mouse.button.left)) {
		mouse.button.left = true;
		button_checkPress(true);
	} else if ((ev.buttons===2)&&(!mouse.button.right)) {
		mouse.button.right = true;
	} else if ((ev.buttons===4)&&(!mouse.button.middle)) {
		mouse.button.middle = true;
	}
}

function button_mouseUp(ev)
{
	if (mouse.button.left) {
		mouse.button.left = false;
		if (button_targetId != -1)
		{
			if (isMobile)
				canvasButton[button_targetId].int_state = 0;
			else if ((canvasButton[button_targetId].int_type == 0)&&(mouse.vec_pos.x > canvasButton[button_targetId].vec_pos.x)&&(mouse.vec_pos.x < canvasButton[button_targetId].vec_pos.x+canvasButton[button_targetId].vec_size.x)&&
				(mouse.vec_pos.y > canvasButton[button_targetId].vec_pos.y)&&(mouse.vec_pos.y < canvasButton[button_targetId].vec_pos.y+canvasButton[button_targetId].vec_size.y))
				{
				canvasButton[button_targetId].int_state = 1;
				button_hoverId = button_targetId;
			} else if (canvasButton[button_targetId].int_type == 0)
				canvasButton[button_targetId].int_state = 0;
			button_targetId = -1;
			button_mouseMove(ev);
		}
	} else if (mouse.button.right) {
		mouse.button.right = false;
	} else if (mouse.button.middle) {
		mouse.button.middle = false;
	}
}

document.addEventListener("mousedown", button_mouseDown, false);
document.addEventListener("mousemove", button_mouseMove, false);
document.addEventListener("mouseup", button_mouseUp, false);