class ProgramTiles extends Phaser.Scene {

    constructor() {
        super({key: "ProgramTiles"});
    }
    preload(){
        this.load.image('tiles', 'assets/drawtiles-spaced.png');
    }

    create() {
        var tiles = [];
        for(let i = 0; i < 10; i++){
            let row = [];
            for(let j = 0; j<10; j++){
                row.push(10*i + j + 1);
            }
            tiles.push(row);
        }
        var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        var layer = map.createStaticLayer(0, tileset, 0, 0);
    }

    update(){

    }

}