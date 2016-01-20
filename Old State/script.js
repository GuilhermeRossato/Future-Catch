var canvas;
window.addEventListener("load",function()
{
	console.log("I'm alive");
	/* Setting up canvas and output */
	canvas = document.createElement('canvas');
	canvas.setAttribute('id','cnv');
	canvas.height = (canvas.width = 480)/(4/3);
	document.body.appendChild(canvas);
	var ctx = canvas.getContext("2d"), lastClock = +new Date(), leftoverTime = 0;
	var playerAnimation = {bool_active: false};
	
	var cookiePos, obj_player = {vec_pos:vec2d(150,150), vec_target:vec2d(150,150), num_angle:0, };
	
	cookiePos = getCookie("posx");
	if (!isNaN(parseInt(cookiePos)))
		obj_player.vec_pos.x = obj_player.vec_target.x = parseInt(cookiePos);
	cookiePos = getCookie("posy");
	if (!isNaN(parseInt(cookiePos)))
		obj_player.vec_pos.y = obj_player.vec_target.y = parseInt(cookiePos);
	cookiePos = getCookie("angle");
	if (!isNaN(parseInt(cookiePos)))
		obj_player.num_angle = obj_player.vec_target.y = parseInt(cookiePos);
	
	function generateEnemy(int_size)
	{
		console.log("New enemy being generated");
		var startSide = (Math.random()*8)|0,
			stopSide = (Math.random()*8)|0,
			whereAtStart = Math.random(),
			whereAtStop = Math.random(),
			vec_posStart = getPointFromSubSide(startSide,whereAtStart),
			vec_posStop;
		while ((Math.abs(startSide-stopSide)===7)||(Math.abs(startSide-stopSide)<=1)||(startSide==stopSide))
			stopSide = (Math.random()*8)|0;
		vec_posStop = getPointFromSubSide(stopSide,whereAtStop);
		vec_posStart.x = vec_posStart.x * 300;
		vec_posStart.y = vec_posStart.y * 300;
		vec_posStop.x = vec_posStop.x * 300;
		vec_posStop.y = vec_posStop.y * 300;
		vec_posStop.x = (vec_posStop.x-vec_posStart.x)/500;
		vec_posStop.y = (vec_posStop.y-vec_posStart.y)/500;
		createEnemy(0, vec_posStart, vec_posStop, +new Date(), 4, Math.random()*Math.PI*2,Math.random()*0.02-0.01);
	}
	
	function shootEnemy(i)
	{
		console.log("New shot being generated");
		var newPos = enemyList[i].vec_pos;
		for (var x = 0;x<10;x++)
			newPos = getEnemyPosition(i,(Math.sqrt(sqrDist(obj_player.vec_pos, newPos)))/bulletSpeed);
		var ang = Math.atan2(newPos.y-obj_player.vec_pos.y, newPos.x-obj_player.vec_pos.x);
		createBullet(vec2d(obj_player.vec_pos.x,obj_player.vec_pos.y), vec2d(Math.cos(ang)*bulletSpeed, Math.sin(ang)*bulletSpeed), +new Date());
	}
		
	event_canvasButtonPress = function(obj, i)
	{
		console.log("Button \"" + obj.text + "\" pressed");
		if (obj.text === "Generate Enemy")
		{
			generateEnemy();
		} else if (obj.text === "Shoot Nearest")
		{
			var x = getNearestEnemy(obj_player.vec_pos);
			if (x!=-1)
				shootEnemy(x);
		} else if (obj.text === "Generate 10")
		{
			for (var x=0;x<10;x++)
				generateEnemy();
		} else if (obj.text === "Generate 50")
		{
			
			for (var x=0;x<50;x++)
				generateEnemy();
		} else if (obj.text === "Shoot All")
		{	for (var x=0;x<enemyList.length;x++)
				if (enemyList[x].int_state===1)
					shootEnemy(x);
		} else if (obj.text === "Move Player")
		{
			playerAnimation.bool_active = true;
			playerAnimation.int_started = + new Date();
			playerAnimation.int_totalTime = 4000;
			playerAnimation.arr_pts = [vec2d(obj_player.vec_pos.x, obj_player.vec_pos.y)];
			playerAnimation.arr_pts.push(vec2d(Math.cos(obj_player.num_angle), Math.sin(obj_player.num_angle)));
			playerAnimation.arr_pts.push(vec2d(Math.random()*300, Math.random()*00));
			playerAnimation.arr_pts.push(vec2d((0.2+Math.random()*0.6)*300, (0.2+Math.random()*0.6)*300));
		} else if (obj.text === "Clear")
		{
			enemyList = [];
			bulletList = [];
			emptyEnemies = 0;
			emptyBullets = 0;
		}
	}
	
	function update()
	{
		var delta = -(lastClock - (lastClock = +new Date()));
		leftoverTime += (delta%10);
		if (leftoverTime > 20) { delta += 20; leftoverTime -= 20; } else if (leftoverTime > 10) { delta += 10; leftoverTime -= 10; };
		processPrimitives((delta/10)|0);
		if ((obj_player.vec_pos.x*10)|0 !== (obj_player.vec_target.x*10)|0)
			obj_player.vec_pos.x = obj_player.vec_pos.x + (obj_player.vec_target.x - obj_player.vec_pos.x)*0.1;
		if ((obj_player.vec_pos.y*10)|0 !== (obj_player.vec_target.y*10)|0)
			obj_player.vec_pos.y = obj_player.vec_pos.y + (obj_player.vec_target.y - obj_player.vec_pos.y)*0.1;
		if (playerAnimation.bool_active)
		{
			if (lastClock - playerAnimation.int_started > playerAnimation.int_totalTime)
				playerAnimation.bool_active = false;
			obj_player.vec_target = bbb2d(playerAnimation.arr_pts[0], playerAnimation.arr_pts[1], playerAnimation.arr_pts[2], playerAnimation.arr_pts[3], ((lastClock - playerAnimation.int_started)/playerAnimation.int_totalTime));
		}
		display(delta);
	}
	
	function display(delta)
	{
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "#fff";
		//ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.save();
		ctx.fillStyle = "#46574C";
		ctx.fillRect(10,10,300,300);
		ctx.globalCompositeOperation = "source-atop";
		drawEnemies(10,10,ctx);
		ctx.strokeStyle = "#FFF";
		ctx.strokeRect(10,10,300,300);
		drawBullets(ctx);
		ctx.strokeStyle = "#000";
		ctx.save();
		ctx.translate(obj_player.vec_pos.x, obj_player.vec_pos.y);
		ctx.beginPath();
		ctx.moveTo(-5,0);
		ctx.lineTo(+5,0);
		ctx.moveTo(0,-5);
		ctx.lineTo(0,+5);
		ctx.stroke();
		ctx.restore();
		var i = mouseOverButton();
		if ((i!=-1)&&(canvasButton[i].text == "Shoot Nearest"))
		{
			i = getNearestEnemy(obj_player.vec_pos);
			if (i!=-1)
			{
				var newPos = enemyList[i].vec_pos;
				newPos = getEnemyPosition(i,(Math.sqrt(sqrDist(obj_player.vec_pos, newPos)))/bulletSpeed);
				newPos = getEnemyPosition(i,(Math.sqrt(sqrDist(obj_player.vec_pos, newPos)))/bulletSpeed);
				newPos = getEnemyPosition(i,(Math.sqrt(sqrDist(obj_player.vec_pos, newPos)))/bulletSpeed);
				if ((newPos.x < 0)||(newPos.x > 300)||(newPos.y < 0)||(newPos.y > 300))
				{
					ctx.strokeStyle = "#833";
					ctx.lineWidth = 2;
					drawCancel(ctx,vec2d((enemyList[i].vec_pos.x+obj_player.vec_pos.x)/2,(enemyList[i].vec_pos.y+obj_player.vec_pos.y)/2),8);
					ctx.lineWidth = 1;
				} else {
					var angle = Math.atan2(newPos.y-obj_player.vec_pos.y, newPos.x-obj_player.vec_pos.x);
					ctx.strokeStyle = "#999";
					ctx.beginPath();
				}
				ctx.beginPath();
				ctx.moveTo(obj_player.vec_pos.x,obj_player.vec_pos.y);
				ctx.lineTo(enemyList[i].vec_pos.x,enemyList[i].vec_pos.y);
				ctx.moveTo(obj_player.vec_pos.x,obj_player.vec_pos.y);
				ctx.lineTo(newPos.x,newPos.y);
				ctx.stroke();
			}
		}
		ctx.restore();
		drawButtons(ctx);
		window.requestAnimationFrame(update);
	}
	
	function mouseClick(ev)
	{
		mouse.vec_pos.x = ev.clientX-canvas.offsetLeft;
		mouse.vec_pos.y = ev.clientY-canvas.offsetTop;
		if ((ev.button === 2)&&(mouse.vec_pos.x > 10)&&(mouse.vec_pos.x < 310)&&(mouse.vec_pos.y > 10)&&(mouse.vec_pos.y < 310))
		{
			obj_player.vec_target.x = mouse.vec_pos.x;
			obj_player.vec_target.y = mouse.vec_pos.y;
            setCookie("posx", obj_player.vec_target.x, 2);
            setCookie("posy", obj_player.vec_target.y, 2);
		} else if (ev.button === 0) {
			
			console.log("found")
		}
	}
	
	function mouseMove(ev)
	{
		mouse.vec_pos.x = ev.clientX-canvas.offsetLeft;
		mouse.vec_pos.y = ev.clientY-canvas.offsetTop;
	}
	
	document.addEventListener("mousedown", mouseClick, false);
	document.addEventListener("mousemove", mouseClick, false);
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	createButton("Generate Enemy",vec2d(10,canvas.height-40),vec2d(160,30),0);
	createButton("Shoot Nearest",vec2d(180,canvas.height-40),vec2d(160,30),0);
	createButton("Generate 10",vec2d(320,10),vec2d(150,30),0);
	createButton("Generate 50",vec2d(320,10+35*1),vec2d(150,30),0);
	createButton("Shoot All",vec2d(320,10+35*2),vec2d(150,30),0);
	createButton("Move Player",vec2d(320,10+35*3),vec2d(150,30),0);
	createButton("Show Numbers",vec2d(320,10+35*4),vec2d(150,30),0);
	createButton("Big Enemies",vec2d(320,10+35*5),vec2d(150,30),0);
	createButton("Small Enemies",vec2d(320,10+35*6),vec2d(150,30),0);
	createButton("Clear Game",vec2d(320,10+35*7),vec2d(150,30),0);
	window.requestAnimationFrame(update);
})