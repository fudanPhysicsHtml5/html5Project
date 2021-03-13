var canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d"),
    circle={
    	x:100,
    	y:100,
    	radius:20
    },
    info ={
    	
    	startTime:0,
    },
    touch = false,
    G_ACC=9.8;
function drawcircle(){
	context.save();
	
	context.beginPath();
	context.arc(circle.x, circle.y, circle.radius,0,2*Math.PI);
	context.fillStyle ="rgb(220,120,150)";
	
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
    context.rect(420, 20, 150, 80);

    context.shadowColor = "rgba(0,0,0,0.3)";
    context.shadowOffsetX = 4;
    context.shadowOffsetY = -4;
    context.shadowBlur = 3;
    context.fillStyle = "rgba(0,150,255,0.3)";
    context.fill();

    context.restore();

    context.fillText("弹簧长度："+info.lengthInMeter.toFixed(2)+" m", 440, 50);
    context.fillText("角度："+Math.abs(info.angleInDegree).toFixed(2)+"°", 440, 80);
}




function draw(currentTime){
	requestAnimFrame(draw);
	var	angleInRad=Math.PI/180*45
    	velocity=30;
	if(!touch){
		
		if (info.startTime == 0 && currentTime >info.startTime) {
            info.startTime = currentTime;
            
		};
		
		circle.x = 100 + velocity*Math.cos(angleInRad)*(currentTime-info.startTime)/1000;
		circle.y = 100 - velocity*Math.sin(angleInRad)*(currentTime-info.startTime)/1000 + 1/2*G_ACC*(currentTime-info.startTime)*(currentTime-info.startTime)/1000000;
    };
	
	// body...
	

	context.clearRect(0,0,canvas.width,canvas.height);
	drawcircle();
	drawRect();
	drawInfo();
}

draw();
