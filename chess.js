"use strict"

const chessBoard = new Object({
    rows: new Array('8','7','6','5','4','3','2','1'),
    cols: new Array('A','B','C','D','E','F','G','H'),
});

const chessMan = new Array(
    {
        type: 'king',
        color: 'white',
        name: 'Weißer König',
        startPositions: new Array('E1')
    },
    {

        type: 'queen',
        color: 'white',
        name: 'Weiße Königin',
        startPositions: new Array('D1')
    },
    {
        type: 'bishop',
        color: 'white',
        name: 'Weißer Läufer',
        startPositions: new Array('C1','F1')
    },
    {
        type:  'knight',
        color: 'white',
        name: 'Weißes Pferd',
        startPositions: new Array('B1','G1')
    },
    {
        type: 'rook',
        color: 'white',
        name: 'Weißer Turm',
        startPositions: new Array('A1','H1')
    },
    {
        type: 'pawn',
        color: 'white',
        name: 'Weißer Bauer',
        startPositions: new Array('A2','B2','C2','D2','E2','F2','G2','H2')
    },
    {
        type: 'king',
        color: 'black',
        name: 'Schwarzer König',
        startPositions: new Array('E8')
    },
    {
        type: 'queen',
        color: 'black',
        name: 'Schwarze Königin',
        startPositions: new Array('D8')
    },
    {
        type: 'bishop',
        color: 'black',
        name: 'Schwarzer Läufer',
        startPositions: new Array('C8','F8')
    },
    {
        type: 'knight',
        color: 'black',
        name: 'Schwarzes Pferd',
        startPositions: new Array('B8','G8')
    },
    {
        type: 'rook',
        color: 'black',
        name: 'Schwarzer Turm',
        startPositions: new Array('A8','H8')
    },
    {
        type: 'pawn',
        color: 'black',
        name: 'Schwarzer Bauer',
        startPositions: new Array('A7','B7','C7','D7','E7','F7','G7','H7')
    }
);

let gameState = new Object({
    playMoves: new Array(),
    selectedChessMen: undefined,
    playersTurn: undefined,
    rochade: false
});

let playerOne = new Object({
    id: 1,
    name: 'Raphael Dobesch',
    color: 'white',
    rochadeWith: undefined,
    rochadeTo: undefined
})

let playerTwo = new Object({
    id: 2,
    name: 'Computer',
    color: 'black',
    rochadeWith: undefined,
    rochadeTo: undefined
})

// --------------------------------------------------------------------------------------------------------------------

/**
 * Funktion um Spielfeld als HTML Element zu erstellen
 */
