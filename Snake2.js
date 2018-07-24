 
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
        
        this.levelData;
        this.ppUps;
        this.portalTiles;
        this.timer;
        this.loneMarine;
        this.instanceActivePortal;
       
        this.portalPowerUp;
       
        this.nodeArray;
        this.tileCanMove;
        this.activePortals;
    
    },

    preload: function ()
    {
  
        this.load.image('tiles', 'assets/drawtiles-good64.png');
        // this.load.image('tiles', 'assets/drawtiles-numbered2.png');
        
        this.load.image('ladder', 'assets/ladder.png');
        this.load.image('snake', 'assets/snake.png');
        this.load.image('snake256', 'assets/snake256.png');
        this.load.image('snakeY', 'assets/snakeY.png');
        this.load.image('glassTile', 'assets/glassTile.png');
        this.load.image('marine', 'assets/marine.png');
        // this.load.image('activePortal', 'assets/activePortal.png');

        this.load.spritesheet('2sheet', 'assets/2sheet.png', { frameWidth: 32, frameHeight: 32 }); /// n.b. 2
        this.load.spritesheet('3sheet', 'assets/3sheet.png', { frameWidth: 32, frameHeight: 32 }); /// n.b. 2
        this.load.spritesheet('4sheet', 'assets/4sheet.png', { frameWidth: 32, frameHeight: 32 }); /// n.b. 2
        this.load.spritesheet('5sheet', 'assets/5sheet.png', { frameWidth: 32, frameHeight: 32 }); /// n.b. 2
        // try animating the sprite here
 
        
        this.load.image('portalTile', 'assets/portalTile.png');
        //this.load.image('portalCentre', 'assets/portalCentre.png');
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
             ,  ,  ,  ,  ,10,  ,  ,66,  ,
             ,  ,  ,20,  ,45,  ,  ,  ,  ,
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
            defaultKey: 'activePortalSheet',
        });  // w/out physics?  
      
        this.anims.create({
            key: 'portalFlux2',
            frames: this.anims.generateFrameNumbers('2sheet', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'portalFlux3',
            frames: this.anims.generateFrameNumbers('3sheet', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'portalFlux4',
            frames: this.anims.generateFrameNumbers('4sheet', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'portalFlux5',
            frames: this.anims.generateFrameNumbers('5sheet', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
       
        
        this.getSnakes(this.levelData);  // 
        
        this.ppUps = this.physics.add.group();
        
        this.portalTiles = this.physics.add.group();
        
        ///////////

        // speed
        this.input.keyboard.on('keydown_O', function (event) { 
              this.beatLength -= 100;
              console.log(this.beatLength);
            }, this);
        this.input.keyboard.on('keydown_P', function (event) { 
                this.beatLength += 100;
                console.log(this.beatLength);
        }, this);
        this.input.keyboard.on('keydown_L', function (event) { 
                this.dudeTest();
                // console.log(this.beatLength);
        },this);
      
        this.input.keyboard.on('keydown_U', function (event) { 
            this.placePPUp(5,8);
        }, this);
        this.input.keyboard.on('keydown_A', function (event) {
            if(this.tileCanMove && this.instancePortalTile) {
            this.instancePortalTile.x -= 64;
            // this.instancePortalZone.x -= 64;
            }
        }, this);
        this.input.keyboard.on('keydown_D', function (event) {
            if(this.tileCanMove && this.instancePortalTile) {
            this.instancePortalTile.x += 64;
            // this.instancePortalZone.x += 64;
            }
        }, this);
    
        this.input.keyboard.on('keydown_W', function (event) {
            if(this.tileCanMove && this.instancePortalTile) {
            this.instancePortalTile.y -= 64;
            // this.instancePortalZone.y -= 64;
            }
        }, this);
        this.input.keyboard.on('keydown_S', function (event) {
            if(this.tileCanMove && this.instancePortalTile) {
            this.instancePortalTile.y += 64;
            // this.instancePortalZone.y += 64;
            }
        }, this);
        this.input.keyboard.on('keydown_SPACE', function (event) {
           this.portalPlace();
        }, this);
        this.input.keyboard.on('keydown_B', function (event) {
           this.portalPop();
        }, this);
     
        this.physics.add.overlap(this.marines, this.ppUps, this.collectPortal, null, this);
      
        // random tint
        this.snakes.children.each( snake => {
            console.log('snakes_children_each');
            let someColors = [
                0x55F055,
                0x00DD00,
                0x0FF0EE,
                0x0FBBBF,
                0xBFEFF0,
                0xAAFAAA
            ]
            let randomTint = someColors[Math.random() * 6 | 0 ]; 
            let borrowedRand = (Math.random()*0xFFFFFF<<0).toString(16);
            snake.setTint(randomTint);
        })
        // instantiate some powerups
        // use tile number?
        // how to set multiplier?
        this.placePPUp(5,8);
        this.placePPUp(5,8);
        this.placePPUp(5,8);
        this.placePPUp(5,8);
    },
   
    collectPortal: function (marine, ppUp) 
    {
        ppUp.disableBody(true, true);
        // console.log('in collectPortal');
        this.tileCanMove = true;
        this.instancePortalTile = this.portalTiles.create(64 * 10 - 32, 64 * 10 - 32, 'tile4').setAlpha(0.8,0.6,0.7, 0.5);
       
  
    },
    
    togglePortal: function() {
        /* 
        idea: press space to set portal down.  then will autofocus to next portal.
        need a main tile to focus on.  
        can create a spritesheet with all possible warp tiles:
        blank focusser (moving yellow lines)
        mul 1 to 10
        div 1 to 10
        add
        sub
        ==41 tiles
                
        
        */
    },
    // new multicolor: 
    portalPlace2: function() {
        let colorArray = [
            0x55F055,
            0x00DD00,
            0x0FF0EE,
            0x0FBBBF,
            0xBFEFF0,
            0xFFFAAA
        ]
        let targetX = this.instancePortalTile.x;
        let targetY = this.instancePortalTile.y;
        let curTile = this.tileNumberFromXY(targetX,targetY) - 1; /// using old func here.
        if (this.levelData[curTile]) return;
        // check legal
        this.tileCanMove = false;
        this.instancePortalTile.disableBody(true,true);
     
        // this.instanceActivePortal = this.activePortals.create(targetX,targetY,'activePortal').setAlpha(0.8);
        this.instanceActivePortal = this.physics.add.sprite(targetX, targetY, '4sheet');
        this.instanceActivePortal.setData('factor', 4);
        this.instanceActivePortal.anims.play('portalFlux4', true);
        console.log(this.instanceActivePortal.anims);
        this.levelData[curTile] = (this.instanceActivePortal.data.values.factor * curTile > 100) ? 0 : 4 * curTile;
    },
    portalPlace: function() {
        let targetX = this.instancePortalTile.x;
        let targetY = this.instancePortalTile.y;
        let curTile = this.tileNumberFromXY(targetX,targetY) - 1; /// using old func here.
        if (this.levelData[curTile]) return;
        // check legal
        this.tileCanMove = false;
        this.instancePortalTile.disableBody(true,true);
        
        // this.instanceActivePortal = this.activePortals.create(targetX,targetY,'activePortal').setAlpha(0.8);
        this.instanceActivePortal = this.physics.add.sprite(targetX, targetY, '4sheet');
        this.instanceActivePortal.setData('factor', 4);
        this.instanceActivePortal.anims.play('portalFlux4', true);
        console.log(this.instanceActivePortal.anims);
        this.levelData[curTile] = (this.instanceActivePortal.data.values.factor * curTile > 100) ? 0 : 4 * curTile;
    },
    /// combine these
    portalPop: function() {
        let targetX = this.instanceActivePortal.x;
        let targetY = this.instanceActivePortal.y;
        let curTile = this.tileNumberFromXY(targetX,targetY) - 1;
        this.instanceActivePortal.disableBody(true,true);
       
        this.instancePortalTile.enableBody(true, targetX, targetY, true, true)
     
        this.tileCanMove = true;
      
        this.levelData[curTile] = null;
    },
    //
    releaseMarine2: function (tX,tY) 
    {
        this.timer = this.time.now + 2*this.beatLength;
        var marine = this.marines.get(); // works!
         
        if(marine){ 
          
            marine.setPosition(64 * tX + 48 ,64 * tY + 48);
   
            marine.setData({nextTile: 1});
 
        }
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
    placePPUp: function(tX,tY,multiplier = 0) {
        // colorize
        let colorArray = [
            0xFFFFFF,
            0x00DD00,
            0x0FF0EE,
            0x0FBBBF,
            0xBFEFF0,
            0xFFFAAA
        ]
        this.portalPowerUp = this.ppUps.create(64 * tX + 32, 64 * tY + 32, 'glassTile').setTint(colorArray[multiplier]).setAlpha(1,.5,.5, 0.3);
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
    }, // deprec
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
       
        this.physics.moveTo(marine,targetX,targetY,null,this.beatLength );
    },
    
    update: function ()
    {       
            this.marines.children.each( marine => this.mapWrap(marine),this);
            //this.mapWrap(this.loneMarine);
            if(this.portalPowerUp) {
                this.portalPowerUp.angle++;
            }

            // if(this.loneMarine.y < - 200) {
            //     this.resetMarine(this.loneMarine);
            // }
            if(this.time.now > this.timer  ) {
                //console.log(this.marines.children.length); // undefined
                // will phase out 
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


