var box = { width: 50, height: 50 };
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
    }
    pause.onclick = () => {
        clearInterval(timer);
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
isInSnakeBody = (left, top) => {
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].offsetTop == top && snake[i].offsetLeft == left) {
            return true;
        }
    }
};
createFood = () => {
    food = document.createElement("span");
    food.className = "food";
    var left, top;
    do {
        left = Math.floor((con.offsetWidth - 2) / box.width * Math.random()) * box.width;
        top = Math.floor((con.offsetHeight - 2) / box.height * Math.random()) * box.height;
    } while (isInSnakeBody(left, top));
    food.style.left = left + "px";
    food.style.top = top + "px";
    con.appendChild(food);
}
createSnake = () => {
    var newBody = null;
    for (var i = 1; i <= 5; i++) {
        newBody = document.createElement("span");
        newBody.className = 'snakeBody';
        newBody.style.left = (i - 1) * box.width + "px";
        newBody.style.top = "0px";
        if (i == 5) {
            newBody.className = 'head headRight';
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
GameOverOfEatSelf = () => {
    clearInterval(timer);
    alert("吃到自己了！");
    ranks(snake.length - 5);
    window.location.reload();
}
throughWall = (newLeft,newTop) => {
    let head = getSnakeHead();
    if(newLeft > con.offsetWidth - 2 - 1) {
        head.style.left = '0px';
    }
    else if (newLeft < 0) {
        head.style.left = '750px';
    }
    else if (newTop > con.offsetHeight - 2 -1){
        head.style.top = '0px';
    }
    else if (newTop < 0 ){
        head.style.top = '450px';
    }

}
moveHead = (head,newLeft,newTop) => {
    head.style.left = newLeft + "px";
    head.style.top = newTop + "px";
}
isEatFood = (newLeft,newTop) => {
    return (newLeft == food.offsetLeft && newTop == food.offsetTop) || 
    (newLeft == food.offsetLeft + box.width && newTop == food.offsetTop) ||
    (newLeft == food.offsetLeft - box.width && newTop == food.offsetTop) ||
    (newLeft == food.offsetLeft && newTop == food.offsetTop - box.height) ||
    (newLeft == food.offsetLeft && newTop == food.offsetTop + box.height) ; 
}
foodPush = () => {
    food.className =  getSnakeHead().className;
    getSnakeHead().className = 'snakeBody';
    snake.push(food); 
    truescore.innerHTML = snake.length - 5;
    createFood();
    return;
}
getLocation = (newLeft,newTop) => {
    switch (dir) {
        case DIR.DIR_LEFT: 
        return {
            newLeft : newLeft - box.width,
            newTop : newTop,
        }; 
        case DIR.DIR_RIGHT:
        return {
            newLeft: newLeft + box.width,
            newTop : newTop,
        };
        case DIR.DIR_TOP:
        return {
            newLeft : newLeft,
            newTop: newTop - box.height,
        };
        case DIR.DIR_BOTTOM:
        return {
            newLeft : newLeft,
            newTop : newTop + box.height,
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
changeHead = (direction) => {
    let head = getSnakeHead();
    if (direction == DIR.DIR_RIGHT) {
        head.className = 'head headRight';
    }
    if (direction == DIR.DIR_LEFT) {
        head.className = 'head headLeft';

    }
    if (direction == DIR.DIR_BOTTOM) {
        head.className = 'head headBottom';
    }
    if (direction == DIR.DIR_TOP) {
        head.className = 'head headTop';
    }
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
    isEatSelf(obj.newLeft,obj.newTop) && GameOverOfEatSelf();
    moveBody();
    changeHead(dir);
    isEatFood(obj.newLeft,obj.newTop) && foodPush();
    moveHead(getSnakeHead(),obj.newLeft,obj.newTop);
    throughWall(obj.newLeft,obj.newTop);
}