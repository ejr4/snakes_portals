class Example1 extends Phaser.Scene {
    constructor() {
        super({key:"Example1"});
    }
    preload() {
        this.load.image('sun', 'assets/sun.jpg');
    }
    create() {
        this.image = this.add.image(400,300,'sun');
        var score = 0;
        var scoreText;
        var kshhText;
        var mapText = this.add.text(16, 64, 'Welcome to Snakes.  Hit T to enter Tile100 map', { fontSize: '32px', fill: '#555' });

        var MarioText = this.add.text(16, 96, 'Hit M to enter Mario map', { fontSize: '32px', fill: '#555' });

        var tile200Text = this.add.text(16, 128, 'Hit N to enter movement tile map 200', { fontSize: '32px', fill: '#555' });
        var tileJsonText = this.add.text(16, 176, 'Hit J to enter Json  map', { fontSize: '32px', fill: '#555' });
        var ProgramTileText = this.add.text(16, 480, 'Hit X to enter ProgramTiles  map', { fontSize: '32px', fill: '#11F' });
        //var DynamicExampleText = this.add.text(16, 540, 'Hit E to enter Dynamic Example Map', { fontSize: '32px', fill: '#777' });

        this.input.keyboard.on('keyup_T', (event) => {
            //console.log('keyup_T')
            kshhText = this.add.text(400, 255, 'kShKshKsH a la strider& this needs to delay and audio', { fontSize: '32px', fill: '#444' });
            this.scene.switch("Tile100");

        });


        this.input.keyboard.on('keyup_D', (event) => {
            //console.log('keyup_D registered');
            this.image.x += 20;
        },this);  /// 'this' conserves context per bro
        /// es6 problem?  the following does not work.  
        // this.input.keyboard.on('keyup_D', function(event) {
        //     console.log('keyup_D registered');
        //     this.image.x += 20;
        // });

        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.input.on('pointerdown', (event) => {
            this.image.x = event.x;
            this.image.y = event.y;
        });
        // },this);  // per bro

        this.input.keyboard.on('keyup_P', (event) => {
            var physicsImage = this.physics.add.image(this.image.x,this.image.y, "sun"); 
            physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100,100),-300);
        });

        this.input.keyboard.on('keyup', (event) =>{
            if(event.key == "2") {
                this.input.stopPropagation();
                this.scene.switch("Example2");
            }
        });
        this.input.keyboard.on('keyup', (event) =>{
            if(event.key == "3") {
                this.input.stopPropagation();
                this.scene.switch("Example3");
            }
        });
        this.input.keyboard.on('keyup_M', (event) =>{ 
                this.input.stopPropagation();
                this.scene.switch("Mario");
            });
        this.input.keyboard.on('keyup_N', (event) =>{ 
                this.input.stopPropagation();
                this.scene.switch("Tile200");
            });
        this.input.keyboard.on('keyup_J', (event) =>{ 
                this.input.stopPropagation();
                this.scene.switch("TileJson");
            });
        this.input.keyboard.on('keyup_E', (event) =>{ 
                this.input.stopPropagation();
                this.scene.switch("DynamicExample");
            });
        this.input.keyboard.on('keyup_X', (event) =>{ 
                this.input.stopPropagation();
                this.scene.switch("ProgramTiles");
            });
        
    }

    update(delta) {
        if(this.key_A.isDown)
        this.image.x--;
    }/// this is polling.  per frame
}