var canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d"),

    circle = {
        x: 150,
        y: 150,
        radius: 20
    };

// Functions

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

// Initialization

drawCircle();