function createChessBoard(){
    const table = document.createElement('table');
    table.setAttribute('id','chessBoard');

    const tableHeader = document.createElement('thead');
    table.append(tableHeader);

    const tableHeaderRow = document.createElement('tr');
    tableHeader.append(tableHeaderRow);

    // 10 Felder
    const tableHeaderColumnSideLeft= document.createElement('td');
    tableHeaderColumnSideLeft.setAttribute('class', 'side')
    tableHeaderRow.append(tableHeaderColumnSideLeft);

    for(let col of chessBoard.cols){
        const tableHeaderColumnField = document.createElement('td');
        tableHeaderColumnField.setAttribute('class', 'side')
        tableHeaderColumnField.innerText = col;
        tableHeaderRow.append(tableHeaderColumnField);
    }

    const tableHeaderColumnSideRight= document.createElement('td');
    tableHeaderColumnSideRight.setAttribute('class', 'side')
    tableHeaderRow.append(tableHeaderColumnSideRight);

    const tableBody = document.createElement('tbody');
    table.append(tableBody);

    // 8 Zeilen
    for(let row of chessBoard.rows){
        const tableBodyRow = document.createElement('tr');
        // 10 Felder
        const tableBodyColumnSideLeft = document.createElement('td');
        tableBodyColumnSideLeft.setAttribute('class', 'side');
        tableBodyColumnSideLeft.innerText = row;
        tableBodyRow.append(tableBodyColumnSideLeft);
        let index = parseInt(row);
        for(let col of chessBoard.cols){
            const tableBodyColumnField = document.createElement('td');
            tableBodyColumnField.setAttribute('id', col+row);
            if(index % 2 === 0){
                tableBodyColumnField.setAttribute('class', 'field-dark clickable');
            } else {
                tableBodyColumnField.setAttribute('class', 'field-light clickable');
            }
            tableBodyColumnField.addEventListener('click', moveChessMen);
            tableBodyRow.append(tableBodyColumnField);
            index++;
        }
        const tableBodyColumnSideRight = document.createElement('td');
        tableBodyColumnSideRight.setAttribute('class', 'side');
        tableBodyColumnSideRight.innerText = row;
        tableBodyRow.append(tableBodyColumnSideRight);
        tableBody.append(tableBodyRow);
    }

    const tableBodyRowBottom = document.createElement('tr');
    tableBody.append(tableBodyRowBottom);

    const tableBodyColumnSideBottomLeft = document.createElement('td');
    tableBodyColumnSideBottomLeft.setAttribute('class', 'side');
    tableBodyRowBottom.append(tableBodyColumnSideBottomLeft);
    for(let col of chessBoard.cols){
        const tableBodyColumnSideBottom = document.createElement('td');
        tableBodyColumnSideBottom.setAttribute('class', 'side');
        tableBodyColumnSideBottom.innerText = col;
        tableBodyRowBottom.append(tableBodyColumnSideBottom);
    }
    const tableBodyColumnSideRight = document.createElement('td');
    tableBodyColumnSideRight.setAttribute('class', 'side');
    tableBodyRowBottom.append(tableBodyColumnSideRight);


    return table;
}

/**
 * Erstellt die Spielfiguren als HTML Elemente
 */
function createChessMan(){
    const figures = new Array();

    for(let figure of chessMan){
        for (let position in figure.startPositions){
            const element = document.createElement('i');
            const htmlClasses = figure.color+' '+figure.type+' '+'fas fa-chess-'+figure.type;
            element.setAttribute('class', htmlClasses);
            figures.push(element);
        }
    }
    return figures;
}

/**
 * Erstellt die Konsolen-Nachricht als HTML Element
 */
function createMessage(message){
    const listItem = document.createElement('li');
    listItem.innerHTML = message;
    return listItem;
}

// --------------------------------------------------------------------------------------------------------------------

/**
 * Funktion um Schachbrett auf der Seite im vorgesehenen Spielfeld-Element zu setzen.
 * HTML Element wird in das Spielfeld gesetzt.
 */
function setChessBoardToPlayGround(htmlElement){
    let playGround = document.querySelector('main div#playGround');
    playGround.append(htmlElement);
}

/**
 * Funktion um eine Schachfigur auf ein bestimmtes Feld zu setzen.
 * HTML Element wird in das Feld eingebettet.
 *
 */
function setChessMenToField(htmlElement, fieldId){
    const chessField = document.querySelector('main table#chessBoard td#'+fieldId);
    chessField.append(htmlElement);
}

/**
 * Setzt einen Spieler neben das Schachbrett auf die Seite.
 * HTML Element wird in das Feld eingebettet.
 */
function setChessMenToSideBoard(htmlElement){
    const chessField = document.querySelector('main div#sideBoard');
    chessField.append(htmlElement);
}

/**
 * Zeigt die Nachricht auf der Konsole der Seite an.
 * HTML Element wird in die Konsole eingebettet.
 */
function setMessageToConsole(htmlElement){
    const messageFrame = document.querySelector('main ol#console');
    messageFrame.append(htmlElement);
}

/**
 * Zeigt die Nachricht auf dem Nachrichtenfeld der Seite an.
 * HTML Element wird in das Nachrichtenfeld eingebettet.
 */
function setMessageToMessageFrame(htmlElement){
    const messageFrame = document.querySelector('main div#messageFrame');
    messageFrame.append(htmlElement);
}

/**
 * Kennzeichnet die Schachfigur als ausgewählt
 */
function setChessMenSelected(htmlElement){
    htmlElement.classList.add('selected');
}

