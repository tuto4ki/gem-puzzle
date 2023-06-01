import Sound from './sound.js';
import Square from './square.js';
import getTimeFormat from './module.js';

let sizeSquare = 80;
let sizeText = 40;

class Game {
    constructor(canvas, movesGame, timeGame, gameSize = 4, listScore = null) {
        this.canvas = canvas;
        this.gameSize = gameSize;
        //this.canvas.addEventListener('click', (e) => {console.log(this.dropSquare);if (this.dropSquare.clickX == 0 && this.dropSquare.clickY == 0) {console.log('click'); this.onClickCanvas(e);}})
        this.canvas.addEventListener('mousedown', (e) => {this.onMoveDown(e); });
        this.canvas.addEventListener('mouseup', (e) => {this.onMoveUp(e); });
        this.canvas.addEventListener('mousemove', (e) => {this.onMouseMove(e);});
        this.ctx = canvas.getContext("2d");
        this.count = 0; // the number of moves
        this.time = 0; //  the game duration in minutes and seconds
        this.timeInterval;
        this.listSquare; // list of square
        this.isAnimation = false;
        this.sound = new Sound();
        this.movesGame = movesGame;
        this.timeGame = timeGame;
        this.intervalGame;
        this.listScore = listScore;
        this.isGameEnd = false;
        this.resizeWindows();
        this.canvas.width = this.canvas.height = sizeSquare * this.gameSize;
        this.setDropDefault();
    }
    createCanvas () {
        this.count = 0;
        this.time = 0;
        let arrRand = [];
        for (let i = 0; i < this.gameSize ** 2 - 1; i++) {
            arrRand[i] = i + 1;
        }
        arrRand = randomPosition(arrRand);
        this.createListSquare(arrRand);
    }
    deleteTimeInterval () {
        clearInterval(this.timeInterval);
        clearInterval(this.intervalGame);
    }
    createListSquare (arrRand) {
        this.listSquare = [];
        for(let i = 0; i < this.gameSize; i++) {
            this.listSquare[i] = [];
            for(let j = 0; j < this.gameSize; j++) {
                this.listSquare[i][j] = new Square(arrRand[i * this.gameSize + j], sizeSquare * j, sizeSquare * i, sizeSquare);
            }
        }
        this.deleteTimeInterval();
        this.timeInterval = setInterval(() => { this.time++; this.timeGame.innerHTML = getTimeFormat(this.time); }, 1000);
        this.drawCanvas();
    }
    // game end 
    isGameOver () {
        let isOver = true;
        if (this.listSquare[this.gameSize - 1][this.gameSize - 1].number !== 0) return false;
        for(let i = 0; i < this.gameSize; i++) {
            for(let j = 0; j < this.gameSize && !(i == this.gameSize - 1 && j == this.gameSize - 1); j++) {
                isOver = isOver && (this.listSquare[i][j].number === (i * this.gameSize + j) + 1);
                if (!isOver)    return isOver;
            }
        }
        return isOver;
    }
    // function draw puzzle
    drawCanvas() {
        if (!this.isAnimation) {
            clearInterval(this.intervalGame);
            // check game over
            this.isGameEnd = this.isGameOver ();
            if (this.isGameEnd) {
                clearInterval(this.timeInterval);
                this.listScore.addInListScore(this.count, this.time)
            }
        }
        this.movesGame.innerHTML = this.count;
        this.timeGame.innerHTML = getTimeFormat(this.time);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let isAnimationSquare = false;
        for(let i = 0; i < this.gameSize; i++) {
            for(let j = 0; j < this.gameSize; j++) {
                let square = this.listSquare[i][j];
                if (square.number) {
                    if(square.isAnimation) {
                        square.changeAnimation();
                        isAnimationSquare = true;
                    }
                    square.drawCanvas(this.ctx, sizeText, sizeSquare);
                }
            }
        }
        this.isAnimation = this.isAnimation && isAnimationSquare;
    }
    onClickCanvas(e) {
        if (this.isAnimation) return;
        let clickX = e.pageX - this.canvas.offsetLeft;
        let clickY = e.pageY - this.canvas.offsetTop;
        for(let i = 0; i < this.gameSize; i++) {
            for(let j = 0; j < this.gameSize; j++) {
                let square = this.listSquare[i][j];
                if(clickX >= square.x && clickX <= square.x + square.size &&
                    clickY >= square.y && clickY<= square.y + square.size && square.number !== 0) {
                    let newSquare = null;
                    if (i > 0 && Number(this.listSquare[i - 1][j].number) == 0) {
                        newSquare = this.listSquare[i - 1][j];
                        this.isAnimation = true;
                    } else if (j < this.listSquare[i].length - 1 && Number(this.listSquare[i][j + 1].number) === 0) {
                        newSquare = this.listSquare[i][j + 1];
                        this.isAnimation = true;
                    } else if (j > 0 && Number(this.listSquare[i][j - 1].number) === 0) {
                        newSquare = this.listSquare[i][j - 1];
                        this.isAnimation = true;
                    } else if (i < this.listSquare.length - 1 && Number(this.listSquare[i + 1][j].number) === 0) {
                        newSquare = this.listSquare[i + 1][j];
                        this.isAnimation = true;
                    }
                    if (newSquare !== null) {
                        this.sound.play();
                        if (square.animationStart (newSquare)) {
                            this.count++;
                        }
                        clearInterval(this.intervalGame);
                        this.intervalGame = setInterval(this.drawCanvas.bind(this), 10);
                    }
                    return;
                }
            }
        }
    }
    setDropDefault () {
        this.dropSquare = null;
        this.emptySquare = null;
        this.directionSquare = [0, 0, 0];
    }
    onMoveUp (e) {
        if (this.dropSquare === null)   return;
        this.onClickCanvas(e);
        this.setDropDefault();
    }
    onMouseMove (e) {
        if (this.dropSquare === null)   return;
        let clickX = e.pageX - this.canvas.offsetLeft;
        let clickY = e.pageY - this.canvas.offsetTop;
        if(clickX < this.dropSquare.x || clickX > this.dropSquare.x + this.dropSquare.size ||
            clickY < this.dropSquare.y || clickY > this.dropSquare.y + this.dropSquare.size) {
            if (Math.abs(this.dropSquare.x - this.dropSquare.animX) > 0 || Math.abs(this.dropSquare.y - this.dropSquare.animY) > 0)
                this.sound.play();
            this.dropSquare.setValueDefault();
            this.setDropDefault();
            this.drawCanvas();
            return;
        }
        let newX = this.dropSquare.x + (this.dropSquare.clickX - clickX ) * this.directionSquare[1];
        let newY = this.dropSquare.y + (this.dropSquare.clickY - clickY ) * this.directionSquare[0];
        if (this.directionSquare[1] != 0 && ((this.dropSquare.animX >= newX && this.directionSquare[2] === 1) || (this.dropSquare.animX <= newX && this.directionSquare[2] === -1))) {
           return;
        }
        if (this.directionSquare[0] != 0 && ((this.dropSquare.animY >= newY && this.directionSquare[2] === 1) || (this.dropSquare.animY <= newY && this.directionSquare[2] === -1))) {
            return;
        }
        if (Math.abs(newX - this.dropSquare.animX) <= this.dropSquare.size) {
            this.dropSquare.x = newX;
        }
        if (Math.abs(newY - this.dropSquare.animY) <= this.dropSquare.size) {
            this.dropSquare.y = newY;
        }
        this.dropSquare.clickX = clickX;
        this.dropSquare.clickY = clickY;
        this.drawCanvas();
    }
    onMoveDown (e) {
        if (this.isAnimation) return;
        let clickX = e.pageX - this.canvas.offsetLeft;
        let clickY = e.pageY - this.canvas.offsetTop;
        for(let i = 0; i < this.gameSize; i++) {
            for(let j = 0; j < this.gameSize; j++) {
                let square = this.listSquare[i][j];
                // click in square
                if(clickX >= square.x && clickX <= square.x + square.size &&
                    clickY >= square.y && clickY<= square.y + square.size) {
                    if (i > 0 && Number(this.listSquare[i - 1][j].number) == 0) {
                        this.emptySquare = this.listSquare[i - 1][j];
                        this.directionSquare = [-1, 0, -1];
                    } else if (j < this.listSquare[i].length - 1 && Number(this.listSquare[i][j + 1].number) === 0) {
                        this.emptySquare = this.listSquare[i][j + 1];
                        this.directionSquare = [0, -1, 1];
                    } else if (j > 0 && Number(this.listSquare[i][j - 1].number) === 0) {
                        this.emptySquare = this.listSquare[i][j - 1];
                        this.directionSquare = [0, -1, -1];
                    } else if (i < this.listSquare.length - 1 && Number(this.listSquare[i + 1][j].number) === 0) {
                        this.emptySquare = this.listSquare[i + 1][j];
                        this.directionSquare = [-1, 0, 1];
                    }
                    if (this.emptySquare) {
                        this.listSquare[i][j].clickX = clickX;
                        this.listSquare[i][j].clickY = clickY;
                        this.dropSquare = square;
                    }
                }
            }
        }
    }
    restart () {
        this.setLocalStorageDefault();
        this.createCanvas();
    }
    setLocalStorage () {
        if (this.isGameEnd) { 
            localStorage.removeItem('count');
            localStorage.removeItem('time');
            localStorage.removeItem('listSquare');
            return; 
        }
        localStorage.setItem('count', this.count);
        localStorage.setItem('time', this.time);
        let arrStorage = [];
        for (let i = 0; i < this.listSquare.length; i ++) {
            for (let j = 0; j < this.listSquare[i].length; j++) {
                arrStorage.push(this.listSquare[i][j].number);
            }
        }
        localStorage.setItem('listSquare', JSON.stringify(arrStorage));
    }
    setLocalStorageDefault () {
        localStorage.removeItem('count');
        localStorage.removeItem('time');
        localStorage.removeItem('listSquare');
    }
    getLocalStorage (count = 0, time = 0, arrStorage = null) { 
        if(!arrStorage.length)  return;
        this.count = count;
        this.time = time;
        this.gameSize = arrStorage.length ** 0.5;
        this.canvas.width = sizeSquare * this.gameSize;
        this.canvas.height = sizeSquare * this.gameSize;
        this.createListSquare(arrStorage);
        this.resizeCanvas();
    }
    onSoundsClick () {
        this.sound.changeState();
    }
    newGame (gameSize) {
        this.setLocalStorageDefault();
        this.gameSize = gameSize;
        this.resizeWindows();
        this.canvas.width = sizeSquare * this.gameSize;
        this.canvas.height = sizeSquare * this.gameSize;
        this.createCanvas();
    }
    showScore () {
        this.listScore.showScore();
        clearInterval(this.timeInterval);
    }
    start (e) {
        let isClose = this.listScore.onClosePopUp(e);
        if (isClose) {
            this.gameChoose();
        }
        return isClose;
    }
    gameChoose () {
        if (this.isGameEnd) {
            this.restart();
        }
        else {
            this.timeInterval = setInterval(() => { this.time++; this.timeGame.innerHTML = getTimeFormat(this.time); }, 1000);
        }
    }
    resizeCanvas () {
        this.resizeWindows(this.gameSize);
        this.canvas.width = this.canvas.height = sizeSquare * this.gameSize;
        for(let i = 0; i < this.gameSize; i++) {
            for(let j = 0; j < this.gameSize; j++) {
                this.listSquare[i][j].resizeSquare(sizeSquare, sizeSquare * j, sizeSquare * i);
            }
        }
        this.drawCanvas();
    }
    resizeWindows () {
        if (document.documentElement.clientWidth < 1280) {
            let newWidthCnv = Math.min( (document.documentElement.clientWidth - 20) , 640)  / this.gameSize;
            sizeSquare = newWidthCnv > 80 ? 80 : newWidthCnv;
            sizeText = sizeSquare / 2;
        }
    }
}
function randomPosition(arr) {
    for(let i = 0; i < arr.length; i++) {
        let ranNum = Math.floor(Math.random() * arr.length);
        let item = arr[i];
        arr[i] = arr[ranNum];
        arr[ranNum] = item;
    }
    // check game is true
    let kDisorder = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j <= arr.length; j++) {
            if (arr[i] > arr[j]) kDisorder++;
        }
    }
    arr.push(0);
    if( (kDisorder ) % 2) {
        let t = arr[0];
        arr[0] = arr[1];
        arr[1] = t;
    }
    return arr;
}

export default Game;