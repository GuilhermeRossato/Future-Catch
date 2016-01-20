// Enemy prototype: int_state (dead/live), int_type, vec_pos, vec_speed, int_bornAt, int_size

var enemyList = [];
var bulletList = [];
var emptyEnemies = 0;
var emptyBullets = 0;

var bulletSpeed = 1;

function createEnemy(int_type, vec_pos, vec_speed, int_bornAt, int_size, num_angle, num_angleSpeed)
{
	if (emptyEnemies > 0) {
		for (var i=0;i<enemyList.length;i++)
			if (enemyList[i].int_state===0)
			{
				enemyList[i] = {int_state: 1, int_type:int_type, vec_pos:vec_pos, vec_speed:vec_speed, int_born: int_bornAt, int_size:int_size, num_angle:num_angle, num_angleSpeed:num_angleSpeed};
				emptyEnemies -= 1;
				return i;
			}
	} else
		return enemyList.push({int_state: 1, int_type:int_type, vec_pos:vec_pos, vec_speed:vec_speed, int_born: int_bornAt, int_size:int_size, num_angle:num_angle, num_angleSpeed:num_angleSpeed});
}

function createBullet(vec_pos,vec_speed, int_bornAt)
{
	if (emptyBullets > 0) {
		for (var i=0;i<bulletList.length;i++)
			if (bulletList[i].int_state===0)
			{
				bulletList[i] = {int_state: 1, vec_pos:vec_pos, vec_speed:vec_speed, int_born: int_bornAt};
				emptyBullets -= 1;
				return i;
			}
	} else
		return bulletList.push({int_state: 1, vec_pos:vec_pos, vec_speed:vec_speed, int_born: int_bornAt});
}

function getEnemyPosition(id, time)
{
	if (typeof(enemyList[id])==="object")
		return vec2d(enemyList[id].vec_pos.x+enemyList[id].vec_speed.x*time,enemyList[id].vec_pos.y+enemyList[id].vec_speed.y*time);
	else console.warn("Enemy Id",id," does not exist");
}


function getBulletPosition(id, time)
{
	if (typeof(bulletList[id])==="object")
		return vec2d(bulletList[id].vec_pos.x+bulletList[id].vec_speed.x*time,bulletList[id].vec_pos.y+bulletList[id].vec_speed.y*time);
	else console.warn("Bullet Id",id," does not exist");
}

function getNearestEnemy(vec_pos)
{
	var clId = -1, clDist, clDistNow;
	for (i=0;i<enemyList.length;i++)
	{
		if ((typeof(enemyList[i])=="object")&&(enemyList[i].int_state === 1))
		{
			clDistNow = sqrDist(enemyList[i].vec_pos,vec_pos);
			if ((clId===-1)||(clDist>clDistNow))
			{
				clId = i;
				clDist = clDistNow;
			}
		}
	}
	return clId;
}

function processPrimitives(gameSteps)
{
	if ((gameSteps > 0)&&(gameSteps < 10))
	{
		enemyList.forEach(function (obj, objId)
		{
			if (obj.int_state === 1)
			{
				var clId = -1, clDist, clDistNow, i, enemyRemoved = false;
				for (i=0;i<bulletList.length;i++)
				{
					clDistNow = sqrDist(bulletList[i].vec_pos,obj.vec_pos);
					if ((i==0)||(clDist>clDistNow))
					{
						clId = i;
						clDist = clDistNow;
					}
				}
				if (clId == -1)
					enemyRemoved = true;
				else if (clDist < obj.int_size*obj.int_size) {
					removeEnemy(objId);
					enemyRemoved = true;
				}
				if ((obj.vec_pos.x < -20)||(obj.vec_pos.x > 320)||(obj.vec_pos.y < -20)||(obj.vec_pos.y > 320))
				{
					removeEnemy(objId);
					enemyRemoved = true;
				} else {
					for (i=0;i<gameSteps;i++)
					{
						obj.vec_pos.x += obj.vec_speed.x;
						obj.vec_pos.y += obj.vec_speed.y;
						obj.num_angle += obj.num_angleSpeed;
						if (!enemyRemoved)
						{
							if (obj.int_size*obj.int_size > sqrDist(obj.vec_pos,getBulletPosition(clId,i)))
							{
								removeEnemy(objId);
								enemyRemoved = true;
							}
						}
					}
				}
			}
		});
		bulletList.forEach(function (obj, objId)
		{
			obj.vec_pos.x += obj.vec_speed.x*gameSteps;
			obj.vec_pos.y += obj.vec_speed.y*gameSteps;
			if ((obj.vec_pos.x < -20)||(obj.vec_pos.x > 320)||(obj.vec_pos.y < -20)||(obj.vec_pos.y > 320))
				removeBullet(objId);
		})
	} else if (gameSteps >= 10)
	{
		console.warn("Can't keep up!",gameSteps);
	}
}

function drawEnemies(startX,startY,ctx)
{
	if (typeof(ctx)==="object")
	{
		var i;
		ctx.fillStyle = "#fff";
		ctx.font = "8px Verdana";
		ctx.strokeStyle = "#fff";
		ctx.textAlign = "right";
		enemyList.forEach(function (obj, objId)
		{
			if (obj.int_state === 1)
			{
				ctx.save();
				ctx.translate(obj.vec_pos.x,obj.vec_pos.y);
				ctx.rotate(obj.num_angle);
				ctx.beginPath();
				ctx.moveTo(obj.int_size,0);
				for (i=0;i<6;i++) ctx.lineTo(Math.cos((i/6)*2*Math.PI)*obj.int_size,Math.sin((i/6)*2*Math.PI)*obj.int_size);
				ctx.lineTo(obj.int_size,0);
				ctx.stroke();
				ctx.restore();
				//ctx.fillText(objId,obj.vec_pos.x-obj.int_size*0.8,obj.vec_pos.y-obj.int_size*0.8);
			}
		});
	}
}

function drawBullets(ctx)
{
	if (typeof(ctx)==="object")
	{
		bulletList.forEach(function (obj, objId)
		{
			ctx.beginPath();
			ctx.moveTo(obj.vec_pos.x,obj.vec_pos.y);
			ctx.lineTo(obj.vec_pos.x+obj.vec_speed.x,obj.vec_pos.y+obj.vec_speed.y);
			ctx.stroke();
		});
	}
}

function removeEnemy(int_id)
{
	if (enemyList[int_id].int_state === 1)
	{
		enemyList[int_id].int_state = 0;
		emptyEnemies += 1;
	}
}

function removeBullet(int_id)
{
	if (bulletList[int_id].int_state === 1)
	{
		bulletList[int_id].int_state = 0;
		emptyBullets += 1;
	}
}

document.onmousedown= function (e) { return false; }