/**
 * Kennzeichnet die Schachfigur als nicht ausgewählt
 */
function setChessMenUnselected(htmlElement){
    htmlElement.classList.remove('selected');
}

/**
 * Entfernt alle Start-Button von der Seite.
 * HTML Element wird von der Seite entfernt.
 */
function removePlayButtons(){
    const frame = document.querySelector('main div#buttonFrame');
    while(frame.firstElementChild){
        frame.firstElementChild.remove();
    }
}

// --------------------------------------------------------------------------------------------------------------------

/**
 * Initiiert das Schachbrett
 */
function initChessBoard(){
    let chessBoard = createChessBoard();
    setChessBoardToPlayGround(chessBoard);
    removePlayButtons();
}

/**
 * Setze alle Spieler jeweils an Ihre Startposition.
 */
function moveChessManToStartPositions(){
    const figures = createChessMan();
    const chessManClone = JSON.parse(JSON.stringify(chessMan));

    for(let figure of figures){
        for(let chessMenClone of chessManClone){
            if(figure.classList.contains(chessMenClone.type) && figure.classList.contains(chessMenClone.color)){
                setChessMenToField(figure, chessMenClone.startPositions.pop());
            }
        }
    }

}

/**
 * Wählt eine Spielfigur aus und setzt diese anschließend auf eine bestimmte Position.
 */
function moveChessMen(event){
    let element = event.target;

    if (element.tagName === 'TD' && element.firstChild){
        if(element.firstElementChild.tagName === 'I'){
            element = event.target.firstElementChild;
        }
    }

    if(element.tagName === 'TD' && !element.firstChild){
        if(gameState.chessMenSelected){
            const fieldIdTo = element.id;
            const fieldIdFrom = gameState.chessMenSelected.parentElement.id;

            if(verifyMovement(gameState.chessMenSelected,fieldIdFrom, fieldIdTo)) {
                let message = '';
                let type = '';
                for (let chessMen of chessMan) {
                    if (
                        gameState.chessMenSelected.classList.contains(chessMen.type) &&
                        gameState.chessMenSelected.classList.contains(chessMen.color)
                    ) {
                        type = chessMen.type;
                        message = chessMen.name + ' von ' + fieldIdFrom + ' nach ' + fieldIdTo;
                    }
                }
                setChessMenToField(gameState.chessMenSelected, fieldIdTo);
                setChessMenUnselected(gameState.chessMenSelected);
                if(gameState.rochade && gameState.playersTurn.rochadeWith){
                    let rook = document.querySelector('main table#chessBoard td#'+gameState.playersTurn.rochadeWith).firstElementChild;
                    setChessMenToField(rook, gameState.playersTurn.rochadeTo);
                    gameState.rochade = false;
                }
                gameState.chessMenSelected = undefined;
                setMessageToConsole(createMessage(message));
                gameState.playMoves.push({
                    type: type,
                    color: gameState.playersTurn.color,
                    from: fieldIdFrom,
                    to: fieldIdTo
                });
                changePlayersTurn();
            }
        }
    } else{
        if(!gameState.chessMenSelected && verifySelectedPlayer(element)){
            gameState.chessMenSelected = element;
            setChessMenSelected(element);
        } else if(gameState.chessMenSelected === element){
            gameState.chessMenSelected = undefined;
            setChessMenUnselected(element);
        } else if(gameState.chessMenSelected){
            const fieldIdTo = element.parentElement.id;
            const fieldIdFrom = gameState.chessMenSelected.parentElement.id;

            if (verifyMovement(gameState.chessMenSelected, fieldIdFrom, fieldIdTo)) {
                let message = '';
                let type = '';
                for (let chessMen of chessMan) {
                    if (
                        gameState.chessMenSelected.classList.contains(chessMen.type) &&
                        gameState.chessMenSelected.classList.contains(chessMen.color)
                    ) {
                        type = chessMen.type;
                        message = chessMen.name + ' von ' + fieldIdFrom + ' nach ' + fieldIdTo;
                    }
                }
                setChessMenToSideBoard(element);
                setChessMenToField(gameState.chessMenSelected, fieldIdTo);
                setChessMenUnselected(gameState.chessMenSelected);
                if(gameState.rochade && gameState.playersTurn.rochadeWith){
                    let rook = document.querySelector('main table#chessBoard td#'+gameState.playersTurn.rochadeWith).firstElementChild;
                    setChessMenToField(rook, gameState.playersTurn.rochadeTo);
                    gameState.rochade = false;
                }
                gameState.chessMenSelected = undefined;
                setMessageToConsole(createMessage(message));
                gameState.playMoves.push({
                    type: type,
                    color: gameState.playersTurn.color,
                    from: fieldIdFrom,
                    to: fieldIdTo
                });
                changePlayersTurn();
            }
        }
    }

}

