class Splash extends Phaser.Scene {
    constructor() {
        super({key:"Splash"});
    }
    preload() {
        this.load.image('snake-640', 'assets/snake-640.png');
    }
    create() {
        this.image = this.add.image(400,353,'snake-640');
        var score = 1200;
      
        var helpText = this.add.text(14, 62, 'Welcome to Snakes and Portals.  Hit T.', { fontSize: '32px', fill: '#555' });
        var helpText2 = this.add.text(16, 64, 'Welcome to Snakes and Portals.  Hit T.', { fontSize: '32px', fill: '#2F8' });

        

        this.input.keyboard.on('keyup_T', (event) => {
                      this.scene.switch("Snakes");

        });
    
    }

    update(delta) {
       
    }///
}