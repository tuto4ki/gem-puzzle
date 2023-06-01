import getTimeFormat from './module.js';
class Score {
	constructor (score, time) {
		this.score = score;
		this.time = time;
	}
}
class PopUp {
	constructor (canvas, listScore = []) {
		this.canvas = canvas;
		this.canvas.width = 300;
		this.canvas.height = 300;
		this.ctx = canvas.getContext("2d");
		this.listScore = listScore;
	}
	addInListScore (score, time) {
		let item = new Score(score, time);
		this.showGraduate (item);
		if (this.listScore.length === 0) {
			this.listScore.push(item);
		}
		else {
			let flag = this.listScore.length;
			for(let i = 0; i < this.listScore.length; i++) {
				if (Number(this.listScore[i].score) > Number(item.score)){
					this.listScore.splice( i, 0, item );
					break;
				}
				if (Number(this.listScore[i].score) == Number(item.score)) {
					if (Number(this.listScore[i].time) >= Number(item.time)) {
						this.listScore.splice( i, 0, item );
						break;
					}
				}
			}
			if (flag === this.listScore.length) {
				this.listScore.push(item);
			}
		}
		this.listScore = this.listScore.length > 10 ? this.listScore.splice(0, 10) : this.listScore;
		this.setLocalStorage();
	}
	setLocalStorage () {
		if (this.listScore.length === 0)	return;
		localStorage.setItem('listScore', JSON.stringify(this.listScore));
	}
	showScore () {
		this.drawPopUp();
		if (this.listScore.length == 0)
			this.ctx.fillText('No score', 300 / 2, 30);
		else {
			this.ctx.fillText('Score', 300 / 2, 30);
			this.ctx.textAlign = 'left';
			for (let i = 0; i < this.listScore.length; i++) {
				this.ctx.fillText(`${i+1}. ${this.listScore[i].score} ${getTimeFormat(this.listScore[i].time)}`, 20, 30 + 25 * (i + 1));
			}
		}
		this.ctx.fill();
		this.ctx.closePath();
	}
	showGraduate (item) {
		this.addClassPopUp();
		this.drawPopUp();
		this.ctx.fillText(`Hooray! You solved the puzzle`, 300/ 2, 120);
		this.ctx.fillText(`in ${getTimeFormat(item.time)} and ${item.score} moves!`, 300 / 2, 160);
	}
	drawPopUp () {
		this.canvas.classList.toggle('active');
		this.ctx.clearRect(0, 0, 300, 300);
		// button close
		this.ctx.moveTo(275, 10);
		this.ctx.lineTo(290, 25);
		this.ctx.lineWidth = 3;
		this.ctx.strokeStyle = "#ff0000";
		this.ctx.lineCap = "round";
		this.ctx.stroke();
		this.ctx.moveTo(290, 10);
		this.ctx.lineTo(275,25);
		this.ctx.lineWidth = 3;
		this.ctx.strokeStyle = "#ff0000";
		this.ctx.lineCap = "round";
		this.ctx.stroke();
        this.ctx.beginPath();
		this.ctx.fillStyle = '#ffffff';
		this.ctx.font = `20px Arial`;
		this.ctx.textAlign = 'center';
	}
	onClosePopUp (e) { 
		let clickX = e.pageX - this.canvas.offsetLeft;
		let clickY = e.pageY - this.canvas.offsetTop;
		if (clickX >= 270 && clickX <= 295 && clickY >= 5 && clickY <= 30) {
			this.changeClassPopUp();
			return true;
		}
		return false;
	}
	changeClassPopUp () {
		document.querySelector('.game-play').classList.toggle('opacity');
		document.querySelector('.game-play').classList.toggle('hidden');
		this.canvas.classList.toggle('active');
	}
	addClassPopUp () {
		document.querySelector('.game-play').classList.add('opacity');
        setTimeout(() => {
			document.querySelector('.game-play').classList.add('hidden');
		}, 500);
	}
}

export default PopUp;