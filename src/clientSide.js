// Login related
const loginDiv = document.querySelector('.login-container');

const loginForm = loginDiv.querySelector('.login-form');

const loginButton = document.querySelector('.login__button');

const mainGameDiv = document.querySelector('.main-game-page');

// WebSocket
const ws = new WebSocket('ws://192.168.0.12:8081');

ws.onopen = () => {
    console.log("Eu sou um cliente e estou conectado ao servidor.");

}

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
    case "startGame":
        console.log(message.message);
        theGameStarts();        
        break;
    }
}    

ws.onerror = (error) => {
    console.error('Erro na conexão WebSocket:', error);
  };



const handleSubmit = (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    let username = loginForm.querySelector('#username').value;
    console.log('Usuário:', username);
    loginDiv.style.display = 'none';
    mainGameDiv.style.display = 'flex';

    let message = {
        type: "newUserLogin",
        nickname: username,

    };

    sendMessageToServer(JSON.stringify(message));

}

const sendMessageToServer = (message) => {
    ws.send(message);

}

const theGameStarts = () => {
    // Manipule o DOM para mostrar a tela principal
    loginDiv.style.display = 'none';
    mainGameDiv.style.display = 'flex';
}


// fazer um event listener do form on submit com prevent default
loginForm.addEventListener('submit', handleSubmit);