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
        this.portals;
        this.timer;
        this.loneMarine;
        this.firstLadderBottom;
        this.firstLadderTop;
        this.firstSnakeHead;
        this.firstSnakeTail;
        this.firstPortal;
        this.goingUp;
        this.goingDown;
        this.isWalking;
        this.snakeEye;
        this.ladderFoot;
        this.T;
        this.catchLine;

    },

    preload: function ()
    {
       
        this.load.image('tiles', 'assets/drawtiles-longer64.png');//100 tiles across, first is ignored
        this.load.image('redguy', 'assets/redguy.png');
        this.load.image('blueguy', 'assets/blueguy.png');
        this.load.image('ladder', 'assets/ladder.png');
        this.load.image('snake', 'assets/snake.png');
        this.load.image('snake256', 'assets/snake256.png');
        this.load.image('snakeY', 'assets/snakeY.png');
        this.load.image('glassTile', 'assets/glassTile.png');
        this.load.image('soldier', 'assets/soldier.png');
        this.load.image('laddertop', 'assets/laddertop.png');
        this.load.image('ladderbottom', 'assets/ladderbottom.png');
        this.load.image('snakehead', 'assets/snakehead.png');
        this.load.image('snaketail', 'assets/snaketail.png');
        this.load.image('blankTailHelper', 'assets/blankTailHelper.png');
        this.load.image('snakeEye', 'assets/snakeEye.png');
        this.load.image('ladderFoot', 'assets/ladderFoot.png');
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
        this.portals = this.physics.add.group();
        this.snakeEyes = this.physics.add.group();
        this.ladderFoot = this.physics.add.group();
        this.sTHelpers = this.physics.add.group();
        ///////////
        this.loneMarine = this.marines.create(64 * 9 + 48 ,64 * 8 + 48, 'soldier');
        
        this.firstSnakeHead = this.snakeheads.create(64 * 1 + 32, 64 * 2 + 32, 'snakehead');
        this.firstSnakeEye = this.snakeEyes.create(64 * 1 + 32, 64 * 2 + 30, 'snakeEye');
        this.firstSnakeTail = this.snaketails.create(64 * 1 + 32, 64 * 6 + 32, 'snaketail');
        //this.firstSTHelper = this.snaketails.create(64 * 1 + 32, 64 * 6 + 32, 'snaketail');
        this.firstLadderBottom = this.ladderbottoms.create(64 * 2 + 16, 64 * 8 + 48, 'ladderbottom');
        this.firstLadderTop = this.laddertops.create(64 * 7 + 32, 64 * 2 + 16, 'laddertop');
        this.firstLadderFoot = this.ladderFoot.create(2 * 64 + 6, 8 * 64 + 60, 'ladderFoot');
        

        // release manually for now with 'R'
        this.input.keyboard.on('keydown_R', function (event) { 
            //this.loneMarine.setVelocityX(-60);
            this.loneMarine.setVelocityX(-99);
        }, this);
        /// tile placer
        this.input.keyboard.on('keydown_U', function (event) { 
            this.placePortal(7,7);
        }, this);
        ///////////////////////////
        // overlaps are great ... if they work
        //this.physics.add.collider(this.loneMarine, this.firstLadderBottom);
        //this.physics.add.collider(this.marines, this.firstLadderBottom);
        // this.physics.add.collider(this.loneMarine, this.firstLadderBottom, this.exclaimInDespair, null, this);
        // this.physics.add.collider(this.loneMarine, this.firstSnakeTail, this.exclaimInDespair, null, this);
        //this.physics.add.overlap(this.loneMarine, this.firstLadderBottom, this.walkUp, null, this);
        // this.physics.add.overlap(this.loneMarine, this.firstLadderTop, this.walkLeft, null, this);
        // this.physics.add.overlap(this.loneMarine, this.firstSnakeHead, this.slideDown, null, this);
        //this.physics.add.overlap(this.loneMarine, this.firstSnakeTail, this.walkLeft, null, this);
        this.physics.add.overlap(this.loneMarine, this.firstPortal, this.walkLeft, null, this);
        this.physics.add.overlap(this.loneMarine, this.snakeEye, this.slideDown, null, this);
        this.physics.add.overlap(this.loneMarine, this.ladderFoot, this.walkUp, null, this);
        // this.physics.add.overlap(this.loneMarine, this.firstSnakeHead, this.walkUp, null, this);
        // this.physics.add.overlap(this.loneMarine, this.firstSnakeTail, this.walkLeft, null, this);
        console.log('post-create log ');
        

    },
    exclaimInDespair: function(what,what) {
        console.log(what,what);
    },
    // reference:
    walkUp: function (marine, ladderBottom)
    {
        console.log('walkUp');
        this.physics.moveToObject(marine,this.firstLadderTop,140);
        
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
        this.firstPortal = this.portals.create(64 * tX + 32, 64 * tY + 16, 'glassTile').setTint(0x448FF1);
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
            // hackey ladder send
            //this.physics.overlap(this.loneMarine, this.firstLadderBottom, this.walkUp, null, this);
            // if (this.loneMarine.x <= 64*2 + 32 && this.loneMarine.y == 64 * 8 + 48)  
            //     //console.log('100 x crossed');
            //     this.physics.moveToObject(this.loneMarine,this.firstLadderTop);
            //     //this.physics.moveTo(this.loneMarine,  64 * 7 + 32, 64 * 2 + 48, 100 );
            if(this.warping && this.loneMarine.y > this.warpCatchHeight) {
                this.walkLeft();
            }
    }

});


