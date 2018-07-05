


function tileCentreYFromNumber(number) {
    let rowFromOne = Math.floor((number - 1)/10);
    return (
        640 - (64 * rowFromOne + 32)
    );
}
function tileCentreXFromNumber(number) {
    let columnFromZero = (number - 1) % 10;
    return (
        64 * columnFromZero + 32
    );
}
function tileNumberFromXY(x,y) {
    return (
        Math.floor(x / 64) + 1 + (10 * (10 - Math.ceil(y / 64)))
    );
}

console.log(tileNumberFromXY(608,608));
console.log(tileNumberFromXY(5,5));
console.log(tileNumberFromXY(608,15));
console.log(tileCentreXFromNumber(1));
console.log(tileCentreYFromNumber(1));
console.log(tileCentreXFromNumber(10));
console.log(tileCentreYFromNumber(10));
console.log(tileCentreXFromNumber(91));
console.log(tileCentreYFromNumber(91));
console.log(tileCentreXFromNumber(100));
console.log(tileCentreYFromNumber(100));
console.log(tileCentreXFromNumber(100));
console.log(tileCentreYFromNumber(100));
console.log(tileCentreXFromNumber(78));
console.log(tileCentreYFromNumber(78));