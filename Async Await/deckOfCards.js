document.addEventListener('DOMContentLoaded', async function() {

 /******************
  * Part 2.3
  *****************/


  const deckOfCardsBaseUrl = 'https://deckofcardsapi.com/api/deck';
  const cardStack = document.querySelector('#cardStack');
  let deckId = null;

  async function getDeck() {
    const {data} = await axios.get(`${deckOfCardsBaseUrl}/new/shuffle/?deck_count=1`);
    deckId = data.deck_id;
  }

  async function reshuffleDeck(deckId) {
    const {data} = await axios.get(`${deckOfCardsBaseUrl}/${deckId}/shuffle/`);
    return data;
  }

  async function drawCard(deckid) {
    const {data} = await axios.get(`${deckOfCardsBaseUrl}/${deckid}/draw/?count=1`);
    return data.cards[0];
  }

  function getCardCssTransform() {
    const randomdeg = Math.floor(Math.random() * 90) - 45;
    return `rotate(${randomdeg}deg)`;
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
  document.body.addEventListener('click', async function() {
    await reshuffleDeck(deckId);
    document.querySelectorAll('#cardStack img').forEach(img => img.remove());
    document.querySelector('#drawCard').style.display = 'block';
    await getDeck();
  }, { once: true });
 }
function checkIfDeckIsEmpty() {
  if (cardStack.children.length >= 52) {
   outOfCardsHandler();
   return true;
  }
  return false;
}
  await getDeck();

  document.querySelector('#drawCard').addEventListener('click', async function() {
    const card = await drawCard(deckId);
    addCardToStack(card);
    checkIfDeckIsEmpty();
  });

});