/**
 * Wählt eine Spielfigur aus und setzt diese anschließend auf eine bestimmte Position.
 */
function moveChessMenSpainOpening(){
    const spainOpening = new Array(
        {
            from: 'E2',
            to: 'E4'
        },
        {
            from: 'E7',
            to: 'E5'
        },
        {
            from: 'G1',
            to: 'F3'
        },
        {
            from: 'B8',
            to: 'C6'
        },
        {
            from: 'F1',
            to: 'B5'
        },
        {
            from: 'A7',
            to: 'A6'
        },
        {
            from: 'B5',
            to: 'A4'
        },);

    for(let move of spainOpening){
        let element = document.querySelector('main table#chessBoard td#'+move.from).firstElementChild;

        const fieldIdFrom = element.parentElement.id;
        const fieldIdTo = move.to;
        let message = '';
        for(let chessMen of chessMan){
            if(
                element.classList.contains(chessMen.type) &&
                element.classList.contains(chessMen.color)
            ){
                message = chessMen.name + ' von ' + fieldIdFrom + ' nach ' + fieldIdTo;
            }
        }
        setChessMenToField(element, fieldIdTo);
        setMessageToConsole(createMessage(message));
        gameState.playMoves.push(message);

    }
}

/**
 * Wählt den nächsten Spieler aus, welcher am Zug ist.
 */
function changePlayersTurn(){
    if(gameState.playersTurn.id === 1){
        gameState.playersTurn = playerTwo;
    } else {
        gameState.playersTurn = playerOne;
    }
}

// --------------------------------------------------------------------------------------------------------------------

/**
 * Stellt sicher, dass der Spieler nur seine eigenen Figuren auswählt
 */
function verifySelectedPlayer(htmlElement){
    return htmlElement.classList.contains(gameState.playersTurn.color);
}

/**
 * Einstiegsfunktion in die Überprüfung eines Spielzuges
 * @param htmlElement
 * @param fieldIdFrom
 * @param fieldIdTo
 * @returns {boolean}
 */
