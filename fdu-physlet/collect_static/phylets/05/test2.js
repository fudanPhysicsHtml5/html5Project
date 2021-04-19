var canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d"),
    animateButton = document.getElementById("animateButton"),
    
    circle = {
        x: 100,
        y: 160,
        radius: 20,
    },
    info = {
        angleInRad: 0,
        angleInDegree: 0,
        lengthInPixel: 0,
        lengthInMeter: 0,
        startTime:0,
    },

    PIXEL_PER_METER = canvas.height/5,
    G_ACC=9.8,
    paused=true,
    touched=false;
// Functions

function updateInfo() {
    dx = 180-circle.x;
    dy = circle.y-200;
    info.angleInRad = Math.atan(dy/dx);
    info.angleInDegree = info.angleInRad / Math.PI * 180;
    info.lengthInPixel = Math.sqrt(dx*dx + dy*dy);
    info.lengthInMeter = info.lengthInPixel / PIXEL_PER_METER;
}

function drawCircle() {
    context.save();

    context.beginPath();        //draw the line
    context.moveTo(circle.x, circle.y);
    context.lineTo(180,200);
    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.stroke();

    context.beginPath();        //draw the circle
    context.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
    context.fillStyle = "cornflowerblue";
    context.fill();
    context.lineWidth = 0.5;
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

function draw(currentTime) {

    requestAnimFrame(draw);
    var velocity = Math.sqrt(10)*info.lengthInMeter;
    if(!touched){
        if (info.startTime == 0 && currentTime > info.startTime) {
            info.startTime = currentTime;
        
        };   
       
        circle.x = velocity * Math.cos(info.angleInRad)*(currentTime-info.startTime);
        circle.y = -velocity * Math.sin(info.angleInRad)*(currentTime-info.startTime)+1/2*G_ACC*(currentTime-info.startTime)*(currentTime-info.startTime);
           
    };
    context.cleanRect(0,0,canvas.width,canvas.height);
    drawCircle();
    drawRect();
    drawInfo();
}
//Events



// Initialization

context.font = "18px Arial";
context.fillStyle = "black";
updateInfo();
draw();
