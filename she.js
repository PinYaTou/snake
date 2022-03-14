const BOX = { WIDTH: 20, HEIGHT: 20 };
var snake = [];
var DIR = {
    DIR_RIGHT: 1,
    DIR_LEFT: 2,
    DIR_TOP: 3,
    DIR_BOTTOM: 4
};
var dir = DIR.DIR_RIGHT;
var food = null;
var timer;
var eatBgm = true;
var start = document.getElementById('start');
var pause = document.getElementById('pause');
var con = document.getElementById("container");
window.onload = () => {
    createFood();
    createSnake();
    start.onclick = () => {
        clearInterval(timer);
        let spaceIndex = spaces.selectedIndex;
        let newSpace = spaces.options[spaceIndex].value;
        timer = setInterval(snakeMove, newSpace);
        controlBgm ();
    }
    pause.onclick = () => {
        clearInterval(timer);
        bgmAudio.pause();
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
        }
    }
    ranks(snake.length - 5);
   
};
eatFoodBgm = () => {
        eatBgmAudio.play();
}
controlBgm = () => {
    let bgmChangeIndex = bgmChange.selectedIndex;
    let newBgm = bgmChange.options[bgmChangeIndex].value;
    bgmAudio.src = newBgm;
    enablePlayBgm.onclick = () =>{
        bgmAudio.play();
    };
    disablePlayBgm.onclick = () => {
        bgmAudio.pause();
    }
    enableOpenEatBgm.onclick = () => {
        eatBgm = true;
   }
   disableOpenEatBgm.onclick = () => {
      eatBgm = false;
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
        left = Math.floor((con.offsetWidth - 10) / BOX.WIDTH * Math.random()) * BOX.WIDTH;
        top = Math.floor((con.offsetHeight - 10) / BOX.HEIGHT * Math.random()) * BOX.HEIGHT;
    } while (isInSnakeBody(left, top));
    food.style.left = left + "px";
    food.style.top = top + "px";
    con.appendChild(food);
}
createSnake = () => {
    var newBody = null;
    for (var i = 1; i <= 5; i++) {
        newBody = document.createElement("span");
        newBody.className = 'node body';
        newBody.style.left = (i - 1) * BOX.WIDTH + "px";
        newBody.style.top = "0px";
        if (i == 5) {
            newBody.className = 'node head';
        }
        con.appendChild(newBody);
        snake.push(newBody);
    }
}
getSnakeHead = () => {
    return snake[snake.length - 1] ;
}
isEatSelf = (newLeft,newTop) => {;
    return snake.slice(0,snake.length - 1).some(body =>
    {return body.offsetLeft === newLeft && body.offsetTop == newTop});
}
gameOverOfEatSelf = () => {
    clearInterval(timer);
    alert("吃到自己了！");
    ranks(snake.length - 5);
    window.location.reload();
}
throughWall = (newLeft,newTop) => {
    let head = getSnakeHead();
    if(newLeft > con.offsetWidth - 10 - 1) {
        head.style.left = '-1px';
    }
    else if (newLeft < 0) {
        head.style.left = '281px';
    }
    else if (newTop > con.offsetHeight - 10 -1){
        head.style.top = '-1px';
    }
    else if (newTop < 0 ){
        head.style.top = '281px';
    }

}
moveHead = (head,newLeft,newTop) => {
    head.style.left = newLeft + "px";
    head.style.top = newTop + "px";
}
isEatFood = (newLeft,newTop) => {
    const head = getSnakeHead();
    return (((newLeft + head.offsetWidth) > food.offsetLeft) && 
        (newTop < (food.offsetTop + food.offsetHeight) )&&
        (newLeft < (food.offsetLeft + food.offsetWidth) ) &&
        ((newTop + head.offsetHeight) > food.offsetTop)
    )
}
foodPush = () => {
    food.className =  getSnakeHead().className;
    getSnakeHead().className = 'node body';
    eatBgm && eatFoodBgm();
    snake.push(food); 
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
ranks = (score) => {
    if (score > localStorage.first) {
        let t1 = localStorage.first;
        let t2 = localStorage.second;
        localStorage.first = score;
        localStorage.second = t1;
        localStorage.third = t2;
    }
    else if (score < localStorage.first && score > localStorage.second) {
        let t3 = localStorage.second;
        localStorage.second = score;
        localStorage.third = t3;
    }
    else if (score < localStorage.second && score > localStorage.third) {
        localStorage.second = score;
    }
    else {
        localStorage.first = localStorage.first || 0;
        localStorage.second = localStorage.second || 0;
        localStorage.third = localStorage.third || 0;
    }

    firstscore.innerHTML = "第一名" + localStorage.first + "分";
    secondscore.innerHTML = "第二名" + localStorage.second + "分";
    thirdscore.innerHTML = "第三名" + localStorage.third + "分";
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
    isEatSelf(obj.newLeft,obj.newTop) && gameOverOfEatSelf();
    moveBody();
    isEatFood(obj.newLeft,obj.newTop) && foodPush();
    moveHead(getSnakeHead(),obj.newLeft,obj.newTop);
    throughWall(obj.newLeft,obj.newTop);
}