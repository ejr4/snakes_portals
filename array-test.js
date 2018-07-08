// idea: simple functions give next state.  animation follows by animate_to.  however may not need for proof of concept.
var log = console.log;
var board1 = [ , , , ,7, , , , ,   , 10] ; // - 1 is end, perhaps
var board2 = [ , , , , , , , 3 , ,   , 10];  // - 1 is end, perhaps
var board3 = [ , , 6, , , , , 1, , , 10];
// var player1tile = 0,
//     player2tile = 0,
//     player3tile = 0,
//     loopcount = 0;
var players = [0, 2, 7];
// while(player1tile != 10 && loopcount < 5) {
//     player1tile = board[player1tile] || player1tile + 1;
//     console.log( player1tile);
// }

function runboard(board, players) { 
    var record = [];
    let steps = 0;
    
    record.push(players); // could deep copy.  could keeep just some records. etc.  for now keep all steps.  not much data
    log(record);
    while(++steps < 10) {
        players = players.map( (player) => 
            (board[player] || player + 1)
            );
        record.push(players);
        console.log(players);
    }
    return record;
}
// log("ladder board:" )
// runboard(board1,player1tile);
// log("snake board:" );
// runboard(board2,player2tile);
log("board3:" );
runboard(board3, players);
log("board1:" );
players = [0, 2, 7];
runboard(board1, players);
log("board2:" );
players = [0, 2, 7];
runboard(board2, players);

/*  snakes from array pseudocode
    init snakes
    init ladders
        for tiles in board 
            if tile 
                if tile > index // snakehead case
                    next snake is from tile to index
                else if tile < index 
                    next ladder is index to tile
                else if tile == index
                    winning square or glue trap
                else error  // ok maybe overkill
            fi
        

with warp tiles: on hit detect (make it small, let the tile have no in-between), if tile valid, flag warping, (use marines.forEach, if not warping then update, e.g.).  

*/ 
