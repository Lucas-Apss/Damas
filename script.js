document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const currentPlayerDisplay = document.getElementById('current-player');
    const blackCapturedDisplay = document.getElementById('black-captured');
    const redCapturedDisplay = document.getElementById('red-captured');

    let currentPlayer = 'black';
    let selectedPiece = null;
    const pieces = [];
    let blackCaptured = 0;
    let redCaptured = 0;

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
                removeHighlights();
            }
            selectedPiece = piece;
            selectedPiece.element.classList.add('selected');
            highlightPossibleMoves(piece);
        } else if (selectedPiece && isValidMove(selectedPiece, row, col)) {
            movePiece(selectedPiece, row, col);
        }
    }

    function movePiece(piece, newRow, newCol) {
        const capturedPiece = capturePiece(piece, newRow, newCol);
        if (capturedPiece) {
            capturedPiece.element.remove();
            pieces.splice(pieces.indexOf(capturedPiece), 1);
            updateCapturedCount(capturedPiece.color);
        }
        piece.element.remove();
        piece.row = newRow;
        piece.col = newCol;
        const cell = findCell(newRow, newCol);
        cell.appendChild(piece.element);

        // Verifica se a peça alcançou o final do tabuleiro para se tornar uma dama
        if ((piece.color === 'black' && newRow === 7) || (piece.color === 'red' && newRow === 0)) {
            piece.element.classList.add('king');
        }

        removeHighlights();
        selectedPiece.element.classList.remove('selected');
        selectedPiece = null;

        // Verifica se há capturas adicionais possíveis
        if (capturedPiece && canCapture(piece)) {
            // Verifica se é realmente possível fazer a próxima captura
            if (!canCaptureMore(piece)) {
                endTurn();
            } else {
                selectedPiece = piece;
                selectedPiece.element.classList.add('selected');
                highlightPossibleMoves(piece);
            }
        } else {
            endTurn();
        }
    }

    function capturePiece(piece, newRow, newCol) {
        const rowDiff = newRow - piece.row;
        const colDiff = newCol - piece.col;
        if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
            const capturedRow = piece.row + rowDiff / 2;
            const capturedCol = piece.col + colDiff / 2;
            return getPieceAt(capturedRow, capturedCol);
        }
        if (piece.element.classList.contains('king')) {
            const rowDirection = rowDiff / Math.abs(rowDiff);
            const colDirection = colDiff / Math.abs(colDiff);
            for (let i = 1; i < Math.abs(rowDiff); i++) {
                const intermediateRow = piece.row + i * rowDirection;
                const intermediateCol = piece.col + i * colDirection;
                const capturedPiece = getPieceAt(intermediateRow, intermediateCol);
                if (capturedPiece && capturedPiece.color !== piece.color) {
                    return capturedPiece;
                }
            }
        }
        return null;
    }

    function updateCapturedCount(color) {
        if (color === 'black') {
            redCaptured++;
            redCapturedDisplay.textContent = redCaptured;
        } else {
            blackCaptured++;
            blackCapturedDisplay.textContent = blackCaptured;
        }
    }

    function getPieceAt(row, col) {
        return pieces.find(p => p.row === row && p.col === col);
    }

    function findCell(row, col) {
        return board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    }

    function isValidMove(piece, newRow, newCol) {
        const rowDiff = newRow - piece.row;
        const colDiff = newCol - piece.col;

        // Verifica se a célula de destino está vazia
        if (!isEmpty(newRow, newCol)) return false;

        // Se a peça for uma dama, permitir movimento livre
        if (piece.element.classList.contains('king')) {
            return isValidKingMove(piece, newRow, newCol);
        }

        // Verifica se a peça está se movendo na direção correta ou se está capturando voltando
        if ((piece.color === 'black' && newRow > piece.row) || (piece.color === 'red' && newRow < piece.row)) {
            if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
                return true;
            }
            if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
                const capturedPiece = capturePiece(piece, newRow, newCol);
                return capturedPiece && capturedPiece.color !== piece.color;
            }
        }
        return false;
    }

    function isEmpty(row, col) {
        return !getPieceAt(row, col);
    }

    function isValidKingMove(piece, newRow, newCol) {
        const rowDiff = newRow - piece.row;
        const colDiff = newCol - piece.col;
        if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;

        const rowDirection = rowDiff / Math.abs(rowDiff);
        const colDirection = colDiff / Math.abs(colDiff);
        for (let i = 1; i < Math.abs(rowDiff); i++) {
            if (!isEmpty(piece.row + i * rowDirection, piece.col + i * colDirection)) {
                return false;
            }
        }
        return true;
    }

    function endTurn() {
        currentPlayer = currentPlayer === 'black' ? 'red' : 'black';
        currentPlayerDisplay.textContent = currentPlayer === 'black' ? 'Preto' : 'Vermelho';
    }

    function highlightPossibleMoves(piece) {
        const possibleMoves = getPossibleMoves(piece);
        possibleMoves.forEach(move => {
            const cell = findCell(move.row, move.col);
            cell.classList.add('highlight');
        });
    }

    function getPossibleMoves(piece) {
        const moves = [];
        const directions = piece.element.classList.contains('king') ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : piece.color === 'black' ? [[1, 1], [1, -1]] : [[-1, 1], [-1, -1]];

        directions.forEach(([rowDiff, colDiff]) => {
            let row = piece.row + rowDiff;
            let col = piece.col + colDiff;
            while (row >= 0 && row < 8 && col >= 0 && col < 8) {
                if (isValidMove(piece, row, col)) {
                    moves.push({ row, col });
                }
                if (!piece.element.classList.contains('king') || !isEmpty(row, col)) break;
                row += rowDiff;
                col += colDiff;
            }
        });

        return moves;
    }

    function removeHighlights() {
        const highlightedCells = board.querySelectorAll('.highlight');
        highlightedCells.forEach(cell => {
            cell.classList.remove('highlight');
        });
    }

    function canCapture(piece) {
        return getPossibleMoves(piece).some(move => Math.abs(move.row - piece.row) > 1);
    }

    function canCaptureMore(piece) {
        return getPossibleMoves(piece).some(move => {
            const capturedPiece = capturePiece(piece, move.row, move.col);
            return capturedPiece && capturedPiece.color !== piece.color;
        });
    }

    initializeBoard();
});
