const Screen = require('./screen');
const Cursor = require('./cursor');

class ConnectFour {
	constructor() {
		this.playerTurn = 'O';

		this.grid = [
			[' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' '],
			[' ', ' ', ' ', ' ', ' ', ' ', ' '],
		];

		this.move = 'O';

		this.cursor = new Cursor(6, 7);

		// Initialize a 6x7 connect-four grid
		Screen.initialize(6, 7);
		Screen.setGridlines(true);

		// Replace this with real commands
		Screen.addCommand('up', 'up', this.cursor.up.bind(this.cursor));
		Screen.addCommand('left', 'left', this.cursor.left.bind(this.cursor));
		Screen.addCommand(
			'right',
			'right',
			this.cursor.right.bind(this.cursor)
		);
		Screen.addCommand('down', 'down', this.cursor.down.bind(this.cursor));
		Screen.addCommand('space', 'place a move', this.placeMove.bind(this));

		// set initial highlight at 0, 0 location
		this.cursor.setBackgroundColor();
		Screen.render();

		// print commands upon starting the game
		Screen.printCommands();
	}

	// Remove this
	placeMove() {
		// put down move at cursor
		let row = this.cursor.row;
		let col = this.cursor.col;

		Screen.setGrid(row, col, this.move);
		Screen.render();

		// change move for the next time
		if (this.move === 'O') {
			this.move = 'X';
		} else {
			this.move = 'O';
		}

		// check the status
		let winner = ConnectFour.checkWin(Screen.grid);

		// end game if should
		if (winner !== false) ConnectFour.endGame(winner);
	}

	static checkWin(grid) {
		// define check array helper function
		const checkArrSame = arr => {
			// Return 'X' if player X wins
			// Return 'O' if player O wins
			for (let i = 0; i < arr.length - 3; i++) {
				if (
					arr[i] !== ' ' &&
					arr[i] === arr[i + 1] &&
					arr[i] === arr[i + 2] &&
					arr[i] === arr[i + 3]
				) {
					return arr[i];
				}
			}
		};

		// 1. check each row
		for (const row of grid) {
			let winner = checkArrSame(row);
			if (winner !== undefined) return winner;
		}

		// 2. check each column
		for (let col = 0; col < grid[0].length; col++) {
			let tempCol = [];
			for (const row of grid) {
				tempCol.push(row[col]);
			}
			let winner = checkArrSame(tempCol);
			if (winner !== undefined) return winner;
		}

		// 3. check each diagonal
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < grid[0].length; col++) {
				for (const direct of [1, -1]) {
					let tempDiag = [];
					for (let i = 0; i < 4; i++) {
						let elDiag = grid[row + i][col + direct * i];

						if (elDiag !== undefined) {
							tempDiag.push(elDiag);
						}
					}

					if (tempDiag.length >= 4) {
						let winner = checkArrSame(tempDiag);
						if (winner !== undefined) return winner;
					}
				}
			}
		}

		// Return false if the game has not ended (i.e. with empty cells)
		for (const row of grid) {
			for (const el of row) {
				if (el === ' ') return false;
			}
		}

		// Return 'T' if the game is a tie
		return 'T';
	}

	static endGame(winner) {
		if (winner === 'O' || winner === 'X') {
			Screen.setQuitMessage(`Player ${winner} wins!`);
		} else if (winner === 'T') {
			Screen.setQuitMessage(`Tie game!`);
		} else {
			Screen.setQuitMessage(`Game Over`);
		}
		Screen.render();
		Screen.quit();
	}
}

module.exports = ConnectFour;
