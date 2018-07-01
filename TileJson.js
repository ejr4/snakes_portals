class TileJson extends Phaser.Scene { 
    constructor() {
        super({key:"TileJson"});
    }

    preload ()
    {
        this.load.image('tiles', 'assets/cybernoid.png');
        this.load.tilemapTiledJSON('map', 'assets/cybernoid.json');
    }

    create ()
    {   var controls;
        var map = this.make.tilemap({ key: 'map' });

        // The first parameter is the name of the tileset in Tiled and the second parameter is the key
        // of the tileset image used when loading the file in preload.
        var tiles = map.addTilesetImage('cybernoid', 'tiles');

        // You can load a layer from the map using the layer name from Tiled, or by using the layer
        // index (0 in this case).
        var layer = map.createStaticLayer(0, tiles, 0, 0);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        var cursors = this.input.keyboard.createCursorKeys();
        var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        };
        controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

        var help = this.add.text(16, 16, 'Arrow keys to scroll', {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            backgroundColor: '#000000',
            fill: '#ffffff'
        });
        help.setScrollFactor(0);
    }

    update (time, delta)
    {
        controls.update(delta);
    }
}