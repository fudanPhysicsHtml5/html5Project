var canvas = document.getElementById("Canvas"),
    context = canvas.getContext("2d"),
    figure = document.getElementById("figure"),
    figureContext = figure.getContext("2d"),
    animateButton = document.getElementById("animateButton"),
    formFactor = document.getElementById("formFactor")
    inAngle = document.getElementById("inAngle")
    outAngle = document.getElementById("outAngle")
    latticeType = document.getElementById("latticeType")
    testButton = document.getElementById("testButton")
    latticeRange = document.getElementById("latticeRange")
    latticeConstant = document.getElementById("latticeConstant")
    wavelength = document.getElementById("wavelength")
    amplitudeShow = document.getElementById("amplitude")
    test = document.getElementById("test")
    x = 100, 
    y = 100,
    z = 50;
    amplitude = 0;
    lastAngle=0;
    lastAmplitude=0;

    points = [
        [0,0],
        [x,0],
        [x,-y],
        [0,-y],
        [z*Math.cos(45*Math.PI/180),-z*Math.sin(45*Math.PI/180)],
        [z*Math.cos(45*Math.PI/180),-y-z*Math.sin(45*Math.PI/180)],
        [x+z*Math.cos(45*Math.PI/180),-z*Math.sin(45*Math.PI/180)],
        [x+z*Math.cos(45*Math.PI/180),-y-z*Math.sin(45*Math.PI/180)]
    ];
    faces = [
        [points[4],points[5],points[7],points[6]], //后
        [points[0],points[4],points[6],points[1]], //下
        [points[0],points[3],points[5],points[4]], //左
        [points[1],points[2],points[7],points[6]], //右
        [points[2],points[3],points[5],points[7]], //上
        [points[0],points[3],points[2],points[1]], //前
    ]

    
    inCircle = {
        x: 200,
        y: 250,
        radius: 5,
        color: "black"
    },
    outCircle = {
        x: 400,
        y: 250,
        radius: 5,
        color: "black"
    },
    atomCircle = {
        x: 0,
        y: 0,
        radius: 3,
        color: "blue"
    },
    startTime=0,
    paused = true;

// Functions

function drawCrystal(x,y,fill){
    context.save();
    context.translate(x,y);
    for(var i=0,len=faces.length;i<len;i++){
        var p = faces[i];
        context.beginPath();
        for(var j=0,l=p.length;j<l;j++){
            if(j==0){
                context.moveTo(p[j][0],p[j][1]);
            }else{
                context.lineTo(p[j][0],p[j][1]);
            }   
        }
        context.closePath();
        if(fill){
            context.fillStyle = randC();
            context.fill();
        }else{
            context.stroke();
        }
    }
    context.restore();
}

function randC(){
    return 'rgb('+(~~(Math.random()*255))+","+(~~(Math.random()*255))+","+(~~(Math.random()*255))+")";
}

function drawCircle(circle){
    context.save();

    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
    context.fillStyle = circle.color;
    context.fill();
    context.lineWidth = 0.5;
    context.stroke();

    context.restore();
}

function drawLineArrow(fromX, fromY, toX, toY, color) {
    context.save();

    var headlen = 10;
    var theta = 45;
    var arrowX, arrowY;
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
    var angle1 = (angle + theta) * Math.PI / 180;
    var angle2 = (angle - theta) * Math.PI / 180;
    var topX = headlen * Math.cos(angle1);
    var topY = headlen * Math.sin(angle1);
    var botX = headlen * Math.cos(angle2);
    var botY = headlen * Math.sin(angle2);
    context.beginPath();

    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);

    arrowX = (toX+fromX)/2 + topX;
    arrowY = (toY+fromY)/2 + topY;

    context.moveTo(arrowX, arrowY);
    context.lineTo((toX+fromX)/2, (toY+fromY)/2);

    arrowX = (toX+fromX)/2 + botX;
    arrowY = (toY+fromY)/2 + botY;

    context.lineTo(arrowX, arrowY);
    
    context.strokeStyle = color;
    context.stroke();

    context.restore();
}

