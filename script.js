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

function card(title) {
    this.title = title;
    this.html =
      $("<img src=\"/home/mitchell/Projects/hearts_web/card_pngs/" + title + ".png\">")
    this.value = getValByTitle(title);
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

//var a = new card("2_of_hearts");
//document.write(a.value);
//var b = new card("queen_of_hearts");
//document.write(b.value);

$(document).ready(function() {
  var x = $("<img src=\"/home/mitchell/Projects/hearts_web/card_pngs/2_of_clubs.png\" style=\"width:50px;height:90px;\">");
  $('#1').append(x);
  $(x).click(function(){
    $(this).remove();
  });

  var a = new card("2_of_hearts");
  $('#2').append(a.html);



});
