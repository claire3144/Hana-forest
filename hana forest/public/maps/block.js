export class Block{
    constructor(x,y,width,height, name){
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.name = name;
    }


    drawObstacle(ctx, color){
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}