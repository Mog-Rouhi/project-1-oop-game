class Game {
    constructor(){
        this.player = null;
        this.bubble = null;
        this.guardsArr = [];
        this.boxPosition = [];
        this.planks = [];
        this.score = 0;
        this.interval1;

        this.timer; 
        this.timeLeft = 20;
        
        const box3 = document.getElementById("item3");
        const box4 = document.getElementById("item4");
        const box8 = document.getElementById("item8");
        this.boxes = [box3, box4, box8];
        
        const cave = document.getElementById("grid-container");
        box3.style.width = cave.width/3 + "px";
        box3.style.height = cave.height/3 + "px";
    }

    start(){

        var audio = new Audio("./audio/background-music.wav");
        audio.play();

        this.player = new Player();

        const newGuard = new Guards();
        this.guardsArr.push(newGuard);
        
        this.attachEventListeners();

        const firstPlankton = new Plankton();
        this.planks.push(firstPlankton);
        
        const secondPlankton = new Plankton();
        this.planks.push(secondPlankton);

        const thirdPlankton = new Plankton();
        this.planks.push(thirdPlankton);

        this.timeCountDown();
              
        this.guardsArr.forEach((newGuard) => {
        this.moveBack(newGuard);

       this.interval1 = setInterval(() => {
            this.detectCollisionGuard(newGuard);
            this.detectCollisionBox();
            });
        }, 60);

        setInterval(() => {
            this.planks.forEach((plankInstance) => {          
                if(this.detectCollisionWithPlank(plankInstance)){
                    this.removePlank(plankInstance);
                    this.totalScore();
                }
            })
        }, 100);

        setInterval(() => {
            if(this.player.positionX > 390 && this.player.positionY > 230){
                setInterval(() => {
                    const follow = document.querySelector("#follow-guard");
                    follow.style.bottom = this.player.positionY + "px";
                    follow.style.left = this.player.positionX + "px";
                    setTimeout(() =>{
                    location.href = 'gameover.html';
                    }, 100)
                }, 100)               
              }
            }, 60);

        setInterval(() => {
            this.detectCollisionShootTarget()
          }, 60)
    }

    detectCollisionShootTarget(){
            let target1 = document.getElementById("follow-guard");
            let target2 = document.getElementById("door-guard");
            let shoot = document.querySelector("#bubble");

            let positionXShoot = Number(shoot.style.left.replace("px", ""));
            let positionYShoot = Number(shoot.style.bottom.replace("px", ""));

            let positionXTarget1 = 0;
            let positionYTarget1 = 0;

            let positionXTarget2 = 0;
            let positionYTarget2 = 0;

            if (target1){
                positionXTarget1 = Number(target1.style.left.replace("px", ""));
                positionYTarget1 = Number(target1.style.bottom.replace("px", ""));
            }
            if (target2){
                positionXTarget2 = Number(target2.style.left.replace("px", ""));
                positionYTarget2 = Number(target2.style.bottom.replace("px", ""));
            }
            if (
                positionXShoot < positionXTarget1 + 50 &&
                positionXShoot + 50 > positionXTarget1 &&
                positionYShoot < positionYTarget1 + 30 &&
                30 + positionYShoot > positionYTarget1 &&
                shoot.style.display === "block"
            ) {
                shoot = document.querySelector("#bubble");
                target1.remove();
                this.totalScore();
            }
            if (
                positionXShoot < positionXTarget2 + 50 &&
                positionXShoot + 50 > positionXTarget2 &&
                positionYShoot < positionYTarget2 + 30 &&
                30 + positionYShoot > positionYTarget2 &&
                shoot.style.display === "block"
            ) {
                shoot = document.querySelector("#bubble");
                target2.remove();
                clearInterval(this.interval1);
                this.totalScore();
            }    
        } 
        

    timeCountDown(){
        let timer = document.getElementById("timer");
        this.timer = setInterval(() => {
            this.timeLeft--;
            if(this.timeLeft > 0 && this.player.positionX < 760){
                timer.innerText = this.timeLeft;
            }
            if(this.player.positionX >= 760 && this.timeLeft > 0){ 
                const winAlert = document.getElementById("win-alert")
                let win = new Audio("./audio/win.wav");
                win.play();
                winAlert.style.display = "block";
                cancelInterval(this.timer);
            }
            if(this.player.positionX < 770 && this.timeLeft === 0){
                location.href = 'gameover.html';
                cancelInterval(this.timer);
            }
        }, 1000);        
    }

    moveBack(newGuard){
        let time = 0;
        const intervalIdUp = setInterval(()=>{
        newGuard.moveGuardUp();
        time++;
        if(time === 60){
        clearInterval(intervalIdUp)
        let count = 0;
        const intervalIdDown = setInterval(()=>{
            newGuard.moveGuardDown();
            count++;
            if(count === 60){
               clearInterval(intervalIdDown)
               this.moveBack(newGuard);
            }
        },20)
        }
    },20);
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

        document.addEventListener("keydown", (e) => {
            if(
                e.key == " " ||
                e.code == "Space" ||      
                e.keyCode == 32 
            ){
                let shoot = document.getElementById("bubble");
                shoot.style.display = "block";
                var audio = new Audio("./audio/bubbling.wav");
                audio.play();
            }             
        })  

         document.addEventListener("keyup", (e) => {
            if(
                e.key == " " ||
                e.code == "Space" ||      
                e.keyCode == 32 
            ){
                let shoot = document.getElementById("bubble");
                shoot.style.display = "none";}            
        })     
    }

    detectCollisionBox(){
        //horizontal walls
        if (this.player.positionX >= 0 && this.player.positionX < 270 && this.player.positionY < 270)
        {this.player.positionY = 270;}
        if (this.player.positionX >= 270 && this.player.positionX < 530 && this.player.positionY < 150)
        {this.player.positionY = 150;}
        if (this.player.positionX >= 530 && this.player.positionX < 800 && this.player.positionY > 225)
        {this.player.positionY = 225;}
        // vertical walls    
        if (this.player.positionY < 270 && this.player.positionY >= 150 && this.player.positionX < 290)
        {this.player.positionX = 290;}
        if (this.player.positionY < 150 && this.player.positionY > 0 && this.player.positionX < 540)
        {this.player.positionX = 540;}
        if (this.player.positionY > 230 && this.player.positionY < 400 && this.player.positionX > 480)
        {this.player.positionX = 480;}
    }   

    detectCollisionGuard(newGuard){
        if (
            this.player.positionX < newGuard.positionX + newGuard.width &&
            this.player.positionX + this.player.width > newGuard.positionX &&
            this.player.positionY < newGuard.positionY + newGuard.height &&
            this.player.height + this.player.positionY > newGuard.positionY
        ) {
            location.href = 'gameover.html';
        }
    }

    detectCollisionWithPlank(plankInstance){
        if (
            this.player.positionX < plankInstance.positionX + plankInstance.width &&
            this.player.positionX + this.player.width > plankInstance.positionX &&
            this.player.positionY < plankInstance.positionY + plankInstance.height &&
            this.player.height + this.player.positionY > plankInstance.positionY
        ) {
            return true;
        }else{
            return false;
        }
    }

    removePlank(plankInstance){
            plankInstance.domElement.remove();
            var coin = new Audio("./audio/planki.wav");
            coin.play();
            this.planks.splice(this.planks.indexOf(plankInstance), 1);     
        }

    totalScore(){
        let scoreText = document.getElementById("score");
                this.score += 500;
                scoreText.innerText = this.score;
                console.log(this.score);
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
        this.domElement2 = null;
        this.createDomElement();
    }

    createDomElement(){
        this.domElement = document.createElement("div");
        this.domElement2 = document.createElement("div");
        this.domElement.id = "sam";
        this.domElement2.id = "bubble"
        this.domElement2.style.display = "none";
        this.domElement.style.width = this.width + "px";
        this.domElement2.style.width = this.width  + "px";

        this.domElement.style.height = this.height + "px";
        this.domElement2.style.height = this.height  + "px";

        this.domElement.style.left = this.positionX + "px";
        this.domElement2.style.left = this.positionX + 100 + "px";

        this.domElement.style.bottom = this.positionY + "px";
        this.domElement2.style.bottom = this.positionY + "px";

        const boardElm = document.getElementById("grid-container");
        boardElm.appendChild(this.domElement);
        boardElm.appendChild(this.domElement2);
    }

    moveLeft(){
        if (this.positionX < 0){
            this.domElement.style.left = 0 + "px";
        } else {
            this.positionX -= 5;
            this.domElement.style.left = this.positionX + "px";
            this.domElement2.style.left = this.positionX + 100 + "px";

        } 
        return this.positionX;   
    } 

    moveRight(){
        if (this.positionX > 767){
            this.domElement.style.left = 767 + "px";
        } else {
            this.positionX += 5;
            this.domElement.style.left = this.positionX + "px";
            this.domElement2.style.left = this.positionX + 100 + "px";
        }
        return this.positionX;
    }

    moveUp(){
        if (this.positionY > 334){
            this.domElement.style.bottom = 334 + "px";
        } else {
            this.positionY += 5;
            this.domElement.style.bottom = this.positionY + "px";
            this.domElement2.style.bottom = this.positionY + "px";
        }
        return this.positionY;
    }

    moveDown(){
        if (this.positionY < 34){
            this.domElement.style.bottom = 34 + "px";
        } else {
            this.positionY -= 5;
            this.domElement.style.bottom = this.positionY + "px";
            this.domElement2.style.bottom = this.positionY + "px";
        }
        return this.positionY;
    } 
}