function drawSimpleCubic(x,y){
    context.save();
    context.translate(x,y);
    for(var i=0,len=points.length;i<len;i++){
        var p = points[i];
        atomCircle.x = p[0];
        atomCircle.y = p[1];
        drawCircle(atomCircle);
    }
    context.restore();
}

function drawBodyCenteredCubic(x, y){
    context.save();
    context.translate(x,y);
    for(var i=0,len=points.length;i<len;i++){
        var p = points[i];
        atomCircle.x = p[0];
        atomCircle.y = p[1];
        drawCircle(atomCircle);
    }
    atomCircle.x = points[7][0]/2;
    atomCircle.y = points[7][1]/2;
    drawCircle(atomCircle);
    context.restore();
}

function drawFaceCenteredCubic(x, y){
    context.save();
    context.translate(x,y);
    for(var i=0,len=points.length;i<len;i++){
        var p = points[i];
        atomCircle.x = p[0];
        atomCircle.y = p[1];
        drawCircle(atomCircle);
    }
    atomCircle.x = points[2][0]/2;
    atomCircle.y = points[2][1]/2;
    drawCircle(atomCircle);
    atomCircle.x = (points[2][0]+points[6][0])/2;
    atomCircle.y = (points[2][1]+points[6][1])/2;
    drawCircle(atomCircle);
    atomCircle.x = points[6][0]/2;
    atomCircle.y = points[6][1]/2;
    drawCircle(atomCircle);
    atomCircle.x = (points[6][0]+points[5][0])/2;
    atomCircle.y = (points[6][1]+points[5][1])/2;
    drawCircle(atomCircle);
    atomCircle.x = points[5][0]/2;
    atomCircle.y = points[5][1]/2;
    drawCircle(atomCircle);
    atomCircle.x = (points[2][0]+points[5][0])/2;
    atomCircle.y = (points[2][1]+points[5][1])/2;
    drawCircle(atomCircle);
    context.restore();
}

function clearCanvas(){
    canvas.height = canvas.height;
}

function changeLattice(){
    if (latticeType.options[latticeType.selectedIndex].value == "sc") {
        clearCanvas();
        drawCrystal(300-x/2,150);
        drawCrystal(300+x/2,150);
        drawCrystal(300-3*x/2,150);
        drawLineArrow(inCircle.x, inCircle.y, 300, 150, "black");
        drawLineArrow(300, 150, outCircle.x, outCircle.y, "black");
        drawCircle(inCircle);
        drawCircle(outCircle);
        drawSimpleCubic(300-x/2, 150);
        drawSimpleCubic(300+x/2, 150);
        drawSimpleCubic(300-3*x/2, 150);
    } else if (latticeType.options[latticeType.selectedIndex].value == "bcc") {
        clearCanvas();
        drawCrystal(300-x/2,150);
        drawCrystal(300+x/2,150);
        drawCrystal(300-3*x/2,150);
        drawLineArrow(inCircle.x, inCircle.y, 300, 150, "black");
        drawLineArrow(300, 150, outCircle.x, outCircle.y, "black");
        drawCircle(inCircle);
        drawCircle(outCircle);
        drawBodyCenteredCubic(300-x/2, 150);
        drawBodyCenteredCubic(300+x/2, 150);
        drawBodyCenteredCubic(300-3*x/2, 150);
    } else if (latticeType.options[latticeType.selectedIndex].value == "fcc") {
        clearCanvas();
        drawCrystal(300-x/2,150);
        drawCrystal(300+x/2,150);
        drawCrystal(300-3*x/2,150);
        drawLineArrow(inCircle.x, inCircle.y, 300, 150, "black");
        drawLineArrow(300, 150, outCircle.x, outCircle.y, "black");
        drawCircle(inCircle);
        drawCircle(outCircle);
        drawFaceCenteredCubic(300-x/2, 150);
        drawFaceCenteredCubic(300+x/2, 150);
        drawFaceCenteredCubic(300-3*x/2, 150);
    }
}

function changeInAngle() {
    inCircle.x = 300-Math.sin(inAngle.value/180*Math.PI)*100*Math.SQRT2;
    inCircle.y = 150+Math.cos(inAngle.value/180*Math.PI)*100*Math.SQRT2;
    changeLattice();
    calculate();
    amplitudeShow.innerHTML = amplitude;
}

