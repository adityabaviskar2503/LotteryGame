// 1. Deposit some money
// 2. Determine no. of lines
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings
// 7. Play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "$": 2,
    "@": 4,
    "#": 6,
    "&": 8
}

const SYMBOL_VALUES = {
    "$": 5,
    "@": 4,
    "#": 3,
    "&": 2
}

const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numDepositAmount = parseFloat(depositAmount);

        if (isNaN(numDepositAmount) || numDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        }
        else {
            return numDepositAmount;
        }
    }
};

const getLines = () => {
    while (true) {
        const lines = prompt("Enter number of lines(1-3): ");
        const numLines = parseFloat(lines);

        if (isNaN(numLines) || numLines <= 0 || numLines > 3) {
            console.log("Invalid number of lines, try again.");
        }
        else {
            return numLines;
        }
    }
};

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the Bet per line: ");
        const numBet = parseFloat(bet);

        if (isNaN(numBet) || numBet <= 0 || numBet > (balance / lines)) {
            console.log("Invalid number of lines, try again.");
        }
        else {
            return numBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];

    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];

        for (let j = 0; j < ROWS; j++) {
            const randomInd = Math.floor(Math.random() * reelSymbols.length);
            const selectedSym = reelSymbols[randomInd];
            reels[i].push(selectedSym);
            reelSymbols.splice(randomInd, 1);
        }
    }

    return reels;
}

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);

        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const printRows = (rows) => {
    for (const row of rows) {
        let string = "";
        for (const [i, symbol] of row.entries()) {
            string += symbol;
            if (i != row.length - 1) {
                string += " | ";
            }
        }
        console.log(string);
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }
    return winnings;
}

const game = () => {
    let balance = deposit();

    while (true) {
        console.log("Total Balance: " + balance);
        const Lines = getLines();
        const bet = getBet(balance, Lines);
        balance -= bet * Lines;
        const reel = spin();
        const trans = transpose(reel);
        printRows(trans);
        const win = getWinnings(trans, bet, Lines);
        balance += win;
        console.log(win);

        if (balance <= 0) break;

        const playAgain = prompt("Play Again (y/n)?: ");

        if (playAgain != "y") break;

    }
}

game();
