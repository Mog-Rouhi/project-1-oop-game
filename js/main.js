class Game {
    constructor(){
        this.player = null;
        this.guards = [];
        this.boxPosition = [];
        
        const box3 = document.getElementById("item3");
        const box4 = document.getElementById("item4");
        const box8 = document.getElementById("item8");
        this.boxes = [box3, box4, box8];
        
        const cave = document.getElementById("grid-container");
        box3.style.width = cave.width/3 + "px";
        box3.style.height = cave.height/3 + "px";
    }

    start(){
        this.player = new Player();

        this.attachEventListeners();
        this.detectCollision();
        this.getBoxPosition("item3");
        this.getBoxPosition("grid-container");
    }

    attachEventListeners(){
        document.addEventListener("keydown", (event) => {
            if(event.key === "ArrowLeft"){
                this.player.moveLeft();
            }else if(event.key === "ArrowRight"){
                this.player.moveRight();
            }else if(event.key === "ArrowUp"){
                this.player.moveUp();
            }else if(event.key === "ArrowDown"){
                this.player.moveDown();
            }
        });
    }

    getBoxPosition(id){
        let elem = document.getElementById(`${id}`);
        let rect = elem.getBoundingClientRect();
        console.log("x: "+ rect.x);
        console.log("y: "+ rect.y);
        this.boxPosition = [rect.x, rect.y]
        return this.boxPosition;
    }

    detectCollision(){
        if (
            this.player.positionX < this.boxPosition[0] + this.boxes[0].width &&
            this.player.positionX + this.player.width > this.boxPosition[0] &&
            this.player.positionY < this.boxPosition[1] + this.boxes[0].height &&
            this.player.height + this.player.positionY > this.boxPosition[1]
        ) {
            console.log("game over....")
            location.href = 'gameover.html';
        }
    }
}


// player

class Player {
    constructor(){
        this.width = 50;
        this.height = 30;
        this.positionX = 0;
        this.positionY = 300;

        this.domElement = null;
        this.createDomElement();
    }

    createDomElement(){
        this.domElement = document.createElement("div");
        this.domElement.id = "sam";
        this.domElement.style.width = this.width + "px";
        this.domElement.style.height = this.height + "px";
        this.domElement.style.left = this.positionX + "px";
        this.domElement.style.bottom = this.positionY + "px";
        const boardElm = document.getElementById("grid-container");
        boardElm.appendChild(this.domElement);
    }

    moveLeft(){
        if (this.positionX < 0){
            this.domElement.style.left = 0 + "px";
        } else {
            this.positionX -= 5;
            this.domElement.style.left = this.positionX + "px";
        }      
    } 

    moveRight(){
        if (this.positionX > 767){
            this.domElement.style.left = 767 + "px";
        } else {
            this.positionX += 5;
            this.domElement.style.left = this.positionX + "px";
        }
    }

    moveUp(){
        if (this.positionY > 334){
            this.domElement.style.bottom = 334 + "px";
        } else {
            this.positionY += 5;
            this.domElement.style.bottom = this.positionY + "px";
        }
    }

    moveDown(){
        if (this.positionY < 34){
            this.domElement.style.bottom = 34 + "px";
        } else {
            this.positionY -= 5;
            this.domElement.style.bottom = this.positionY + "px";
        }
    }
}

// guards

class Guards {

}


const game = new Game();
game.start();
