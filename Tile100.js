class Tile100 extends Phaser.Scene {
    constructor() {
        super({key:"Tile100"});
    }
    preload() {
        this.load.image('sun', 'assets/sun.jpg');
    }
    create() {
        this.image = this.add.image(400,300,'sun');
        var repeatText;
        var repeatCounter = 0;
        var mainText = this.add.text(16, 16, 'Welcome to Snakes.  Hit T to repeat', { fontSize: '32px', fill: '#555' });
        this.input.keyboard.on('keyup_T', (event) => {
            repeatCounter++;
            //scoreText.setText('Score: ' + score);
            repeatText = this.add.text(16 + repeatCounter, 128 + 4*repeatCounter, 'it repeats it ...', { fontSize: '32px', fill: '#F00' }); 
        });
        

        this.input.keyboard.on('keyup_D', (event) => {
            //console.log('keyup_D registered');
            this.image.x += 20;
        },this);  /// 'this' conserves context 

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
    }

    update(delta) {
        
    }
      
}