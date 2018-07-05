// this build models BreakoutForReference as closely as poss. 
var Snakies = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Snakies ()
    {
        Phaser.Scene.call(this, { key: 'Snakies' });

        
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
        this.isWalking;
        this.snakeEye;
        this.ladderFoot;
        this.T;
        this.catchLine;
        this.instancePortalCentre;
        

    },

    preload: function ()
    {
       
        this.load.image('tiles', 'assets/drawtiles-longer64.png');//100 tiles across, instance is ignored
        
        this.load.image('ladder', 'assets/ladder.png');
        this.load.image('snake', 'assets/snake.png');
        this.load.image('snake256', 'assets/snake256.png');
        //this.load.image('snakeY', 'assets/snakeY.png');
        this.load.image('glassTile', 'assets/glassTile.png');
        this.load.image('soldier', 'assets/soldier.png');
        this.load.image('laddertop', 'assets/laddertop.png');
        this.load.image('ladderbottom', 'assets/ladderbottom.png');
        this.load.image('snakehead', 'assets/snakehead.png');
        this.load.image('snaketail', 'assets/snaketail.png');
        //this.load.image('blankTailHelper', 'assets/blankTailHelper.png');
        this.load.image('snakeEye', 'assets/snakeEye.png');
        this.load.image('ladderFoot', 'assets/ladderFoot.png');
        this.load.image('portalTile', 'assets/portalTile.png');
        this.load.image('portalCentre', 'assets/portalCentre.png');
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
        this.isWalking = true;
        this.goingDown = false;
        this.goingUp = false;

        this.marines = this.physics.add.group();
        this.snakeheads = this.physics.add.group();
        this.snaketails = this.physics.add.group();
        this.laddertops = this.physics.add.group();
        this.ladderbottoms = this.physics.add.group();
        this.ppUps = this.physics.add.group();
        this.snakeEyes = this.physics.add.group();
        this.ladderFoot = this.physics.add.group();
        this.sTHelpers = this.physics.add.group();
        this.portalTiles = this.physics.add.group();
        this.portalCentres = this.physics.add.group();
        ///////////
        this.loneMarine = this.marines.create(64 * 9 + 48 ,64 * 5 + 48, 'soldier');
        
        this.instanceSnakeHead = this.snakeheads.create(64 * 1 + 32, 64 * 2 + 48, 'snakehead');
        this.instanceSnakeEye = this.snakeEyes.create(64 * 1 + 32, 64 * 2 + 48, 'snakeEye');
        this.instanceSnakeTail = this.snaketails.create(64 * 1 + 32, 64 * 6 + 32, 'snaketail');
        //this.instanceSTHelper = this.snaketails.create(64 * 1 + 32, 64 * 6 + 32, 'snaketail');
        this.instanceLadderBottom = this.ladderbottoms.create(64 * 2 + 16, 64 * 8 + 48, 'ladderbottom');
        this.instanceLadderTop = this.laddertops.create(64 * 7 + 32, 64 * 2 + 16, 'laddertop');
        this.instanceLadderFoot = this.ladderFoot.create(2 * 64 + 6, 8 * 64 + 60, 'ladderFoot');
        this.instanceLadderFoot = this.ladderFoot.create(2 * 64 + 6, 8 * 64 + 60, 'ladderFoot');
        //this.instancePortalTile = this.portalTiles.create(10 * 64 -32, 10 * 64 - 32, 'portalTile');
        

        // release manually for now with 'R'
        this.input.keyboard.on('keydown_R', function (event) { 
            //this.loneMarine.setVelocityX(-60);
            this.loneMarine.setVelocityX(-99);
        }, this);
        /// tile placer
        this.input.keyboard.on('keydown_U', function (event) { 
            this.placePortal(3,5);
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
        
        this.physics.add.overlap(this.loneMarine, this.portalPowerUp, this.walkLeft, null, this);
        this.physics.add.overlap(this.loneMarine, this.snakeEyes, this.slideDown, null, this); // this could be SnakeEyes
        this.physics.add.overlap(this.loneMarine, this.ladderFoot, this.walkUp, null, this);
        // this.physics.add.overlap(this.loneMarine, this.instanceSnakeHead, this.walkUp, null, this);
        // this.physics.add.overlap(this.loneMarine, this.instanceSnakeTail, this.walkLeft, null, this);
        this.physics.add.overlap(this.loneMarine, this.ppUps, this.collectPortal, null, this);
        this.physics.add.overlap(this.loneMarine, this.portalCentres, this.portalSend, null, this);
        console.log('post-create log ');
        

    },
    exclaimInDespair: function(what,what) {
        console.log(what,what);
    },
    collectPortal: function (marine, ppUp) 
    {
        ppUp.disableBody(true, true);
        console.log('in collectPortal');
        //setTimeout
        //setTimeout(function(){
            this.instancePortalTile = this.portalTiles.create(64 * 10 - 32, 64 * 10 - 32, 'portalTile').setAlpha(0.4,0.4,0.4, 0.4);
            this.instancePortalZone = this.portalCentres.create(64 * 10 - 32, 64 * 10 - 15,'portalCentre');
            //; }, 400);
    },
    // reference:
    walkUp: function (marine, ladderBottom)
    {
        //console.log('walkUp');
        this.goingUp = true;
        this.physics.moveToObject(marine,this.instanceLadderTop,160);
        this.catchLine = this.instanceLadderTop.y + 32;
        
    },
    slideDown: function (marine, snakeHead)
    {
        console.log('slideDown');
        this.goingDown = true;
        this.physics.moveToObject(marine,this.instanceSnakeTail,160);
        this.catchLine = this.instanceSnakeTail.y + 14;
        
    },
    walkLeft: function (marine, ladderBottom)
    {
        this.loneMarine.setVelocityX(-100);
        this.loneMarine.setVelocityY(0);
        this.isWalking = true;
        
    },

    releaseMarine: function (tX,tY) 
    {
        this.timer = this.time.now + 1618;
        //let newMarine = this.marines.get(64*tX + 48,64*tY +  48);
        let newMarine = this.marines.create(64 * tX + 48 ,64 * tY + 48,'soldier');
        //this.marines.push(newMarine); // nope.
        newMarine.setVelocityX(-100);
        //console.log(newMarine.typeof());
    },


    //place portal tile  
    placePortal: function(tX,tY) {
        this.portalPowerUp = this.ppUps.create(64 * tX + 32, 64 * tY + 32, 'glassTile').setTint(0x448FF1).setAlpha(1,.6,.6, 0.2);
    },
    portalSend: function(marine, portal) {
        console.log("in portalSend");
        this.goingUp = true;
        
        let targetX = 
        this.physics.moveTo(marine,targetX,targetY);
    },
    mapWrap: function(marine) {
        if(marine && marine.x < 0){
            marine.y -= 64;
             marine.x = 64*10 - 16;
         }
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
                this.walkLeft();
                this.goingUp = false;
            }
            if(this.goingDown && this.loneMarine.y > this.catchLine) {
                this.walkLeft();
                this.goingDown = false;
            }
        }

});


