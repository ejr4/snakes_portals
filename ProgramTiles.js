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
        this.load.image('glassTile', 'assets/glassTile.png');
        this.load.image('soldier', 'assets/soldier.png');
    }

    create() {
        // text instructions
        var helpTextL = this.add.text(640 + 10, 64, 'L - snake \n scaleX up', { fontSize: '16px', fill: '#909' });
        var helpTextM = this.add.text(640 + 10, 128, 'M - snake \n scaleX down', { fontSize: '16px', fill: '#862' });
        var helpTextG = this.add.text(640 + 10, 192, 'G - snake \n angle up', { fontSize: '16px', fill: '#D54' });
        var helpTextY = this.add.text(640 + 10, 240, 'Y - snake256 \n angle up', { fontSize: '16px', fill: '#E2E' });
        var helpTextU = this.add.text(640 + 10, 300, 'U - snake256 \n angle up', { fontSize: '16px', fill: '#19A' });
        var helpTextY = this.add.text(640 + 10, 360, 'Y - soldierMake function', { fontSize: '16px', fill: '#19A' });
        // initialize map
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
        // tint test
        snake256.setTint(0x113344);
        
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
        snakePlace(snakeY,3,3,9,9);
        //glassTiles
        var glassTiles = this.physics.add.staticGroup();
        var red = glassTiles.create(64*6 + 16, 64*2 + 16,'glassTile').setTint(0xDE2020).setAlpha(1,.5,.5,0); // '.setInteractive()' may be useful
        var darkerblue = glassTiles.create(64*5 + 32 + 16, 64*2 + 32 + 16,'glassTile').setTint(0x6C1A91).setAlpha(1,.7,.7,0.2); // '.setInteractive()' may be useful

        // soldiers group
        // var soldiers = this.physics.add.group(null,{gravityY : 0});
        var soldiers = this.physics.add.group();
        this.loneMarcher = soldiers.create(64*9 + 48, 64*5 + 48,'soldier');
        var soldierArray = [];
        this.soldierTimer = 0;
        this.soldierMake = function (tX,tY){
            let newSoldier = soldiers.create(64 * tX + 48 ,64 * tY + 48,'soldier');
            newSoldier.setVelocityX(-60);
            this.soldierTimer = this.time.now + 1618;
            soldierArray.push(newSoldier);  //  not sure about this.
        } // try once:
        this.soldierCheckTime = function() {
            if (this.time.now > this.soldierTimer) {
                this.soldierMake (9,8);
            }
        }
        // or soldierArray.push this.soldierMake ..?
        var testMarcher = this.soldierMake(9,4);
        this.loneMarcher.setVelocityX(-60);
        //loneMarcher.setGravityY(0); // no effect
        //loneMarcher.setAllowGravity(false);// no effect
        //loneMarcher.setGarbigoo(4); // error

        //snakes group
        var snakeGroup = this.physics.add.staticGroup();
        function snakeCreate (tX,tY,hX,hY) {
            return snakeGroup.create(null,null,'snakeY').setOrigin(0, 0.5).setData({headX: hX, headY: hY, tailX: tX, tailY: tY });
        }
        var firstSnake = snakeGroup.create(null,null,'snakeY').setOrigin(0, 0.5).setData({headX: 6, headY: 4, tailX: 1, tailY: 1 });
        var secondSnake = snakeCreate(5,2,7,7);

        // see if it appears.
        snakePlace(secondSnake,...snakeCoords(secondSnake)); 
        snakePlace(firstSnake,...snakeCoords(firstSnake)); 

        //more snake helpers
        function snakePlace(snake,tailTileX,tailTileY,headTileX,headTileY) { // at first will only work with brown snake
            snake.x = 64 * tailTileX + 32;
            snake.y = 64 * tailTileY + 32;
            let rotation =Math.atan2(headTileY- tailTileY,headTileX - tailTileX);
            snake.rotation = rotation;
            let squareSum = (headTileX - tailTileX)*(headTileX - tailTileX) + (headTileY- tailTileY) * (headTileY- tailTileY) ;
            snake.scaleX = Math.sqrt(squareSum) / 4; // n.b. scaled to tiles
            // tint test:
            //snake.setTint(0xDE2020);
        }
        function snakeCoords(snake){
            return [snake.getData('tailX'),snake.getData('tailY'),snake.getData('headX'),snake.getData('headY')]
        }
        
        //  Snake scaleX down
        this.input.keyboard.on('keydown_M', function (event) {
                snake.scaleX -= .05;
                
        });
        //  firstSnake head moves right 
        this.input.keyboard.on('keydown_R', function (event) {
            //snakePlace(; this'll be maybe wanting snakes as coords. in tiles.
            firstSnake.setData('headX' , firstSnake.getData( 'headX') + 1 );  
            snakePlace(firstSnake,...snakeCoords(firstSnake));
                
        });
        //  loneSoldier marches left
        this.input.keyboard.on('keydown_Y', function (event) {
            //snakePlace(; this'll be maybe wanting snakes as coords. in tiles.
            this.soldierMake(9,7);  
        });
        this.player2 = player2;
        this.boundCheckWrap =  function(soldier) {
            if(soldier.x < 0){
               soldier.y -= 64;
                soldier.x = 64*10 - 16;
            }
        }
    }

    update(time,delta){
        this.player2.angle ++;   
        this.boundCheckWrap(this.loneMarcher);
        this.soldierCheckTime();
    }

}