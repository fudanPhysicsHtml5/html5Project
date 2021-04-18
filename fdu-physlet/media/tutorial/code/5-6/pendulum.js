var canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d"),

    circle = {
        x: 150,
        y: 150,
        radius: 20
    },
    info = {
        angleInRad: 0,
        angleInDegree: 0,
        lengthInPixel: 0,
        lengthInMeter: 0
    },

    PIXEL_PER_METER = canvas.height/5;

// Functions

function updateInfo() {
    dx = circle.x - canvas.width/2;
    dy = circle.y;
    info.angleInRad = Math.atan(dx/dy);
    info.angleInDegree = info.angleInRad / Math.PI * 180;
    info.lengthInPixel = Math.sqrt(dx*dx + dy*dy);
    info.lengthInMeter = info.lengthInPixel / PIXEL_PER_METER;
}

function drawCircle() {
    context.save();

    context.beginPath();
    context.moveTo(circle.x, circle.y);
    context.lineTo(canvas.width/2, 0);

    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.stroke();

    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
    context.fillStyle = "cornflowerblue";
    context.fill();
    context.lineWidth = 0.5;
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
    context.shadowBlur = 8;
    context.fillStyle = "rgba(0,150,255,0.3)";
    context.fill();

    context.restore();

    context.fillText("摆长："+info.lengthInMeter.toFixed(2)+" m", 440, 50);
    context.fillText("摆幅："+Math.abs(info.angleInDegree).toFixed(2)+"°", 440, 80);
}

function draw() {
    drawCircle();
    drawInfo();
}

// Initialization

context.font = "18px Arial";
context.fillStyle = "black";
updateInfo();
draw();