function changeOutAngle() {
    outCircle.x = 300+Math.sin(outAngle.value/180*Math.PI)*100*Math.SQRT2;
    outCircle.y = 150+Math.cos(outAngle.value/180*Math.PI)*100*Math.SQRT2;
    changeLattice()
    calculate();
    amplitudeShow.innerHTML = amplitude;
}

function changeLatticeConstant() {
    latticeConstant.innerHTML = latticeRange.value;
    x = Math.sqrt(100*latticeRange.value);
    y = Math.sqrt(100*latticeRange.value);
    z = Math.sqrt(50*latticeRange.value/2);
    points = [
        [0,0],
        [x,0],
        [x,-y],
        [0,-y],
        [z*Math.cos(45*Math.PI/180),-z*Math.sin(45*Math.PI/180)],
        [z*Math.cos(45*Math.PI/180),-y-z*Math.sin(45*Math.PI/180)],
        [x+z*Math.cos(45*Math.PI/180),-z*Math.sin(45*Math.PI/180)],
        [x+z*Math.cos(45*Math.PI/180),-y-z*Math.sin(45*Math.PI/180)]
    ];
    faces = [
        [points[4],points[5],points[7],points[6]], //后
        [points[0],points[4],points[6],points[1]], //下
        [points[0],points[3],points[5],points[4]], //左
        [points[1],points[2],points[7],points[6]], //右
        [points[2],points[3],points[5],points[7]], //上
        [points[0],points[3],points[2],points[1]], //前
    ]
    changeLattice();
    calculate();
    amplitudeShow.innerHTML = amplitude;
}

function changeWavelength(){
    calculate();
    calculate();
    amplitudeShow.innerHTML = amplitude;
}

function calculate_sc(){
    amplitude = 0;
    var cosValue = (Math.cos(Math.PI/180*inAngle.value)+Math.cos(Math.PI/180*outAngle.value))/wavelength.value;
    var ratio;
    var roundValue;
    ratio = cosValue*latticeRange.value;
    roundValue = Math.round(ratio);
    if(roundValue!=0 && Math.abs(ratio/roundValue-1) < 0.0005){
        amplitude = 1;
    }
    ratio = cosValue*latticeRange.value/Math.SQRT2;
    roundValue = Math.round(ratio);
    if(roundValue!=0 && Math.abs(ratio/roundValue-1) < 0.0005){
        amplitude = 1;
    }
}

function calculate(){
    var dx, dy, dz;
    var kx, ky, kz;
    var Sk;
    if (latticeType.options[latticeType.selectedIndex].value == "sc"){
        calculate_sc();
    } else if (latticeType.options[latticeType.selectedIndex].value == "bcc"){
        kx = Math.PI*2.0/wavelength.value*Math.sin(Math.PI/180*inAngle.value);
        ky = Math.PI*2.0/wavelength.value*Math.cos(Math.PI/180*inAngle.value);
        kz = 0.0;

        dx = latticeRange.value/2.0;
        dy = latticeRange.value/2.0;
        dz = latticeRange.value/2.0;

        Sk = 1+Math.cos(kx*dx+ky*dy+kz*dz);

        calculate_sc();
        amplitude = amplitude*Sk;
    } else if (latticeType.options[latticeType.selectedIndex].value == "fcc"){
        kx = Math.PI*2.0/wavelength.value*Math.sin(Math.PI/180*inAngle.value);
        ky = Math.PI*2.0/wavelength.value*Math.cos(Math.PI/180*inAngle.value);
        kz = 0.0;        
        
        Sk = 1.0;

        dx = latticeRange.value/2.0;
        dy = latticeRange.value/2.0;
        dz = 0.0;
        Sk = Sk+Math.cos(kx*dx+ky*dy+kz*dz);

        dx = 0.0;
        dy = latticeRange.value/2.0;
        dz = latticeRange.value/2.0;
        Sk = Sk+Math.cos(kx*dx+ky*dy+kz*dz);

        dx = latticeRange.value/2.0;
        dy = 0.0;
        dz = latticeRange.value/2.0;
        Sk = Sk+Math.cos(kx*dx+ky*dy+kz*dz);

        calculate_sc();
        amplitude = amplitude*Sk;
    }

}


