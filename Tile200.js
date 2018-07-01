class Tile200 extends Phaser.Scene {
    constructor() {
        super({key:"Tile200"});
    }

    preload ()
    {
        this.load.image('tiles', 'assets/drawtiles-spaced.png');
        this.load.image('car', 'assets/car90.png');
        this.load.tilemapCSV('map', 'assets/grid.csv');
    }

    create ()
    {
        var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        var layer = map.createStaticLayer(0, tileset, 0, 0);

        var player = this.add.image(32+16, 32+16, 'car');

        //  Left
        this.input.keyboard.on('keydown_A', function (event) {

            var tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);

            if (tile.index === 2)
            {
                //  Blocked, we can't move
            }
            else
            {
                player.x -= 32;
                player.angle = 180;
            }

        });

        //  Right
        this.input.keyboard.on('keydown_D', function (event) {

            var tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);

            if (tile.index === 2)
            {
                //  Blocked, we can't move
            }
            else
            {
                player.x += 32;
                player.angle = 0;
            }

        });

        //  Up
        this.input.keyboard.on('keydown_W', function (event) {

            var tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);

            if (tile.index === 2)
            {
                //  Blocked, we can't move
            }
            else
            {
                player.y -= 32;
                player.angle = -90;
            }

        });

        //  Down
        this.input.keyboard.on('keydown_S', function (event) {

            var tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);

            if (tile.index === 2)
            {
                //  Blocked, we can't move
            }
            else
            {
                player.y += 32;
                player.angle = 90;
            }

        });

    }
}