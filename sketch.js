var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  //trex = createSprite(50,180,20,50);
  trex = createSprite(50,height-20,20,50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  //ground = createSprite(200,180,400,20);
  ground = createSprite(200,height-20 ,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //gameOver = createSprite(300,100);
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  //restart = createSprite(300,140);
  restart = createSprite(width/2,height/2 +40);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  //invisibleGround = createSprite(200,190,400,10);
  invisibleGround = createSprite(200,height-10,300,10);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hola" + 5);
  
  trex.setCollider("circle",0,0,40);
  
  
  score = 0;
  
}

function draw() {
  
  background(360);
  //mostrar puntuación
  text("Puntuación: "+ Math.round(score), width -100,50);
  
  
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //mover el suelo
    ground.velocityX = -4;
    //puntuación
    score = score + 0.3;

    

    if(score %100== 0){
      checkpointSound.play();
    }
      

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el trex salte al presionar la barra espaciadora
    if((keyDown("space") || touches.length>0) && trex.y >= height -60) {
        trex.velocityY = -13;
        jumpSound.play();
    }
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer las nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    if(Math.round(score)>0 && Math.round(score)%100== 0){
        checkpointSound.play();
    }


    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
     
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //cambiar la animación del trex
      trex.changeAnimation("collided", trex_collided);
     
      //establecer lifetime de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

     if(mousePressedOver(restart)){
      console.log("Reinicio")
      reset();
      touches= [];
  }
   }
  
 
  //evitar que el trex caiga
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function reset(){
  gameState = PLAY
  score = 0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running")
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   //var obstacle = createSprite(400,165,10,40);
   var obstacle = createSprite(width,height-35,165,10,40);
   obstacle.velocityX = -6;
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.6;
    obstacle.lifetime = 320;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}
              
function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
     //cloud = createSprite(600,100,40,10);
     cloud = createSprite(width,100,40,10);
    cloud.y = Math.round(random(10,height -100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 310;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube al grupo
   cloudsGroup.add(cloud);
    }
}

