document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
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
        const oldRow = piece.row;
        const oldCol = piece.col;
        const newRowDiff = currentPlayer === 'black' ? newRow - oldRow : oldRow - newRow;
        const newColDiff = Math.abs(newCol - oldCol);

        // Verifica se o movimento é permitido
        if ((newRowDiff === 1 && newColDiff === 1) || (newRowDiff === 2 && newColDiff === 2)) {
            // Verifica se a célula de destino está vazia
            const targetCellIsEmpty = isEmpty(newRow, newCol);
            if (targetCellIsEmpty) {
                // Verifica se há uma peça a ser capturada
                const capturedPieceRow = (newRow + oldRow) / 2;
                const capturedPieceCol = (newCol + oldCol) / 2;
                const capturedPieceIndex = pieces.findIndex(p => p.row === capturedPieceRow && p.col === capturedPieceCol);
                if (capturedPieceIndex !== -1) {
                    const capturedPiece = pieces[capturedPieceIndex];
                    // Move a peça capturada para fora do tabuleiro
                    capturedPiece.element.remove();
                    pieces.splice(capturedPieceIndex, 1);
                }

                // Move a peça para a nova posição
                piece.element.remove();
                piece.row = newRow;
                piece.col = newCol;
                const cell = findCell(newRow, newCol);
                cell.appendChild(piece.element);
                if (newRow === 0 || newRow === 7) {
                    piece.element.classList.add('king');
                }
                selectedPiece.element.classList.remove('selected');
                selectedPiece = null;
                if (!checkForWinner()) {
                    currentPlayer = currentPlayer === 'black' ? 'red' : 'black';
                }
            }
        }
    }

    function getPieceAt(row, col) {
        return pieces.find(p => p.row === row && p.col === col);
    }

    function findCell(row, col) {
        return board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    }

    function checkForWinner() {
        const blackPiecesLeft = pieces.filter(p => p.color === 'black').length;
        const redPiecesLeft = pieces.filter(p => p.color === 'red').length;
        if (blackPiecesLeft === 0) {
            alert('Red wins!');
            return true;
        } else if (redPiecesLeft === 0) {
            alert('Black wins!');
            return true;
        }
        return false;
    }

    function isEmpty(row, col) {
        return !getPieceAt(row, col);
    }

    initializeBoard();
});
