const buttoncolor = [
  "Red",
  "Yellow",
  "Gray",
  "Pink",
  "Purple",
  "Orange",
  "Green",
];

const successMessage = "Excellent memory!";
const failMessage = "Wrong order!";

class Buttons {
  constructor(color, number) {
    this.btn = document.createElement("button");
    this.btn.style.backgroundColor = color;
    this.btn.textContent = number;
    this.btn.style.position = "absolute";
    this.btn.id = `${number}`;
  }

  setBtnLocation(left, top) {
    this.btn.style.top = `${top}px`;
    this.btn.style.left = `${left}px`;
  }

  // the logic of how to restrict buttons move within browser window was inspired from the use of chatGPT
  setRandomBtnLocation(container) {
    const containerrect = container.getBoundingClientRect();

    const containerWidth = containerrect.width;
    const containerHeight = containerrect.height;

    const buttonWidth = this.btn.offsetWidth;
    const buttonHeight = this.btn.offsetHeight;

    const maxHeight = containerHeight - 2 * buttonHeight;
    const maxWidth = containerWidth - 2 * buttonWidth;

    const top = Math.floor(Math.random() * maxHeight);
    const left = Math.floor(Math.random() * maxWidth);

    this.setBtnLocation(left, top);
  }

  getButton() {
    return this.btn;
  }
}

class buttonContainer {
  constructor(id) {
    this.container = document.getElementById(id);
    this.buttonArray = [];
    this.buttoncolor = buttoncolor;
  }

  clear() {
    this.container.innerHTML = "";
    this.buttonArray = [];
    this.buttoncolor = buttoncolor;
  }

  selectRandomBtnColor() {
    const colornum = buttoncolor.length;
    const randomIndex = Math.floor(Math.random() * colornum);

    const selectedColor = buttoncolor[randomIndex];
    buttoncolor.splice(randomIndex, 1);

    return selectedColor;
  }

  addButtontoContainer(button) {
    this.container.appendChild(button.getButton());
    this.buttonArray.push(button);
  }

  displayInRow() {
    let left = 0;
    for (let i = 0; i < this.buttonArray.length; i++) {
      const button = this.buttonArray[i];
      button.setBtnLocation(left, 0);
      left += button.getButton().offsetWidth + 10;
    }
  }

  // the logic of how to scramble buttons and pause buttons was inspired from the use of chatGPT

  scrambleButtons(inputValue) {
    let scrambleTimes = 0;
    const scramble = () => {
      if (scrambleTimes < inputValue) {
        setTimeout(scramble, 2000);
        this.buttonArray.forEach((button) => {
          button.setRandomBtnLocation(this.container);
        });
      } else {
        this.removeButtonNum();
      }
      scrambleTimes++;
    };
    scramble();
  }

  removeButtonNum() {
    this.buttonArray.forEach((button) => {
      button.getButton().textContent = "";
    });
  }
}

class buttonSeqCheck {
  constructor(container, game) {
    this.container = container;
    this.init();
    this.game = game;
    this.correctId = 1;
    this.size = container.buttonArray.length;
  }

  init() {
    this.container.buttonArray.forEach((button) => {
      button
        .getButton()
        .addEventListener("click", () => this.getClickedButtonIds(button));
    });
  }

  getClickedButtonIds(button) {
    const buttonid = button.getButton().id;
    this.checkCorrectSeq(button, buttonid);
  }

  displayCheckMessage(message) {
    document.getElementById("message-area").textContent = message.getContent();
  }

  revealCorrectOrder() {
    this.container.buttonArray.forEach((button) => {
      button.getButton().textContent = button.getButton().id;
    });

    setTimeout(() => {
      this.game.endGame();
    }, 2000);
  }

  checkCorrectSeq(button, currentid) {
    if (this.correctId != currentid) {
      var wrongMessage = new Message(failMessage);
      this.revealCorrectOrder();
      this.displayCheckMessage(wrongMessage);
    } else if (this.correctId == this.size) {
      var correctMessage = new Message(successMessage);
      this.displayCheckMessage(correctMessage);
      setTimeout(() => {
        this.game.endGame();
      }, 500);
    } else if (this.correctId == currentid) {
      document.getElementById(currentid).textContent = button.getButton().id;
    }
    this.correctId++;
  }
}

class buttonGame {
  constructor(container) {
    this.color = buttoncolor;
    this.container = container;
  }

  start(input) {
    this.container.clear();
    for (let i = 0; i < input; i++) {
      this.container.addButtontoContainer(
        new Buttons(this.container.selectRandomBtnColor(), i + 1)
      );
    }
    this.container.displayInRow();

    // initial pause: n*1 seconds
    setTimeout(() => {}, input * 1000);

    // after initial pause, scramble buttons and inbetween them pause 2 seconds.
    setTimeout(() => {
      this.container.scrambleButtons(input);
    }, 2000);
  }

  endGame() {
    this.container.clear();
    document.getElementById("message-area").textContent = "";
    document.getElementById("input-value").value = "";
  }

  checkUserInput(inputValue) {
    if (inputValue < 3 || inputValue > 7) {
      alert("the user input need to be between 3 and 7!");
    } else {
      return true;
    }
  }

  getUserInput() {
    const inputValue = document.getElementById("input-value").value;
    if (this.checkUserInput(inputValue)) {
      this.start(inputValue);
    }
  }
}

const game = new buttonGame(new buttonContainer("button-display-area"));
document.getElementById("start-button").addEventListener("click", () => {
  game.getUserInput();
  new buttonSeqCheck(game.container, game);
});
