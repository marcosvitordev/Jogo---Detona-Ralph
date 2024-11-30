const state = {
    view: {
        squares: document.querySelectorAll('.square'),
        timeLeft: document.querySelector('#time-left'),
        score: document.querySelector('#score'),
        lives: document.querySelector('#lives'),
        playAgainButton: document.querySelector('.playagain'),
    },
    values: {
        gameVelocity: 1000, // Velocidade do jogo
        initialTime: 30, // Tempo inicial
        initialLives: 3, // Vidas iniciais
        hitPosition: 0,
        result: 0,
        currentTime: 30,
        lives: 3,
    },
    actions: {
        timerId: null,
        countDownId: null,
    },
};

// Conta-regressiva do jogo
function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        endGame("GAME OVER! Seu resultado foi: " + state.values.result);
    }
}

// Som de acerto
function playSound() {
    const audio = new Audio('./src/audios/hit.m4a');
    audio.currentTime = 0;
    audio.volume = 0.2;
    audio.play();
}

// Escolhe uma posição aleatória para o inimigo
function randomSquare() {
    state.view.squares.forEach((square) => square.classList.remove('enemy'));

    const randomNumber = Math.floor(Math.random() * state.view.squares.length);
    const randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add('enemy');
    state.values.hitPosition = randomSquare.id;
}

// Lida com cliques nas caixas
function squareClickHandler(event) {
    const square = event.target;

    if (square.id == state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        playSound();
    } else {
        state.values.lives--;
        state.view.lives.textContent = state.values.lives;

        // Verifica se as vidas acabaram
        if (state.values.lives <= 0) {
            endGame("GAME OVER! Seu resultado foi: " + state.values.result);
        }
    }

    // Reseta a posição do hit
    state.values.hitPosition = null;
}

// Adiciona eventos de clique nas caixas
function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener('mousedown', squareClickHandler);
    });
}

// Remove eventos de clique das caixas
function removeListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.removeEventListener('mousedown', squareClickHandler);
    });
}

// Finaliza o jogo
function endGame(message) {
    clearInterval(state.actions.countDownId);
    clearInterval(state.actions.timerId);
    alert(message);
    removeListenerHitBox();
}

// Reseta o estado inicial do jogo
function resetGame() {
    state.values.result = 0;
    state.values.currentTime = state.values.initialTime;
    state.values.lives = state.values.initialLives;

    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.lives.textContent = state.values.lives;

    state.view.squares.forEach((square) => square.classList.remove('enemy'));

    clearInterval(state.actions.countDownId);
    clearInterval(state.actions.timerId);
}

// Inicializa o jogo
function initialize() {
    resetGame();
    addListenerHitBox();
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownId = setInterval(countDown, 1000);
}

// Clique no botão "Play Again"
state.view.playAgainButton.addEventListener('click', () => {
    initialize();
});

// Inicia o jogo ao carregar
// initialize();
