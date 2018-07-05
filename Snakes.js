// this build models BreakoutForReference as closely as poss. 
var Snakes = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Snakes ()
    {
        Phaser.Scene.call(this, { key: 'Snakes' });

        
        ///////////
        this.snakes;
        this.ladders;
        this.marines;
        this.portalCentres;
        this.ppUps;
        this.portalTiles;
        this.timer;
        this.loneMarine;
        this.instanceLadderBottom;
        this.instanceLadderTop;
        this.instanceSnakeHead;
        this.instanceSnakeTail;
        this.portalPowerUp;
        this.goingUp;
        this.goingDown;
        this.walking;
        this.snakeEye;
        this.ladderFeet;
        this.T;
        this.catchLine;
        this.instancePortalCentre;
        this.snakeEye2;
        this.snakeEye3;
        this.ladderFoot2;
        this.ladderFoot3;
        

    },

    preload: function ()
    {
       
        this.load.image('tiles', 'assets/drawtiles-longer64.png');//100 tiles across, instance is ignored
        
        this.load.image('ladder', 'assets/ladder.png');
        this.load.image('snake', 'assets/snake.png');
        this.load.image('snake256', 'assets/snake256.png');
        this.load.image('snakeY', 'assets/snakeY.png');
        this.load.image('glassTile', 'assets/glassTile.png');
        this.load.image('marine', 'assets/marine.png');
        this.load.image('laddertop', 'assets/laddertop.png');
        this.load.image('ladderbottom', 'assets/ladderbottom.png');
        this.load.image('snakehead', 'assets/snakehead.png');
        this.load.image('snaketail', 'assets/snaketail.png');
        //this.load.image('blankTailHelper', 'assets/blankTailHelper.png');
        this.load.image('snakeEye', 'assets/snakeEye.png');
        this.load.image('ladderFoot', 'assets/ladderFoot.png');
        this.load.image('portalTile', 'assets/portalTile.png');
        this.load.image('portalCentre', 'assets/portalCentre.png');
        this.load.image('tile4', 'assets/tile4.png');
    },

    mapMake: function() {
        this.tiles = [];
        for(let i = 0; i < 10; i++){
            let row = [];
            for(let j = 0; j<10; j++){
                row.push(10*i + j + 1);
            }
            this.tiles.push(row);
        }
        
        this.map = this.make.tilemap({ data: this.tiles, tileWidth: 64, tileHeight: 64 });// was 32
        this.tileset = this.map.addTilesetImage('tiles',null,64,64,2,4);//was 32,32,1,2
        this.layer = this.map.createStaticLayer(0, this.tileset,0, 0);
    },

    create: function ()
    {
        // place the map
        this.mapMake();
        this.T = 64;
        this.timer = 0;
        this.walking = true;
        this.goingDown = false;
        this.goingUp = false;
        this.spinning = false;
        //// groups
        this.marines = this.physics.add.group();
        this.snakes = this.add.group();
        this.ladders = this.add.group();
        // this.snakeheads = this.physics.add.group();
        // this.snaketails = this.physics.add.group();
        // this.laddertops = this.physics.add.group();
        // this.ladderbottoms = this.physics.add.group();
        this.ppUps = this.physics.add.group();
        this.snakeEyes = this.physics.add.group();
        this.ladderFeet = this.physics.add.group();
        // this.sTHelpers = this.physics.add.group();
        this.portalTiles = this.physics.add.group();
        this.portalCentres = this.physics.add.group();
        ///////////
        this.loneMarine = this.marines.create(32 ,64 * 9 + 48, 'marine');
        
        // this.instanceSnakeHead = this.snakeheads.create(64 * 1 + 32, 64 * 2 + 48, 'snakehead');
        // this.instanceSnakeTail = this.snaketails.create(64 * 1 + 32, 64 * 6 + 32, 'snaketail');
        //this.instanceSTHelper = this.snaketails.create(64 * 1 + 32, 64 * 6 + 32, 'snaketail');
        // this.instanceLadderBottom = this.ladderbottoms.create(64 * 2 + 16, 64 * 8 + 48, 'ladderbottom');
        // this.instanceLadderTop = this.laddertops.create(64 * 7 + 32, 64 * 2 + 16, 'laddertop');
        //this.instancePortalTile = this.portalTiles.create(10 * 64 -32, 10 * 64 - 32, 'portalTile');
        this.snakEye1 = this.snakeEyes.create(64 * 1 + 32, 64 * 2 + 48, 'snakeEye');
        this.snakeEye2 = this.snakeEyes.create(8 * 64 + 32, 4 * 64 + 32, 'snakeEye').setData({tailTileNumber: 5});
        this.snake2 = this.snakes.create(this.snakeEye2.x,this.snakeEye2.y,'snakeY') ;
        this.snakePlace(this.snake2,this.snakeEye2,5);
        
        this.snakeEye3 = this.snakeEyes.create(5 * 64 + 32, 4 * 64 + 32, 'snakeEye').setData({tailTileNumber: 12});
        this.snake3 = this.snakes.create(this.snakeEye3.x,this.snakeEye3.y,'snakeY').setTint(0xDEDE11);
        this.snakePlace(this.snake3,this.snakeEye3);
        
        this.snakeEye4 = this.snakeEyes.create(3 * 64 + 32, 1 * 64 + 32, 'snakeEye').setData({tailTileNumber: 33});
        this.snake4 = this.snakes.create(this.snakeEye4.x,this.snakeEye4.y,'snakeY').setTint(0x175903);
        this.snakePlace(this.snake4,this.snakeEye4);
        //////////////////////////////////////////
        this.ladderFoot1 = this.ladderFeet.create(2 * 64 + 6, 8 * 64 + 60, 'ladderFoot');
        this.ladderFoot2 = this.ladderFeet.create(64 * 6 + 32, 64* 10 - 32,'ladderFoot').setData({topTileNumber: 57});
        this.ladder2 = this.ladders.create(this.ladderFoot2.x,this.ladderFoot2.y,'ladder');
        this.ladderPlace(this.ladder2,this.ladderFoot2);

        this.ladderFoot3 = this.ladderFeet.create(64 * 7 + 32, 64* 8 - 32,'ladderFoot').setData({topTileNumber: 98});
        this.ladder3 = this.ladders.create(this.ladderFoot3.x,this.ladderFoot3.y,'ladder').setTint(0xFFDED0);
        this.ladderPlace(this.ladder3,this.ladderFoot3);

        this.ladderFoot4 = this.ladderFeet.create(64 * 4 + 32, 64 * 8 - 32,'ladderFoot').setData({topTileNumber: 78});
        this.ladder4 = this.ladders.create(this.ladderFoot4.x,this.ladderFoot4.y,'ladder').setTint(0x222222);
        
        this.ladderPlace(this.ladder4,this.ladderFoot4);


        // release manually for now with 'R'
        this.input.keyboard.on('keydown_R', function (event) { 
            
            this.loneMarine.setVelocityX(100);
        }, this);
        /// tile placer
        this.input.keyboard.on('keydown_U', function (event) { 
            this.placePortal(7,4);
        }, this);
        this.input.keyboard.on('keydown_A', function (event) {
            if(this.instancePortalTile) {
            this.instancePortalTile.x -= 64;
            this.instancePortalZone.x -= 64;
            }
        }, this);
        this.input.keyboard.on('keydown_D', function (event) {
            if(this.instancePortalTile) {
            this.instancePortalTile.x += 64;
            this.instancePortalZone.x += 64;
            }
        }, this);
    
        this.input.keyboard.on('keydown_W', function (event) {
            if(this.instancePortalTile) {
            this.instancePortalTile.y -= 64;
            this.instancePortalZone.y -= 64;
            }
        }, this);
        this.input.keyboard.on('keydown_S', function (event) {
            if(this.instancePortalTile) {
            this.instancePortalTile.y += 64;
            this.instancePortalZone.y += 64;
            }
        }, this);
        ///////////////////////////
        // overlaps are great ... if they work
        //this.physics.add.collider(this.loneMarine, this.instanceLadderBottom);
        //this.physics.add.collider(this.marines, this.instanceLadderBottom);
        // this.physics.add.collider(this.loneMarine, this.instanceLadderBottom, this.exclaimInDespair, null, this);
        // this.physics.add.collider(this.loneMarine, this.instanceSnakeTail, this.exclaimInDespair, null, this);
        
        this.physics.add.overlap(this.loneMarine, this.portalPowerUp, this.walkRight, null, this);
        this.physics.add.overlap(this.loneMarine, this.snakeEyes, this.slideDown, null, this); // this could be SnakeEyes
        this.physics.add.overlap(this.loneMarine, this.ladderFeet, this.walkUp, null, this);
        // this.physics.add.overlap(this.loneMarine, this.instanceSnakeHead, this.walkUp, null, this);
        // this.physics.add.overlap(this.loneMarine, this.instanceSnakeTail, this.walkRight, null, this);
        this.physics.add.overlap(this.loneMarine, this.ppUps, this.collectPortal, null, this);
        this.physics.add.overlap(this.loneMarine, this.portalCentres, this.portalSend, null, this);
        console.log('post-create log ');
        

    },
   
    snakePlace: function (snake, headObject) {
        snake.setOrigin(0, 0.5)
        let tailTileNumber = headObject.getData('tailTileNumber');
        snake.x = this.tileCentreXFromNumber(tailTileNumber);
        snake.y = this.tileCentreYFromNumber(tailTileNumber);
        
        let rotation =Math.atan2(-snake.y + headObject.y, -snake.x + headObject.x);
        snake.rotation = rotation;
        let squareSum = (snake.x - headObject.x)*(snake.x - headObject.x) + (snake.y- headObject.y) * (snake.y- headObject.y) ;
        snake.scaleX = Math.sqrt(squareSum) / 256; // n.b. scaled to tiles

    },
    ladderPlace: function (ladder, footObject) {
        ladder.setOrigin(0, 0.5)
        let topTileNumber = footObject.getData('topTileNumber');
        let topTileX = this.tileCentreXFromNumber(topTileNumber);
        let topTileY = this.tileCentreYFromNumber(topTileNumber);
    
        console.log('ttx,y,ttN:',topTileX,topTileY,topTileNumber);
        
        let rotation =-Math.atan2(ladder.y - topTileY, ladder.x - topTileX);
        ladder.rotation = rotation;
        let squareSum = (ladder.x - topTileX)*(ladder.x - topTileX) + (ladder.y- topTileY) * (ladder.y- topTileY) ;
        ladder.scaleX = Math.sqrt(squareSum) / 160; // n.b. scaled to tiles

    },
    collectPortal: function (marine, ppUp) 
    {
        ppUp.disableBody(true, true);
        console.log('in collectPortal');
        //setTimeout
        //setTimeout(function(){
            this.instancePortalTile = this.portalTiles.create(64 * 10 - 32, 64 * 10 - 32, 'tile4').setAlpha(0.8,0.6,0.7, 0.5);
            this.instancePortalZone = this.portalCentres.create(64 * 10 - 32, 64 * 10 - 15,'portalCentre');
            //; }, 400);
    },
    // reference:
    walkUp: function (marine, ladderFoot)
    {
        //console.log('walkUp');
        this.goingUp = true;
        let topTileNumber = ladderFoot.getData('topTileNumber');
        let targetX = this.tileCentreXFromNumber(topTileNumber);
        let targetY = this.tileCentreYFromNumber(topTileNumber);
        this.physics.moveTo(marine,targetX,targetY,160);
        this.catchLine = targetY + 16;
    },
    slideDown: function (marine, snakeEye)
    {
        console.log('slideDown');
        this.goingDown = true;
        let targetX = this.tileCentreXFromNumber(snakeEye.getData('tailTileNumber'));
        let targetY = this.tileCentreYFromNumber(snakeEye.getData('tailTileNumber'));
        this.physics.moveTo(marine,targetX,targetY,160);
        // console.log(targetX,targetY);
        this.catchLine = targetY + 16;
        
    },
    walkRight: function (marine, ladderBottom)
    {
        this.loneMarine.setVelocityX(100);
        this.loneMarine.setVelocityY(0);
        this.walking = true;
        this.spinning = false;
        this.loneMarine.angle = 0;
        this.loneMarine.setAngularAcceleration(0);
        this.loneMarine.setAngularVelocity(0);
        //orig.
        // this.loneMarine.setVelocityX(100);
        // this.loneMarine.setVelocityY(0);
        // this.walking = true;
        // this.spinning = false;
        // this.loneMarine.angle = 0;
        // this.loneMarine.setAngularDrag(0);
        
    },

    releaseMarine: function (tX,tY) 
    {
        this.timer = this.time.now + 1618;
        //let newMarine = this.marines.get(64*tX + 48,64*tY +  48);
        let newMarine = this.marines.create(64 * tX + 48 ,64 * tY + 48,'marine');
        //this.marines.push(newMarine); // nope.
        newMarine.setVelocityX(100);
        //console.log(newMarine.typeof());
    },
    resetMarine: function (marine) {
      marine.x = 16;
      marine.y = 640 - 16;
      marine.setVelocityX(100);
      marine.setVelocityY(0);  
      marine.setAngularAcceleration(-250);
    },

    //place portal tile  
    placePortal: function(tX,tY) {
        this.portalPowerUp = this.ppUps.create(64 * tX + 32, 64 * tY + 32, 'glassTile').setTint(0x448FF1).setAlpha(1,.5,.5, 0.3);
    },
    portalSend: function(marine, portal) {
        this.goingUp = true;
        this.spinning = true;
        let targetNumber = this.tileNumberFromXY(marine.x,marine.y)*4;
        console.log("in portalSend",targetNumber);
        let targetX = this.tileCentreXFromNumber(targetNumber);
        let targetY = this.tileCentreYFromNumber(targetNumber);
        this.catchLine = targetY + 16;
        this.physics.moveTo(marine,targetX,targetY);
        this.physics.moveTo(marine,100,100,170);
    },
    mapWrap: function(marine) {
        if(marine && marine.x > 640){
            marine.y -= 64;
             marine.x = 16;
         }
    },
    //auxiliary
    tileCentreYFromNumber: function (number) {
        let rowFromOne = Math.floor((number - 1)/10);
        return (
            640 - (64 * rowFromOne + 32)
        );
    },
    tileCentreXFromNumber: function (number) {
        let columnFromZero = (number - 1) % 10;
        return (
            64 * columnFromZero + 32
        );
    },
    tileNumberFromXY: function (x,y) {
        return (
            Math.floor(x / 64) + 1 + (10 * (10 - Math.ceil(y / 64)))
        );
    },
    
    
    update: function ()
    {
            this.mapWrap(this.loneMarine);
            if(this.portalPowerUp) {
                this.portalPowerUp.angle++;
            }
            // hackey ladder send
            //this.physics.overlap(this.loneMarine, this.instanceLadderBottom, this.walkUp, null, this);
            // if (this.loneMarine.x <= 64*2 + 32 && this.loneMarine.y == 64 * 8 + 48)  
            //     //console.log('100 x crossed');
            //     this.physics.moveToObject(this.loneMarine,this.instanceLadderTop);
            //     //this.physics.moveTo(this.loneMarine,  64 * 7 + 32, 64 * 2 + 48, 100 );
            if(this.goingUp && this.loneMarine.y < this.catchLine) {
                this.walkRight();
                this.goingUp = false;
            }
            if(this.goingDown && this.loneMarine.y > this.catchLine) {
                this.walkRight();
                this.goingDown = false;
            }
            if(this.spinning) {
                this.loneMarine.angle += 14;
            }
            if(this.instancePortalCentre) {
                this.instancePortalCentre.angle += 90;
            }
            if(this.loneMarine.y < - 200) {
                this.resetMarine(this.loneMarine);
            }
        }

});


