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
    }

    create() {
       this.tiles = [];
        for(let i = 0; i < 10; i++){
            let row = [];
            for(let j = 0; j<10; j++){
                row.push(10*i + j + 1);
            }
            this.tiles.push(row);
        }
        // var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        // var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        // var layer = map.createStaticLayer(0, tileset, 0, 0);
        /////////// above via Tile200. 
        //////////// below via Mario
        this.map = this.make.tilemap({ data: this.tiles, tileWidth: 64, tileHeight: 64 });// was 32
        this.tileset = this.map.addTilesetImage('tiles',null,64,64,2,4);//was 32,32,1,2
        this.layer = this.map.createStaticLayer(0, this.tileset,0, 0);
        this.player = this.add.image(32+16, 32+16, 'redguy');// was 'var'
        this.player2 = this.add.image(48, 48, 'blueguy');// 
    }

    update(){

    }

}