
var canvi = document.getElementById("myCanvas");
var c = canvi.getContext("2d");

var points = [];

var obstacles = [];

var distance = 0;

var buttonPressed = 0;
var gameEnded = false;
var speed = 1;

var vect2 = function(x,y){
    this.x = x;
    this.y = y;
}
var obstacle = function(x,y,size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.active = true;
}

for(var i = 0; i<20; i++){
    obstacles[i] = new obstacle(Math.round(Math.random()*500),Math.round(Math.random()*500),Math.round(Math.random()*50));
}

var mouseLoc = {x:0,y:0};

pathPosition = 250;

points[0] = new vect2(250,500);
points[1] = new vect2(250,400);

var timer = window.setInterval(drawAll,17)

function drawPathLine(){
    c.moveTo(points[0].x,points[0].y+distance);
    c.beginPath();
    c.lineWidth = "5";
    c.strokeStyle = "black";
    for(var i = 0; i<points.length;i++){
        c.lineTo(points[i].x,points[i].y+distance);
        //console.log("line "+points[i].x.toString()+", "+points[i].y.toString());
    }
    c.stroke();
}

function drawObstacles(){
    //c.lineWidth = "5";
    c.fillStyle = "black";
    for(var i = 0; i<obstacles.length;i++){
        if(obstacles[i].active){
            c.beginPath();
            c.arc(obstacles[i].x, obstacles[i].y+distance, obstacles[i].size, 0, 2 * Math.PI);
            //console.log("obstacle "+i.toString()+" at position: "+obstacles[i].x.toString()+", "+obstacles[i].y.toString());
            c.fill();
            if(obstacles[i].y+distance>500+obstacles[i].size){
                var sizer = Math.round(Math.random()*50);
                obstacles[obstacles.length] = new obstacle(Math.round(Math.random()*500),0-(distance+sizer),sizer);
                obstacles[i].active = false;
            }
            if( Math.sqrt(Math.pow(points[points.length-1].x-obstacles[i].x,2)+Math.pow(points[points.length-1].y-obstacles[i].y,2)) < obstacles[i].size){
                gameEnded = true;
                console.log("gameover "+i.toString()+" with a distance of "+Math.sqrt((points[points.length-1].x-obstacles[i].x)^2+(points[points.length-1].y-obstacles[i].y)^2).toString()+" size of "+obstacles[i].size);
                obstacles[i].active = false;
                speed = 0;
            }
        }else if(gameEnded){
            c.beginPath();
            c.arc(obstacles[i].x, obstacles[i].y+distance, obstacles[i].size, 0, 2 * Math.PI);
            c.fill();
        }
    }
}

function drawAll(){
    c.beginPath();
    c.fillStyle = "white";
    c.fillRect(0,0,500,500);
    c.fill();
    drawPathLine();
    drawObstacles();
    
    if(gameEnded == false){
        console.log("test");
        if(buttonPressed == 0){
            distance += speed;
            points[points.length-1].y -= speed;
            speed += 0.001;
        }else{
            if(buttonPressed == 1){
                pathPosition += 5;
            }else if(buttonPressed == -1){
                pathPosition -= 5;
            }
            points[points.length-1].x = pathPosition;
        }
        if(points[points.length-1].x <0||points[points.length-1].x>500){
            gameEnded = true;
        }
    }else{
        if(distance > 0){
            speed += 0.05;
        }else{
            distance = 0;
            speed *= -0.1;
        }
        distance -= speed;
    }
}

window.onkeydown = function(evt){
    if(gameEnded == false){
        if(evt.keyCode == 37){//left
            buttonPressed = -1;
            points[points.length] = new vect2(pathPosition,400-distance);
        }else if(evt.keyCode == 39){//right
            buttonPressed = 1;
            points[points.length] = new vect2(pathPosition,400-distance);
        }
    }
}

window.onkeyup = function(evt){
    if(gameEnded == false){
        points[points.length] = new vect2(pathPosition,400-distance);
        buttonPressed = 0;
    }
}

window.addEventListener("touchstart",function(e){
    var rect = canvi.getBoundingClientRect();
    mouseLoc = {
       x: e.touches[0].PageX,
       y: e.touches[0].PageY
    }; //change the "mouseLoc" variable to reflect the mouse's current position
    if(gameEnded == false){
    if(mouseLoc.x>50){
        buttonPressed = 1;
    }else{
        buttonPressed = -1;
    }
    points[points.length] = new vect2(pathPosition,400-distance);
    }
    e.preventDefault();
});

window.addEventListener("touchend",function(e){
    if(gameEnded == false){
        points[points.length] = new vect2(pathPosition,400-distance);
        buttonPressed = 0;
    }
});
