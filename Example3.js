class Example3 extends Phaser.Scene {
    constructor() {
        super({key:"Example3"});
    }
    preload() {
       this.load.audio('test',['assets/test.mp3']);
    }
    
    create() {
         
        this.soundFX = this.sound.add("test", { loop: "true"});
        this.soundFX.play();
        this.soundFX.rate = 3;
         this.input.keyboard.on('keydown_P', (event) => { 
             if(this.soundFX.isPlaying) {
                this.soundFX.pause();
             } else this.soundFX.resume();
         });
         this.input.keyboard.on('keydown_L', (event) => {
             //console.log('keydown_L registered');
             this.soundFX.loop = !this.soundFX.loop;
             if(this.soundFX.loop) {this.soundFX.play();};
         });


         this.input.keyboard.on('keyup', (event) =>{
             if(event.key == "1") {
                 if(this.soundFX.isPlaying) {
                     this.soundFX.stop();
                 }
                 this.input.stopPropagation();
                 this.scene.switch("Example1");
                
             }
        });
         this.input.keyboard.on('keyup', (event) =>{
             if(event.key == "2") {
                
                    this.soundFX.stop();
                    this.input.stopPropagation();
                 this.scene.switch("Example2");
             }
        });
    }

    // update(delta) {
    //     if(this.key_A.isDown)
    //     this.image.x--;
    // }/// this is polling.  per frame
}