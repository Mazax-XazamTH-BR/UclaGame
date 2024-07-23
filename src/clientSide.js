// Login related
const loginDiv = document.querySelector('.login-container');

const loginForm = loginDiv.querySelector('.login-form');

const loginButton = document.querySelector('.login__button');

const mainGameSection = document.querySelector('#main-game-section');
    mainGameSection.style.display = 'none';

const deckCodeNSelectSection = document.querySelector('#codigoESelecionar');

const interpretButton = document.getElementById('interpretButton');

// WebSocket
const ws = new WebSocket('ws://192.168.0.12:8081');

ws.onopen = () => {
    console.log("Eu sou um cliente e estou conectado ao servidor.");

}

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
    case "requestDeckCode":
        console.log(message.message);
        askForDeckCode();
        break;
    case "startGame":
        console.log(message.message);
        theGameStarts();        
        break;
 
    case 'cardsCreated':
        console.log(message.message)
        const cardObjects = message.message
        displayCardsInHand(cardObjects);      
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

    let message = {
        type: "newUserLogin",
        nickname: username,

    };

    sendMessageToServer(JSON.stringify(message));

}

const sendMessageToServer = (message) => {
    ws.send(message);

}

// import { cards, cardsTextDescription } from './cards.js'; // importando as cartas


const editMode = false;

const theGameStarts = () => {
    // Manipule o DOM para mostrar a tela principal
    mainGameSection.style.display = 'flex';
    deckCodeNSelectSection.style.display = 'none';
    if (editMode) {
        drawCard();
        return;
     } 
 drawCard (6)       
    
}

const askForDeckCode = () => {
    loginDiv.style.display = 'none';
    deckCodeNSelectSection.style.display = 'flex';
}

const drawCard = (amount = 1) => {
    let message = {
        type: 'cardDraw',
        amount: amount
    };
    message = JSON.stringify(message);
    sendMessageToServer(message);
}



const displayCardsInHand = (cardObjects) => {
    // Exibe cada carta na mão
  cardObjects.forEach(carta => {
    carta.criarImagemDaCarta()













  }

  );
}

// fazer um event listener do form on submit com prevent default
loginForm.addEventListener('submit', handleSubmit);

// ao clicar no botão de selecionar deck
interpretButton.addEventListener('click', () => {
    let deckCode = document.getElementById('deckCodeInput').value;
    let message = {
        type: 'deckCode',
        deckCode: deckCode
    }
    console.log(`Deck (${message.deckCode}) enviado para o servidor com sucesso. Aguardar pelo oponente e pela respota do servidor.`)
    message = JSON.stringify(message);
    sendMessageToServer(message);
})