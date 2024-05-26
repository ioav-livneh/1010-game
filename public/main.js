$(document).ready(function (event) {
  var html = "";
  for (let i = 0; i < 10; i++) {
    html += '<div class="col" col-number="' + i + '">';
    for (let j = 0; j < 10; j++) {
      html += '  <div class="tile" row-number="' + j + '"><div></div></div>';
    }
    html += "</div>";
  }
  // Add all the div's to the HTML
  $("#game-board").html(html);

  const shapes = {
    "1x1": [1, 1],
    "2x1": [2, 1],
    "1x2": [1, 2],
    "3x1": [3, 1],
    "1x3": [1, 3],
    "4x1": [4, 1],
    "1x4": [1, 4],
    "5x1": [5, 1],
    "1x5": [1, 5],
    "2x2": [2, 2],
    "3x3": [3, 3],
  };

  //Shape selection
  $(".newTurn").click(function (event) {
    if ($(event.target).is(".container")) {
      let selectedItem = $(event.target).siblings();
      tempContainer = $(event.target).attr("class").split(" ")[1];
      if (!(shapeClicked == null)) {
        if (tempContainer != container) {
          return;
        }
        selectedItem.toggle();
        shapeClicked = null;
        return;
      }
      shapeClicked = selectedItem.attr("class").split(" ")[1];
      container = $(event.target).attr("class").split(" ")[1];
      selectedItem.toggle();
    }
  });

  // Shape placement logic
  $(".tile").click(function (event) {
    //Update collison grid
    let col = parseInt($(this).closest(".col").attr("col-number"));
    let row = parseInt($(this).attr("row-number"));
    surroundingShape = shapesCollection[shapeClicked].surroundingShape;

    if (shapeClicked == null) {
      return;
    }
    for (i = 0; i < surroundingShape.length; i++) {
      if (
        row + surroundingShape[i][1] > 9 ||
        col + surroundingShape[i][0] > 9 ||
        grid[row + surroundingShape[i][1]][col + surroundingShape[i][0]] == 1
      ) {
        invalid.play();
        return;
      }
    }

    if (shapeClicked != null) {
      var myImage = new Image(44, 44);
      myImage.style.borderRadius = "5px";
      myImage.style.backgroundColor = eval(`_${shapeClicked}`).color;
    }

    function place(x, y) {
      for (i = 0; i < x; i++) {
        for (j = 0; j < y; j++) {
          $(`.col[col-number='${col + i}']`)
            .find(`.tile[row-number=${row + j}]`)
            .append(myImage.cloneNode());
          grid[row + j][col + i] = 1;
          pointCounter++;
        }
      }
      $(".score").html(pointCounter);
      clearLine(grid);
      shapeClicked = null;
      currentTime = 30;
      pop.play();
    }

    const dimensions = shapes[shapeClicked];
    if (dimensions) {
      place(dimensions[0], dimensions[1]);
    }

    //Create 3 more shapes for new turn
    if (
      $(".c1").siblings().css("display") === "none" &&
      $(".c2").siblings().css("display") === "none" &&
      $(".c3").siblings().css("display") === "none"
    ) {
      $(".container").siblings().remove();
      pickThree(shapesArray);
    }
  });

  //Theme button
  $("#theme").click(function (event) {
    $("body").toggleClass("dark-theme");
    $(".tile, .tile div").toggleClass("dark-theme-tile");
    if ($("#theme i").hasClass("fa-moon")) {
      $("#theme i").addClass("fa-sun");
      $("#theme i").removeClass("fa-moon");
      $("i").addClass("light-icon");
      $("i").removeClass("dark-icon");
    } else {
      $("#theme i").addClass("fa-moon");
      $("#theme i").removeClass("fa-sun");
      $("i").addClass("dark-icon");
      $("i").removeClass("light-icon");
    }
  });

  //Volume button
  $("#volume").click(function (event) {
    if ($("#volume i").hasClass("fa-volume-high")) {
      $("#volume i").addClass("fa-volume-xmark");
      $("#volume i").removeClass("fa-volume-high");
      //turn on sound
    } else {
      $("#volume i").addClass("fa-volume-high");
      $("#volume i").removeClass("fa-volume-xmark");
      //turn off sound
    }
  });

  //Info button
  $("#info").click(function (event) {
    //make modal popup
  });

  //Show what a placed item will look like
  $(".tile").mouseover(function (event) {
    let col = parseInt($(this).closest(".col").attr("col-number"));
    let row = parseInt($(this).attr("row-number"));
    surroundingShape = shapesCollection[shapeClicked].surroundingShape;

    let myImage = new Image(44, 44);
    myImage.style.borderRadius = "5px";

    for (i = 0; i < surroundingShape.length; i++) {
      if (
        row + surroundingShape[i][1] > 9 ||
        col + surroundingShape[i][0] > 9 ||
        grid[row + surroundingShape[i][1]][col + surroundingShape[i][0]] == 1
      ) {
        myImage.style.backgroundColor = "rgb(255, 200, 200)";
        break;
      }
      myImage.style.backgroundColor = "rgb(205, 255, 200)";
    }

    function hoverimage(x, y) {
      for (i = 0; i < x; i++) {
        for (j = 0; j < y; j++) {
          $(`.col[col-number='${col + i}']`)
            .find(`.tile[row-number=${row + j}]`)
            .append(myImage.cloneNode());
        }
      }
    }

    const dimensions = shapes[shapeClicked];
    if (dimensions) {
      hoverimage(dimensions[0], dimensions[1]);
    }
  });

  $(".tile").mouseout(function (event) {
    let col = parseInt($(this).closest(".col").attr("col-number"));
    let row = parseInt($(this).attr("row-number"));

    function removeimage(x, y) {
      for (i = 0; i < x; i++) {
        for (j = 0; j < y; j++) {
          $(`.col[col-number='${col + i}']`)
            .find(`.tile[row-number=${row + j}] img:last-child`)
            .remove();
        }
      }
    }

    if (grid[row][col] != 1 || shapeClicked != null) {
      const dimensions = shapes[shapeClicked];
      if (dimensions) {
        removeimage(dimensions[0], dimensions[1]);
      }
    }
  });
});

