var canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d"),
    dRange = document.getElementById("dRange"),
    ddRange = document.getElementById("ddRange"),
    deltaX = document.getElementById("dx"),
    dshow = document.getElementById("dshow"),
    ddshow = document.getElementById("ddshow"),
    lambdashow = document.getElementById("lambdashow"),

    screen1 = {
        z: 100,
        hole: 4
    },

    screen2 = {
        z: 200,
        d: ddRange.value,
        hole: 4
    },

    screen3 = {
        z: 500
    },

    light = {
        lambda: 589e-9
    },

    fringe = {
        dx: 0,
        dxInPixel: 0
    },

    anim = {
        radius1: 0,
        radius2: 0,
        radius3: 0,
        radius4: 0,
        radius5: 0,
        radius6: 0,
        startTime: 0
    },

    PIXEL_PER_METER = 1e7,
    D = dRange.value;

// Function

function drawScreen1(){
    context.save();

    context.beginPath();
    context.moveTo(screen1.z, 60);
    context.lineTo(screen1.z, canvas.height/2 - screen1.hole/2);

    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();

    context.beginPath();
    context.moveTo(screen1.z, 240);
    context.lineTo(screen1.z, canvas.height/2 + screen1.hole/2);

    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();

    context.restore();
}

function drawScreen2(){
    context.save();

    context.beginPath();
    context.moveTo(screen2.z, 40);
    context.lineTo(screen2.z, canvas.height/2 - screen2.d/2 - screen2.hole/2);

    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();

    context.beginPath();
    context.moveTo(screen2.z, canvas.height/2 - screen2.d/2 + screen2.hole/2);
    context.lineTo(screen2.z, canvas.height/2 + screen2.d/2 - screen2.hole/2);

    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();

    context.beginPath();
    context.moveTo(screen2.z, canvas.height/2 + screen2.d/2 + screen2.hole/2);
    context.lineTo(screen2.z, 260);

    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();

    context.beginPath();
    context.moveTo(screen1.z, 150);
    context.lineTo(screen2.z, canvas.height/2 - screen2.d/2);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    context.beginPath();
    context.moveTo(screen1.z, 150);
    context.lineTo(screen2.z, canvas.height/2 + screen2.d/2);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    context.restore();
}

function drawScreen3(){
    context.save();

    context.beginPath();
    context.moveTo(screen3.z, 40);
    context.lineTo(screen3.z, 260);

    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();

    context.restore();
}

function drawSource(){
    context.save();

    context.beginPath();
    context.rect(35, 125, 30, 50);

    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.stroke();

    context.fillText("光", 43, 145);
    context.fillText("源", 43, 165);

    context.restore();
}

function drawAxis(){
    context.save();

    context.beginPath();
    context.moveTo(65, 150);
    context.lineTo(screen3.z, 150);

    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.stroke();

    context.restore();
}

function updateDeltaX(){
    fringe.dx = light.lambda * D / screen2.d;
    fringe.dxInPixel = fringe.dx * PIXEL_PER_METER;
    deltaX.innerHTML = (fringe.dxInPixel*0.1).toFixed(3) + " μm";
    lambdashow.innerHTML = (light.lambda*1e9) + " nm";
    dshow.innerHTML = D + "mm\t";
    ddshow.innerHTML = "\t" + screen2.d + " mm\t";
}

function drawFringe(){
    context.save();

    var i_max = 1;
    if(fringe.dxInPixel != 0){
        i_max = Math.max(1, Math.floor(130 / fringe.dxInPixel));
    }

    for(var i=0; i<i_max; i++){
        var dx = fringe.dxInPixel;
        var grd1 = context.createLinearGradient(0, 150-dx*(i+1), 0, 150-dx*i);
        grd1.addColorStop(0, "whitesmoke");
        grd1.addColorStop(0.5, "black");
        grd1.addColorStop(1, "whitesmoke");
    
        context.fillStyle = grd1;
        context.fillRect(520, 150-dx*(i+1), 50, dx);
    
        var grd2 = context.createLinearGradient(0, 150+dx*i, 0, 150+dx*(i+1));
        grd2.addColorStop(0, "whitesmoke");
        grd2.addColorStop(0.5, "black");
        grd2.addColorStop(1, "whitesmoke");
    
        context.fillStyle = grd2;
        context.fillRect(520, 150+dx*i, 50, dx);
    }

    context.restore();
}

function drawAnim(currentTime){
    requestAnimFrame(drawAnim);

    if(anim.startTime == 0 && currentTime > anim.startTime){
        anim.startTime = currentTime;
    }

    anim.radius1 = ((currentTime - anim.startTime) / 200) % 300;
    anim.radius2 = ((currentTime - anim.startTime) / 200 + 50) % 300;
    anim.radius3 = ((currentTime - anim.startTime) / 200 + 100) % 300;
    anim.radius4 = ((currentTime - anim.startTime) / 200 + 150) % 300;
    anim.radius5 = ((currentTime - anim.startTime) / 200 + 200) % 300;
    anim.radius6 = ((currentTime - anim.startTime) / 200 + 250) % 300;

    context.clearRect(screen2.z, 0, 300, canvas.height);
    drawWave();
}


function drawWave(){
    context.save();

    var theta = Math.atan((110-screen2.d/2)/300);

    // radius1
    context.beginPath();
    context.arc(screen2.z, canvas.height/2 - screen2.d/2, anim.radius1, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    context.beginPath();
    context.arc(screen2.z, canvas.height/2 + screen2.d/2, anim.radius1, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    // radius2
    context.beginPath();
    context.arc(screen2.z, canvas.height/2 - screen2.d/2, anim.radius2, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    context.beginPath();
    context.arc(screen2.z, canvas.height/2 + screen2.d/2, anim.radius2, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    // radius3
    context.beginPath();
    context.arc(screen2.z, canvas.height/2 - screen2.d/2, anim.radius3, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    context.beginPath();
    context.arc(screen2.z, canvas.height/2 + screen2.d/2, anim.radius3, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    // radius4
    context.beginPath();
    context.arc(screen2.z, canvas.height/2 - screen2.d/2, anim.radius4, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    context.beginPath();
    context.arc(screen2.z, canvas.height/2 + screen2.d/2, anim.radius4, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    // radius5
    context.beginPath();
    context.arc(screen2.z, canvas.height/2 - screen2.d/2, anim.radius5, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    context.beginPath();
    context.arc(screen2.z, canvas.height/2 + screen2.d/2, anim.radius5, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    // radius6
    context.beginPath();
    context.arc(screen2.z, canvas.height/2 - screen2.d/2, anim.radius6, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    context.beginPath();
    context.arc(screen2.z, canvas.height/2 + screen2.d/2, anim.radius6, -theta, theta);
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.stroke();

    context.beginPath();
    context.moveTo(screen2.z, 150);
    context.lineTo(500, 150);

    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.stroke();

    context.restore();
}

function draw(){
    drawScreen1();
    drawScreen2();
    drawScreen3();
    drawSource();
    drawAxis();

    updateDeltaX();
    drawFringe();
    drawAnim();
}

// Events

dRange.onchange = function(e){
    D = dRange.value;

    context.clearRect(0, 0, canvas.width, canvas.height);
    draw()
}

ddRange.onchange = function(e){
    screen2.d = ddRange.value;

    context.clearRect(0, 0, canvas.width, canvas.height);
    draw()
}

// Initialization

context.font = "15px Arial";
context.fillStyle = "black";

draw()