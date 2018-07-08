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
        this.snakeEye1;
        this.snakeEye2;
        this.snakeEye3;
        this.snakeEye4;

        this.ladderFoot1;
        this.ladderFoot2;
        this.ladderFoot3;
        this.ladderFoot4;

        this.snakeHeads;
        this.testheads;
        

    },

    preload: function ()
    {
       
        //this.load.image('tiles', 'assets/drawtiles-longer64.png');
        this.load.image('tiles', 'assets/drawtiles-good64.png');
        // this.load.image('tiles', 'assets/drawtiles-numbered2.png');
        
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
        this.load.image('snake3', 'assets/snake3.png');
        
    },

    mapMake: function() {
        this.tiles = [];
        for(let i = 9; i >= 0 ; i -- ){
            let row = [];
            for(let j = 0; j<10; j++){
                row.push(10*i + j + 1);
            }
            this.tiles.push(row);
         }
         /// original:
    // mapMake: function() {
    //     this.tiles = [];
    //     for(let i = 0; i < 10; i++){
    //         let row = [];
    //         for(let j = 0; j<10; j++){
    //             row.push(10*i + j + 1);
    //         }
    //         this.tiles.push(row);
    //     }
        
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
        this.marines = this.physics.add.group({
            maxSize: 5,
            runChildUpdate: true,
            defaultKey: 'marine'
        });
        /// trying runChildUpdate.  
        this.snakes = this.add.group();
        this.ladders = this.add.group();
        this.snakeHeads = this.add.group();
      
        this.ppUps = this.physics.add.group();
        this.snakeEyes = this.physics.add.group();
        this.ladderFeet = this.physics.add.group();
        // this.sTHelpers = this.physics.add.group();
        this.portalTiles = this.physics.add.group();
        this.portalCentres = this.physics.add.group();
        ///////////
        this.loneMarine = this.marines.create(32 ,64 * 9 + 48, 'marine');
        
      

        this.snakeEye2 = this.snakeEyes.create(8 * 64 + 32, 4 * 64 + 32, 'snakeEye').setData({tailTileNumber: 5});
        this.snake2 = this.snakes.create(this.snakeEye2.x,this.snakeEye2.y,'snakeY') ;
        this.snakePlace(this.snake2,this.snakeEye2);
        
        this.snakeEye3 = this.snakeEyes.create(5 * 64 + 32, 4 * 64 + 32, 'snakeEye').setData({tailTileNumber: 12});
        this.snake3 = this.snakes.create(this.snakeEye3.x,this.snakeEye3.y,'snakeY').setTint(0xDEDE11);
        this.snakePlace(this.snake3,this.snakeEye3);
        
        this.snakeEye4 = this.snakeEyes.create(3 * 64 + 32, 1 * 64 + 32, 'snakeEye').setData({tailTileNumber: 33});
        this.snake4 = this.snakes.create(this.snakeEye4.x,this.snakeEye4.y,'snakeY').setTint(0x175903);
        this.snakePlace(this.snake4,this.snakeEye4);
        //////////////////////////////////////////
        // this.ladderFoot1 = this.ladderFeet.create(2 * 64 + 6, 8 * 64 + 60, 'ladderFoot');
        // this.ladder1 = this.ladders.create(this.ladderFoot1.x,this.ladderFoot1.y,'ladder').setTint(0xD09155).setData({topTileNumber: 75});
        // this.ladderPlace(this.ladder1,this.ladderFoot1);
        
        this.ladderFoot2 = this.ladderFeet.create(64 * 6 + 32, 64* 10 - 32,'ladderFoot').setData({topTileNumber: 57});
        this.ladder2 = this.ladders.create(this.ladderFoot2.x,this.ladderFoot2.y,'ladder');
        this.ladderPlace(this.ladder2,this.ladderFoot2);

        this.ladderFoot3 = this.ladderFeet.create(64 * 7 + 32, 64* 8 - 32,'ladderFoot').setData({topTileNumber: 98});
        this.ladder3 = this.ladders.create(this.ladderFoot3.x,this.ladderFoot3.y,'ladder').setTint(0xFFDED0);
        this.ladderPlace(this.ladder3,this.ladderFoot3);

        this.ladderFoot4 = this.ladderFeet.create(64 * 1 + 32, 64 * 8 - 32,'ladderFoot').setData({topTileNumber: 41}); // this one buggy
        this.ladder4 = this.ladders.create(this.ladderFoot4.x,this.ladderFoot4.y,'ladder').setTint(0xAAAAAB);
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
        /////////////////////////// test  !!!  
       this.testheads = this.physics.add.group({
            defaultKey: 'snakehead',
            maxSize: 10
        });
    
        var x = 60;
    
        this.input.on('pointerdown', function () {
    
            //  Pluck an entry from the pool. If it doesn't already exist, create it.
            this.testheads.get(x, 500);
    
            x += 74;
            console.log(this.testheads[0]);
            // info.setText([
            //     'Used: ' + testheads.getTotalUsed(),
            //     'Free: ' + testheads.getTotalFree()
            // ]);
    
        },this);

        ////////////////////////////
        // overlaps are great ... if they work
        //this.physics.add.collider(this.loneMarine, this.instanceLadderBottom);
        //this.physics.add.collider(this.marines, this.instanceLadderBottom);
        // this.physics.add.collider(this.loneMarine, this.instanceLadderBottom, this.exclaimInDespair, null, this);
        // this.physics.add.collider(this.loneMarine, this.instanceSnakeTail, this.exclaimInDespair, null, this);
        
        this.physics.add.overlap(this.loneMarine, this.portalPowerUp, this.walkRight, null, this);
        this.physics.add.overlap(this.loneMarine, this.snakeEyes, this.slideDown, null, this); // this could be SnakeEyes
        this.physics.add.overlap(this.loneMarine, this.ladderFeet, this.walkUp, null, this);
        this.physics.add.overlap(this.marines, this.ladderFeet, this.walkUp, null, this);
        //  this.physics.add.overlap(this.loneMarine, this.testheads, this.testUp, null, this); // loneMarine
         this.physics.add.overlap(this.marines, this.testheads, this.testUp, null, this);
        // this.physics.add.overlap(this.loneMarine, this.instanceSnakeTail, this.walkRight, null, this);
        this.physics.add.overlap(this.loneMarine, this.ppUps, this.collectPortal, null, this);
        this.physics.add.overlap(this.loneMarine, this.portalCentres, this.portalSend, null, this);
        console.log('post-create log ');
        

    },
   testUp: function(marine, other) {
    console.log('in testUp for testHead overlap');
    //this.testheads.children.forEach((snakehead)=>console.log('tsetse fly'));
    // the above throws error with or without 'children'
    this.portalSend(marine,other);
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
    ladderPlaceFromArray: function (ladder, footObject) {
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
    
            this.instancePortalTile = this.portalTiles.create(64 * 10 - 32, 64 * 10 - 32, 'tile4').setAlpha(0.8,0.6,0.7, 0.5);
            this.instancePortalZone = this.portalCentres.create(64 * 10 - 32, 64 * 10 - 15,'portalCentre');
  
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
    releaseMarine2: function (tX,tY) 
    {
        this.timer = this.time.now + 1618;
        var marine = this.marines.get();
        if(marine){ 
            //let newMarine = this.marines.get(64*tX + 48,64*tY +  48);
            marine.setPosition(64 * tX + 48 ,64 * tY + 48);
            //this.marines.push(newMarine); // nope.
            marine.setVelocityX(100);
            //console.log(newMarine.typeof());
        }
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
        this.physics.moveTo(marine,targetX,targetY,170);
        //this.physics.moveTo(marine,100,100,170); what
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
            if(this.time.now > this.timer  ) {
                this.releaseMarine2(0,9);
                console.log(this.marines.length);
            }
    }

});


