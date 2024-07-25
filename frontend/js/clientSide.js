// Login related
const loginDiv = document.querySelector('.login-container');

const loginForm = loginDiv.querySelector('.login-form');

//const loginButton = document.querySelector('.login__button');

const mainGameSection = document.querySelector('#main-game-section');
    mainGameSection.style.display = 'none';

const deckCodeNSelectSection = document.querySelector('#codigoESelecionar');

const interpretButton = document.getElementById('interpretButton');

// Classe Carta (POO)
class Carta {
    constructor(id, name, baseCost, currentCost, image, baseAttack, currentAttack, baseHealth, currentHealth, keywords) {
      this.id = id;
      this.name = name;
      this.baseCost = baseCost;
      this.currentCost = currentCost
      this.image = image;
      this.baseAttack = baseAttack;
      this.currentAttack = currentAttack;
      this.baseHealth = baseHealth;
      this.currentHealth = currentHealth;
      this.keywords = keywords;
      this.currentHealth = baseHealth;
      this.totalDamage = 0;
      this.killCount = 0;
    }
  
      // Método para atualizar o custo da carta
      updateCost(newCost) {
        this.cost = newCost;
        this.updateDOM();
    }
  
    // Método para atualizar ataque e vida da carta
    updateStats(newAttack, newHealth) {
        this.attack = newAttack;
        this.health = newHealth;
        this.updateDOM();
    }
  
    attack(alvo) {
      if (this.currentHealth > 0) {
        alvo.takeDamage(this.currentAttack);
        this.totalDamage += this.currentAttack;
        
        // Verifica se o alvo morreu
        if (alvo.currentHealth <= 0) {
          this.killCount += 1; // Incrementa o kill count se o alvo morreu
        }
      }
    }
  
   // Método para receber dano
   takeDamage(dano) {
    if (this.currentHealth > 0) {
        const newHealth = this.currentHealth - dano;
        if (newHealth <= 0) {
            this.morrer();
        }
        this.updateStats(this.currentAttack, newHealth); // Atualiza a vida após o dano
    }
  }
  
    morrer() {
      this.currentHealth = 0;
      // Aumenta o killCount apenas se for um ataque bem-sucedido (já incrementado na função attack)
    }
  
     // Método que cria ou atualiza a representação da carta no DOM
     updateDOM() {
      // Aqui você vai obter a carta correspondente no DOM e atualizá-la
      const cardElement = document.querySelector(`.card[data-id='${this.id}']`);
      if (cardElement) {
          cardElement.querySelector('.card-cost-display').textContent = this.currentCost;
          const statsDisplay = document.querySelector('card-stats');
          statsDisplay.querySelector('.card-attack').textContent = this.currentAttack;
          statsDisplay.querySelector('.card-health').textContent = this.currentHealth;
      }
  }
    
    criarImagemDaCarta() {
      // Criação do elemento da carta
      const cartaDiv = document.createElement('div');
      cartaDiv.className = 'carta';
      cartaDiv.dataset.id = this.id;
    
      // Adiciona a imagem
      const imagem = document.createElement('img');
      imagem.src = this.image;
      imagem.alt = this.name;
      imagem.classList.add('card-image');
      cartaDiv.appendChild(imagem);
    
      // Adiciona o custo
      const cost = document.createElement('div');
      cost.textContent = `${this.currentCost}`; 
      cost.classList.add('card-cost-display');
      cartaDiv.appendChild(cost);
    
      // Adiciona a div dos stats
      const statsDisplay = document.createElement('div');
      statsDisplay.classList.add('card-stats');
    
      // Adiciona o ataque
      const attack = document.createElement('div');
      attack.classList.add('card-attack');
      attack.textContent = `${this.currentAttack}`;
      statsDisplay.appendChild(attack);
    
      // Adiciona a vida
      const health = document.createElement('div');
      health.classList.add('card-health');
      health.textContent = `${this.currentHealth}`; 
      statsDisplay.appendChild(health);
    
      cartaDiv.appendChild(statsDisplay);
  
      return cartaDiv;
  
    }
  
      }


//
const handElement = document.getElementById('hand');

// WebSocket
const ws = new WebSocket('wss://uclagamewsserver.onrender.com');

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
        { console.log('Dados de cartas recebidos do servidor:', message.message)
        const cartas = message.message.map(cardData => {
            console.log('Processando dados da carta:', cardData);
            return  new Carta(
                cardData.id,
                cardData.name,
                cardData.currentCost,
                cardData.baseCost,
                cardData.image,
                cardData.currentAttack,
                cardData.baseAttack,
                cardData.currentHealth,
                cardData.baseHealth,
                cardData.keywords
            )
    });
     // Log para verificar a criação de instâncias
     console.log('Instâncias de Carta criadas no cliente:', cartas);
    // Exibir as cartas na mão do jogador
    displayCardsInHand(cartas);
    break; }
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



const displayCardsInHand = (cartas) => {
    // Exibe cada carta na mão
  cartas.forEach(carta => {
    // Certifique-se de que carta é uma instância de Carta
    if (carta instanceof Carta) {
    const cardContainer = carta.criarImagemDaCarta();
    handElement.appendChild(cardContainer);

    // Log para verificar a exibição de cada carta
    console.log('Carta exibida:', carta);

  } else {
    console.error('carta não é uma instância da classe Carta: ', carta);
  }

});
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