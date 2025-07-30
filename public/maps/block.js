export class Block {
    constructor(x, y, width, height, name, action = null,message=null ,imageSrc = null, key = -1) {
        this.x = x;
        this.y = y;
        this.width = width; 
        this.height = height;
        this.name = name;
        this.imageSrc = imageSrc;
        this.img = new Image()
        this.imgLoaded = false;
        this.message = message;
        this.action =  action;
        this.key = key
    }

    loadObj(){
        this.imgLoaded = false;
        this.img.onload = () =>{
            this.imgLoaded = true;
        };
        this.img.src = this.imageSrc;
    }
    drawObj(ctx){
        if(this.imgLoaded)
            ctx.drawImage(this.img,this.x,this.y, this.width, this.height)

    }
        drawObstacle(ctx, color){
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}
