const { default: axios } = require("axios");
const BACK_CARD = "https://deckofcardsapi.com/static/img/back.png";
// time between dealer actions
const DEALER_PAUSE = 1500;

document.addEventListener('axios:init', () => {
  axios.data('app', () => ({
    async init() {
      await this.shuffleDeck();
      await this.deal();
    },
    async shuffleDeck() {
      let resp = await fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${this.deckSize}`);
      this.deck = await resp.json();
    },
    // initial deal, 2 cards to PC/player
    async deal() {
      // first to player, then PC, then player, then PC
      this.playerCards.push(await this.drawCard());
      // for the dealer, the first card is turned over
      let newcard = await this.drawCard();
      newcard.showback = true;
      this.pcCards.push(newcard);
      this.playerCards.push(await this.drawCard());
      this.pcCards.push(await this.drawCard());
    },
    async drawCard(count=1) {
      let resp = await fetch(`https://www.deckofcardsapi.com/api/deck/${this.deck.deck_id}/draw/?count=${count}`);
      let cardArr = await resp.json();
      let card = cardArr.cards[0];
      card.title = `${card.value} of ${card.suit}`;
      return card;
    },
    getCount(hand) {
      /*
      For a hand, I return 2 values, a low value, where aces are considered 1s, and a high value, where aces are 11. Note that this fails to properly handle a case where I have 3 aces
      and could have a mix... although thinking about it, you can only have ONE ace at 11, so 
      maybe the logic is:  low == all aces at 1. high = ONE ace at 11. fixed!
      */
      let result = {};
      // first we will do low, all 1s
      let lowCount = 0;
      for(card of hand) {
        if(card.value === 'JACK' || card.value === 'KING' || card.value === 'QUEEN') lowCount+=10;
        else if(card.value === 'ACE') lowCount += 1;
        else lowCount += Number(card.value);
        //console.log(card);        
      }
      //console.log('lowCount', lowCount);
      let highCount = 0;
      let oneAce = false;
      for(card of hand) {
        if(card.value === 'JACK' || card.value === 'KING' || card.value === 'QUEEN') highCount+=10;
        else if(card.value === 'ACE') {
          if(oneAce) highCount += 1;
          else {
            highCount += 10;
            oneAce = true;
          }
        }
        else highCount += Number(card.value);
      }
      //console.log('highCount', highCount);
      return { lowCount, highCount };
    },
    async hitMe() {
      this.hitMeDisabled = true;
      this.playerCards.push(await this.drawCard());
      let count = this.getCount(this.playerCards);
      if(count.lowCount >= 22) {
        this.playerTurn = false;
        this.playerBusted = true;
      }
      this.hitMeDisabled = false;
    },
    async newGame() {
      this.pcBusted = false;
      this.playerBusted = false;
      this.playerWon = false;
      this.pcWon = false;
      this.playerCards = [];
      this.pcCards = [];
      await this.shuffleDeck();
      await this.deal();
      this.playerTurn = true;
    },
    async stay() {
      this.playerTurn = false;
      this.pcTurn = true;
      this.startDealer();
    },
    async startDealer() {
      /*
      Idea is - I take a card everytime I'm < 17. so i check my hand, 
      and do it, see if im going to stay or hit. if hit, i do a delay though
      so the game isn't instant.
      */  

      // really first, initial text
      this.pcText = 'The dealer begins their turn...';
      await delay(DEALER_PAUSE);

      // first, a pause while we talk
      this.pcText = 'Let me show my hand...';
      await delay(DEALER_PAUSE);
      
      // reveal my second card
      this.pcCards[0].showback = false;
      
      // what does the player have, we need the best under 22
      let playerCount = this.getCount(this.playerCards);
      let playerScore = playerCount.lowCount;
      if(playerCount.highCount < 22) playerScore = playerCount.highCount;
      //console.log('dealer needs to beat', playerScore);

      // ok, now we're going to loop until i bust/win
      let dealerLoop = true;
      while(dealerLoop) {
        let count = this.getCount(this.pcCards);
        
        /*
        We are NOT doing 'soft 17', so 1 ace always count as 11
        */
        if(count.highCount <= 16) {
          this.pcText = 'Dealer draws a card...';
          await delay(DEALER_PAUSE);
          this.pcCards.push(await this.drawCard());
        } else if(count.highCount <= 21) {
          this.pcText = 'Dealer stays...';
          await delay(DEALER_PAUSE);
          dealerLoop = false;
          this.pcTurn = false;
          if(count.highCount >= playerScore) this.pcWon = true;
          else this.playerWon = true;
        } else {
          dealerLoop = false;
          this.pcTurn = false;
          this.pcBusted = true;
        }
      }
    },
    deckSize: 6,
    hitMeDisabled:false,
    playerCards:[], 
    pcCards:[],
    pcText:'',
    pcBusted: false,
    pcWon: false,
    playerBusted: false,
    playerWon: false, 
    pcTurn:false,
    playerTurn: true
  }))
});

async function delay(x) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), x);
  });
}