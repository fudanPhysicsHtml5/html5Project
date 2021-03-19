var canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d"),
    animateButton = document.getElementById("animateButton"),
    animateButton2= document.getElementById("animateButton2"),
    distance = document.getElementById("distance"),
    elasticity=document.getElementById('elasticity'),
    weight =document.getElementById('weight'),
    kvalue = document.getElementById('kvalue'),
    mvalue = document.getElementById('mvalue'),
    circle={
    	x:100,
    	y:200,
    	radius:20
    },
    info ={
    	length: 0,
    	angle:0,
    	startTime:0,
    },
     mousedown = {
        offsetX: 0,
        offsetY: 0
    },
    PIXEL_PER_METER = canvas.height/5,
    dragging = false,
    paused = true,
    land = false,
    shoot = false,
    G_ACC=29.8,
    positionx = 0,
    positiony = 0,
    m=40,
    k=40;


function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return { x: x - bbox.left * (canvas.width/bbox.width),
             y: y - bbox.top * (canvas.height/bbox.height) };
}
function isPointInCircle(loc) {
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
    return context.isPointInPath(loc.x, loc.y);
}
function updateCircle(loc) {      
    circle.x = loc.x + mousedown.offsetX;
    circle.y = loc.y + mousedown.offsetY;
}

function drawcircle(){
	context.save();
	if(paused && info.startTime==0){
		context.beginPath();
		context.moveTo(circle.x,circle.y);
		context.lineTo(180,200);
		context.stroke();
		//context.restore();
	}
	context.beginPath();
	context.arc(circle.x, circle.y, circle.radius,0,2*Math.PI);
	context.fillStyle ='#FFFF00';
	
	context.fill();
	context.stroke();
	context.restore();
}

function drawRect(){
    context.save();
    context.beginPath();

    context.fillStyle='brown';
    context.fillRect(170,200,20,200);
    context.stroke();

    context.restore();

}
function drawInfo() {
    context.save();

    context.beginPath();
    context.rect(720, 20, 250, 80);

    context.shadowColor = "rgba(0,0,0,0.3)";
    context.shadowOffsetX = 4;
    context.shadowOffsetY = -4;
    context.shadowBlur = 3;
    context.fillStyle = "rgba(0,150,255,0.3)";
    context.fill();

    context.restore();
    context.fillStyle='#FFFFE0'
    context.fillText("弹弓拉伸长度："+info.length.toFixed(2)+" m", 730, 50);
    context.fillText("角度："+Math.abs(info.angle/Math.PI*180).toFixed(2)+"°", 770, 80);

}

function updateInfo(){
	var dx = 180-circle.x,
        dy = circle.y-200;
    info.angle= Math.atan(dy/dx);
    info.length=Math.sqrt(dx*dx+dy*dy)/PIXEL_PER_METER;
}


function draw(currentTime){
	requestAnimFrame(draw);

	var	
		vx= Math.sqrt(k/m)*(180-positionx),
		vy = Math.sqrt(k/m)*(positiony-200),
		distance_x,
		distance_x1,
        x1=positionx,
        y1=positiony,
        posx,
        posy;
    if(!paused && !land && !shoot){
        if(circle.x>180){
            shoot = true;
            posx = circle.x;
            posy = circle.y;
        }
        if (info.startTime == 0 && currentTime >info.startTime) {
            info.startTime = currentTime;
        };
        circle.x = x1+vx*(currentTime- info.startTime)/300;
        circle.y = y1 -vy*(currentTime - info.startTime)/300;
    }
	if(!paused && !land &&shoot){
		if(circle.y> 380){
			land = true;
			distance_x= (circle.x-180)/PIXEL_PER_METER;
			distance_x1 = circle.x;
			info.startTime = 0;
		};
		
		if (info.startTime == 0 && currentTime >info.startTime) {
            info.startTime = currentTime;
            
		};
		
		circle.x = x1 + vx*(currentTime-info.startTime)/300;
		circle.y = y1 - vy*(currentTime-info.startTime)/300 + 1/2*G_ACC*(currentTime-info.startTime)*(currentTime-info.startTime)/90000;
   	};
    if(paused && info.startTime ==0 ){
        x1 = circle.x;
        y1 = circle.y;
    }
    
    if(!paused && land){
    	if (info.startTime == 0 && currentTime >info.startTime) {
            info.startTime = currentTime;
            
		};
		distance.innerHTML = distance_x.toFixed(2)+'m';
		circle.y = 380;
		circle.x = distance_x1 + vx*(currentTime-info.startTime)/500;

    };
	
	// body...
	

	context.clearRect(0,0,canvas.width,canvas.height);
	drawcircle();
	drawRect();
	drawInfo();
}

//Events
animateButton.onclick = function(e) {
    if (paused) {
        paused = false;
        animateButton.value = "停止";
        info.startTime = 0;
        m=weight.value;
        k=elasticity.value;
    }
    else {
        paused = true;
        animateButton.value = "开始";

        //updateInfo();
    }
}
animateButton2.onclick = function(e){
	paused = true;
	land = false;
	distance.innerHTML='--'
	circle.x=positionx;
	circle.y=positiony;
	info.startTime = 0;
	animateButton.value="开始";
	updateInfo();
}
canvas.onmousedown = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);
    if (isPointInCircle(loc) && paused) {
        dragging = true;
        mousedown.offsetX = circle.x - loc.x;
        mousedown.offsetY = circle.y - loc.y;
        updateInfo();
    }
}	
canvas.onmousemove = function(e) {
    var loc = windowToCanvas(e.clientX, e.clientY);
    if(dragging){
    	canvas.style.cursor="pointer";
    	updateCircle(loc);
    	updateInfo();
    }
    else{ 
    	if (isPointInCircle(loc) && paused) {
        canvas.style.cursor = "pointer";
    	}
    	else {
        canvas.style.cursor = "auto";
    	}
	}
   
}
canvas.onmouseup = function(e) {
    if (dragging) {
        dragging = false;
        positionx=circle.x;
        positiony=circle.y;
        info.startTime = 0;
    }
    updateInfo();
}

weight.onchange = function(e){
	m=weight.value;
	mvalue.innerHTML = m;
}
elasticity.onchange = function(e){
	k=elasticity.value;
	kvalue.innerHTML = k;
}
kvalue.innerHTML=40;
mvalue.innerHTML=40;
context.font = "24px Arial";
context.fillStyle = '#F0FFF0';
draw();
