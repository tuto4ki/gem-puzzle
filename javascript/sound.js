class Sound {
    constructor () {
        this.AUDIO = new Audio();
        this.AUDIO.volume = 0.2;
        this.isPlay = true;
    }
    play () {
        if (!this.isPlay) return;
        this.AUDIO.src = './assets/soundMove.mp3';
        this.AUDIO.play();
    }
    changeState () {
        this.isPlay = !this.isPlay;
    }
}

export default Sound;