import Game from './game.js';
import PopUp from './popUp.js';

(function () {
    let canvas = document.createElement('canvas');
    canvas.classList.add('canvas-game');
    let canvasPopUp = document.createElement('canvas');
    canvasPopUp.classList.add('canvas-popup');
    canvasPopUp.addEventListener('click', (e) => { 
        if (game.start(e)) {
            document.querySelector('.game-play').classList.remove('opacity');
            document.querySelector('.game-play').classList.remove('hidden');
        }
    });
    let divWrapper = document.createElement('div');
    divWrapper.classList.add('wrapper');
    let div = document.createElement('div');
    div.classList.add('game-play');
    divWrapper.append(canvasPopUp);
    let divNav = document.createElement('div');
    divNav.classList.add('navigation');
    // reload game
    let reloadBtn = document.createElement('div');
    reloadBtn.classList.add('reload-button');
    reloadBtn.innerHTML = 'Reload';
    reloadBtn.addEventListener('click', () => { game.restart(); });
    divNav.append(reloadBtn);
    
    // save game
    let saveBtn = document.createElement('div');
    saveBtn.classList.add('save-button');
    saveBtn.addEventListener('click', setLocalStorage);
    saveBtn.innerHTML = 'Save';
    divNav.append(saveBtn);
    div.append(divNav);
    // list score
    let scoreBtn = document.createElement('div');
    scoreBtn.classList.add('score-button');
    scoreBtn.innerHTML = 'Score';
    scoreBtn.addEventListener('click', () => {
        popUpScore.addClassPopUp();
        game.showScore();
    });
    divNav.append(scoreBtn);
    // sounds
    let divState = document.createElement('div');
    divState.classList.add('game-state');
    let soundsButton = document.createElement('div');
    soundsButton.classList.add('sounds-button');
    soundsButton.addEventListener('click', onSoundsClick);
    soundsButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M832 352v1088q0 26-19 45t-45 19-45-19l-333-333h-262q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h262l333-333q19-19 45-19t45 19 19 45zm384 544q0 76-42.5 141.5t-112.5 93.5q-10 5-25 5-26 0-45-18.5t-19-45.5q0-21 12-35.5t29-25 34-23 29-36 12-56.5-12-56.5-29-36-34-23-29-25-12-35.5q0-27 19-45.5t45-18.5q15 0 25 5 70 27 112.5 93t42.5 142zm256 0q0 153-85 282.5t-225 188.5q-13 5-25 5-27 0-46-19t-19-45q0-39 39-59 56-29 76-44 74-54 115.5-135.5t41.5-173.5-41.5-173.5-115.5-135.5q-20-15-76-44-39-20-39-59 0-26 19-45t45-19q13 0 26 5 140 59 225 188.5t85 282.5zm256 0q0 230-127 422.5t-338 283.5q-13 5-26 5-26 0-45-19t-19-45q0-36 39-59 7-4 22.5-10.5t22.5-10.5q46-25 82-51 123-91 192-227t69-289-69-289-192-227q-36-26-82-51-7-4-22.5-10.5t-22.5-10.5q-39-23-39-59 0-26 19-45t45-19q13 0 26 5 211 91 338 283.5t127 422.5z" fill="#fff"></path></svg>'
    divState.append(soundsButton);
    // choose size game
    let sizeGameSelect = document.createElement('select');
    sizeGameSelect.innerHTML = '<option value="3">3x3</option><option value="4">4x4</option><option value="5">5x5</option><option value="6">6x6</option><option value="7">7x7</option><option value="8">8x8</option>';
    sizeGameSelect.addEventListener('change', onChangeSizeValue);
    divState.append(sizeGameSelect);
    div.append(divState);
    // moves and time
    let gameStatistics = document.createElement('div');
    gameStatistics.classList.add('game-statistics');
    let movesDiv = document.createElement('div');
    movesDiv.innerHTML = '<span>Moves: </span><span id="moves"></span>'
    let timeDiv = document.createElement('div');
    timeDiv.innerHTML = '<span>Time: </span><span id="time"></span>';
    gameStatistics.append(movesDiv);
    gameStatistics.append(timeDiv);
    div.append(gameStatistics);
    div.append(canvas);
    divWrapper.append(div);
    document.body.append(divWrapper);
    // score list and popup
    let popUpScore = new PopUp(canvasPopUp);
    let game = new Game(canvas, document.querySelector('#moves'), document.querySelector('#time'));
    game.createCanvas();
    
    //window.addEventListener('beforeunload', setLocalStorage);
    window.addEventListener('load', getLocalStorage);
    window.addEventListener('resize', resizeScreen);
    window.addEventListener('click', (e) => {onClickPopUp(e);});

    function onSoundsClick () {
        soundsButton.classList.toggle('sounds-button-none');
        game.onSoundsClick();
    }
    function onChangeSizeValue () {
        game.newGame(Number(sizeGameSelect.value));
    }
    function getLocalStorage () {
        if (localStorage.getItem('listScore')) {
            popUpScore.listScore = JSON.parse(localStorage.getItem('listScore'));
        }
        if(localStorage.getItem('count')) { 
            let squaresArray = JSON.parse(localStorage.getItem('listSquare'));
            game.getLocalStorage(localStorage.getItem('count'), localStorage.getItem('time'), squaresArray);
        }
        sizeGameSelect.value = game.gameSize;
        game.listScore = popUpScore;
    }
    function setLocalStorage() {
        game.setLocalStorage();
    }
    function resizeScreen () {
        game.resizeCanvas();
    }
    function onClickPopUp(e) {
        if (canvasPopUp.classList.contains('active')) {
            if (e.target == document.querySelector('body')) {
                popUpScore.changeClassPopUp();
                game.gameChoose();
            }
        }
    }
})();