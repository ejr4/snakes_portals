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
        scoreText = this.add.text(16, 16, 'Welcome to Snakes.  Hit T to enter map', { fontSize: '32px', fill: '#555' });
        this.input.keyboard.on('keyup_T', (event) => {
            //console.log('keyup_T')
            kshhText = this.add.text(16, 128, 'kShKshKsH a la strider&c', { fontSize: '32px', fill: '#444' });
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
        
    }

    update(delta) {
        if(this.key_A.isDown)
        this.image.x--;
    }/// this is polling.  per frame
}