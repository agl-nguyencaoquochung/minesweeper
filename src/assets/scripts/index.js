document.addEventListener('DOMContentLoaded', () => {
    countUpTime();
    // Khai báo
    const smileIcon = document.querySelector('#smile');
    const grid = document.querySelector('.l-board__grid');
    let clickCount = 0;
    let totalSeconds = 0;
    let flag = 10;
    let width = 10;
    let bombAmount = 10;
    let squares = [];
    let isOverGame = false;
    let gameLose = document.querySelector('.l-popup');
    let flagCounter = document.querySelector('#flagCounter');
    flagCounter.innerHTML = flag;

    // Hàm đếm thời gian chạy
    function countUpTime() {
        var minutesLabel = document.getElementById('minutes');
        var secondsLabel = document.getElementById('seconds');

        setInterval(setTime, 1000);

        function setTime() {
            if (isOverGame == false) {
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

    function createBoard() {
        // Tạo mảng bombs random
        const bombsArray = Array(bombAmount).fill('l-board__bomb'); // 10 mảng bomb
        const emptyArray = Array(width * width - bombAmount).fill('l-board__valid'); // 90 mảng l-board__valid

        const gameArray = emptyArray.concat(bombsArray); // nối 2 mảng bomb và l-board__valid lại với nhau
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5); // trộn 2 mảng lại với nhau
        // Tạo bảng 10*10 ô rồi đưa vào grid
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.classList.add(shuffledArray[i])
            square.setAttribute('id', i); //set id cho các ô
            grid.appendChild(square); // đưa các ô vào Grid
            squares.push(square); // đưa ô vào mảng

            square.addEventListener('click', function() {
                click(square);

            });


            // Click chuột phải thêm lá cờ.
            square.oncontextmenu = function(event) {
                event.preventDefault();
                addFlag(square);
            };

        }
        countClick(); // Chạy hàm đếm số lượt Click
        //Thêm số vào ô
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0); // rìa bên trái - 0 10...90
            const isRightEdge = (i % width === width - 1); // rìa bên phải  - 9 19....99
            //Kiểm tra nếu có class l-board__valid thì chạy
            if (squares[i].classList.contains('l-board__valid')) {
                // left bomb
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('l-board__bomb')) {
                    total++
                }
                // top-right 
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('l-board__bomb')) {
                    total++
                }
                // top
                if (i >= 10 && squares[i - width].classList.contains('l-board__bomb')) {
                    total++
                }
                // top-left
                if (i >= 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('l-board__bomb')) {
                    total++
                }
                // right
                if (i <= 98 && !isRightEdge && squares[i + 1].classList.contains('l-board__bomb')) {
                    total++
                }
                // bottom-left
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('l-board__bomb')) {
                    total++
                }
                // bottom-right
                if (i <= 88 && !isRightEdge && squares[i + 1 + width].classList.contains('l-board__bomb')) {
                    total++
                }
                // bottom
                if (i <= 89 && squares[i + width].classList.contains('l-board__bomb')) {
                    total++
                }
                squares[i].setAttribute('data', total++);
            }
        }
    }
    // Hàm đếm số Click vào ô
    function countClick() {
        var divElements = document.querySelectorAll('.l-board__grid div');
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
                console.log(clickCount);
            });
        });
    }
    // Hàm Click vào ô
    function click(square) {
        var currentId = square.id; // Lấy id từng ô
        if (isOverGame) {
            return;
        }
        // Click vào ô Bomb 
        if (square.classList.contains('l-board__bomb')) {
            if (square.classList.contains('l-board__flag')) {
                return;
            } else {
                overGame(square);
                popupLose();
            }

        } else if (square.classList.contains('l-board__flag')) {
            return;
        } else { // Ngược lại khi không click vào ô Bomb 
            let total = square.getAttribute('data'); // Lấy data điểm gán vào biến total
            if (total != 0) { //Khi điểm khác 0
                square.classList.add('l-board__valid--checked');
                square.innerHTML = total; // Hiện ra ngoài ô
                return;
            }
            square.classList.add('l-board__valid--checked'); // các điểm = 0

        }
        checkSquare(square, currentId);
    }
    // Kiểm tra các ô kế bên khi nhấp vào ô.
    function checkSquare(square, currentId) {
        const isLeftEdge = currentId % width === 0;
        const isRightEdge = currentId % width === width - 1;

        setTimeout(() => {
            // left 
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            // top-right 
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            // top
            if (currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            // top-left
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            // right
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            // bottom-left
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            // bottom-right
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            // bottom
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10);
    }
    // Click vào mặt lại trang
    smileIcon.addEventListener('click', function() {
        window.location.reload();
    });
    // Thêm lá cờ đánh dấu
    function addFlag(square) {
        if (isOverGame) {
            return;
        }
        if (!square.classList.contains('l-board__valid--checked') && (flag <= bombAmount)) { // Khi không phải ô l-board__valid--checked và nhỏ hơn số lượng Bomb
            if (!square.classList.contains('l-board__flag')) {
                square.classList.add('l-board__flag');
                square.classList.add('is-active');
                flag--;
                checkWin(square)
            } else {
                square.classList.remove('l-board__flag');
                square.style.backgroundImage = 'none';
                flag++;
            }
            let flagCounter = document.querySelector('#flagCounter');
            flagCounter.innerHTML = flag;
        }
    }
    // Kiểm tra nếu thắng
    function checkWin() {

        let matches = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('l-board__flag') && squares[i].classList.contains('l-board__bomb')) { // Nếu có class Flag và Bomb
                matches++;
            } else if (matches == bombAmount) {
                popupWin();
            }
        }
    }
    // Kiểm tra nếu thua
    function overGame(square) {
        square;
        isOverGame = true;
        smileIcon.classList.add('is-active');
        //Hiện bomb sau khi thua
        squares.forEach(square => {
            if (square.classList.contains('l-board__bomb')) {
                square.style.backgroundImage = 'url(https://minesweeper.online/img/skins/hd/mine_red.svg?v=2)';
            }
        })
    }
    // Hiện popup sau khi thua.
    function popupLose() {

        gameLose.classList.add('is-active');
        gameLose.innerHTML = `
                <h1>GAME OVER!</h1>
                <p>Time: ${totalSeconds} sec</p> 
                <p>Clicks: ${clickCount}</p>
            `;
    }
    // Hiện popup sau khi thắng.
    function popupWin() {
        gameLose.classList.add('is-active');
        gameLose.innerHTML = `
                <h1>CONGRATULATION!</h1>
                <p>Time: ${totalSeconds} sec</p> 
                <p>Clicks: ${clickCount}</p>
            `;
    }


    // chạy hàm createBoard
    createBoard();
});