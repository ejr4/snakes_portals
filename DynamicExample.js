class DynamicExample extends Phaser.Scene {
    
    constructor() {
        super({key:"DynamicExample"});
        // var this.culled = 0;
        //var tilemap;
    
       this.time;
       this.culled;

    }
    preload ()
    {
        this.load.image('image', 'assets/catastrophi_tiles_16.png');
        this.load.text('map', 'assets/catastrophi_level3.csv');
        this.load.bitmapFont('nokia16', 'assets/nokia16.png', 'assets/nokia16.xml');
    }
    
     create ()
    {
        
        this.culled = 0;
        this.time = 0;
        var rows = game.cache.text.get('map').split('\n');
        var mapWidth = rows[0].split(',').length;
        var mapHeight = rows.length;
        var tileSize = 16;
        var mapData = [];
    
    
        for (var i = 0; i < mapHeight; ++i)
        {
            var row = rows[i].split(',').map(function (a) { return parseInt(a);});
            for (var j = 0; j < mapWidth; ++j)
            {
                var id = row[j];
                mapData.push(id);
            }
        }
        var tilemap = this.add.tilemap(mapData, 0, 0, tileSize, tileSize, mapWidth, mapHeight, 0, 'image');
        this.culled = this.add.bitmapText(0, 0, 'nokia16', '');
        tilemap.scrollFactorX = 0.5;
        this.culled.scrollFactorX = 0.0;
        this.culled.scrollFactorY = 0.0;
    }
    
     update ()
    {
        
        this.cameras.main.scrollX = (200 + Math.cos(this.time) * 200)|0;
        this.cameras.main.scrollY = (500 + Math.sin(this.time) * 500)|0;
    
        this.culled.setText('Total Tiles: ' + tilemap.getTotalTileCount(this.cameras.main) + '\nVisible Tiles: ' + tilemap.getVisibleTileCount(this.cameras.main));
    
        this.time += 0.01;
    }
    

}