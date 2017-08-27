$(document).ready(function() {

var rounds_left = 13;

function getValByTitle(t) {
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

function getSuitByTitle(t) {
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

function getTitleByHTML(card_html) {
  return card_html.substring(card_html.indexOf("id=") + 4, card_html.length - 2);
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

function initCards() {
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

function shuffleCards() {
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

var hands = [[], [], [], []];

var player_with_2clubs = 0;

function dealCards() {
  var card_index = 0;
  for (var hand = 0; hand < 4; hand++) {
    for (var i = 0; i < 13; i++) {
      hands[hand][i] = cards[card_index];
      if (cards[card_index].title == "2_of_clubs") {
        player_with_2clubs = hand;
      }
      card_index = card_index + 1;
    }

  }
}

dealCards();

function showCards() {
  for (var id = 0; id < 13; id++) {
    $("#" + id).append(hands[0][id].html);
  }
}

function getCardIndexByTitle(player, t) {
  for (var i = 0; i < 13; i++) {
    if (hands[player][i].title == t) {
      return i;
    }
  }
  return -1;
}

function findCardByTitle(t) {
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

function hasSuit(player, suit) {
  for (var i = 0; i < 13; i++) {
    if (hands[player][i].placed == false && hands[player][i].suit == suit) {
      return true; // has suit must placed card of this type
    }
  }
  return false; // doesn't have suit so can place anything
}

function waitContinue() {
  $("#continue_button").click(function() {
    $(this).off("click");
    // $("#m0").empty();
    // $("#m1").empty();
    // $("#m2").empty();
    // $("#m3").empty();

    if (p_first_turn === 0) {
      console.log("begin next round with the user");
      start_move(p_first_turn, true);
    }
    else {
      console.log("begin next round with cpu");
      cpu_move(p_first_turn, true);
    }
  });
}

function endRound() {
  // find who won the rounds
  console.log("------------------");
  currentRound += 1;
  var max_card = placed_cards[p_first_turn];
  var max_card_player = p_first_turn;
  //var active_suit = placed_cards[p_first_turn].suit;
  //var max_of_suit = placed_card[p_first_turn].value;
  for (var i = 0; i < 4; i++) {
    if (max_card.suit === placed_cards[i].suit && max_card.value < placed_cards[i].value) {
      max_card = placed_cards[i];
      max_card_player = i;
    }
  }
  p_first_turn = max_card_player;
  p_turn = max_card_player;
  //cpuPick++;

  waitContinue();
}

// returns an array of card indices of player's hand that could be placed
// turn_suit and hearts_placed global variables will be of use here
// also currentRound
function getPlayableCardsByHand (player, first_move) {
  var playable_card_indices = [];
  // check if can only play 2 of clubs
  if (first_move && currentRound === 0) {
    playable_card_indices.push(getCardIndexByTitle(player, "2_of_clubs"));
    return playable_card_indices;
  }
  // check if can play anything but a heart
  else if (first_move && heart_placed === false) {
    for (var i = 0; i < 13; i++) {
      if (hands[player][i].placed === false && hands[player][i].suit !== "hearts") {
        playable_card_indices.push(i);
      }
    }
    return playable_card_indices;
  }
  // check if can play anything
  else if (first_move && heart_placed) {
    for (var i = 0; i < 13; i++) {
      if (hands[player][i].placed === false) {
        playable_card_indices.push(i);
      }
    }
    return playable_card_indices;
  }
  // check if has to play what turn_suit is
  else if (hasSuit(player, turn_suit)) {
    for (var i = 0; i < 13; i++) {
      if(hands[player][i].placed === false && hands[player][i].suit === turn_suit) {
        playable_card_indices.push(i);
      }
    }
    return playable_card_indices;
  }
  // check if doesn't have turn_suit => can play anything
  else if (hasSuit(player, turn_suit) === false) {
    for (var i = 0; i < 13; i++) {
      if (hands[player][i].placed === false) {
        playable_card_indices.push(i);
      }
    }
    return playable_card_indices;
  }
  return playable_card_indices;
}

function cpu_move(player, first_move) {
  // if (first_move == false && hasSuit(player, turn_suit)) {
  //
  // }
  console.log("player " + player + " fm " + first_move + " cpu" + "p_first_turn " + p_first_turn);
  var picks = getPlayableCardsByHand(player, first_move);
  cpuPick = picks[0];
  $("#m" + player).append(hands[player][cpuPick].html);
  hands[player][cpuPick].placed = true;
  if (hands[player][cpuPick].suit == "hearts") {
    heart_placed = true;
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
  if (next_turn !== p_first_turn) {
    if (next_turn !== 0) {
      cpu_move(next_turn, false);
    }
    else {
      start_move(0, false);
    }
  }
  else {
    endRound();
  }
}

function start_move(player, first_move) {
  console.log("player " + player + " fm " + first_move + " user p_first_turn " + p_first_turn);
  for (var i = 0; i < rounds_left; i++) {
    if (hands[player][i].placed == false) {
      $("#" + i).click(function() {
        $(this).off("click");
        $(this).remove();
        $("#m0").append($(this));
        // get card index in hands . .
        selected_card = hands[player][getCardIndexByTitle(player, getTitleByHTML($(this).html()))];
        selected_card.placed = true;
        if (first_move) {
          turn_suit = selected_card.suit;
        }
        if (selected_card.suit === "hearts") {
          heart_placed = true;
        }
        placed_cards[player] = selected_card;
        p_turn = player;
        next_turn = player + 1;
        if (1 !== p_first_turn) {
          cpu_move(1, false);
        }
        else {
          endRound();
        }
      });
    }
  }

}



//use events instead of loops to play the game
function play() {
  // check to see if user is starting

  p_turn = player_with_2clubs;
  p_first_turn = player_with_2clubs;
  if (p_turn !== 0) {
    cpu_move(p_turn, true);
  }
  else {
    start_move(0, true);
  }

}

play();





});
