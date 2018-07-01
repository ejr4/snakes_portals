var config = { 
    type:Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y : 200}
        }
    },
    scene: [ Example1 , Example2, Example3, Tile100, Mario, Tile200, TileJson, ProgramTiles]
};

var game = new Phaser.Game(config);