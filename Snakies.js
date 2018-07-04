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

        // create Marine Class, or place outside?
        var Marine = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:
            
            

            setTimer: function ()
            {
                this.timer = this.time.now + 1618;
    
                this.setActive(true);
                this.setVisible(true);
            },

            

        });
        this.marines = this.add.group({
            classType: Marine,
            maxSize: 10,
            runChildUpdate: true
        });
        ///////////
        var Bullet = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,
    
            initialize:
            // function Bullet (scene)
            Bullet: function (scene)
            {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
    
                this.speed = Phaser.Math.GetSpeed(400, 1);
            },
    
            fire: function (x, y)
            {
                this.setPosition(x, y - 50);
    
                this.setActive(true);
                this.setVisible(true);
            },
    
            update: function (time, delta)
            {
                this.y -= this.speed * delta;
    
                if (this.y < -50)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
    
        });
    
        bullets = this.add.group({
            classType: Bullet,
            maxSize: 10,
            runChildUpdate: true
        });
    
        ship = this.add.sprite(400, 500, 'ship').setDepth(1);
    
        cursors = this.input.keyboard.createCursorKeys();
    
        speed = Phaser.Math.GetSpeed(300, 1);

    },

    

    

    

    update: function ()
    {
        
    }

});


