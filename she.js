var box = { width: 50, height: 50 };//每一个方块的高度
var snake = [];//保存蛇每一节身体对应的span
var DIR = {
    DIR_RIGHT: 1,
    DIR_LEFT: 2,
    DIR_TOP: 3,
    DIR_BOTTOM: 4
};
var dir = DIR.DIR_RIGHT;
var food = null; //始终记录当前的食物 
var timer;
var start = document.getElementById('start');
var pause = document.getElementById('pause');
var con = document.getElementById("container");
window.onload = () => {
    //1.初始化地图
    //initMap();
    //2.创建蛇
    //2.5随机显示食物
    showFood();
    createSnake();
    //3.让蛇动起来
    start.onclick = () => {
        clearInterval(timer);
        let spaceIndex = spaces.selectedIndex;
        let newSpace = spaces.options[spaceIndex].value;
        timer = setInterval(snakeMove, newSpace);
    }
    pause.onclick = () => {
        clearInterval(timer);
    }
    //4.控制蛇移动
    document.onkeyup = function (e) {
        switch (e.keyCode) {
            case 38:
                if (dir != DIR.DIR_BOTTOM) {   // 不允许返回，向上的时候不能向下
                    dir = DIR.DIR_TOP;
                }
                break;
            case 40:
                if (dir != DIR.DIR_TOP) {
                    dir = DIR.DIR_BOTTOM;
                }
                break;
            case 37:
                if (dir != DIR.DIR_RIGHT) {
                    dir = DIR.DIR_LEFT;
                }
                break;
            case 39:
                if (dir != DIR.DIR_LEFT) {
                    dir = DIR.DIR_RIGHT;
                }
                break;
        }
    }
    scores(snake.length - 5);

};
isInSnakeBody = (left, top) => {
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].offsetTop == top && snake[i].offsetLeft == left) {
            return true;
        }
    }
};
//随机生成食物。
showFood = () => {
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
snakeMove = () => {
    var con = document.getElementById("container");
    //蛇头移动
    var head = snake[snake.length - 1];
    var newTop = head.offsetTop, newLeft = head.offsetLeft;
    switch (dir) {
        case DIR.DIR_LEFT: newLeft -= box.width; break;
        case DIR.DIR_RIGHT: newLeft += box.width; break;
        case DIR.DIR_TOP: newTop -= box.height; break;
        case DIR.DIR_BOTTOM: newTop += box.height; break;
        default: break;
    }

    //撞墙游戏结束
    if (newLeft > con.offsetWidth - 2 - 1 || newLeft < -2 || newTop < 0 || newTop > con.offsetHeight - 2 - 1) {
        clearInterval(timer);
        alert("撞墙了!");
        scores(snake.length - 5);
        window.location.reload();
    }
    //判断新蛇头的位置是不是在蛇身体里面
    for (var i = 0; i < snake.length - 1; i++) {
        if (snake[i].offsetLeft == newLeft && snake[i].offsetTop == newTop) {
            clearInterval(timer);
            alert("吃到自己了！");
            scores(snake.length - 5);
            window.location.reload();
        }
    }
    //1.如果吃到食物
    if (newLeft == food.offsetLeft && newTop == food.offsetTop) {
        snake[snake.length-1].className = 'snakeBody';
        food.className = "head";
        snake.push(food); 
        truescore.innerHTML = snake.length - 5;
        showFood();
        return;
    }
    //2.如果没吃到
    //除蛇头外身体移动
    for (var i = 0; i < snake.length - 1; i++) {
        snake[i].style.top = snake[i + 1].offsetTop + "px";
        snake[i].style.left = snake[i + 1].offsetLeft + "px";
    }
    head.style.left = newLeft + "px";
    head.style.top = newTop + "px";
    changeHead(dir);
    


}
//计算排名
scores = (score) => {
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
    let i = snake.length - 1;
    if (direction == DIR.DIR_RIGHT) {
        snake[i].className = 'head headRight';
    }
    if (direction == DIR.DIR_LEFT) {
        snake[i].className = 'head headLeft';

    }
    if (direction == DIR.DIR_BOTTOM) {
        snake[i].className = 'head headBottom';
    }
    if (direction == DIR.DIR_TOP) {
        snake[i].className = 'head headTop';
    }
}