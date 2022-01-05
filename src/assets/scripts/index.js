console.clear();

let size = 10; // size x size tiles
let tileSize = 60;

const board = document.querySelectorAll('.l-board__main')[0];
let tiles;
let boardSize;
let totalSeconds = 0;
let clickCount = 0;
let flagcount = 10;

const restartBtn = document.querySelector('#smile');
const endscreen = document.querySelector('.l-board__bottom');


// số bombs
let bombsNumber = 10;
let holdingBombs = []; // mảng chứa bomb (có trùng nhau)
let bombs = []; // mảng chưa bomb (không trùng nhau)

let numbers = [];
let numberColors = [
    '#3498db',
    '#2ecc71',
    '#e74c3c',
    '#9b59b6',
    '#f1c40f',
    '#1abc9c',
    '#34495e',
    '#7f8c8d',
];
let endscreenContent = {
    win: '<span>✔</span> you won!',
    loose: '💣 Booom! Game over.',
};

let numObj = {}; // mảng chứa data-num

let gameOver = false;

// ĐẾM số lượt Click
function countClick() {
    tiles = document.querySelectorAll('.l-board__tile');
    tiles.forEach(divElement => {

        divElement.addEventListener('mousedown', function(evt) {
            switch (evt.buttons) {
            case 1:
                clickCount += 1;
                break;
            case 2:
                clickCount += 1;
                break;
            }
        });
    });
}

// ĐẾM thời gian chạy
function countUpTime() {
    var minutesLabel = document.getElementById('minutes');
    var secondsLabel = document.getElementById('seconds');

    setInterval(setTime, 1000);

    function setTime() {
        if (gameOver == false) {
            ++totalSeconds;
            secondsLabel.innerHTML = pad(totalSeconds % 60);
            minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
        } else {
            return;
        }

    }

    function pad(val) {
        var valString = val + '';
        if (valString.length < 2) {
            return '0' + valString;
        } else {
            return valString;
        }
    }
}

/* MAIN GAME */
const setup = () => {
    for (let i = 0; i < Math.pow(size, 2); i++) {
        const tile = document.createElement('div');
        tile.classList.add('l-board__tile');
        board.appendChild(tile);
    }
    tiles = document.querySelectorAll('.l-board__tile');
    boardSize = Math.sqrt(tiles.length);
    board.style.width = boardSize * tileSize + 'px';

    document.documentElement.style.setProperty('--tileSize', `${tileSize}px`);
    document.documentElement.style.setProperty(
        '--boardSize',
        `${boardSize * tileSize}px`
    );
    // gọi add bomb lần đầu
    addBomb();

    let x = 0;
    let y = 0;
    tiles.forEach((tile, i) => {
        i;
        // set tile coordinates
        tile.setAttribute('data-tile', `${x},${y}`);
        x++;
        if (x >= boardSize) {
            x = 0;
            y++;
        }
        // CLICK chuột phải
        tile.oncontextmenu = function(e) {
            e.preventDefault();
            flag(tile); // Chạy hàm thêm lá cờ.
        };

        // CLICK chuột trái
        tile.addEventListener('click', function() {
            clickTile(tile); // Chạy hàm click chuột trái
        });
    });
    bombs.forEach((bomb) => {
        //bomb -> vd: 1,2
        let coords = bomb.split(','); // ['1','2']
        let x = parseInt(coords[0]); // x = 1
        let y = parseInt(coords[1]); // y = 2

        // nghiên cứu cách chơi để hiểu đoạn này
        if (x > 0) numbers.push(`${x - 1},${y}`);
        if (x < boardSize - 1) numbers.push(`${x + 1},${y}`);
        if (y > 0) numbers.push(`${x},${y - 1}`);
        if (y < boardSize - 1) numbers.push(`${x},${y + 1}`);
        if (x > 0 && y > 0) numbers.push(`${x - 1},${y - 1}`);
        if (x < boardSize - 1 && y < boardSize - 1)
            numbers.push(`${x + 1},${y + 1}`);
        if (y > 0 && x < boardSize - 1) numbers.push(`${x + 1},${y - 1}`);
        if (x > 0 && y < boardSize - 1) numbers.push(`${x - 1},${y + 1}`);
    });

    //tạo object chứa data-num và vị trí ô
    //  vd: 1,2 (vị trí ô) : 1 (data-num)
    numbers.forEach((num) => {
        numObj[num] = (numObj[num] || 0) + 1;

    });
};

// THÊM Bomb.
const addBomb = function() {
    let x = Math.floor(Math.random() * 100); //random từ 0-99
    if (x < 10) {
        // nếu random ra số nhỏ hơn 10 thì thêm số 0 phía trước , vd: 5 -> 05 (do tọa độ có 2 số x và y)
        x = '0' + x;
    }
    x = x.toString().split(''); // tách x ra , vd: 05 -> ['0','5']
    holdingBombs.push(`${x[0]},${x[1]}`); // push x vào holdingBombs array , vd : ['5,0','4,5',...]

    bombs = unique(holdingBombs);

    while (bombs.length < bombsNumber) {
        //gọi lại addBomb nếu chưa đủ bom (tính length của mảng bombs )
        addBomb();
    }
};
// Xoá phần tử trùng lặp của mảng holdingBombs
function unique(holdingBombs) {
    var newArr = []
    for (var i = 0; i < holdingBombs.length; i++) {
        if (!newArr.includes(holdingBombs[i])) {
            newArr.push(holdingBombs[i])
        }
    }
    return newArr;
}
// THÊM lá cờ.
function flag(tile) {
    if (gameOver) return;
    if (!tile.classList.contains('l-board__tile--checked')) {
        if (!tile.classList.contains('l-board__tile--flagged')) {
            tile.classList.add('l-board__tile--flagged');
            tile.classList.add('is-active');
            flagcount--;
        } else {
            tile.classList.remove('l-board__tile--flagged');
            tile.style.backgroundImage = 'none';
            flagcount++;
        }
        let flagCounter = document.querySelector('#flagCounter');
        flagCounter.innerHTML = flagcount;
    }
}

