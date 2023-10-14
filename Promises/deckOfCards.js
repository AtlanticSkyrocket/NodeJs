document.addEventListener('DOMContentLoaded', function() {

 /******************
  * Part 2.3
  *****************/


  const deckOfCardsBaseUrl = 'https://deckofcardsapi.com/api/deck';
  const cardStack = document.querySelector('#cardStack');
  let deckId = null;

  function getDeck() {
    return axios.get(deckOfCardsBaseUrl + '/new/shuffle/?deck_count=1').then(res => {
      deckId = res.data.deck_id
      return true
    }, err => {
      console.log(err)
    });
  }

  function reshuffleDeck(deckId) {
    return axios.get(deckOfCardsBaseUrl + `/${deckId}/shuffle/`).then(res => {
      return res.data
    }, err => {
      console.log(err)
    });
  }
  function drawCard(deckid) {
    return axios.get(deckOfCardsBaseUrl + `/${deckid}/draw/?count=1`).then(res => {
      return res.data.cards[0]
    }, err => {
      console.log(err)
    });
  }

  function getCardPile(deckid) {
    return axios.get(deckOfCardsBaseUrl + `/${deckid}/pile/drawnCards/list/`).then(res => {
      return res.data.piles.drawnCards.cards
    }, err => {
      console.log(err)
    });
  }

  function addCardToPile(card) {
    return axios.get(deckOfCardsBaseUrl + `/${deckId}/pile/drawnCards/add/?cards=${card.code}`)
    .then(res => {
      return res.data.deck_id
    }, err => {
      console.log(err)
    });
  }

  function getCardCssTransform() {
    const randomdeg = Math.floor(Math.random() * 90) - 45;
    return `rotate(${randomdeg}deg)`
  }
  
 function addCardToStack(card) {
    const cardImg = document.createElement('img');
    cardImg.src = card.image;
    cardImg.style.transform = getCardCssTransform();
    cardImg.style.position = 'absolute';
    cardImg.style.maxWidth = '100%';
    cardImg.style.marginTop = 'auto';
    cardImg.style.transformOrigin = 'bottom center';
    cardImg.style.zIndex = cardStack.children.length;
    cardStack.appendChild(cardImg);
 }
 function outOfCardsHandler() {
  document.querySelector('#drawCard').style.display = 'none';
  document.body.addEventListener('click', function() {
    reshuffleDeck(deckId)
    .then(() => {
      document.querySelectorAll('#cardStack img').forEach(img => img.remove());
      document.querySelector('#drawCard').style.display = 'block';
      getDeck();
    })
  }, { once: true });
  return true;
 }
function checkIfDeckIsEmpty() {
  if (cardStack.children.length >= 52) {
   outOfCardsHandler()
   return true;
  }
  return false;
}
  getDeck()

  document.querySelector('#drawCard').addEventListener('click', function() {
    drawCard(deckId)
    .then(card => {
      addCardToPile(card)
      addCardToStack(card)
      checkIfDeckIsEmpty()
    })
  })

});