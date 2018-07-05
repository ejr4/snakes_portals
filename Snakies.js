// this build models BreakoutForReference as closely as poss. 
var Snakies = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Snakies ()
    {
        Phaser.Scene.call(this, { key: 'Snakies' });

        this.bricks;
        this.paddle;
        this.ball;
        ///////////
        this.snakes;
        this.ladders;
        this.marines;
        this.portals;
        this.timer;
        this.loneMarine;
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
        this.timer = 0;

        this.marines = this.physics.add.group();
        this.snakeheads = this.physics.add.group();
        this.snaketails = this.physics.add.group();
        this.laddertops = this.physics.add.group();
        this.ladderbottoms = this.add.group();
        ///////////
        this.loneMarine = this.marines.create(64 * 9 + 48 ,64 * 8 + 48, 'soldier');
        
        this.firstSnakeHead = this.snakeheads.create(64 * 3 + 32, 64 * 1 + 32, 'snakehead');
        this.firstSnakeTail = this.snaketails.create(64 * 3 + 32, 64 * 7 + 32, 'snaketail');
        this.firstLadderBottom = this.ladderbottoms.create(64 * 2 + 32, 64 * 8 + 48, 'ladderbottom');
        this.firstLadderTop = this.laddertops.create(64 * 7 + 32, 64 * 2 + 48, 'laddertop');

        // release manually for now with 'R'
        this.input.keyboard.on('keydown_R', function (event) { 
            //this.loneMarine.setVelocityX(-60);
            this.loneMarine.setVelocityX(-99);
        }, this);
        ///////////////////////////
        // colliders 
        this.physics.add.overlap(this.loneMarine, this.firstLadderBottom, this.walkAlong, null, this);

    },
    // reference:
    walkAlong: function (marine, ladderBottom)
    {
        this.physics.moveToObject(marine,this.firstLadderTop);
        console.log('done collided');
    },

    releaseMarine: function (tX,tY) 
    {
        this.timer = this.time.now + 1618;
        //let newMarine = this.marines.get(64*tX + 48,64*tY +  48);
        let newMarine = this.marines.create(64 * tX + 48 ,64 * tY + 48,'soldier');
        //this.marines.push(newMarine); // nope.
        newMarine.setVelocityX(-60);
        //console.log(newMarine.typeof());
        //console.log(newMarine.x);
        // this.marines.children.each(function (marine) {
        //     console.log(marine.y);
        //marine.enableBody(false, 0, 0, true, true);
        // });
    },

    //placeAtTile 
    mapWrap: function(marine) {
        if(marine && marine.x < 0){
            marine.y -= 64;
             marine.x = 64*10 - 16;
         }
    },
    
    update: function ()
    {
        //console.log(this.loneMarine.y);
        // is buggy:
        // if (this.time.now > this.timer) {
        //     //console.log('updating');
        //     this.releaseMarine(9,8);
        // } 
            this.mapWrap(this.loneMarine);
            // hackey ladder send
            // if (this.loneMarine.position = this.firstLadderBottom.position) {
            //     console.log('hackladder hit');
            //     moveTo(loneMarine,this.firstLadderBottom.position);
            // }   /// nope!  
            //even hackier:
            if (this.loneMarine.x <= 64*2 + 32 && this.loneMarine.y == 64 * 8 + 48)  {
                //console.log('100 x crossed');
                this.physics.moveToObject(this.loneMarine,this.firstLadderTop);
                //this.physics.moveTo(this.loneMarine,  64 * 7 + 32, 64 * 2 + 48, 100 );
               // console.log(this.loneMarine.x);
            }
            // if (this.loneMarine.x > 64*2 + 32 && this.loneMarine.y < 64 * 2 + 48)  {
            //     //console.log('100 x crossed');
            //     this.loneMarine.setVelocityX(-100);
            //     this.loneMarine.setVelocityY(0);

            //    // console.log(this.loneMarine.x);
            // }
            
        //console.log('updating');
    }

});


