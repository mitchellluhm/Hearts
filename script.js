var getValByTitle = function(t) {
  var faceValue = t.substring(0, t.indexOf("_")) // string
  var intValue;
  // 0 --> 2 | 12 -> "ace"
  switch (faceValue) {
    case "ace":
      intValue = 12;
      break;
    case "king":
      intValue = 11;
      break;
    case "queen":
      intValue = 10;
      break;
    case "jack":
      intValue = 9;
      break;
    default:
      intValue = parseInt(faceValue) - 2;

  }
  return intValue;
}

var getSuitByTitle = function(t) {
  var id = t.substring(t.length-2, t.length-1);
  switch (id) {
    case "t":
      return "hearts";
    case "e":
      return "spades";
    case "b":
      return "clubs";
    case "d":
      return "diamonds";
    default:
      return "ERROR_SUIT_UNKNOWN/INVALID_CARD_TITLE";
  }
}

function card(title) {
    this.title = title;
    this.html =
      $("<img src=\"/home/mitchell/Projects/hearts_web/card_pngs/" + title + ".png\"" + " class=\"card\"" + ">")
    this.value = getValByTitle(title);
    this.suit = getSuitByTitle(title);
    this.x = -1;
    this.y = -1;
}


var cards = [];

var initCards = function() {
  faceValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"]; // size 13
  suits = ["clubs", "hearts", "spades", "diamonds"];

  for (var i = 0; i < faceValues.length; i++) {
    for (var j = 0; j < suits.length; j++) {
      var card_str = faceValues[i] + "_of_" + suits[j];
      cards.push(new card(card_str));
    }
  }
}

initCards();
//document.write(Math.floor(Math.random() * 52));
var shuffleCards = function() {
  for (var i = 0; i < 300; i++) {
    var randomIndex1 = Math.floor(Math.random() * 52);
    var randomIndex2 = Math.floor(Math.random() * 52);
    if (randomIndex1 != randomIndex2) {
      var tempCard = cards[randomIndex1];
      cards[randomIndex1] = cards[randomIndex2];
      cards[randomIndex2] = tempCard;
    }
  }
}

shuffleCards();
//document.write(cards[4].suit);

var hands = [[], [], [], []];

var dealCards = function() {
  var card_index = 0;
  for (var hand = 0; hand < 4; hand++) {
    for (var i = 0; i < 13; i++) {
      hands[hand][i] = cards[card_index];
      //document.write(hands[hand][i].title);
      card_index = card_index + 1;
    }

  }
}

dealCards();

var showCards = function() {
  for (var id = 0; id < 13; id++) {
    $("#" + id).append(hands[0][id].html);
  }
}

showCards();


$(document).ready(function() {
  /*var x = $("<img src=\"/home/mitchell/Projects/hearts_web/card_pngs/2_of_clubs.png\" style=\"width:50px;height:90px;\">");
  $('#1').append(x);
  $(x).click(function(){
    $(this).remove();
  });

  var a = new card("2_of_hearts");
  $('#2').append(a.html);*/



});
