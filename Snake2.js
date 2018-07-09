 
var Snake2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Snake2 ()
    {
        Phaser.Scene.call(this, { key: 'Snake2' });
        this.beatTimer;
        this.beats;
        this.snakes;
        this.ladders;
        this.marines;
        this.portalCentres;
        this.levelData;
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
        this.ladderFeet;
        this.T;
        this.catchLine;
        this.nodeArray;
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
        
        
        this.load.image('portalTile', 'assets/portalTile.png');
        this.load.image('portalCentre', 'assets/portalCentre.png');
        this.load.image('tile4', 'assets/tile4.png');
        this.load.image('snake3', 'assets/snake3.png');
        
    },
    numberText: function() {
        for(let i = 0; i < 100; i ++ ) {
            for (let j = 0; j < 10; j++) {
                let nText = this.add.text(0, 0);
            }
        }
    },
    makeNodeArray: function() {
        let TSIZE = 64;
        let MHALF = 16;
        var nodeArray = [];
        for(let i = 0; i < 10; i ++ ) {
            for (let j = 0; j < 10; j++) {
                let y = 640 - TSIZE * i - MHALF;
                let x = TSIZE * j + MHALF;
                nodeArray.push([x,y]);
                let nText = this.add.text(x, y);
                nText.setText(10*i + j) ; // hackey?
            }
        }
        return nodeArray;
    },
    getSnakes: function(levelData) {
        for (let i = 0; i < levelData.length; i++) {
            datum = levelData[i];
            if (datum) {
                if (datum < i) {
                    //let marine = this.marines.get();
                    // console.log(this); // is 'Snake2'
                    // let ladder = this.ladders.get();
                    // let snake = this.snakes.get();
                    this.snakeFromTiles(datum,i);
                }
                else if (datum > i) {
                    this.ladderFromTiles(i,datum);
                }
                else if (datum == i) {
                    // should be fall through anyway
                    //this.winTilePlace(i);
                }
            }
        }   
    },
        ///// right order   
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
        this.levelData = [
             ,  ,  ,24,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,  ,13,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
             100
        ];
        this.mapMake();
        this.nodeArray = this.makeNodeArray();
        this.timer = 0;
        this.beatTimer = 0;
        this.beats = 0;
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
        this.snakes = this.physics.add.group({
            maxSize: 6,
            runChildUpdate: true, //// ?
            defaultKey: 'snakeY'
        });
        this.ladders = this.add.group({
            maxSize: 6,
            runChildUpdate: true, //// ?
            defaultKey: 'ladder'
        });
        
        //this.thisFunction(4,4); /// after defining sneks
         this.getSnakes(this.levelData);  // not workign
        
        this.ppUps = this.physics.add.group();
        
        this.portalTiles = this.physics.add.group();
        this.portalCentres = this.physics.add.group();
        ///////////
        this.loneMarine = this.marines.create(32 ,64 * 9 + 48, 'marine');
        this.loneMarine.setData({nextTile: 1 })
        
        
        
        this.input.keyboard.on('keydown_R', function (event) { 
              this.sendToTile(this.loneMarine,1);
        //    this.loneMarine.setVelocityX(100);
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
       
        this.physics.add.overlap(this.loneMarine, this.portalPowerUp, this.walkRight, null, this);
        this.physics.add.overlap(this.loneMarine, this.snakeEyes, this.slideDown, null, this); // this could be SnakeEyes
        
       
        //  this.physics.add.overlap(this.loneMarine, this.testheads, this.testUp, null, this); // loneMarine
         this.physics.add.overlap(this.marines, this.testheads, this.testUp, null, this);
        // this.physics.add.overlap(this.loneMarine, this.instanceSnakeTail, this.walkRight, null, this);
        this.physics.add.overlap(this.loneMarine, this.ppUps, this.collectPortal, null, this);
        this.physics.add.overlap(this.loneMarine, this.portalCentres, this.portalSend, null, this);
        //console.log('post-create log ');
    },
   testUp: function(marine, other) {
    // console.log('in testUp for testHead overlap');
 
    this.portalSend(marine,other);
   },

    // snakePlace: function (snake, headObject) {
    //     snake.setOrigin(0, 0.5)
        
    //     let tailTileNumber = headObject.getData('tailTileNumber');
    //     snake.x = this.tileCentreXFromNumber(tailTileNumber);
    //     snake.y = this.tileCentreYFromNumber(tailTileNumber);
        
    //     let rotation =Math.atan2(-snake.y + headObject.y, -snake.x + headObject.x);
    //     snake.rotation = rotation;
    //     let squareSum = (snake.x - headObject.x)*(snake.x - headObject.x) + (snake.y- headObject.y) * (snake.y- headObject.y) ;
        
    //     snake.scaleX = Math.sqrt(squareSum) / 256; // n.b. scaled
    // },
    
    ladderPlace: function (ladder, footObject) {
        ladder.setOrigin(0, 0.5)
        let topTileNumber = footObject.getData('topTileNumber');
        let topTileX = this.tileCentreXFromNumber(topTileNumber);
        let topTileY = this.tileCentreYFromNumber(topTileNumber);
    
        // console.log('ttx,y,ttN:',topTileX,topTileY,topTileNumber);
        
        let rotation =-Math.atan2(ladder.y - topTileY, ladder.x - topTileX);
        ladder.rotation = rotation;
        let squareSum = (ladder.x - topTileX)*(ladder.x - topTileX) + (ladder.y- topTileY) * (ladder.y- topTileY) ;
        ladder.scaleX = Math.sqrt(squareSum) / 160; // n.b. scaled to tiles

    },
    
    collectPortal: function (marine, ppUp) 
    {
        ppUp.disableBody(true, true);
        // console.log('in collectPortal');
    
            this.instancePortalTile = this.portalTiles.create(64 * 10 - 32, 64 * 10 - 32, 'tile4').setAlpha(0.8,0.6,0.7, 0.5);
            this.instancePortalZone = this.portalCentres.create(64 * 10 - 32, 64 * 10 - 15,'portalCentre');
  
    },
    // 
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
        // console.log('slideDown');
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

  
    releaseMarine2: function (tX,tY) 
    {
        this.timer = this.time.now + 1618;
        var marine = this.marines.get(); // works!
         
        if(marine){ 
          
            marine.setPosition(64 * tX + 48 ,64 * tY + 48);
   
            marine.setVelocityX(100);
 
        }
    },
    thisFunction: function(tailTile,headTile) {
        let snake = this.snakes.get();
        snake.setPosition(400,400);
    },
    resetMarine: function (marine) {
      marine.x = 16;
      marine.y = 640 - 16;
      marine.setVelocityX(100);
      marine.setVelocityY(0);  
      marine.setAngularAcceleration(-250);
    },
    snakeFromTiles: function (tailTile,headTile) {
        var snake = this.snakes.get();
        snake.setOrigin(0, 0.5);
        /// setPosition, rather? 
        snake.x = this.nodeArray[tailTile][0];
        snake.y = this.nodeArray[tailTile][1];
        let headX = this.nodeArray[headTile][0];
        let headY = this.nodeArray[headTile][1];
        let rotation = Math.atan2(-snake.y + headY, -snake.x + headX);
        snake.rotation = rotation;
        let squareSum = (snake.x - headX)*(snake.x - headX) + (snake.y- headY) * (snake.y- headY) ;
        
        snake.scaleX = Math.sqrt(squareSum) / 256; // n.b. scaled
    },
    ladderFromTiles: function (tailTile, headTile) {
        var ladder = this.ladders.get();
        ladder.setOrigin(0, 0.5);
        /// setPosition, rather? 
        ladder.x = this.nodeArray[tailTile][0];
        ladder.y = this.nodeArray[tailTile][1];
        let headX = this.nodeArray[headTile][0];
        let headY = this.nodeArray[headTile][1];
        let rotation = Math.atan2(-ladder.y + headY, -ladder.x + headX);
        ladder.rotation = rotation;
        let squareSum = (ladder.x - headX)*(ladder.x - headX) + (ladder.y- headY) * (ladder.y- headY) ;
        
        ladder.scaleX = Math.sqrt(squareSum) / 160; // n.b. sc

    },

    //place portal tile  
    placePortal: function(tX,tY) {
        this.portalPowerUp = this.ppUps.create(64 * tX + 32, 64 * tY + 32, 'glassTile').setTint(0x448FF1).setAlpha(1,.5,.5, 0.3);
    },
    portalSend: function(marine, portal) {
        this.goingUp = true;
        this.spinning = true;
        let targetNumber = this.tileNumberFromXY(marine.x,marine.y)*4;
        // console.log("in portalSend",targetNumber);
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
    sendToTile: function (marine, tileNumber) {
        let targetX = this.nodeArray[tileNumber][0];
        let targetY = this.nodeArray[tileNumber][1];
        marine.setData({nextTile: tileNumber});
        this.physics.moveTo(marine,targetX,targetY,null,1000 );
    },
    updateAndSend: function (marine) {
        let curTile = marine.data.values.nextTile;
        let gotTile = this.levelData[curTile];
        /// checking if need to wrap
        if( (curTile % 10 == 9) && !gotTile) {
            let targetX = marine.x + 64;
            let targetY = marine.y;
        }
        else { 
            let targetX = this.nodeArray[nextTile][0];
            let targetY = this.nodeArray[nextTile][1];
        }

        /////// old
        let curTile = marine.data.values.nextTile;
        let nextTile = this.levelData[curTile] || curTile + 1;
        marine.setData({nextTile: nextTile});
        let targetX = this.nodeArray[nextTile][0];
        let targetY = this.nodeArray[nextTile][1];
       // marine.setData({nextTile: this.levelData[nextTile]});
        this.physics.moveTo(marine,targetX,targetY,null,1000 );
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
            // if(this.time.now > this.timer  ) {
            //     this.releaseMarine2(0,9);
            //     //console.log(this.marines.children.length); // undefined
            // }
            if(this.time.now > this.beatTimer ) {
                this.beatTimer = this.time.now + 1000;
                // let nextTile = this.loneMarine.data.values.nextTile;
                // console.log(nextTile);
                // this.sendToTile(this.loneMarine,nextTile) ;
                this.updateAndSend(this.loneMarine);
                
            }
    }

});