// guards

class Guards {
    constructor(){
        this.width = 50;
        this.height = 30;
        this.positionX = 670;
        this.positionXX = 490;
        this.positionY = 40;
        this.positionYY = 330;
        this.domElement = null;
        this.domElement2 = null;
        this.createDomElement();        
    }

    createDomElement(){
        this.domElement = document.createElement('div');
        this.domElement2 = document.createElement('div');

        this.domElement.className = "guards";
        this.domElement2.className = "guards";
        this.domElement.id = "door-guard";
        this.domElement2.id = "follow-guard";

        this.domElement.style.width = this.width + "px";
        this.domElement2.style.width = this.width + "px";

        this.domElement.style.height = this.height + "px";
        this.domElement2.style.height = this.height + "px";

        this.domElement.style.bottom = this.positionY + "px";
        this.domElement2.style.bottom = this.positionYY + "px";

        this.domElement.style.left = this.positionX + "px";
        this.domElement2.style.left = this.positionXX + "px";

        const boardElm = document.getElementById("grid-container");
        boardElm.appendChild(this.domElement);  
        boardElm.appendChild(this.domElement2);     
    }

   moveGuardUp(){
        this.positionY += 3;
        this.domElement.style.bottom = this.positionY + "px";
        return this.positionY;
    }

    moveGuardDown(){
        this.positionY -= 3;
        this.domElement.style.bottom = this.positionY + "px";
        return this.positionY;
    }
}  


// planktons

class Plankton {
    constructor(){
        this.width = 40;
        this.height = 20;
        this.positionX = Math.round(Math.random() * 100 + 400);
        this.positionY = Math.round(Math.random() * 100 + 240);

        this.domElement = null;
        this.createPlanktonDom();
    }

    createPlanktonDom(){
    this.domElement = document.createElement('div');
    this.domElement.className = "plank";
    this.domElement.style.width = this.width + "px";
    this.domElement.style.height = this.height + "px";
    this.domElement.style.bottom = this.positionY + "px";
    this.domElement.style.left = this.positionX + "px";
    const boardElement = document.getElementById("grid-container");
    boardElement.appendChild(this.domElement);
    }    
}

const game = new Game();
game.start();
