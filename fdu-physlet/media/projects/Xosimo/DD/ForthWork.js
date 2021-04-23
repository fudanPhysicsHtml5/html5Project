var canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d"),
    
    Range1 = document.getElementById("Range1"),
    Range2 = document.getElementById("Range2"),
    Range3 = document.getElementById("Range3"),
    Range4 = document.getElementById("Range4"),
    things = {
        silt:20,
        distence:1030,
        width:2,
        N:4,
    };
function drawSilt() {
        var o=(things.N*(things.width+things.silt)-things.silt)/2
        
        context.save();
    
        context.beginPath();
        context.moveTo(30, 0);
        context.lineTo(30, 250-o);
    
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.stroke();

        for(var i=1;i<=things.N;i++)
        {
            context.beginPath();
            context.moveTo(30, 250-o+i*things.width+(i-1)*things.silt);
            context.lineTo(30, 250-o+i*(things.width+things.silt));
    
            context.lineWidth = 1;
            context.strokeStyle = "#996633";
            context.stroke();
        }
        

        context.beginPath();
        context.moveTo(30, 250+o);
        context.lineTo(30, canvas.height);
    
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.stroke();
        
        
    
        context.restore();
    }
function drawLen(){
    context.save();
    var z = Math.tanh(11/60);

    context.beginPath();
    context.arc(-530, 250, 610, -z, z);
    context.arc(670, 250, 610, Math.PI-z, Math.PI+z);
    context.fillStyle = "cornflowerblue";
    context.fill();
    context.lineWidth = 0.5;
    context.stroke();

    context.restore();
}
function drawScreen() {
        
        context.save();
    
        context.beginPath();
        context.moveTo(things.distence, 0);
        context.lineTo(things.distence, canvas.height);
    
        context.lineWidth = 2;
        context.strokeStyle = "#996633";
        context.stroke();
    
    
        context.restore();
    }
function drawSpect(){
    context.save();
    for(var i=0;i<canvas.height;i+=1){
        var a =Math.PI*things.width*Math.sin(Math.tanh((250-i)/things.distence));
        var b =Math.PI*(things.width+things.silt)*Math.sin(Math.tanh((250-i)/things.distence));
        if(i!=250){
            var u=Math.pow(Math.sin(a)/a,2);
            var v=Math.pow(Math.sin(things.N*b)/Math.sin(b),2);
        }
        else{
            var u=1;
            var v=Math.pow(things.N,2);
        }
        var q =Math.PI*things.width*Math.sin(Math.tanh((250-i-1)/things.distence));
        var w =Math.PI*(things.width+things.silt)*Math.sin(Math.tanh((250-i-1)/things.distence));
        if(i!=249){
            var e=Math.pow(Math.sin(a)/a,2);
            var r=Math.pow(Math.sin(things.N*b)/Math.sin(b),2);
        }
        else{
            var e=1;
            var r=Math.pow(things.N,2);
        }

        context.beginPath();
        context.moveTo(things.distence-30*u*v, i);
        context.lineTo(things.distence-30*e*r, i+1);
        context.lineWidth = 3;
        context.strokeStyle = "#663333";
        context.stroke();
        

        var f = Math.ceil(15*u*v);
        var h = "rgb(255,255,0)";
        var y = h.replace(/255/g,f);
        context.beginPath();
        context.moveTo(1105, i);
        context.lineTo(1105, i+1);
        context.lineWidth = 40;
        context.strokeStyle = y;
        context.stroke();


    }
    context.restore();

}
function draw(currentTime) {
    requestAnimFrame(draw);

    
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSilt();
    drawLen();
    drawScreen(); 
    drawSpect();   
}

Range1.onchange = function(e) {
    things.silt = Math.trunc(Range1.value);
}
Range2.onchange = function(e) {
    things.distence = Range2.value;
}
Range3.onchange = function(e) {
    things.width = Math.trunc(Range3.value);
}
Range4.onchange = function(e) {
    things.N = Math.trunc(Range4.value);
}

draw();