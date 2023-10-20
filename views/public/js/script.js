const hide = document.getElementById('hidden');
hide.style.display = 'none';
const result = document.querySelector('.result');
const cards = document.querySelectorAll('.memory-card');
const remainingMatches = document.getElementById('remain');
const countdown = document.getElementById('countdown');

let hasFlippedCard = false;
let lockBoard = false;
let first = false;
let matchesFound = 0;
let firstCard, secondCard;
let countdownInterval;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    if (first === false) {
      startCountdown();
    }
    hasFlippedCard = true;
    firstCard = this;
    first = true;
    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
  if (isMatch) {
    matchesFound++;
    remainingMatches.innerHTML = `Remaining Matches: ${6 - matchesFound}`;
    if (matchesFound === 6) {
      stopCountdown();
      result.innerHTML = 'You Won!';
      hide.style.display = 'flex';
    }
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach((card) => card.addEventListener('click', flipCard));

function reset() {
  location.reload();
}

// Countdown
const countdownMinutes = 2;
let time = countdownMinutes * 60;

function startCountdown() {
  countdownInterval = setInterval(updateCountdown, 0);
}

function stopCountdown() {
  clearInterval(countdownInterval);
}

function updateCountdown() {
  if (matchesFound < 6) {
    const minutes = Math.floor(time / 60.0);
    let seconds = time % 60.0;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdown.innerHTML = `${minutes}:${seconds}`;
    time--;

    if (time < 0) {
      stopCountdown();
      result.innerHTML = 'You Lost!';
      hide.style.display = 'flex';
    }
  }
}
