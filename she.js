const BOX = { WIDTH: 20, HEIGHT: 20 };
let snake = [];
const DIR = {
    DIR_RIGHT: 1,
    DIR_LEFT: 2,
    DIR_TOP: 3,
    DIR_BOTTOM: 4
};
let dir = DIR.DIR_RIGHT;
let food = null;
let timer;
let  foodDisappearTimer;
let  foodAppearTimer;
let  beginOrPuase = true;
const isPauseGame = document.getElementById('playAndPauseGame');
let  checkIsPauseGame = false;
const isPauseBgm = document.getElementById('playAndPauseBgm');
let  checkIsPauseBgm = false;
const isPauseSoundEffects = document.getElementById('playAndPauseSoundEffects');
let  checkIsPauseSoundEffects = false;
const contain = document.getElementById("container");
window.onload = () => {
    createFood();
    createSnake();
    isPauseGame.onclick = () => {
        checkIsPauseGame = !checkIsPauseGame;
        checkIsPauseGame === true ? gameBegin() : gamePuase();
    }
    document.onkeyup = function (e) {
        switch (e.key) {
            case 'ArrowUp':
                if (dir != DIR.DIR_BOTTOM) {  
                    dir = DIR.DIR_TOP;
                }
                break;
            case 'ArrowDown':
                if (dir != DIR.DIR_TOP) {
                    dir = DIR.DIR_BOTTOM;
                }
                break;
            case 'ArrowLeft':
                if (dir != DIR.DIR_RIGHT) {
                    dir = DIR.DIR_LEFT;
                }
                break;
            case 'ArrowRight':
                if (dir != DIR.DIR_LEFT) {
                    dir = DIR.DIR_RIGHT;
                }
                break;
            case 'Enter':
                if(beginOrPuase){
                    gamePuase();
                    beginOrPuase = false;
                }
                else {
                    gameBegin();
                    beginOrPuase = true;
                }
               break;
        }
    }
    ranks(snake.length - 5);
    changeBgm();
    
};
eatFoodBgm = () => {
        eatBgmAudio.play();
}
changeBgm = () => {
    const ensureChangeBgmButton = document.getElementById('ensureChangeBgm');
    ensureChangeBgmButton.onclick = () => {
        let bgmChangeIndex = bgmChange.selectedIndex;
        let newBgm = bgmChange.options[bgmChangeIndex].value;
        bgmAudio.src = newBgm;
        bgmAudio.play();
    }
}
controlBgm = () => {
    bgmAudio.play();
    isPauseBgm.onclick = () =>{

        checkIsPauseBgm = !checkIsPauseBgm;

        if(checkIsPauseBgm){
            bgmAudio.play();
            isPauseBgm.style.background = 'url(resources/icon/bgm-on.svg) no-repeat center center/30px 30px';
        }
        else {
            bgmAudio.pause();
            isPauseBgm.style.background = 'url(resources/icon/bgm-off.svg) no-repeat center center/30px 30px';
        }   
    };
    isPauseSoundEffects.onclick = () => {
        checkIsPauseSoundEffects = !checkIsPauseSoundEffects;
        if(checkIsPauseSoundEffects){
            isPauseSoundEffects.style.background = 'url(resources/icon/music-on.svg) no-repeat center center/30px 30px';
        }
        else {

            isPauseSoundEffects.style.background = 'url(resources/icon/music-off.svg) no-repeat center center/30px 30px';
        }
    }

}
isInSnakeBody = (left, top) => {
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].offsetTop == top && snake[i].offsetLeft == left) {
            return true;
        }
    }
};
createFood = () => {
    food = document.createElement("span");
    food.className = "node food";    
    var left, top;
    do {
        left = Math.floor((contain.offsetWidth - 10) / BOX.WIDTH * Math.random()) * BOX.WIDTH;
        top = Math.floor((contain.offsetHeight - 10) / BOX.HEIGHT * Math.random()) * BOX.HEIGHT;
    } while (isInSnakeBody(left, top));
    food.style.left = left + "px";
    food.style.top = top + "px";
    contain.appendChild(food);
};
createSnake = () => {
    var newBody = null;
    var left, top;
    const directionOfSnake = Math.floor(Math.random()*10);
    if(directionOfSnake >= 0 && directionOfSnake <= 4){
        left = Math.floor((contain.offsetWidth - 10 - 4 * BOX.WIDTH) / BOX.WIDTH * Math.random()) * BOX.WIDTH;
        top = Math.floor((contain.offsetHeight - 10) / BOX.HEIGHT * Math.random()) * BOX.HEIGHT;
        for (var i = 1; i <= 5; i++) {
            newBody = document.createElement("span");
            newBody.className = 'node body';
            newBody.style.left = left + "px";
            newBody.style.top = top + "px";
            if (i == 5) {
                newBody.className = 'node head';
            }
            contain.appendChild(newBody);
            snake.push(newBody);
            left += 20;
        }
    }
    else {
        left = Math.floor((contain.offsetWidth - 10 ) / BOX.WIDTH * Math.random()) * BOX.WIDTH;
        top = Math.floor((contain.offsetHeight - 10 -4 * BOX.HEIGHT) / BOX.HEIGHT * Math.random()) * BOX.HEIGHT;
        for (var i = 1; i <= 5; i++) {
            newBody = document.createElement("span");
            newBody.className = 'node body';
            newBody.style.left = left + "px";
            newBody.style.top = top + "px";
            if (i == 5) {
                newBody.className = 'node head';
            }
            contain.appendChild(newBody);
            snake.push(newBody);
            top += 20;
        }
    }
 
}
getSnakeHead = () => {
    return snake[snake.length - 1] ;
}
isEatSelf = (newLeft,newTop) => {;
    return snake.slice(0,snake.length - 1).some(body =>
    {return body.offsetLeft === newLeft && body.offsetTop == newTop});
}
gameOver = () => {
    clearInterval(timer);
    ranks(rankScores(snake.length - 5));
    const mask = document.getElementById('mask');
    const settlementPanel = document.getElementById('settlementPanel');
    mask.className += ' show';
    settlementPanel.style.display = 'block';
    lastScore.innerHTML = snake.length - 5;
    bgmAudio.pause();
    initReStart();
}
throughWall = (newLeft,newTop) => {
    let head = getSnakeHead();
    if(newLeft > contain.offsetWidth - 10 - 6) {
        head.style.left = '0px';
    }
    else if (newLeft < 0) {
        head.style.left = '280px';
    }
    else if (newTop > contain.offsetHeight - 10 - 6){
        head.style.top = '0px';
    }
    else if (newTop < 0 ){
        head.style.top = '280px';
    }

}
moveHead = (head,newLeft,newTop) => {
    head.style.left = newLeft + "px";
    head.style.top = newTop + "px";
}
isEatFood = (newLeft,newTop) => {
    const head = getSnakeHead();
    return (((newLeft + head.offsetWidth) > food.offsetLeft) && 
        (newTop < (food.offsetTop + food.offsetHeight) ) &&
        (newLeft < (food.offsetLeft + food.offsetWidth) ) &&
        ((newTop + head.offsetHeight) > food.offsetTop)
    )
}
foodPush = () => {
    food.className =  getSnakeHead().className;
    getSnakeHead().className = 'node body';
    !checkIsPauseSoundEffects && eatFoodBgm();
    snake.push(food); 
    getSnakeHead().style.opacity = '1';
    truescore.innerHTML = snake.length - 5;
    createFood();
    return;
}
getLocation = (newLeft,newTop) => {
    switch (dir) {
        case DIR.DIR_LEFT: 
        return {
            newLeft : newLeft - BOX.WIDTH,
            newTop : newTop,
        }; 
        case DIR.DIR_RIGHT:
        return {
            newLeft: newLeft + BOX.WIDTH,
            newTop : newTop,
        };
        case DIR.DIR_TOP:
        return {
            newLeft : newLeft,
            newTop: newTop - BOX.HEIGHT,
        };
        case DIR.DIR_BOTTOM:
        return {
            newLeft : newLeft,
            newTop : newTop + BOX.HEIGHT,
        };
        default: break;
    }
}
rankScores = (score) => {
    let scores = JSON.parse(localStorage.getItem('scores'));
    if(!scores) {
        scores = [score,0,0];
    }
    scores = [...scores, score].sort((a,b) => (b - a)).slice(0,3);
    localStorage.setItem('scores',JSON.stringify(scores));
    return  scores;
}
ranks = (scores) => {
    firstscore.innerHTML = "第一名" + scores[0] + "分";
    secondscore.innerHTML = "第二名" + scores[1] + "分";
    thirdscore.innerHTML = "第三名" + scores[2] + "分";
}
moveBody = () => {
    for (let i = 0; i < snake.length - 1; i++) {
        snake[i].style.top = snake[i + 1].offsetTop+ "px";
        snake[i].style.left = snake[i + 1].offsetLeft  + "px";
    }
}
snakeMove = () => {
    const {offsetTop:top ,offsetLeft:left} = getSnakeHead();
    const newTop = top, newLeft = left;
    const obj = getLocation(newLeft,newTop);
    isEatSelf(obj.newLeft,obj.newTop) && gameOver();
    moveBody();
    isEatFood(obj.newLeft,obj.newTop) && foodPush();
    moveHead(getSnakeHead(),obj.newLeft,obj.newTop);
    throughWall(obj.newLeft,obj.newTop);
 
}
initReStart = () => {
    const reStartButton = document.getElementById('reStartButton');
    reStartButton.onclick = () => {
        window.location.reload();
    }
}
foodFlashing = () => {
    clearInterval(foodDisappearTimer);
    foodDisappearTimer = setInterval(function(){
        food.style.opacity = '0';
    },300);
    clearInterval(foodAppearTimer);
    foodAppearTimer = setInterval(function(){
        food.style.opacity = '1';
    },600);
}
gameBegin = () => {
    clearInterval(timer);
    let spaceIndex = spaces.selectedIndex;
    let newSpace = spaces.options[spaceIndex].value;
    timer = setInterval(snakeMove, newSpace);
    controlBgm ();
    foodFlashing();
    isPauseGame.style.background = 'url(resources/icon/play.svg) no-repeat center center/40px 40px';
}
gamePuase = () => {
    clearInterval(timer);
    bgmAudio.pause();
    clearInterval(foodDisappearTimer);
    clearInterval(foodAppearTimer);
    isPauseGame.style.background = 'url(resources/icon/pause.svg) no-repeat center center/40px 40px';
}