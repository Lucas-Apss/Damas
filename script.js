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
        if ((piece.color === 'black' && rowDiff <= 0) || (piece.color === 'red' && rowDiff >= 0)) {
            if (Math.abs(rowDiff) !== 2 || Math.abs(colDiff) !== 2) return false;
            const capturedPiece = capturePiece(piece, newRow, newCol);
            return capturedPiece && capturedPiece.color !== piece.color;
        }

        // Movimento normal ou de captura
        if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) return true;
        if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
            const capturedPiece = capturePiece(piece, newRow, newCol);
            return capturedPiece && capturedPiece.color !== piece.color;
        }

        return false;
    }

    function isValidKingMove(piece, newRow, newCol) {
        const rowDiff = Math.abs(newRow - piece.row);
        const colDiff = Math.abs(newCol - piece.col);

        if (rowDiff === colDiff) {
            const rowDirection = (newRow - piece.row) / rowDiff;
            const colDirection = (newCol - piece.col) / colDiff;

            let hasCapturedPiece = false;
            for (let i = 1; i < rowDiff; i++) {
                const intermediateRow = piece.row + i * rowDirection;
                const intermediateCol = piece.col + i * colDirection;

                const intermediatePiece = getPieceAt(intermediateRow, intermediateCol);
                if (intermediatePiece) {
                    if (intermediatePiece.color === piece.color) {
                        return false;
                    }
                    if (hasCapturedPiece) {
                        return false; // Não pode capturar mais de uma peça por movimento
                    }
                    hasCapturedPiece = true;
                }
            }
            return true;
        }
        return false;
    }

    function canCapture(piece) {
        const directions = piece.element.classList.contains('king')
            ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
            : piece.color === 'black'
                ? [[1, 1], [1, -1]]
                : [[-1, 1], [-1, -1]];

        return directions.some(([rowDir, colDir]) => {
            const newRow = piece.row + 2 * rowDir;
            const newCol = piece.col + 2 * colDir;
            const capturedPiece = capturePiece(piece, newRow, newCol);
            return capturedPiece && capturedPiece.color !== piece.color && isEmpty(newRow, newCol);
        });
    }

    function canCaptureMore(piece) {
        const directions = piece.element.classList.contains('king')
            ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
            : piece.color === 'black'
                ? [[1, 1], [1, -1]]
                : [[-1, 1], [-1, -1]];

        return directions.some(([rowDir, colDir]) => {
            const newRow = piece.row + 2 * rowDir;
            const newCol = piece.col + 2 * colDir;
            const capturedPiece = capturePiece(piece, newRow, newCol);
            return capturedPiece && capturedPiece.color !== piece.color && isEmpty(newRow, newCol);
        });
    }

    function isEmpty(row, col) {
        return !getPieceAt(row, col);
    }

    function highlightPossibleMoves(piece) {
        removeHighlights();
        const possibleMoves = generatePossibleMoves(piece);
        possibleMoves.forEach(([row, col]) => {
            const cell = findCell(row, col);
            if (cell) cell.classList.add('highlight');
        });
    }

    function generatePossibleMoves(piece) {
        const directions = piece.element.classList.contains('king')
            ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
            : piece.color === 'black'
                ? [[1, 1], [1, -1]]
                : [[-1, 1], [-1, -1]];

        const moves = directions.map(([rowDir, colDir]) => [piece.row + rowDir, piece.col + colDir]);
        const captures = directions.map(([rowDir, colDir]) => [piece.row + 2 * rowDir, piece.col + 2 * colDir]);
        return [...moves, ...captures];
    }

    function removeHighlights() {
        document.querySelectorAll('.highlight').forEach(cell => {
            cell.classList.remove('highlight');
        });
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

    function endTurn() {
        if (!checkForWinner()) {
            currentPlayer = currentPlayer === 'black' ? 'red' : 'black';
        }
    }

    initializeBoard();
});