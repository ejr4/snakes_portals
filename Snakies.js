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

        this.marines = this.physics.add.group({    
            // maxSize: 5,
            key: 'soldier'// ??
        });
        ///////////
        this.loneMarine = this.marines.create(64 * 9 + 48 ,64 * 8 + 48,'soldier');
        this.loneMarine.setVelocityX(-60);

        // release manually for now with 'R'
        this.input.keyboard.on('keydown_R', function (event) { 
            //this.loneMarine.setVelocityX(-60);
            console.log(this);
        }, this);
        ///////////////////////////

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
        // is buggy:
        // if (this.time.now > this.timer) {
        //     //console.log('updating');
        //     this.releaseMarine(9,8);
        // } 
            this.mapWrap(this.loneMarine);
        //console.log('updating');
    }

});