var shapeClicked = null;
var container = null;
var pointCounter = 0;

//Create collision grid
var grid = [];

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    if (!Array.isArray(grid[i])) grid[i] = [];
    grid[i][j] = 0;
  }
}

shapesCollection = {};
//Block-shapes
function Shape(name, dimension, color) {
  this.surroundingShape = [];
  for (let x = 0; x < dimension[0]; x++) {
    for (let y = 0; y < dimension[1]; y++) {
      this.surroundingShape.push([x, y]);
    }
  }
  this.name = name;
  this.dimension = dimension;
  this.color = color;
  var myImage = new Image(dimension[0] * 40, dimension[1] * 40);
  myImage.style.backgroundColor = color;
  myImage.style.borderRadius = "5px";
  $(myImage).addClass("shape");
  $(myImage).addClass(name);
  this.img = myImage;
  shapesCollection[name] = this;
}

var _1x5 = new Shape("1x5", [1, 5], "rgb(221,101,85)");
var _5x1 = new Shape("5x1", [5, 1], "rgb(221,101,85)");
var _1x4 = new Shape("1x4", [1, 4], "rgb(228,105,131)");
var _4x1 = new Shape("4x1", [4, 1], "rgb(228,105,131)");
var _1x3 = new Shape("1x3", [1, 3], "rgb(238,147,71)");
var _3x1 = new Shape("3x1", [3, 1], "rgb(238,147,71)");
var _1x2 = new Shape("1x2", [1, 2], "rgb(251,198,61)");
var _2x1 = new Shape("2x1", [2, 1], "rgb(251,198,61)");
var _1x1 = new Shape("1x1", [1, 1], "rgb(119,136,196)");
var _2x2 = new Shape("2x2", [2, 2], "rgb(149,220,77)");
var _3x3 = new Shape("3x3", [3, 3], "rgb(108,213,177)");

// Shape Collection
shapesArray = [
  _1x1,
  _1x2,
  _2x1,
  _1x3,
  _3x1,
  _1x4,
  _4x1,
  _1x5,
  _5x1,
  _2x2,
  _3x3,
];
pickThree(shapesArray);

// Remove completed row or column
function clearLine(grid) {
  checkRow(grid);
  checkColumn(grid);
}

function checkRow(grid) {
  var counterOne = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (grid[i][j] == 1) {
        counterOne.push([i, j]);
        if (counterOne.length === 10) {
          for (let k = 0; k < 10; k++) {
            grid[counterOne[i][0]][k] = 0;
            deleteRow = $(`.tile[row-number='${counterOne[i][k]}']`);
            if (deleteRow) {
              deleteRow.children("img").addClass("vanish");
              success.play();
              $(deleteRow).on("transitionend", function (e) {
                deleteRow.children("img").remove();
                checkRow(grid);
                checkColumn(grid);
              });
            }
          }
          counterOne = [];
          return;
        }
      }
    }
    counterOne = [];
  }
}

function checkColumn(grid) {
  var counterOne = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (grid[j][i] == 1) {
        counterOne.push([i, j]);
        if (counterOne.length === 10) {
          for (let k = 0; k < 10; k++) {
            grid[k][counterOne[i][0]] = 0;
            deleteColumn = $(`.col[col-number='${counterOne[i][k]}']`);
            if (deleteColumn) {
              deleteColumn.children().children("img").addClass("vanish");
              success.play();
              $(deleteColumn).on("transitionend", function (e) {
                deleteColumn.children().children("img").remove();
                checkColumn(grid);
                checkRow(grid);
              });
            }
          }
          counterOne = [];
          return;
        }
      }
    }
    counterOne = [];
  }
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}
var success = new sound("/sounds/success.wav");
var invalid = new sound("/sounds/invalid.mp3");
var pop = new sound("/sounds/pop.flac");

//Pick next 3 block-shapes
function pickThree(array) {
  let newTiles = [];
  let rand1 = Math.floor(Math.random() * array.length);
  let rand2 = Math.floor(Math.random() * array.length);
  let rand3 = Math.floor(Math.random() * array.length);
  newTiles.push(shapesArray[rand1]);
  newTiles.push(shapesArray[rand2]);
  newTiles.push(shapesArray[rand3]);
  $(".div1").append(newTiles[0].img.cloneNode());
  $(".div2").append(newTiles[1].img.cloneNode());
  $(".div3").append(newTiles[2].img.cloneNode());
  $(".div").animate({ right: "-100vw" }, 0);
  $(".div1").animate({ right: "0" }, 200);
  $(".div2").animate({ right: "0" }, 300);
  $(".div3").animate({ right: "0" }, 400);
}
