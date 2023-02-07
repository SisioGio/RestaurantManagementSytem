class PuzzleItem {
  constructor(index, position, w, size) {
    this.index = index;
    this.position = position;
    this.w = w;
    this.isEmpty = false;
    this.size = size;
  }

  isNeighbor(item) {
    if (this.position === this.size || item.position === this.size) {
      return false;
    }
    if (
      (this.getDestRow() === item.getDestRow() &&
        Math.abs(this.getDestCol() - item.getDestCol()) === 1) ||
      (this.getDestCol() === item.getDestCol() &&
        Math.abs(this.getDestRow() - item.getDestRow()) === 1)
    ) {
      return true;
    }
    return false;
  }

  getSrcRow(size) {
    let output = Math.ceil(this.index / this.size);
    return output;
  }
  getSrcCol(size) {
    let output = this.index % this.size;
    if (output === 0) {
      output = this.size;
    }
    return output;
  }

  getDestRow(size) {
    let output = Math.ceil(this.position / this.size);
    return output;
  }
  getDestCol(size) {
    let output = this.position % this.size;
    if (output === 0) {
      output = this.size;
    }
    return output;
  }
}

class Puzzle {
  constructor(size, width) {
    this.size = size;
    this.width = width;
    this.items = [];
    this.container = this.createGridContainer();
    var thisModal = this;
  }

  startGame() {
    this.createPuzzleItems();
    this.randomizePuzzle();

    this.renderPuzzle();
    this.container.addEventListener(
      "click",
      this.handleClick.bind(this),
      false
    );
  }

  createPuzzleItems() {
    console.log("Creating puzzle " + this.size + " x " + this.size);
    for (let i = 1; i <= this.size * this.size; i++) {
      let item = new PuzzleItem(i, i, this.width / this.size, this.size);
      if (i === this.size * this.size) {
        item.isEmpty = true;
      }
      this.items.push(item);
    }
  }

  // randomizePuzzle(){
  //     for(let i =0;i<30;i++){
  //         const a = Math.floor(Math.random()* this.items.length)
  //         const b = Math.floor(Math.random()* this.items.length)

  //         if(this.items[a].isNeighbor(this.items[b])){
  //             let temp = this.items[a].position;
  //             this.items[a].position = this.items[b].position;
  //             this.items[b].position = temp;
  //         }

  //     }
  // }
  renderPuzzle() {
    const img = new Image();
    img.onload = () => {
      for (const item of this.items) {
        let div = this.createChildElement(
          item.getDestRow(this.size),
          item.getDestCol(this.size),
          item.index
        );

        let canvas = this.createCanvas(item.w);
        let ctx = canvas.getContext("2d");
        if (item.isEmpty === false) {
          ctx.drawImage(
            img,
            ((item.getSrcCol(this.size) - 1) * img.width) / this.size,
            ((item.getSrcRow(this.size) - 1) * img.width) / this.size,
            img.width / this.size,
            img.width / this.size,
            0,
            0,
            item.w - 2,
            item.w - 2
          );
        }

        div.append(canvas);

        this.container.append(div);
      }
    };
    img.src = "./img/prod1.jpg";
  }

  findClickedRow(clickY) {
    var containerY = this.container.getBoundingClientRect().top;
    let output = Math.ceil((clickY - containerY) / (this.width / this.size));
    return output;
  }

  handleClick(event) {
    const clickedRow = this.findClickedRow(event.clientY);
    const clickedCol = this.findClickedColumn(event.clientX);
    let clickedItem = this.findClickedItem(clickedRow, clickedCol);

    let emptyItem = this.findEmptyItem();
    let emptyRow = emptyItem.getDestRow(this.size);
    let emptyCol = emptyItem.getDestCol(this.size);

    if (
      (clickedRow === emptyRow && Math.abs(clickedCol - emptyCol) === 1) ||
      (clickedCol === emptyCol && Math.abs(clickedRow - emptyRow) === 1)
    ) {
      console.log("Swith items!");
      let clickedDiv = document.getElementById(
        "puzzleItem-" + clickedItem.index
      );
      let emptyDiv = document.getElementById("puzzleItem-" + emptyItem.index);

      this.SwapHtmlItems(clickedDiv, emptyDiv);

      this.SwapPuzzleItems(clickedItem, emptyItem);
      if (this.CheckIfCompleted()) {
        document.getElementById("win-message").style.display = "block";
      }
    } else {
      console.log(
        "Clicked row:" + clickedRow + " - Clicked Col :" + clickedCol
      );
      console.log("Empty row:" + emptyRow + " - Empty Col :" + emptyCol);
    }
  }
  createGridContainer() {
    const parent_exists = document.getElementById("grid-container");
    if (parent_exists) {
      parent_exists.remove();
    }

    let parent = document.createElement("div");
    parent.setAttribute("id", "grid-container");

    parent.style.width = this.width + "px";
    parent.style.gridTemplateColumns =
      "repeat(" + this.size + ",calc(" + this.width + "px/" + this.size + "))";
    parent.style.gridTemplateRows =
      "repeat(" + this.size + ",calc(" + this.width + "px/" + this.size + "))";
    document.getElementById("game").append(parent);

    return parent;
  }

  createChildElement(row, col, index) {
    let output_div = document.createElement("div");
    output_div.style.setProperty("--col", col);
    output_div.style.setProperty("--row", row);
    output_div.style.setProperty("--size", this.size);
    output_div.style.width = this.width / this.size;
    output_div.setAttribute("id", "puzzleItem-" + index);

    return output_div;
  }