// CLICK chuột trái.
const clickTile = (tile) => {
    if (gameOver) return;
    if (tile.classList.contains('l-board__tile--checked') || tile.classList.contains('l-board__tile--flagged')) return;
    let coordinate = tile.getAttribute('data-tile');
    if (bombs.includes(coordinate)) {
        endGame(tile);
    } else {
        /* kiểm tra xem có bom gần đó không */
        let num = numObj[coordinate];
        if (num != null) {
            tile.classList.add('l-board__tile--checked');
            tile.innerHTML = num;
            tile.style.color = numberColors[num - 1];
            setTimeout(() => {
                checkVictory();
            }, 100);
            return;
        }

        checkTile(tile, coordinate);
    }
    tile.classList.add('l-board__tile--checked');
};

// CLICK chuột trái kiểm tra các ô xung quanh.
const checkTile = (tile, coordinate) => {
    let coords = coordinate.split(',');
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);

    // Kiểm tra các ô trống xung quanh
    setTimeout(() => {
        if (x > 0) {
            let targetW = document.querySelectorAll(`[data-tile="${x - 1},${y}"`)[0];
            clickTile(targetW, `${x - 1},${y}`);
        }
        if (x < boardSize - 1) {
            let targetE = document.querySelectorAll(`[data-tile="${x + 1},${y}"`)[0];
            clickTile(targetE, `${x + 1},${y}`);
        }
        if (y > 0) {
            let targetN = document.querySelectorAll(`[data-tile="${x},${y - 1}"]`)[0];
            clickTile(targetN, `${x},${y - 1}`);
        }
        if (y < boardSize - 1) {
            let targetS = document.querySelectorAll(`[data-tile="${x},${y + 1}"]`)[0];
            clickTile(targetS, `${x},${y + 1}`);
        }

        if (x > 0 && y > 0) {
            let targetNW = document.querySelectorAll(
                `[data-tile="${x - 1},${y - 1}"`
            )[0];
            clickTile(targetNW, `${x - 1},${y - 1}`);
        }
        if (x < boardSize - 1 && y < boardSize - 1) {
            let targetSE = document.querySelectorAll(
                `[data-tile="${x + 1},${y + 1}"`
            )[0];
            clickTile(targetSE, `${x + 1},${y + 1}`);
        }

        if (y > 0 && x < boardSize - 1) {
            let targetNE = document.querySelectorAll(
                `[data-tile="${x + 1},${y - 1}"]`
            )[0];
            clickTile(targetNE, `${x + 1},${y - 1}`);
        }
        if (x > 0 && y < boardSize - 1) {
            let targetSW = document.querySelectorAll(
                `[data-tile="${x - 1},${y + 1}"`
            )[0];
            clickTile(targetSW, `${x - 1},${y + 1}`);
        }
    }, 10);
};

// CLICK vào mặt cười Reset lại trang.
restartBtn.addEventListener('click', function() {
    window.location.reload();
});

// Kiểm tra nếu game thua
function endGame(tile) {
    tile;
    endscreen.innerHTML = `
    <h3>${endscreenContent.loose}</h3>   
    <p>Time: ${totalSeconds} sec</p> 
    <p>Clicks: ${clickCount}</p>
    `;
    endscreen.classList.add('is-active');
    gameOver = true;
    tiles.forEach(tile => {
        let coordinate = tile.getAttribute('data-tile');
        if (bombs.includes(coordinate)) {
            tile.classList.remove('l-board__tile--flagged');
            tile.classList.add('l-board__tile--checked', 'tile--bomb');
            tile.style.backgroundImage = 'url(https://minesweeper.online/img/skins/hd/mine_red.svg?v=2)';
        }
    });
    restartBtn.classList.add('is-active');
}

// Kiểm tra nếu game thắng
function checkVictory() {
    let win = true;
    tiles.forEach(tile => {
        let coordinate = tile.getAttribute('data-tile');
        if (!tile.classList.contains('l-board__tile--checked') && !bombs.includes(coordinate)) win = false;
    });
    if (win) {
        endscreen.innerHTML = `
        <h3>${endscreenContent.win}</h3>   
        <p>Time: ${totalSeconds} sec</p> 
        <p>Clicks: ${clickCount}</p>
        `
        endscreen.classList.add('is-active');
        gameOver = true;
    }
}

/* chạy hàm Setup Game */
setup();
/* Đếm số Click chuột*/
countClick();
/* Đếm số Giây*/
countUpTime();