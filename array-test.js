// idea: simple functions give next state.  animation follows by animate_to.  however may not need for proof of concept.
var log = console.log;
var board1 = [ , , , ,7, , , , ,   ]  // - 1 is end, perhaps
var board2 = [ , , , , , , , 3 , ,   ]  // - 1 is end, perhaps
var board3 = [ , , 6, , , , , 1, , ]
var player1tile = 0,
    player2tile = 0,
    player3tile = 0,
    loopcount = 0;
// while(player1tile != 10 && loopcount < 5) {
//     player1tile = board[player1tile] || player1tile + 1;
//     console.log( player1tile);
// }

function runboard(board, playertile) { 
    let steps = 0;
    while(playertile != 10 && ++steps < 30) {
        playertile = board[playertile] || playertile + 1;
        console.log( playertile);
    }
}
log("ladder board:" )
runboard(board1,player1tile);
log("snake board:" );
runboard(board2,player2tile);
log("inf hourglass board:" );
runboard(board3, player3tile);


