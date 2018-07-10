 
var Snake2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Snake2 ()
    {
        Phaser.Scene.call(this, { key: 'Snake2' });
        this.beatTimer;
        this.beats;
        this.beatLength;
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
        this.tileCanMove;
        this.activePortal;
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
        this.load.image('activePortal', 'assets/activePortal.png');
        
        
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
                nText.setText(10*i + j) ; // hackey? works!
            }
        }
        // try tile 100:   /// 
        nodeArray.push([10 * TSIZE + MHALF, TSIZE - MHALF]);
        return nodeArray;
    },
    getSnakes: function(levelData) {
        for (let i = 0; i < levelData.length; i++) {
            datum = levelData[i];
            if (datum) {
                if (datum < i) {
                 
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
             ,35,  ,  ,  ,  ,13,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  , 2,  ,
             ,  ,  ,  ,  ,57,  ,  ,  ,  ,
             ,95,  ,  ,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
             ,  ,  ,  ,  ,54,  ,  ,66,  ,
             ,  ,  ,  ,  ,45,  ,  ,  ,  ,
             100
        ];
        this.mapMake();
        this.nodeArray = this.makeNodeArray();
        this.timer = 0;
        this.beatTimer = this.time.now + 1000;
        this.beatLength = 600;
        this.beats = 0;
       
        this.tileCanMove = false;
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
        this.activePortals = this.physics.add.group({
            maxSize: 8,
            runChildUpdate: true,
            defaultKey: 'activePortal',
        });  // w/out physics?  
        // this.anims.create({
        //     key: 'woowoo',
        //     frames: 
        //     // frames: [
        //     //     { key: 'cat1' },
        //     //     { key: 'cat2' },
        //     //     { key: 'cat3' },
        //     //     { key: 'cat4', duration: 50 }
        //     // ],
        //     frameRate: 8,
        //     repeat: -1
        // });
        //this.thisFunction(4,4); /// after defining sneks
         this.getSnakes(this.levelData);  // not workign
        
        this.ppUps = this.physics.add.group();
        
        this.portalTiles = this.physics.add.group();
        this.portalCentres = this.physics.add.group();
        ///////////
        // this.loneMarine = this.marines.create(32 ,64 * 9 + 48, 'marine');
        // this.loneMarine.setData({nextTile: 1 })
        
        
        // speed
        this.input.keyboard.on('keydown_O', function (event) { 
              this.beatLength -= 100;
              console.log(this.beatLength);
            }, this);
            this.input.keyboard.on('keydown_P', function (event) { 
                this.beatLength += 100;
                console.log(this.beatLength);
        }, this);
        // this.input.keyboard.on('keydown_R', function (event) { 
        //       this.sendToTile(this.loneMarine,1);
        // //    this.loneMarine.setVelocityX(100);
        // }, this);
        /// tile placer
        this.input.keyboard.on('keydown_U', function (event) { 
            this.placePortal(5,8);
        }, this);
        this.input.keyboard.on('keydown_A', function (event) {
            if(this.tileCanMove && this.instancePortalTile) {
            this.instancePortalTile.x -= 64;
            this.instancePortalZone.x -= 64;
            }
        }, this);
        this.input.keyboard.on('keydown_D', function (event) {
            if(this.tileCanMove && this.instancePortalTile) {
            this.instancePortalTile.x += 64;
            this.instancePortalZone.x += 64;
            }
        }, this);
    
        this.input.keyboard.on('keydown_W', function (event) {
            if(this.tileCanMove && this.instancePortalTile) {
            this.instancePortalTile.y -= 64;
            this.instancePortalZone.y -= 64;
            }
        }, this);
        this.input.keyboard.on('keydown_S', function (event) {
            if(this.tileCanMove && this.instancePortalTile) {
            this.instancePortalTile.y += 64;
            this.instancePortalZone.y += 64;
            }
        }, this);
        this.input.keyboard.on('keydown_SPACE', function (event) {
           this.portalPlace();
        }, this);
        this.input.keyboard.on('keydown_B', function (event) {
           this.portalPop();
        }, this);
        /////////////////////////// test  !!!  
      
       
      
        this.physics.add.overlap(this.marines, this.ppUps, this.collectPortal, null, this);
        // this.physics.add.overlap(this.loneMarine, this.portalCentres, this.portalSend, null, this);
        //console.log('post-create log ');
    },
   
    
    collectPortal: function (marine, ppUp) 
    {
        ppUp.disableBody(true, true);
        // console.log('in collectPortal');
        this.tileCanMove = true;
        this.instancePortalTile = this.portalTiles.create(64 * 10 - 32, 64 * 10 - 32, 'tile4').setAlpha(0.8,0.6,0.7, 0.5);
        this.instancePortalZone = this.portalCentres.create(64 * 10 - 32, 64 * 10 - 15,'portalCentre');
  
    },
    portalPlace: function() {
        let targetX = this.instancePortalTile.x;
        let targetY = this.instancePortalTile.y;
        let curTile = this.tileNumberFromXY(targetX,targetY) - 1; /// using old func here.
        if (this.levelData[curTile]) return;
        // check legal
        this.tileCanMove = false;
        this.instancePortalTile.disableBody(true,true);
        this.instancePortalZone.disableBody(true,true);
        this.instanceActivePortal = this.activePortals.create(targetX,targetY,'activePortal').setAlpha(0.8);
        this.instanceActivePortal.setData('factor', 4);
        
        this.levelData[curTile] = (this.instanceActivePortal.data.values.factor * curTile > 100) ? 0 : 4 * curTile;
    },
    /// combine these
    portalPop: function() {
        let targetX = this.instanceActivePortal.x;
        let targetY = this.instanceActivePortal.y;
        let curTile = this.tileNumberFromXY(targetX,targetY) - 1;
        this.instanceActivePortal.disableBody(true,true);
        //this.instancePortalTile.disableBody(false,false);
        //this.instancePortalZone.disableBody(false,false);
        this.instancePortalTile.enableBody(true, targetX, targetY, true, true)
        this.instancePortalZone.enableBody(true, targetX, targetY, true, true);
        this.tileCanMove = true;
        // let targetX = this.instancePortalZone.x;
        // let targetY = this.instancePortalZone.y;
        // this.instanceActivePortal = this.activePortal.create(targetX,targetY,'activePortal').setAlpha(0.8);
        // this.instanceActivePortal.setData('factor', 4);
        // this.levelData[curTile] = 4 * curTile;
        this.levelData[curTile] = null;
    },
    // 
   
    

  
    releaseMarine2: function (tX,tY) 
    {
        this.timer = this.time.now + 2*this.beatLength;
        var marine = this.marines.get(); // works!
         
        if(marine){ 
          
            marine.setPosition(64 * tX + 48 ,64 * tY + 48);
   
            // marine.setVelocityX(100);  // no longer
            marine.setData({nextTile: 1});
 
        }
    },
    // thisFunction: function(tailTile,headTile) {
    //     let snake = this.snakes.get();
    //     snake.setPosition(400,400);
    // },
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
        let nextTile = gotTile || curTile + 1;
        marine.setData({nextTile: nextTile });

        /// checking if need to wrap
        let willWrap = (curTile % 10 == 9) && !gotTile;
        ///ternernaries 
        let targetX = ( willWrap ? marine.x + 64 : this.nodeArray[nextTile][0]);
        let targetY = ( willWrap ? marine.y  : this.nodeArray[nextTile][1]);
        /// replaced by ternernes
        // if( (curTile % 10 == 9) && !gotTile) {
        //     let targetX = marine.x + 64;
        //     let targetY = marine.y;
        // }
        // else { 
        //     let targetX = this.nodeArray[nextTile][0];
        //     let targetY = this.nodeArray[nextTile][1];
        // }


        // /////// old
        // let curTile = marine.data.values.nextTile;
        // let nextTile = this.levelData[curTile] || curTile + 1;
        // marine.setData({nextTile: nextTile});
        // let targetX = this.nodeArray[nextTile][0];
        // let targetY = this.nodeArray[nextTile][1];
       // marine.setData({nextTile: this.levelData[nextTile]});
        this.physics.moveTo(marine,targetX,targetY,null,this.beatLength );
    },
    
    update: function ()
    {       
            this.marines.children.each( marine => this.mapWrap(marine),this);
            //this.mapWrap(this.loneMarine);
            if(this.portalPowerUp) {
                this.portalPowerUp.angle++;
            }

            if(this.instancePortalCentre) {
                this.instancePortalCentre.angle += 90;
            }
            // if(this.loneMarine.y < - 200) {
            //     this.resetMarine(this.loneMarine);
            // }
            if(this.time.now > this.timer  ) {
                //console.log(this.marines.children.length); // undefined
            }
            if(this.time.now > this.beatTimer ) {
                this.beatTimer = this.time.now + this.beatLength;
                this.marines.children.each( marine => {
                        this.updateAndSend(marine);
                    });
                this.releaseMarine2(0,9);
                // let nextTile = this.loneMarine.data.values.nextTile;

            }
    }
});


