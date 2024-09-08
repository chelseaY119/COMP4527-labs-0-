class Message {
  constructor(content) {
    this.content = content;
  }

  getContent() {
    return this.content;
  }
}

var message = new Message("How many buttons you want to create?");

function displayMessage() {
  document.getElementById("display-message").textContent = message.getContent();
}

document.addEventListener("DOMContentLoaded", displayMessage);
