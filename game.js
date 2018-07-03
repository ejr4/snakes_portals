var config = { 
    type:Phaser.WEBGL, // was AUTO  !!!
    width: 800,
    height: 640, // was 600 !!!
     physics: {
         default: 'arcade'//,
    //     // arcade: {
    //     //     gravity: {y : 500}
    //     // }
 },
    scene: [ProgramTiles ] // order of appearance 
};

var game = new Phaser.Game(config);