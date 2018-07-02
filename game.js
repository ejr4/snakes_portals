var config = { 
    type:Phaser.AUTO,
    width: 800,
    height: 640, // was 600 !!!
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y : 200}
        }
    },
    scene: [ProgramTiles, Example1 , Example2, Example3, Tile100, Mario, Tile200, TileJson,   ] // order of appearance 
};

var game = new Phaser.Game(config);