function verifyMovement(htmlElement, fieldIdFrom, fieldIdTo){
    let token = false;
    let type = undefined;

    const colFieldIndexFrom = chessBoard.cols.indexOf(fieldIdFrom[0])
    const colFieldIndexTo = chessBoard.cols.indexOf(fieldIdTo[0])
    const rowFieldIndexFrom = chessBoard.rows.indexOf(fieldIdFrom[1]);
    const rowFieldIndexTo = chessBoard.rows.indexOf(fieldIdTo[1]);

    const lengthOfColIndexPath = Math.abs(colFieldIndexFrom-colFieldIndexTo);
    const lengthOfRowIndexPath = Math.abs(rowFieldIndexFrom-rowFieldIndexTo);

    const isColIndexDirectionNegative = colFieldIndexFrom > colFieldIndexTo;
    const isRowIndexDirectionNegative = rowFieldIndexFrom > rowFieldIndexTo;

    let startPosition = undefined;

    for(let chessMen of chessMan){
        if(htmlElement.classList.contains(chessMen.type) && chessMen.color===gameState.playersTurn.color){
            type = chessMen.type;
            startPosition = chessMen.startPositions.find(fieldId => fieldId === fieldIdFrom);
            break;
        }
    }

    switch (type) {
        case 'king' :
            token = kingMovement(colFieldIndexFrom, rowFieldIndexFrom, isColIndexDirectionNegative, isRowIndexDirectionNegative, lengthOfColIndexPath, lengthOfRowIndexPath, startPosition, fieldIdFrom);
            break;
        case 'queen' :
            token = queenMovement(colFieldIndexFrom, rowFieldIndexFrom, isColIndexDirectionNegative, isRowIndexDirectionNegative, lengthOfColIndexPath, lengthOfRowIndexPath);
            break;
        case 'bishop' :
            token = bishopMovement(colFieldIndexFrom, rowFieldIndexFrom, isColIndexDirectionNegative, isRowIndexDirectionNegative, lengthOfColIndexPath, lengthOfRowIndexPath);
            break;
        case 'rook' :
            token = rookMovement(colFieldIndexFrom, rowFieldIndexFrom, isColIndexDirectionNegative, isRowIndexDirectionNegative, lengthOfColIndexPath, lengthOfRowIndexPath);
            break;
        case 'knight' :
            token = knightMovement(lengthOfColIndexPath, lengthOfRowIndexPath, fieldIdTo);
            break;
        case 'pawn' :
            token = pawnMovement(colFieldIndexFrom, rowFieldIndexFrom, isRowIndexDirectionNegative, isColIndexDirectionNegative, lengthOfColIndexPath, lengthOfRowIndexPath, startPosition, fieldIdFrom);
            break;
    }

    return token;
}

function kingMovement(colFieldIndexFrom, rowFieldIndexFrom, isColIndexDirectionNegative, isRowIndexDirectionNegative, lengthOfColIndexPath, lengthOfRowIndexPath, startPosition, fieldIdFrom){
    let tokenMovement = false;
    let tokenCollision = false;

    if(lengthOfRowIndexPath <= 1 && lengthOfColIndexPath === 0){
        //-----------------------
        tokenCollision = verifyStraightCollision(lengthOfRowIndexPath,isRowIndexDirectionNegative, 'row', colFieldIndexFrom, rowFieldIndexFrom)
        //----------------------
        tokenMovement = true;
    } else if(lengthOfColIndexPath <= 1 && lengthOfRowIndexPath === 0){
        //-----------------------
        tokenCollision = verifyStraightCollision(lengthOfColIndexPath,isColIndexDirectionNegative, 'col', colFieldIndexFrom, rowFieldIndexFrom)
        //----------------------
        tokenMovement = true;
    } else if(lengthOfColIndexPath === 1 && lengthOfRowIndexPath === 1){
        //-----------------------
        tokenCollision = verifyDiagonalCollision(lengthOfRowIndexPath, lengthOfColIndexPath, colFieldIndexFrom, rowFieldIndexFrom, isRowIndexDirectionNegative, isColIndexDirectionNegative);
        //----------------------
        tokenMovement = true;
    } else if(lengthOfColIndexPath === 2 && !isColIndexDirectionNegative && lengthOfRowIndexPath === 0 && fieldIdFrom === startPosition && !gameState.playersTurn.rochadeWith){
        //-----------------------
        tokenCollision = verifyStraightCollision(lengthOfColIndexPath,isColIndexDirectionNegative, 'col', colFieldIndexFrom, rowFieldIndexFrom)
        //----------------------
        if(tokenCollision && gameState.playersTurn.color === 'white'){
            gameState.playersTurn.rochadeWith='H1';
            gameState.playersTurn.rochadeTo='F1';
            gameState.rochade = true;
        } if(tokenCollision && gameState.playersTurn.color === 'black'){
            gameState.playersTurn.rochadeWith='H8';
            gameState.playersTurn.rochadeTo='F8';
            gameState.rochade = true;
        }
        tokenMovement = true;
    } else if(lengthOfColIndexPath === 2 && isColIndexDirectionNegative && lengthOfRowIndexPath === 0 && fieldIdFrom === startPosition && !gameState.playersTurn.rochadeWith){
        //-----------------------
        tokenCollision = verifyStraightCollision(lengthOfColIndexPath,isColIndexDirectionNegative, 'col', colFieldIndexFrom, rowFieldIndexFrom)
        //----------------------
        if(tokenCollision && gameState.playersTurn.color === 'white'){
            gameState.playersTurn.rochadeWith='A1';
            gameState.playersTurn.rochadeTo='D1';
            gameState.rochade = true;
        } if(tokenCollision && gameState.playersTurn.color === 'black'){
            gameState.playersTurn.rochadeWith='A8';
            gameState.playersTurn.rochadeTo='D8';
            gameState.rochade = true;
        }
        tokenMovement = true;
    }

    return tokenMovement && tokenCollision;
}

