class ProgramTiles extends Phaser.Scene {

    constructor() {
        super({key: "ProgramTiles"});
        this.map;
        this.tiles;
        this.tileset;
        this.layer;
    }
    preload(){
        this.load.image('tiles', 'assets/drawtiles-longer64.png');//100 tiles across, first is ignored
        this.load.image('redguy', 'assets/redguy.png');
        this.load.image('blueguy', 'assets/blueguy.png');
        this.load.image('ladder', 'assets/ladder.png');
        this.load.image('snake', 'assets/snake.png');
        this.load.image('snake256', 'assets/snake256.png');
    }

    create() {
        var helpText = this.add.text(640 + 10, 64, 'L - snake \n scaleX up', { fontSize: '16px', fill: '#909' });
        var helpText = this.add.text(640 + 10, 128, 'M - snake \n scaleX down', { fontSize: '16px', fill: '#862' });
        var helpText = this.add.text(640 + 10, 192, 'G - snake \n angle up', { fontSize: '16px', fill: '#D54' });

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
        var player = this.add.image(32+16, 32+16, 'redguy');// was 'var'
        var player2 = this.add.image(32*10 + 48, 320 + 48, 'blueguy');// 
        var ladder = this.add.image(32*10 + 48, 320 + 64 + 48, 'ladder');// 
        var snake = this.add.image(32*2 + 48, 320 + 48, 'snake');// 

        // Left
        this.input.keyboard.on('keydown_A', function (event) {
                player.x -= 32;
                player.angle = 180;
            });
        //  Right
        this.input.keyboard.on('keydown_D', function (event) {
                player.x += 32;
                player.angle = 0;
        });
        //  Up
        this.input.keyboard.on('keydown_W', function (event) {
                player.y -= 32;
                player.angle = -90;
        });
        //  Down
        this.input.keyboard.on('keydown_S', function (event) {
                player.y += 32;
                player.angle = 90;
        });
        //  Snake rotate up
        this.input.keyboard.on('keydown_G', function (event) {
                snake.angle += 22.5;
                
        });
        //  Snake scaleX up
        this.input.keyboard.on('keydown_L', function (event) {
                snake.scaleX += .05;
                
        });
        //  Snake scaleX down
        this.input.keyboard.on('keydown_M', function (event) {
                snake.scaleX -= .05;
                
        });
        this.player2 = player2;
    }

    update(){
        this.player2.angle ++;

    }

}