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
  return reshuffleDeck(deckId)
      .then(() => {
        document.querySelectorAll('#cardStack img').forEach(img => img.remove());
        document.querySelector('#drawCard').style.display = 'block';
      })
      .then(getDeck)
 }
function checkIfDeckIsEmpty() {
  if (cardStack.children.length >= 52) {
    document.querySelector('#drawCard').style.display = 'none';
    document.body.addEventListener('click', function() {
      return outOfCardsHandler()
    }, { once: true });
  }
}
  getDeck()

  document.querySelector('#drawCard').addEventListener('click', function() {
    return drawCard(deckId)
    .then(card => {
      addCardToStack(card)
    })
    .then(checkIfDeckIsEmpty)
  })

});