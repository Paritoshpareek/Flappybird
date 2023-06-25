// board variables
let board;
let boardWidth=360;
let boardHeight=640;
let context; //for drawing purpose

//bird
let birdWidth=34;
let birdHeight=24;
let birdX= boardWidth/8;
let birdY= boardHeight/2;
let birdImg;

let bird={
    x : birdX, 
    y : birdY,
    width : birdWidth, 
    height : birdHeight
}
// pipes
let pipeArray= [];
let pipeWidth=64;
let pipeHeight=512;
let pipeX= boardWidth;
let pipeY= 0;

let topPipeImg;
let bottomPipeImg;
// adding physics
let velocityX=-1.8  ;//pipe moving left
let velocityY=0; // bird jumping speed
let gravity=0.4 ;//gravity

let gameOver = false;
let score = 0;


window.onload = function() {//these feature will only load once the pafe is fully rendendered
board = document.getElementById("board");
board.height = boardHeight;
board.width = boardWidth;
context = board.getContext("2d"); //for   drawing purpose
//   draw flappy bird
// context.fillStyle = "green";
// context.fillRect(bird.x, bird.y, bird.width, bird.height);

//load images
birdImg = new Image();
birdImg.src = "./flappybird.png";
birdImg.onload = function() {
context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

topPipeImg = new Image();
topPipeImg.src="./toppipe.png";

bottomPipeImg = new Image();
bottomPipeImg.src="./bottompipe.png";


 requestAnimationFrame(update);
 setInterval(placePipes,1500);// updating in 1.5 sec
 document.addEventListener("keydown",moveBird);
 document.addEventListener("mousedown", moveBird);

}


function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    //clearing previous frames
    context.clearRect(0, 0, board.width, board.height);

    // bird
    velocityY+=gravity;
    // bird.y+=velocityY; this have no limits to the height to add limit to height we need to
    bird.y= Math.max(bird.y + velocityY , 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);


    if(bird.y > board.height){
        gameOver = true;
    }


    // pipes
    for(let i = 0; i <pipeArray.length; i++)    {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if( !pipe.passed && bird.x > pipe.x + pipe.width){
            score +=0.5;// for every edge of pipe passed +o.6 to score 
            pipe.passed=true;
        }

        if(detectCollision(bird,pipe)) {
            gameOver = true;
        }
    }
      //clear pipes
      while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);
}
function placePipes(){

   if(gameOver) {
    context.fillText("GAME OVER", 5, 90);
    context.font="20px sans-serif";
    context.fillText("Press space to restart", boardWidth /4 , boardHeight / 2 + 30);
   }

    let randomPipeY=pipeY -pipeHeight/4 -Math.random()*(pipeHeight/2);
    let openingSpace=board.height/4;

    let topPipe={
        img: topPipeImg,
        x: pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height: pipeHeight,
        passed : false
    }
   pipeArray.push(topPipe);
    let bottomPipe={
        img: bottomPipeImg,
        x: pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height: pipeHeight,
        passed : false
        
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code == "Space" || e.code == "ArrowUp" || e.code=="KeyX"|| e.type == "mousedown"){
        //jump
        velocityY=-6;
        //reset the game
        if(gameOver){
            bird.y=birdY;
            pipeArray=[];
            score=0;
            gameOver=false; 
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}