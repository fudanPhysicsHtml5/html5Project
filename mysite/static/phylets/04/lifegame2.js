const SIZE  = 70;//每行每列各有多少个细胞
const WIDTH = 10;//每个细胞宽度
const GAME_canvas= document.getElementById('game');
let GAME_Interval = null;
let	 game_context = GAME_canvas.getContext('2d');
let numbers = document.getElementById('numbers');
let cell_numbers = 1000;
let paused = false;
let isrun = document.getElementById('isrun');
let livingcells = document.getElementById('livingcells');
let animateButton1 = document.getElementById('animateButton');

let mouseListener = function(e){
    let x = Math.floor(e.pageX/WIDTH)-3;
    let y = Math.floor(e.pageY/WIDTH)-45;
    GAME.cells[x][y]=!GAME.cells[x][y];
    draw_cells();
}

let game = function(){
    GAME_canvas.width = WIDTH * SIZE;
    GAME_canvas.height = WIDTH * SIZE;
    this.cells = generate_cells();

    update();
    GAME_canvas.addEventListener("mousedown",mouseListener,false);
};
let random_cells = function(array){
    for(let i = 0; i<cell_numbers;i++){
        j =parseInt(Math.random()*SIZE);
        k =parseInt(Math.random()*SIZE);
        array[j][k] = 1;
    }
}
numbers.onchange = function(){
    cell_numbers = numbers.value;
}

let generate_cells = function(){
    retval = new Array(SIZE);
    for(let i =0; i<retval.length;i++){
        retval[i]=new Array(SIZE);
        for (let j =0; j<retval[i].length;j++){
            retval[i][j] = 0;
        }
    }
    random_cells(retval);

    return retval;
};
let count_neighbors = function(x,y){
    let counter = 0;
    for (let i = x-1; i<x+2;i++){
        for(let j =y-1; j<y+2 ; j++){
            if(i<0 || i>SIZE || j<0 || j>SIZE || (i == x && j == y) || i == SIZE || j ==SIZE)
                continue;
            if(GAME.cells[i][j])
                counter += 1;
        }
    }
    return counter;
};

let draw_cells = function(){
    for(let i = 0; i <SIZE; i++){
        for(let j =0; j<SIZE; j++){
            if(GAME.cells[i][j])
                game_context.fillRect(i*WIDTH+1, j*WIDTH+1, WIDTH-2, WIDTH-2);
            else
                game_context.clearRect(i*WIDTH+1, j*WIDTH+1, WIDTH-2, WIDTH-2);
        }
    }
};

let update = function(){
    game_context.clearRect(0,0,SIZE*WIDTH, SIZE*WIDTH);
    for (let i =0;i<=SIZE;i++) {
        game_context.beginPath();
        game_context.moveTo(0, i*WIDTH);
        game_context.lineTo(WIDTH*SIZE, i*WIDTH);
        game_context.moveTo(i*WIDTH, 0);
        game_context.lineTo(i*WIDTH, WIDTH*SIZE);
        game_context.stroke();
    }

    if(typeof GAME =='undefined')
        return;

    draw_cells();
    let new_cells = JSON.parse(JSON.stringify(GAME.cells));
    for(let i = 0;i <SIZE; i++){
        for(let j =0; j<SIZE; j++){
            new_cells[i][j]=0
            let cell= GAME.cells[i][j];
            let nearby = count_neighbors(i,j);
            if (nearby == 2 || nearby == 3){
                if(cell || nearby ==3)
                    new_cells[i][j]=1;

                else
                    new_cells[i][j]=0;
            }

        }
    }
    let counts = 0;
    for(let i = 0;i<SIZE;i++){
        for (let j = 0;j<SIZE; j++){
           if(GAME.cells[i][j]){
               counts+=1;
           }
        }
    }
    livingcells.innerHTML = counts;3
    GAME.cells = new_cells;
};
animateButton.onclick = function(e) {
    if (paused) {
        paused = false;
        animateButton.value = "stop";
        GAME_Interval = setInterval(update,500);
        isrun.innerHTML='System is running';
    }
    else {
        paused = true;
        animateButton.value = "start";
        clearInterval(GAME_Interval);
        isrun.innerHTML='System is stopped';
    }
}

let step = function(){
    update();
};
let reset = function(){
    if (paused == true){
        GAME = new game();
        draw_cells();

    }

}
GAME= new game();
