var gameState = "play"
var oi = []
var score = 0

function preload() {
    trex_running = loadAnimation("tile000.png", "tile001.png", "tile002.png", "tile003.png")
    trex_stop = loadAnimation("tile004.png", "tile005.png")
    cloudImg = loadAnimation("cloud.png")
    groundImg = loadImage("ground2.png")
    obstacle1Image = loadImage("obstacle1.png")
    obstacle2Image = loadImage("obstacle2.png")
    obstacle3Image = loadImage("obstacle3.png")
    obstacle4Image = loadImage("obstacle4.png")
    obstacle5Image = loadImage("obstacle5.png")
    obstacle6Image = loadImage("obstacle6.png")
    gameover = loadImage("gameOver.png")
    restart = loadImage("restart.png")
    jumpsound = loadSound("jump.mp3")
    diesound = loadSound("die.mp3")
    cppoint = loadSound("checkPoint.mp3")
}
function setup() {
    createCanvas(600, 200)
    // Create Ground sprite
    ground = createSprite(width / 2, 195)
    ground.addImage(groundImg)

    // create trex sprite and addanimation
    trex = createSprite(50, 180)
    trex.addAnimation("run", trex_running)
    trex.addAnimation("trexStop", trex_stop)
    trex.scale = 0.5


    // creating edge sprites
    edges = createEdgeSprites()

    // cloud group
    cloudGroup = new Group()

    // obstacle group
    obstacleGroup = new Group()

    // adding Images to array
    oi = [obstacle1Image, obstacle2Image, obstacle3Image, obstacle4Image, obstacle5Image, obstacle6Image]

    // settign the width of the ground for as wide as image of the ground
    ground.x = ground.width / 2

    invisibleGround = createSprite(width / 2, 198, width, 10)
    invisibleGround.visible = false

    gameOverSprite = createSprite(width/2,height/2)
    gameOverSprite.addImage(gameover)
    gameOverSprite.scale = 0.5

    restartSprite = createSprite(width/2,height/2 + 20 )
    restartSprite.addImage(restart)
    restartSprite.scale = 0.5
}
function draw() {
    background("white")

    // adding score to the game
    textSize(15)
    text("Score:" + score, width - 100, 20)
    
   
    //Moving background
    if (gameState === "play") {

        score = score + Math.round(frameRate()/30)
        gameOverSprite.visible = false
        restartSprite.visible = false
        trex.changeAnimation("run")
        ground.velocityX = -12
        // Jump move with space key for trex
        if (keyDown("space") && trex.y>169) {
            trex.velocityY = -10
            jumpsound.play(6)
        }

        if(score % 200 === 0 &&score > 0){
                cppoint.play(6)
        }
        // adding gravity after jump
        trex.velocityY = trex.velocityY + 0.6

        trex.collide(invisibleGround)

        // calling function spawnClouds
        spawnClouds()

        // calling function spawnObstacles
        spawnObstacles()

        // resetting background to create a moving effect
        if (ground.x < 0) {
            ground.x = ground.width / 2

        }
        if (obstacleGroup.isTouching(trex)) {
            diesound.play()
            diesound.setVolume(6)
            gameState = "end"
        }
    }
    else {
        gameOverSprite.visible = true
        restartSprite.visible = true
     
       
        if(mousePressedOver(restartSprite)){
            reset()
        }
        trex.velocityY = 0
        trex.changeAnimation("trexStop")
        obstacleGroup.setVelocityXEach(0)
        cloudGroup.setVelocityXEach(0)
        ground.velocityX = 0
        obstacleGroup.setLifetimeEach(-1)
        cloudGroup.setLifetimeEach(-1)
    }
    trex.collide(invisibleGround)
    drawSprites()
}

function spawnClouds() {

    // using frameCount to restrict the number of clouds created
    if (frameCount % 90 === 0) {
        cloud = createSprite(850, random(50, 110))
        cloud.addAnimation("clouds", cloudImg)
        cloud.velocityX = -4
        cloudGroup.add(cloud)
        // add liftime to sprite to destroy sprite and save memory(memory leakage)
        cloud.lifetime = 220
        cloud.scale = 0.1
     trex.depth = cloud.depth + 1
    }

}

function spawnObstacles() {
    if (frameCount % 90 === 0) {
        obstacle = createSprite(850, ground.y - 20)
        var rand = Math.round(random(0, 5))
        obstacle.addImage("obstacle", oi[rand])
        obstacle.velocityX = -7
        obstacle.scale = 0.5
        obstacleGroup.add(obstacle)
        obstacle.lifetime = 220
    }
}

function reset(){
    obstacleGroup.destroyEach()
    cloudGroup.destroyEach()
    gameState = "play"
    score = 0

}
