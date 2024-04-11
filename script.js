document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const pieces = [];

    let currentPlayer = 'black';
    let selectedPiece = null;
    const pieces = [];


    function initializeBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if ((row + col) % 2 === 0) {
                    cell.classList.add('light');
                } else {
                    cell.classList.add('dark');
                }
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', cellClickHandler);
                board.appendChild(cell);
            }
        }


        initializePieces();
    }

    function initializePieces() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 === 1) {
                    if (i < 3) {
                        createPiece('black', i, j);
                    } else if (i > 4) {
                        createPiece('red', i, j);
                    }
                }
            }
        }
    }

    function createPiece(color, row, col) {
        const piece = document.createElement('div');
        piece.classList.add('piece', color);
        if (row === 0 || row === 7) {
            piece.classList.add('king');
        }
        pieces.push({ color, row, col, element: piece });
        const cell = findCell(row, col);
        cell.appendChild(piece);
    }


    function cellClickHandler() {
        const row = parseInt(this.dataset.row);
        const col = parseInt(this.dataset.col);
        const piece = getPieceAt(row, col);
        if (piece && piece.color === currentPlayer) {
            if (selectedPiece) {
                selectedPiece.element.classList.remove('selected');
            }
            selectedPiece = piece;
            selectedPiece.element.classList.add('selected');
        } else if (selectedPiece) {
            movePiece(selectedPiece, row, col);
        }
    }

    function movePiece(piece, newRow, newCol) {
        // Adicione a lógica de movimento da peça aqui
    }

    function getPieceAt(row, col) {
        return pieces.find(p => p.row === row && p.col === col);
    }

    function findCell(row, col) {
        return board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);


    function findCell(row, col) {
        return board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    }

    initializeBoard();
});
