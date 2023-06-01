class Square {
    constructor (number, x, y, size) {
        this.number = number;
        this.x = x;
        this.y = y;
        this.size = size;
        this.isAnimation = false;
        this.animX = x;
        this.animY = y;
        this.clickX = 0;
        this.clickY = 0;
    }
    changeAnimation() {
        if(this.animX != this.x) {
            if (Math.abs(this.x - this.animX) <= this.size / 10) {
                this.x = this.animX;
                this.isAnimation = false;
            }
            else {
                this.x = this.x > this.animX ? this.x - this.size / 10 : this.x + this.size / 10;
            }
        }
        else {
            if (Math.abs(this.y - this.animY) <= this.size / 10) {
                this.y = this.animY;
                this.isAnimation = false;
            }
            else {
                this.y = this.y > this.animY ? this.y - this.size / 10 : this.y + this.size / 10;
            }
        }
    }
    animationStart (newSquare) {
        this.clickX = this.clickY = 0;
        if ((this.animX === this.x && this.animY === this.y) || (Math.abs(this.animX - this.x) > this.size / 2) || 
                (Math.abs(this.animY - this.y) > this.size / 2)) {
            let t = newSquare.number;
            newSquare.number = this.number;
            this.number = t;
            newSquare.isAnimation = true;
            newSquare.x = this.x;
            newSquare.y = this.y;
            this.x = this.animX;
            this.y = this.animY;
            return true;
        }
        this.isAnimation = true;
        this.x = this.animX;
        this.y = this.animY;
        return false;
    }
    setValueDefault () {
        this.clickX = 0;
        this.clickY = 0;
        this.x = this.animX;
        this.y = this.animY;
    }
    resizeSquare (size, x, y) {
        this.size = size;
        this.x = this.animX = x;
        this.y = this.animY = y;
    }
    drawCanvas (ctx, sizeText, sizeSquare) {
        ctx.beginPath();
        ctx.fillStyle = '#ffc53b';
        ctx.fillRect(this.x+1, this.y+1, this.size-2, this.size - 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = `${sizeText}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(this.number, this.x + sizeSquare / 2, this.y + 1.3*sizeText);
        ctx.fill();
        ctx.closePath();
    }
}

export default Square;