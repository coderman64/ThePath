
var canvi = document.getElementById("myCanvas");
var c = canvi.getContext("2d");

var points = [];

var obstacles = [];

var score = 0;
var distance = 0;

var buttonPressed = 0;
var gameEnded = false;
var speed = 1;

var particles = [];

var particle = function(x,y,size,angle,speed,direction){
    this.x = x;
    this.y = y;
    this.size = size;
    this.alpha = 255;
    this.angle = angle;
    this.speed = speed;
    this.direction = direction;
}
particle.prototype.draw = function(){
    c.translate(this.x,this.y+distance);
    c.rotate(this.angle);
    c.fillStyle = "rgba(0,0,0,"+(this.alpha/255).toString()+")";
    c.fillRect(0-this.size,0-this.size,this.size*2,this.size*2);
    c.setTransform(1,0,0,1,0,0);
    this.angle += 0.1;
    this.alpha -= this.speed*5;

    var xChange = Math.cos(this.direction)*this.speed;
    var yChange = Math.sin(this.direction)*this.speed;
    this.x += xChange;
    this.y += yChange;
}

function resizeGame(){
    canvi.style.height = Math.min(window.innerHeight,window.innerWidth).toString()+"px";
    canvi.style.width = Math.min(window.innerHeight,window.innerWidth).toString()+"px";
    canvi.style.left = window.innerWidth/2-Math.min(window.innerHeight,window.innerWidth).toString()/2+"px";
    canvi.style.top = window.innerHeight/2-Math.min(window.innerHeight,window.innerWidth).toString()/2+"px";
}
resizeGame();

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
    obstacles[i] = new obstacle(Math.round(Math.random()*500),Math.round(Math.random()*500)-150,Math.round(Math.random()*50));
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
                for(var i = 0; i<20;i++){
                    particles[i] = new particle(points[points.length-1].x,points[points.length-1].y,5,Math.round(Math.random()*360),Math.random()*0.8+0.2,Math.round(Math.random()*360));
                }
            }
        }else if(gameEnded){
            c.beginPath();
            c.arc(obstacles[i].x, obstacles[i].y+distance, obstacles[i].size, 0, 2 * Math.PI);
            c.fill();
        }
    }
}

function drawParticles(){
    for(var i = 0; i<particles.length; i++){
        particles[i].draw();
    }
}

function drawAll(){
    c.beginPath();
    c.fillStyle = "white";
    c.fillRect(0,0,500,500);
    c.fill();
    drawPathLine();
    drawObstacles();
    drawParticles();
    
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
            for(var i = 0; i<20;i++){
                particles[i] = new particle(points[points.length-1].x,points[points.length-1].y,5,Math.round(Math.random()*360),Math.random()*0.8+0.2,Math.round(Math.random()*360));
            }
        }
    }else{
        if(distance > 0){
            speed += 0.05;
        }else{
            distance = 0;
            speed *= -0.1;
            if(speed<0.01&&speed>-0.01){
                speed = 0;
            }
        }
        distance -= speed;
        if(speed < 0.01&&speed > -0.01&&distance == 0){
           c.fillStyle ="#000000";
           c.font = "20px Georgia";
           c.textAlign = "center";
           c.textBaseline = "middle";
           c.fillText("You forged a path "+score.toString()+"m long!",250,200);
           c.fillText("Tap Anywhere To Play Again",250,250);
           speed = 0;
        }
    }
    //c.fillStyle = "#000";
    //c.font = "20px Georgia";
    //c.fillText(mouseLoc.x.toString()+","+mouseLoc.y.toString(),50,50);
    if(score < distance){
        score = Math.ceil(distance);
    }
    c.fillStyle ="#888888";
    c.font = "20px monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(score.toString(),400,50);
}

function resetGame(){
    //reset all obstacles
    obstacles = [];
    for(var i = 0; i<20; i++){
        obstacles[i] = new obstacle(Math.round(Math.random()*500),Math.round(Math.random()*500)-150,Math.round(Math.random()*50));
    }
    //reset line
    points = [new vect2(250,500), new vect2(250,400)];
    speed = 1;
    gameEnded = false;
    pathPosition = 250;
    buttonPressed = 0;
    particles = [];
    score = 0;
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

window.addEventListener("mousedown",function(e){
    if(gameEnded&&speed>-0.01&&speed<0.01){
        resetGame();
    }
});


// --Mobile Controls--
window.addEventListener("touchstart",function(e){
    var rect1 = canvi.getBoundingClientRect();
    mouseLoc = {
       x: e.touches[0].pageX - rect1.left,
       y: e.touches[0].pageY - rect1.top
    }; //change the "mouseLoc" variable to reflect the mouse's current position
    if(gameEnded&&speed>-0.01&&speed<0.01){
        resetGame();
    }else{
    if(mouseLoc.x>window.innerWidth/2){
        buttonPressed = 1;
    }else{
        buttonPressed = -1;
    }
    if(gameEnded == false){
    points[points.length] = new vect2(pathPosition,400-distance);
    }
    }
    
    e.preventDefault();
});

window.addEventListener("touchend",function(e){
    if(gameEnded == false){
        points[points.length] = new vect2(pathPosition,400-distance);
    }
    buttonPressed = 0;
});

window.addEventListener("resize",resizeGame);