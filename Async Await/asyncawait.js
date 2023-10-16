document.addEventListener('DOMContentLoaded', async function() {
  // Part 1
  const randomIntegers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 101));
  const favoriteFacts = new Array(4);
  const ulFavoriteFacts = $('.favorite-number-facts')
  
  async function getSingleNumberFacts(num) {
      let {data} = await axios.get(`http://numbersapi.com/${num}?json`)
      console.log(data.text)
  }

  getSingleNumberFacts(42)

  async function getMultipleNumberFacts(range) {
      let facts =  await axios.get(`http://numbersapi.com/${range}?json`)
      return facts
  }

  let {data} = await getMultipleNumberFacts(randomIntegers)
  ulMultiFacts = $('.multi-facts')
    for (let key in data) {
      ulMultiFacts.append(`<li>${data[key]}</li>`)
    }

  function addFactToUl(data, fact) {
    ulFavoriteFacts.append(`<li>${data.text}</li>`)
  }


  async function getMyFavoriteNumberFacts(number) {
    let {data} = await axios.get(`http://numbersapi.com/${number}?json`)
    return data
  }

  for(let i = 0; i < 4; i++) {
    let facts = await getMyFavoriteNumberFacts(42)
    addFactToUl(facts)
  }




  /******************
  * Part 2
  *****************/
  const deckOfCardsBaseUrl = 'https://deckofcardsapi.com/api/deck'
  let deckId = null;
  let drawnCards = [];

  //2.1
  async function getDeck() {
    let {data} = await axios.get(deckOfCardsBaseUrl + '/new/shuffle/?deck_count=1')
    return data.deck_id
  }

  async function reshuffleDeck(deckid) {
    let {data} = await axios.get(deckOfCardsBaseUrl + `/${deckid}/shuffle/`)
    return data
  }
  async function drawCard(deckid) {
    let {data} = await axios.get(deckOfCardsBaseUrl + `/${deckid}/draw/?count=1`)
    return data.cards[0]
  }

  function logCard(card) {
    console.log(`${card.value} of ${card.suit}`)
  }
  function logCards(cards) {
    console.log('Cards in pile: ')
    cards.forEach(card => {
      console.log(`${card.value} of ${card.suit}`)
    })
  }
  async function getPileOfCards(deckid) {
    let {data} = await axios.get(deckOfCardsBaseUrl + `/${deckid}/pile/drawnCards/list/`)
    return data.piles.drawnCards.cards
  }

  async function addCardToPile(deckid, card) {
    let {data} = await axios.get(deckOfCardsBaseUrl + `/${deckid}/pile/drawnCards/add/?cards=${card.code}`)
    return data.deck_id
  }

  let deck = await getDeck()
  let card = await drawCard(deck)
  logCard(card)

  //2.2
  deck = await getDeck()
  card = await drawCard(deck)
  await addCardToPile(deck, card)
  card = await drawCard(deck)
  await addCardToPile(deck, card)
  let pileOfCards = await getPileOfCards(deck)
  logCards(pileOfCards)

});