function queenMovement(colFieldIndexFrom, rowFieldIndexFrom, isColIndexDirectionNegative, isRowIndexDirectionNegative, lengthOfColIndexPath, lengthOfRowIndexPath){
    let tokenMovement = false;
    let tokenCollision = false;

    if(lengthOfRowIndexPath > 0 && lengthOfColIndexPath === 0){
        //-----------------------
            tokenCollision = verifyStraightCollision(lengthOfRowIndexPath,isRowIndexDirectionNegative, 'row', colFieldIndexFrom, rowFieldIndexFrom)
        //----------------------
        tokenMovement = true;
    } else if(lengthOfColIndexPath > 0 && lengthOfRowIndexPath === 0){
        //-----------------------
            tokenCollision = verifyStraightCollision(lengthOfColIndexPath,isColIndexDirectionNegative, 'col', colFieldIndexFrom, rowFieldIndexFrom)
        //----------------------
        tokenMovement = true;
    } else if(lengthOfColIndexPath === lengthOfRowIndexPath){
        //-----------------------
            tokenCollision = verifyDiagonalCollision(lengthOfRowIndexPath, lengthOfColIndexPath, colFieldIndexFrom, rowFieldIndexFrom, isRowIndexDirectionNegative, isColIndexDirectionNegative);
        //----------------------
        tokenMovement = true;
    }

    return tokenMovement && tokenCollision;
}

function bishopMovement(colFieldIndexFrom, rowFieldIndexFrom, isColIndexDirectionNegative, isRowIndexDirectionNegative, lengthOfColIndexPath, lengthOfRowIndexPath){
    let tokenMovement = false;
    let tokenCollision = true;

    if(lengthOfColIndexPath === lengthOfRowIndexPath){
        //-----------------------
        tokenCollision = verifyDiagonalCollision(lengthOfRowIndexPath, lengthOfColIndexPath, colFieldIndexFrom, rowFieldIndexFrom, isRowIndexDirectionNegative, isColIndexDirectionNegative);
        //----------------------
        tokenMovement = true;
    }

    return tokenMovement && tokenCollision;
}

function rookMovement(colFieldIndexFrom, rowFieldIndexFrom, isColIndexDirectionNegative, isRowIndexDirectionNegative, lengthOfColIndexPath, lengthOfRowIndexPath){
    let tokenMovement = false;
    let tokenCollision = true;

    if(lengthOfRowIndexPath > 0 && lengthOfColIndexPath === 0){
        //-----------------------
        tokenCollision = verifyStraightCollision(lengthOfRowIndexPath,isRowIndexDirectionNegative, 'row', colFieldIndexFrom, rowFieldIndexFrom)
        //----------------------
        tokenMovement = true;
    } else if(lengthOfColIndexPath > 0 && lengthOfRowIndexPath === 0){
        //-----------------------
        tokenCollision = verifyStraightCollision(lengthOfColIndexPath,isColIndexDirectionNegative, 'col', colFieldIndexFrom, rowFieldIndexFrom)
        //----------------------
        tokenMovement = true;
    }

    return tokenMovement && tokenCollision;
}

function knightMovement(lengthOfColIndexPath, lengthOfRowIndexPath, fieldTo){
    let tokenMovement = false;
    let tokenCollision = false;

    if(
        (lengthOfRowIndexPath === 2 && lengthOfColIndexPath === 1) ||
        (lengthOfColIndexPath === 2 && lengthOfRowIndexPath === 1)
    ){
        tokenCollision = verifyKnightCollision(fieldTo)
        tokenMovement = true;
    }

    return tokenMovement && tokenCollision;
}

