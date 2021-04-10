const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');

//Melhoria: novos botões e score
const gameOverText = document.querySelector('.game-over');
const scoreTotal = document.querySelector('.score-total');
const scorePartida = document.querySelector('.score-partida');
const restartButton = document.querySelector('.restart-button');

let alienInterval;

//Melhoria: contagem total e contagem partida
let countTotal = 0;
let countPartida = 0;

//Melhoria tela inicial
startButton.style.display = 'block';
restartButton.style.display = 'none';
instructionsText.style.display = 'block';
gameOverText.style.display = 'none';

scoreTotal.style.display = 'block';
scoreTotal.innerHTML = "Placar total:  " + countTotal;

scorePartida.style.display = 'block'
scorePartida.innerHTML = "Placar partida:  " + countPartida;

//movimento e tiro da nave
function flyShip(event) {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if (event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition <= "0px") {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 30;
        yourShip.style.top = `${position}px`;
    }
}

//Melhoria: ajuste na posição TOP
//função de descer
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition === "460px") {
        return
    } else {
        let position = parseInt(topPosition);
        position += 30;
        yourShip.style.top = `${position}px`;
    }
}

//funcionalidade de tiro
function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {

    let laserInterval = setInterval(() => {

        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada alien foi atingido, se sim, troca o src da imagem
            if (checkLaserCollision(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if (xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

//função para criar inimigos aleatórios
function createAliens() {

    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens

    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;

    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//função para movimentar os inimigos
function moveAlien(alien) {

    let moveAlienInterval = setInterval(() => {

        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));

        if (xPosition <= 50) {
            if (Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }

    }, 30);
}

// Melhoria: score
// função para  colisão
function checkLaserCollision(laser, alien) {

    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if (laserLeft != 340 && laserLeft + 40 >= alienLeft) {

        if (laserTop <= alienTop && laserTop >= alienBottom) {

            countTotal++;
            countPartida++;
            scorePartida.innerHTML = "Placar partida:  " + countPartida;
            scoreTotal.innerHTML = "Placar partida:  " + countTotal;
            return true;

        } else {
            return false;

        }
    } else {
        return false;
    }
}

//inicio do jogo
startButton.addEventListener('click', (event) => {
    playGame();
})

//Melhoria
//Reiniciando o jogo
restartButton.addEventListener('click', (event) => {
    playGame();
})

//Melhoria: botão restart, score total, score
//jogar
function playGame() {

    startButton.style.display = 'none';
    restartButton.style.display = 'none'
    instructionsText.style.display = 'none'
    gameOverText.style.display = 'none'

    scoreTotal.style.display = 'block'
    scoreTotal.innerHTML = "Placar total:  " + countTotal;

    scorePartida.style.display = 'block'
    scorePartida.innerHTML = "Placar partida:  " + countPartida;

    window.addEventListener('keydown', flyShip);

    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

//Melhoria: botão restore, score total, sem alert
//função de game over
function gameOver() {

    window.removeEventListener('keydown', flyShip);

    clearInterval(alienInterval);

    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());

    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());

    scoreTotal.style.display = 'none';
    scoreTotal.innerHTML = "Placar total:  " + countTotal;

    scorePartida.style.display = 'none';
    scorePartida.innerHTML = "Placar partida:  " + countPartida;

    setTimeout(() => {

        gameOverText.style.display = 'none';

        yourShip.style.top = '250px';

        countPartida = 0;

        restartButton.style.display = 'block';

    });
}