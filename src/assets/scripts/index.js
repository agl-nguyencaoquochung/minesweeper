let size = 10; // 10 ô
let bombFrequency = 0.1; // Tỉ lệ ra bomb 0.1.
let tileSize = 60;
let clickCount = 0;
let totalSeconds = 0;
let flagcount = 10;

const board = document.querySelectorAll('.l-board')[0];
let tiles;
let boardSize;

const restartBtn = document.querySelectorAll('.l-board__smile')[0];
const endscreen = document.querySelectorAll('.l-board__bottom')[0]


let bombs = [];
let numbers = [];
let numberColors = ['#3498db', '#2ecc71', '#e74c3c', '#000080']; // màu chữ từ 1-4
let endscreenContent = { // Thông báo thắng và thua
    win: '<span>✔</span> you won!',
    loose: '💣 Booom! Game over.'
};

let gameOver = false; // Mặc định false


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
countUpTime();
/* setup the game */
function setup() {
    for (let i = 0; i < Math.pow(size, 2); i++) {
        const tile = document.createElement('div');
        tile.classList.add('l-board__tile');
        board.appendChild(tile);
    }
    tiles = document.querySelectorAll('.l-board__tile');
    boardSize = Math.sqrt(tiles.length);
    board.style.width = boardSize * tileSize + 'px';

    document.documentElement.style.setProperty('--tileSize', `${tileSize}px`);
    document.documentElement.style.setProperty('--boardSize', `${boardSize * tileSize}px`);

    let x = 0;
    let y = 0;
    tiles.forEach((tile, i) => {
        i;
        // Set Attribute Tile trục tung và hoành
        tile.setAttribute('data-tile', `${x},${y}`);

        // Thêm Bombs.
        let random_boolean = Math.random() < bombFrequency;
        if (random_boolean) {
            bombs.push(`${x},${y}`);
            if (x > 0) numbers.push(`${x - 1},${y}`);
            if (x < boardSize - 1) numbers.push(`${x + 1},${y}`);
            if (y > 0) numbers.push(`${x},${y - 1}`);
            if (y < boardSize - 1) numbers.push(`${x},${y + 1}`);

            if (x > 0 && y > 0) numbers.push(`${x - 1},${y - 1}`);
            if (x < boardSize - 1 && y < boardSize - 1) numbers.push(`${x + 1},${y + 1}`);

            if (y > 0 && x < boardSize - 1) numbers.push(`${x + 1},${y - 1}`);
            if (x > 0 && y < boardSize - 1) numbers.push(`${x - 1},${y + 1}`);
        }

        x++;
        if (x >= boardSize) {
            x = 0;
            y++;
        }

        // CLICK chuột phải
        tile.oncontextmenu = function(e) {
            e.preventDefault();
            flag(tile); // Chạy hàm thêm lá cờ.
        }

        // CLICK chuột trái
        tile.addEventListener('click', function() {
            clickTile(tile); // Hàm chạy click chuột trái
        });
    });

    numbers.forEach(num => {
        let coords = num.split(',');
        let tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0];
        let dataNum = parseInt(tile.getAttribute('data-num'));
        if (!dataNum) dataNum = 0;
        tile.setAttribute('data-num', dataNum + 1);
    });
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

// CLICK chuột trái
function clickTile(tile) {
    if (gameOver) return;
    if (tile.classList.contains('l-board__tile--checked') || tile.classList.contains('l-board__tile--flagged')) return;
    let coordinate = tile.getAttribute('data-tile');
    if (bombs.includes(coordinate)) {
        endGame(tile);
    } else {
        /* kiểm tra xem có bom gần đó không */
        let num = tile.getAttribute('data-num');
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
}

// CLICK chuột trái kiểm tra các ô xung quanh
function checkTile(tile, coordinate) {

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
            let targetNW = document.querySelectorAll(`[data-tile="${x - 1},${y - 1}"`)[0];
            clickTile(targetNW, `${x - 1},${y - 1}`);
        }
        if (x < boardSize - 1 && y < boardSize - 1) {
            let targetSE = document.querySelectorAll(`[data-tile="${x + 1},${y + 1}"`)[0];
            clickTile(targetSE, `${x + 1},${y + 1}`);
        }

        if (y > 0 && x < boardSize - 1) {
            let targetNE = document.querySelectorAll(`[data-tile="${x + 1},${y - 1}"]`)[0];
            clickTile(targetNE, `${x + 1},${y - 1}`);
        }
        if (x > 0 && y < boardSize - 1) {
            let targetSW = document.querySelectorAll(`[data-tile="${x - 1},${y + 1}"`)[0];
            clickTile(targetSW, `${x - 1},${y + 1}`);
        }
    }, 10);
}

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

// CLICK vào ô : Đếm số lượt click
function countClick() {
    var divElements = document.querySelectorAll('.l-board__tile');
    divElements.forEach(divElement => {

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


// CLICK vào mặt cười Reset lại trang.
restartBtn.addEventListener('click', function() {
    window.location.reload();
});

/* chạy hàm Setup Game*/
setup();
countClick();