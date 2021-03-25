"use strict";

const messageSystem = {
  startFetching() {
    this.fetchMessages();

  },

  sendMessage(msg) {
    fetch(`https://thecrew.cc/api/message/create.php?token=${userSystem.getToken()}`, {
        method: "POST",
        body: JSON.stringify({
          message: msg
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        this.fetchMessages();

      });
    // https://thecrew.cc/api/message/create.php?token=__TOKEN__ POST
  },

  fetchMessages() {
    console.log("Fetch!");
    fetch(`https://thecrew.cc/api/message/read.php?token=${userSystem.getToken()}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        let message = document.getElementById("output");
        message.innerHTML = "";
        let htmlString = '';

        data.forEach(function (value) {
          htmlString = htmlString + `
        <div class="message">
        <span class="by">${value.handle}</span>
        <span class="on">${value.created_at}</span>
        <p>${value.message}</p>
      </div>
    `;
        });
        message.insertAdjacentHTML("beforeEnd", htmlString);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const userSystem = {
  token: "",
  loggedIn: false,

  saveToken() {
    localStorage.setItem("token", this.token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  logout() {
    localStorage.removeItem("token");
  },

  login(email, password) {

    fetch(`https://thecrew.cc/api/user/login.php`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.token);
        this.token = data.token;
        this.saveToken();
        display.render();
      });

    // https://thecrew.cc/api/user/login.php POST
  },

  updateUser(password, handle) {
    fetch(`https://thecrew.cc/api/user/update.php?token=${this.token}`, {
      method: "POST",
      body: JSON.stringify({
        handle: handle,
        password: password
      })
    });

    // https://thecrew.cc/api/user/update.php?token=__TOKEN__ POST
  }
};

const display = {
  initFields() {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("yo!");
      const email = document.getElementById("emailField");
      const password = document.getElementById("passwordField");
      console.log(email.value, password.value);
      userSystem.login(email.value, password.value);

    });


  },
  render() {
    const token = userSystem.getToken();
    if (token) {
      console.log("Welcome!");
      document.getElementById("loginWindow").style.display = "none";
      messageSystem.startFetching();

      const messageForm = document.getElementById("messageForm");
      messageForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const value = document.getElementsByName('userMessage')[0].value;
        console.log(value);
        messageSystem.sendMessage(value);
      });

      const button = document.getElementById("logoutBtn");
      button.addEventListener("click", function (e) {
        userSystem.logout();
        window.location.reload();
      });

    } else {
      console.log("Not logged in!");
    }


  }
};
display.render();
display.initFields();