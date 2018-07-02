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
        this.load.image('snakeY', 'assets/snakeY.png');
    }

    create() {
        var helpTextL = this.add.text(640 + 10, 64, 'L - snake \n scaleX up', { fontSize: '16px', fill: '#909' });
        var helpTextM = this.add.text(640 + 10, 128, 'M - snake \n scaleX down', { fontSize: '16px', fill: '#862' });
        var helpTextG = this.add.text(640 + 10, 192, 'G - snake \n angle up', { fontSize: '16px', fill: '#D54' });
        var helpTextY = this.add.text(640 + 10, 240, 'Y - snake256 \n angle up', { fontSize: '16px', fill: '#E2E' });
        var helpTextU = this.add.text(640 + 10, 300, 'U - snake256 \n angle up', { fontSize: '16px', fill: '#19A' });
        var helpTextY = this.add.text(640 + 10, 360, 'Y - snakeY \n angle up', { fontSize: '16px', fill: '#19A' });

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
        var snake256 = this.add.image(64*4 + 32, 64*3 + 32, 'snake256');// 
        snake256.originX = 0;
        snake256.originY = 0;
        snake256.displayOriginX = 0;
        snake256.displayOriginY = 0;
        //
        var snakeY = this.add.image(64*4 + 32, 64*7 + 32, 'snakeY'); 
        snakeY.originX = 0;
        snakeY.originY = 0;
        snakeY.displayOriginX = 0;
        //snakeY.displayOriginY = 0;
        function snakeMake(tailTileX,tailTileY,headTileX,headTileY,snake) { // at first will only work with brown snake
            snake.x = 64 * tailTileX + 32;
            snake.y = 64 * tailTileY + 32;
            let angle =180 *  Math.atan2(headTileY- tailTileY,headTileX - tailTileX)/Math.PI;
            snake.angle = angle;
            let squareSum = (headTileX - tailTileX)*(headTileX - tailTileX) + (headTileY- tailTileY) * (headTileY- tailTileY) ;
            snake.scaleX = Math.sqrt(squareSum) / 4; // n.b. scaled to tiles
        }
        snakeMake(3,3,9,9,snakeY);

        // Left
        this.input.keyboard.on('keydown_A', function (event) {
                player.x -= 64;
                player.angle = 180;
            });
        //  Right
        this.input.keyboard.on('keydown_D', function (event) {
                player.x += 64;
                player.angle = 0;
        });
        //  Up
        this.input.keyboard.on('keydown_W', function (event) {
                player.y -= 64;
                player.angle = -90;
        });
        //  Down
        this.input.keyboard.on('keydown_S', function (event) {
                player.y += 64;
                player.angle = 90;
        });
        //  Snake2 rotate up
        //  Snake rotate up
        this.input.keyboard.on('keydown_G', function (event) {
                snake.angle += 22.5;
                
        });
        this.input.keyboard.on('keydown_Y', function (event) {
                snakeY.angle += 3;
                
        });
        this.input.keyboard.on('keydown_U', function (event) {
                snake256.angle += 22.5;
                
        });
        //  Snake scaleX up
        this.input.keyboard.on('keydown_L', function (event) {
                snake.scaleX += .05;
                
        });
        //  Snake scaleX down
        this.input.keyboard.on('keydown_M', function (event) {
                snake.scaleX -= .05;
                
        });
        //  SnakeY head moves up 
        this.input.keyboard.on('keydown_O', function (event) {
            //snakeMake(; this'll be maybe wanting snakes as coords. in tiles.  
                
        });
        this.player2 = player2;
    }

    update(){
        this.player2.angle ++;

    }

}