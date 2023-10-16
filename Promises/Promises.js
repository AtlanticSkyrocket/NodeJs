document.addEventListener('DOMContentLoaded', function() {
  // Part 1
  const randomIntegers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 101));
  const favoriteFacts = new Array(4);
  const uFavoriteFacts = $('.favorite-number-facts')
  
  function getSingleNumberFacts(num) {
      return axios.get(`http://numbersapi.com/${num}?json`).then(res => {
          console.log(res.data.text)
      }, err => {
          console.log(err)
      });
  }

  getSingleNumberFacts(42)

  function getMultipleNumberFacts(range) {
      return axios.get(`http://numbersapi.com/${range}?json`).then(res => {
          return res
      }, err => {
          console.log(err)
      });
  }

  getMultipleNumberFacts(randomIntegers).then(res => {
    let ulMultiFacts = $('.multi-facts')
    for (let key in res.data) {
      ulMultiFacts.append(`<li>${res.data[key]}</li>`)
    }
  })
  .catch(err => {
    console.log(err)
  })

  function addFactToUl(data, fact) {
    uFavoriteFacts.append(`<li>${data.data.text}</li>`)
  }


  function getMyFavoriteNumberFacts(number) {
    return axios.get(`http://numbersapi.com/${number}?json`).then(res => {
      return res
    }, err => {
      console.log(err)
    });
  }

  for(let i = 0; i < 4; i++) {
    getMyFavoriteNumberFacts(42).then(addFactToUl, err => {
      console.log(err)
    })
  }




 /******************
  * Part 2
  *****************/
 const deckOfCardsBaseUrl = 'https://deckofcardsapi.com/api/deck'
 let deckId = null;
 let drawnCards = [];

 //2.1
  function getDeck() {
    return axios.get(deckOfCardsBaseUrl + '/new/shuffle/?deck_count=1').then(res => {
      deckId = res.data.deck_id
      return deckId
    }, err => {
      console.log(err)
    });
  }

  function reshuffleDeck(deckid) {
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

  function logCard(card) {
    console.log(`${card.value} of ${card.suit}`)
  }
  function logCards(cards) {
    console.log('Cards in pile: ')
    cards.forEach(card => {
      console.log(`${card.value} of ${card.suit}`)
    })
  }
  function getPileOfCards(deckid) {
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
 
  getDeck()
  .then(drawCard)
  .then(logCard)

  //2.2
  getDeck()
  .then(drawCard)
  .then(addCardToPile)
  .then(drawCard)
  .then(addCardToPile)
  .then(getPileOfCards)
  .then(logCards)

});