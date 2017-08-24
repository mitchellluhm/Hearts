$(document).ready(function() {

var rounds_left = 13;

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

var getTitleByHTML = function(card_html) {
  return card_html.substring(card_html.indexOf("id=") + 4, card_html.length - 2);
  //return card_html;
}

function card(title) {
    this.title = title;
    this.html =
      $("<img src=\"/home/mitchell/Projects/hearts_web/card_pngs/" + title + ".png\""
      + " class=\"card\"" + " id=\"" + title + "\"" + ">")
    this.value = getValByTitle(title);
    this.suit = getSuitByTitle(title);
    this.x = -1;
    this.y = -1;
    this.placed = false;
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

var player_with_2clubs = 0;

var dealCards = function() {
  var card_index = 0;
  for (var hand = 0; hand < 4; hand++) {
    for (var i = 0; i < 13; i++) {
      hands[hand][i] = cards[card_index];
      // find 2 of club holder to determine who starts
      if (cards[card_index].title == "2_of_clubs") {
        player_with_2clubs = hand;
      }
      //document.write(hands[hand][i].title);
      card_index = card_index + 1;
    }

  }
}

dealCards();

var showCards = function() {
  for (var id = 0; id < 13; id++) {
    $("#" + id).append(hands[0][id].html);
    // $("#" + id).click(function() {
    //    $(this).remove();
    //    $("#m0").append($(this));
    //  });
  }
}

var getCardIndexByTitle = function(player, t) {
  for (var i = 0; i < 13; i++) {
    if (hands[player][i].title == t) {
      return i;
    }
  }
  return -1;
}

var findCardByTitle = function(t) {
  for (var i = 0; i < 13; i++) {
    if (hands[0][i].title == t) {

      return hands[0][i];
    }
  }
  return -1;
}

showCards();

// playing game active vars
var p_turn;
var p_first_turn;
var placed_cards = [];
var cpuPick = 0;
var currentRound = 0;
var next_turn;
var heart_placed = false; // not allowed to lay hearts until true
var turn_suit;

var hasSuit = function(player, suit) {
  for (var i = 0; i < 13; i++) {
    if (hands[player][i].placed == false && hands[player][i].suit == suit) {
      return true; // has suit must placed card of this type
    }
  }
  return false; // doesn't have suit so can place anything
}

var waitContinue = function() {
  $("#continue_button").click(function() {
    // $("#m0").empty();
    // $("#m1").empty();
    // $("#m2").empty();
    // $("#m3").empty();
    if (p_first_turn == 0) {
      start_move(p_first_turn, true);
    }
    else {
      cpu_move(p_first_turn, true);
    }
  })
}

var endRound = function() {
  // find who won the rounds
  currentRound++;
  var max_card = placed_cards[p_first_turn];
  var max_card_player = p_first_turn;
  //var active_suit = placed_cards[p_first_turn].suit;
  //var max_of_suit = placed_card[p_first_turn].value;
  for (var i = 0; i < 4; i++) {
    if (max_card.suit == placed_cards[i].suit && max_card.value < placed_cards[i].value) {
      //alert("found card!!" + placed_cards[i].title);
      max_card = placed_cards[i];
      max_card_player = i;
    }
  }
  //alert("max card player is " + max_card_player);

  p_first_turn = max_card_player;
  p_turn = max_card_player;
  cpuPick++;

  waitContinue();
}

// returns an array of card indices of player's hand that could be placed
// turn_suit and hearts_placed global variables will be of use here
// also currentRound
var getPlayableCardsByHand = function(player, first_move) {
  var playable_card_indices = [];
  // check if can only play 2 of clubs
  if (first_move && currentRound == 0) {
    playable_card_indices.push(getCardIndexByTitle(player, "2_of_clubs"));
    return playable_card_indices;
  }
  // check if can play anything but a heart
  else if (first_move && hearts_placed == false) {
    for (var i = 0; i < 13; i++) {
      if (hands[player][i].placed == false && hands[player][i].suit != "hearts") {
        playable_card_indices.push(i);
      }
    }
    return playable_card_indices;
  }
  // check if can play anything
  else if (first_move && hearts_placed) {
    for (var i = 0; i < 13; i++) {
      if (hands[player][i].placed == false) {
        playable_card_indices.push(i);
      }
    }
    return playable_card_indices;
  }
  // check if has to play what turn_suit is
  else if (hasSuit(player, turn_suit)) {
    for (var i = 0; i < 13; i++) {
      if(hands[player][i].placed == false && hands[player][i].suit == turn_suit) {
        playable_card_indices.push(i);
      }
    }
    return playable_card_indices;
  }
  // check if doesn't have turn_suit => can play anything
  else if (hasSuit(player, turn_suit) == false) {
    for (var i = 0; i < 13; i++) {
      if (hands[player][i].placed == false) {
        playable_card_indices.push(i);
      }
    }
    return playable_card_indices;
  }

}

var cpu_move = function(player, first_move) {
  // if (first_move == false && hasSuit(player, turn_suit)) {
  //
  // }
  //alert(getPlayableCardsByHand(player, first_move));
  cpuPick = getPlayableCardsByHand(player,first_move)[0];
  $("#m" + player).append(hands[player][cpuPick].html);
  hands[player][cpuPick].placed = true;
  if (hands[player][cpuPick].suit == "hearts") {
    hearts_placed = true;
  }
  placed_cards[player] = hands[player][cpuPick];
  p_turn = player;

  if (first_move) {
    turn_suit = hands[player][cpuPick].suit;
  }
  if (p_turn == 3) {
    next_turn = 0;
  }
  else {
    next_turn = p_turn + 1;
  }
  if (next_turn != p_first_turn) {
    if (p_turn + 1 < 4) {
      cpu_move(p_turn + 1, false);
    }
    else {
      start_move(0, false);
    }
  }
  else {
    //alert("end of round");
    endRound();
  }
}

var start_move = function(player, first_move) {
  if (currentRound == 0) {
    for (var i = 0; i < rounds_left; i++) {
      $("#" + i).click(function() {
        //start_move(0, $(this));
        $(this).remove();
        $("#m0").append($(this));
        findCardByTitle(getTitleByHTML($(this).html())).placed = true;;
        if (first_move) {
          turn_suit = findCardByTitle(getTitleByHTML($(this).html())).suit;
        }
        if (findCardByTitle(getTitleByHTML($(this).html())).suit = "hearts") {
          hearts_placed = true;
        }
        placed_cards[player] = findCardByTitle(getTitleByHTML($(this).html()))
        p_turn = player;
        next_turn = 1;
        if (next_turn != p_first_turn) {
          cpu_move(p_turn + 1, false);
        }
        else {
          //alert("end or round");
          endRound();
        }

      });
    }
  }
  // $card.remove();
  // $("#m0").append($card);
  // //alert(getTitleByHTML($card.html()));
  // cpu_move(p_turn + 1);

  // delay for user move

}


//start_move(0, 1);

//use events instead of loops to play the game
var play = function() {
  // check to see if user is starting

  p_turn = player_with_2clubs;
  p_first_turn = player_with_2clubs;
  if (p_turn != 0) {
    cpu_move(p_turn, true);
  }
  else {
    start_move(0, true);
  }

}

play();





});