  createCanvas(size) {
    let canvas = document.createElement("canvas");
    canvas.setAttribute("width", size);
    canvas.setAttribute("height", size);
    return canvas;
  }

  SwapPuzzleItems(clickedItem, emptyItem) {
    var temp_position = clickedItem.position;
    clickedItem.position = emptyItem.position;
    emptyItem.position = temp_position;
  }

  CheckIfCompleted() {
    for (const item of this.items) {
      if (item.index != item.position) {
        return false;
      }
    }
    return true;
  }

  SwapHtmlItems(clickedDiv, emptyDiv) {
    const temp_index = emptyDiv.style.getPropertyValue("--index");
    const temp_col = emptyDiv.style.getPropertyValue("--col");
    const temp_row = emptyDiv.style.getPropertyValue("--row");

    emptyDiv.style.setProperty(
      "--index",
      clickedDiv.style.getPropertyValue("--index")
    );
    emptyDiv.style.setProperty(
      "--col",
      clickedDiv.style.getPropertyValue("--col")
    );
    emptyDiv.style.setProperty(
      "--row",
      clickedDiv.style.getPropertyValue("--row")
    );
    clickedDiv.style.setProperty("--index", temp_index);
    clickedDiv.style.setProperty("--col", temp_col);
    clickedDiv.style.setProperty("--row", temp_row);
  }

  randomizePuzzle() {
    for (let i = 0; i < 50; i++) {
      var prevIndex = -1;
      let emptyItem = this.findEmptyItem();
      let currIndex = emptyItem.position;
      let left = currIndex - 1;
      let up = currIndex - this.size;
      let right = currIndex + 1;
      let down = currIndex + this.size;
      const row = emptyItem.getDestRow(this.size);
      const col = emptyItem.getDestCol(this.size);
      let allPositions = [left, up, right, down];
      let allowedSwaps = [];
      for (const position of allPositions) {
        let swapWith = this.findItemByPosition(position);
        if (swapWith == null) {
          continue;
        }
        if (emptyItem.isNeighbor(swapWith)) {
          allowedSwaps.push(swapWith);
        }
      }
      var nextIndexIsFound = false;
      do {
        const randomMoveIndex = Math.floor(Math.random() * allowedSwaps.length);
        if (randomMoveIndex != prevIndex) {
          let temp = allowedSwaps[randomMoveIndex].position;
          allowedSwaps[randomMoveIndex].position = emptyItem.position;
          emptyItem.position = temp;
          prevIndex = currIndex;
          nextIndexIsFound = true;
        }
      } while (nextIndexIsFound === false);
    }
  }

  findEmptyItem() {
    for (const item of this.items) {
      if (item.isEmpty) {
        return item;
      }
    }
  }

  findItemByPosition(position) {
    for (const item of this.items) {
      if (item.position === position) {
        return item;
      }
    }
  }
  findClickedItem(row, col) {
    var position = col + (row - 1) * this.size;
    for (const item of this.items) {
      if (item.position === position) {
        return item;
      }
    }
  }

  findClickedColumn(clickX) {
    var containerX = this.container.getBoundingClientRect().left;
    let output = Math.ceil((clickX - containerX) / (this.width / this.size));
    return output;
  }
}

$(document).ready(function() {
  $(document).on("click", ".untoggled", function(event) {
    const doc = document.querySelector(".untoggled");
    doc.classList.remove("untoggled");
    doc.classList.add("toggled");
    document.getElementById("nav-links").classList.add("nav-visible");
    document.getElementById("nav-links").classList.remove("nav-hidden");
  });

  $(document).on("click", ".toggled", function(event) {
    console.log("Closing...");
    const doc = document.querySelector(".toggled");
    doc.classList.remove("toggled");
    doc.classList.add("untoggled");
    document.getElementById("nav-links").classList.remove("nav-visible");
    document.getElementById("nav-links").classList.add("nav-hidden");
  });
});

$(document).ready(function() {
  startPuzzle();
  document.getElementById("btn-start").addEventListener("click", () => {
    startPuzzle();
  });

  // .addEventListener("click", () => {
  //   alert("Hello!!");
  //   // const doc = document.querySelector(".untoggled");
  //   //
  // });

  // $(document)
  //   .getElementsByClassName(".untoggled")
  //   .addEventListener("click", () => {
  //     alert("Hello!!");
  //     // const doc = document.querySelector(".untoggled");
  //     // doc.classList.remove("untoggled");
  //     // doc.classList.add("toggled");
  //     // document.getElementById("nav-links").classList.add("nav-visible");
  //     // document.getElementById("nav-links").classList.remove("nav-hidden");
  //   });

  // $(document)
  //   .getElementsByClassName(".toggled")
  //   .addEventListener("click", () => {
  //     console.log("Closing...");
  //     const doc = document.querySelector(".toggled");
  //     doc.classList.remove("toggled");
  //     doc.classList.add("untoggled");
  //     document.getElementById("nav-links").classList.remove("nav-visible");
  //     document.getElementById("nav-links").classList.add("nav-hidden");
  //   });
});

function startPuzzle() {
  document.getElementById("win-message").style.display = "none";
  document.getElementById("btn-start").innerText = "Reset";
  var puzzleWidth = document.getElementById("game").clientWidth;
  puzzle_game = new Puzzle(4, puzzleWidth);

  puzzle_game.startGame();
}
