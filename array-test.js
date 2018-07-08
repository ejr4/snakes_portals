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
    
    record.push(players);
    log(record);
    while(++steps < 10) {
        let newstate = players.map((player) => { 
            // (board[player] || player + 1)
            player + 1
        });
        record.push(newstate);
        console.log(newstate);
    }
    return record;
}
// log("ladder board:" )
// runboard(board1,player1tile);
// log("snake board:" );
// runboard(board2,player2tile);
log("inwhowhat:" );
runboard(board3, players);