animateButton.onclick = function(e) {
    if (paused) {
        paused = false;
        animateButton.value = "停止";
        startTime = 0;
    }
    else {
        paused = true;
        animateButton.value = "开始";
    }
}

function drawAxes(){
    figureContext.save();
    figureContext.beginPath();

    figureContext.moveTo(10, 90);
    figureContext.lineTo(1000, 90);
    figureContext.moveTo(1000, 90);
    figureContext.lineTo(995, 85);
    figureContext.moveTo(1000, 90);
    figureContext.lineTo(995, 95);
    figureContext.fillText("2Θ/°", 970, 100, 20)

    figureContext.moveTo(10, 90);
    figureContext.lineTo(10, 0);
    figureContext.moveTo(10, 0);
    figureContext.lineTo(5, 5);
    figureContext.moveTo(10, 0);
    figureContext.lineTo(15, 5);
    figureContext.fillText("A", 0, 10, 5)

    figureContext.fillText("0", 0, 100, 5)
    figureContext.moveTo(10, 60);
    figureContext.lineTo(15, 60);
    figureContext.fillText("1", 0, 60, 5)
    figureContext.moveTo(10, 30);
    figureContext.lineTo(15, 30);
    figureContext.fillText("2", 0, 30, 5)

    figureContext.moveTo(310, 90);
    figureContext.lineTo(310, 85);
    figureContext.fillText("30", 305, 100, 10)
    figureContext.moveTo(510, 90);
    figureContext.lineTo(510, 85);
    figureContext.fillText("50", 505, 100, 10)
    figureContext.moveTo(710, 90);
    figureContext.lineTo(710, 85);
    figureContext.fillText("70", 705, 100, 10)
    figureContext.moveTo(910, 90);
    figureContext.lineTo(910, 85);
    figureContext.fillText("90", 905, 100, 10)

    figureContext.lineWidth = 0.5;
    figureContext.stroke();

    figureContext.restore();
}

function drawPoint(angle){
    figureContext.save();
    figureContext.beginPath();

    figureContext.moveTo(lastAngle*10*2+10, 90-lastAmplitude*30);
    figureContext.lineTo(angle*10*2+10, 90-amplitude*30);
    figureContext.lineWidth = 0.3;
    figureContext.stroke();

    figureContext.restore();
}

function draw(currentTime) {
    requestAnimFrame(draw);

    if (!paused) {
        var angle;

        if (startTime == 0) {
            startTime = currentTime;
            figureContext.clearRect(0, 0, figure.width, figure.height);
            drawAxes();
            lastAngle=0;
            lastAmplitude=0;
        }

        angle = (currentTime-startTime)/100+5; 
        inCircle.x = 300-Math.sin(angle/180*Math.PI)*100*Math.SQRT2;
        inCircle.y = 150+Math.cos(angle/180*Math.PI)*100*Math.SQRT2;
        outCircle.x = 300+Math.sin(angle/180*Math.PI)*100*Math.SQRT2;
        outCircle.y = 150+Math.cos(angle/180*Math.PI)*100*Math.SQRT2;
        inAngle.value = angle;
        outAngle.value = angle;

        if (angle>45){
            paused = true;
            animateButton.value = "开始";
        }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    changeLattice();
    calculate();
    drawPoint(angle, lastAngle, lastAmplitude);
    lastAngle = angle;
    lastAmplitude = amplitude;
    amplitudeShow.innerHTML = amplitude;
}

drawCrystal(250,150);
drawCrystal(300+x/2,150);
drawCrystal(300-3*x/2,150);
drawLineArrow(inCircle.x, inCircle.y, 300, 150, "black")
drawLineArrow(300, 150, outCircle.x, outCircle.y, "black")
drawCircle(inCircle)
drawCircle(outCircle)
drawSimpleCubic(250,150)
latticeConstant.innerHTML = latticeRange.value
calculate();
amplitudeShow.innerHTML = amplitude;
drawAxes();
draw();

testButton.onclick = function(e){
    test.innerHTML = inAngle.value;
    //test.innerHTML = latticeType.options[latticeType.selectedIndex].value;
}