function pawnMovement(colFieldIndexFrom, rowFieldIndexFrom, isRowIndexDirectionNegative, isColIndexDirectionNegative, lengthOfColIndexPath, lengthOfRowIndexPath, startPosition, fieldIdFrom){
    let tokenMovement = false;
    let tokenCollision = false;

    if(
        (lengthOfRowIndexPath === 1 || ((fieldIdFrom === startPosition) &&
        lengthOfRowIndexPath === 2)) && lengthOfColIndexPath === 0
    ){
        if(
            (gameState.playersTurn.color === 'black' && !isRowIndexDirectionNegative) ||
            (gameState.playersTurn.color === 'white' && isRowIndexDirectionNegative)
        ){
            //-----------------------
            tokenCollision = verifyStraightCollisionForPawn(colFieldIndexFrom, rowFieldIndexFrom, isRowIndexDirectionNegative, lengthOfRowIndexPath);
            //-----------------------
            tokenMovement = true;
        }
    } else if(
        (lengthOfRowIndexPath === 1) && lengthOfColIndexPath === 1
    ){
        if(
            (gameState.playersTurn.color === 'black' && !isRowIndexDirectionNegative) ||
            (gameState.playersTurn.color === 'white' && isRowIndexDirectionNegative)
        ){
            //-----------------------
            tokenCollision = verifyDiagonalCollisionForPawn(colFieldIndexFrom, rowFieldIndexFrom, isRowIndexDirectionNegative, isColIndexDirectionNegative, lengthOfRowIndexPath, lengthOfColIndexPath);
            //----------------------
            tokenMovement = true;
        }
    }

    return tokenMovement && tokenCollision;
}

function verifyStraightCollision(lengthOfPath, isIndexDirectionNegative, colRowDirection, colFieldIndexFrom, rowFieldIndexFrom)  {
    let tempFieldCol = undefined;
    let tempFieldRow = undefined;
    let tempFieldId = undefined;
    let tempField = undefined;

    for(let step=1;step<=lengthOfPath;step++){
        if(colRowDirection ==='row' && isIndexDirectionNegative){
            tempFieldCol = chessBoard.cols[colFieldIndexFrom];
            tempFieldRow = chessBoard.rows[rowFieldIndexFrom-step];
        } else if(colRowDirection ==='row' && !isIndexDirectionNegative){
            tempFieldCol = chessBoard.cols[colFieldIndexFrom];
            tempFieldRow = chessBoard.rows[rowFieldIndexFrom+step];
        } else if(colRowDirection ==='col' && isIndexDirectionNegative){
            tempFieldCol = chessBoard.cols[colFieldIndexFrom-step];
            tempFieldRow = chessBoard.rows[rowFieldIndexFrom];
        } else {
            tempFieldCol = chessBoard.cols[colFieldIndexFrom+step];
            tempFieldRow = chessBoard.rows[rowFieldIndexFrom];
        }

        tempFieldId = tempFieldCol+tempFieldRow;
        tempField = document.querySelector('main table#chessBoard td#'+tempFieldId);
        if(tempField.firstChild){
            if(step !== lengthOfPath){
                return false;
            } else if(tempField.firstElementChild.classList.contains(gameState.playersTurn.color)){
                return false;
            }
        }
    }

    return true;
}

function verifyStraightCollisionForPawn(colFieldIndexFrom, rowFieldIndexFrom, isRowIndexDirectionNegative, lengthOfRowIndexPath)  {
    let tempFieldId = undefined;

    if(isRowIndexDirectionNegative){
        tempFieldId = chessBoard.cols[colFieldIndexFrom] + chessBoard.rows[rowFieldIndexFrom-lengthOfRowIndexPath];
    } else {
        tempFieldId = chessBoard.cols[colFieldIndexFrom] + chessBoard.rows[rowFieldIndexFrom+lengthOfRowIndexPath];
    }

    let tempField = document.querySelector('main table#chessBoard td#'+tempFieldId);

    if(tempField.firstChild){
        return false;
    }

    return true;
}

