const cards = document.querySelectorAll('.memory-card');
const remaingMatches = document.getElementById('remain');

let hasFlippedCard = false;
let lockBoard = false;
let first = false;
let matchesFound = 0;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    if (first === false) {
      setInterval(updateCountdown, 1000);
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
    remaingMatches.innerHTML = `Remaining Matches: ${matchesFound}`;
    if (matchesFound === 6) {
      console.log('hola');
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
const countdown = document.getElementById('countdown');

const countdownMinutes = 2;
let time = countdownMinutes * 60;

function updateCountdown() {
  const minutes = Math.floor(time / 60.0);
  let seconds = time % 60.0;
  seconds = seconds < 2 ? '0' + seconds : seconds;
  countdown.innerHTML = `${minutes}:${seconds}`;
  time--;
}