function verifyDiagonalCollision(lengthOfRowIndexPath, lengthOfColIndexPath, colFieldIndexFrom, rowFieldIndexFrom, isRowIndexDirectionNegative, isColIndexDirectionNegative){
    let tempFieldCol = undefined;
    let tempFieldRow = undefined;
    let tempFieldId = undefined;
    let tempField = undefined;

    for(let step=1;step<=lengthOfRowIndexPath;step++){
        if(isRowIndexDirectionNegative && isColIndexDirectionNegative){
            tempFieldCol = chessBoard.cols[colFieldIndexFrom-step];
            tempFieldRow = chessBoard.rows[rowFieldIndexFrom-step];
        } else if(!isRowIndexDirectionNegative && isColIndexDirectionNegative){
            tempFieldCol = chessBoard.cols[colFieldIndexFrom-step];
            tempFieldRow = chessBoard.rows[rowFieldIndexFrom+step];
        } else if(isRowIndexDirectionNegative && !isColIndexDirectionNegative){
            tempFieldCol = chessBoard.cols[colFieldIndexFrom+step];
            tempFieldRow = chessBoard.rows[rowFieldIndexFrom-step];
        } else {
            tempFieldCol = chessBoard.cols[colFieldIndexFrom+step];
            tempFieldRow = chessBoard.rows[rowFieldIndexFrom+step];
        }
        tempFieldId = tempFieldCol+tempFieldRow;
        tempField = document.querySelector('main table#chessBoard td#'+tempFieldId);
        if(tempField.firstChild){
            if(step !== lengthOfRowIndexPath){
                return false;
            } else if(tempField.firstElementChild.classList.contains(gameState.playersTurn.color)){
                return false;
            }
        }
    }

    return true;
}

function verifyDiagonalCollisionForPawn(colFieldIndexFrom, rowFieldIndexFrom, isRowIndexDirectionNegative, isColIndexDirectionNegative, lengthOfRowIndexPath, lengthOfColIndexPath)  {
    let tempFieldId = undefined;

    if(isRowIndexDirectionNegative && isColIndexDirectionNegative){
        tempFieldId = chessBoard.cols[colFieldIndexFrom-lengthOfColIndexPath] + chessBoard.rows[rowFieldIndexFrom-lengthOfRowIndexPath];
    } else if(isRowIndexDirectionNegative && !isColIndexDirectionNegative){
        tempFieldId = chessBoard.cols[colFieldIndexFrom+lengthOfColIndexPath] + chessBoard.rows[rowFieldIndexFrom-lengthOfRowIndexPath];
    } else if(!isRowIndexDirectionNegative && isColIndexDirectionNegative){
        tempFieldId = chessBoard.cols[colFieldIndexFrom-lengthOfColIndexPath] + chessBoard.rows[rowFieldIndexFrom+lengthOfRowIndexPath];
    } else {
        tempFieldId = chessBoard.cols[colFieldIndexFrom+lengthOfColIndexPath] + chessBoard.rows[rowFieldIndexFrom+lengthOfRowIndexPath];
    }

    let tempField = document.querySelector('main table#chessBoard td#'+tempFieldId);

    if(!tempField.firstChild){
        return false;
    }

    return true;
}

function verifyKnightCollision(fieldTo)  {
    let tempFieldId = fieldTo;
    let tempField = document.querySelector('main table#chessBoard td#'+tempFieldId);
    if(tempField.firstChild){
        if(tempField.firstElementChild.classList.contains(gameState.playersTurn.color)){
            return false;
        }
    }

    return true;
}

// --------------------------------------------------------------------------------------------------------------------

/**
 *  Funktion um Spiel zu starten.
 */
function initFreeGame(){
    initChessBoard();
    gameState.playersTurn = playerOne;
    moveChessManToStartPositions();
}

/**
 *  Funktion um Spiel mit spanischer eröffnung zu spielen.
 */
function initSpainGame(){
    initChessBoard();
    gameState.playersTurn = playerOne;
    moveChessManToStartPositions();
    moveChessMenSpainOpening();
}