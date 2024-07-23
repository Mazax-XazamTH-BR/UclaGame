
//import { parse } from 'dotenv'; // Para carregar variáveis de ambiente
//const { split } = require("postcss/lib/list");
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8081 });

let players = [];

let now = new Date();

wss.on("connection", ws => {
    ws.on("error", console.error);
    console.log("Servidor online e rodando na porta 8081.");
    const playerId = crypto.randomUUID();
    const clientIp = ws._socket.remoteAddress; // Captura o endereço IP do cliente
    console.log(`Novo cliente conectado: Cliente ${playerId} com IP ${clientIp} ${now.toLocaleString()}`);

     // Inicializa o jogador
     let player = {
        id: playerId,
        ip: clientIp,
        nickname: '',
        deck: [],
        avatarLife: 25, // Adiciona avatarLife
        mana: 1, // Adiciona mana
        score: 0,
        ws: ws // Adiciona a referência ao WebSocket para este jogador
    };

    ws.on('message', (message) => {
        try {
            let parsedMessage = JSON.parse(message);
            
            switch (parsedMessage.type) {
            case 'newUserLogin':
                if (parsedMessage.nickname) { // Verifica se a mensagem contém nickname
                    player.nickname = parsedMessage.nickname; // Atribui o nickname ao jogador
                    players.push(player);
                    console.log(`Jogador ${player.nickname} conectado com ID ${playerId} e IP ${clientIp}`);
                    console.log(`players.length ${players.length}`);
                    if (players.length > 1) {
                        requestDeckCode();
                        //startTheGame();
                    }
                } else {
                    console.error('Mensagem de login recebida sem nickname:', parsedMessage);
                }
                break;
            case 'deckCode':
                if (parsedMessage.deckCode) {
                    interpretDeckCode(parsedMessage.deckCode, player);
                }    
                break;
                // Adicione mais cases conforme necessário para outras mensagens
            case 'cardDraw':
                if (parsedMessage.amount) {
                    drawCard(player, parsedMessage.amount, );
                }
                break;    
                default:
                    console.log('Tipo de mensagem desconhecido:', parsedMessage.type);
                    break;
            }
    } catch (error) {
        console.error('Erro ao processar mensagem JSON:', error);
    }
});
ws.on('close', () => {
    players = players.filter(p => p.id !== playerId);
    console.log(`Jogador ${playerId} desconectado.`);
});
        
    })
    


console.log("O Servidor está ligado.");

// ---------------------------------------------

// import { cards, cardsTextDescription } from './cards.js'; // importando as cartas

import { Carta } from './cardsPOO.js';

//console.log(cards);
//console.log(cardsTextDescription);

const startTheGame = () => {
    players.forEach(player => {
        player.ws.send(JSON.stringify({
            type: "startGame",
            message: "Tudo pronto para começar a partida!"
        }));
    });
};

const requestDeckCode = () => {
    players.forEach(player => player.ws.send(JSON.stringify({
        type: "requestDeckCode",
        message: "Dois jogadores conectados e devidamente identificados. Selecionem seus decks."
    })));
}

//----------------------------------------------------------------

let editMode = false;

// ----------------------------------------------------------------

const interpretDeckCode = (deckCode, player) => {
    //...
    let cardIds = deckCode.split('|');
    let deckCardCount = cardIds.length;
    let handCardCount = 0;

    if (!editMode && deckCardCount < 30) {
        alert('Tamanho do deck inválido.');
        return;
      }

      player.deck = cardIds.map(cardId => {
        let card = cards.find(c => c.id === parseInt(cardId));
        if (card) {
            return {
                name: card.name,
                id: card.id,
                cost: card.baseCost,
                image: card.image,
                attack: card.baseAttack,
                life: card.baseLife
            };
        } else {
            console.error("ID de carta inválida:", cardId);
            console.error("Por favor, insira um código de deck válido!");
            return null;
        }
    }).filter(card => card !== null);

    console.log(`Deck de ${player.nickname} foi carregado com sucesso.`);

    shuffleDeck(player.deck);
    // Verifica se todos os decks têm pelo menos 30 cartas
    if (!editMode && players.every(p => p.deck.length >= 30)) {
        // Iniciar o jogo
        startTheGame();
    } else if (editMode) {
     startTheGame(); // se estiver no modo de edição, começar o jogo mesmo assim
    }
}

  
    const shuffleDeck = (deck) => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        console.log('Deck embaralhado: ');
        console.table(deck);
    }

    const drawCard = (player, amount = 1) => {
        let deck = player.deck; // copiar o array player.deck
        let arrayCardsDrawn = [];
        let cardDrawn;
        // a carta comprada é o primeiro elemento do array deck
        for (let i = 0; i < amount; i++) {
          cardDrawn = deck.shift();
          arrayCardsDrawn.push(cardDrawn);  
        }
        
       createCardObjects(player, arrayCardsDrawn);
    };

    const createCardObjects = (player, array = []) => {
        // intanciar objetos da classe carta
        console.log('array:');
        console.log(array);
    
        let cardsCreated = []
    
        array.forEach(card => {
            let cardKeywords = cards.find(c => c.id === card.id).keywords;
    
            const cardName = cards.find(c => c.id === card.id).name;
    
           
            const novaCarta = new Carta(card.id, cardName, card.cost, card.cost, card.image, card.attack, card.attack, card.life, card.life, cardKeywords);
            
            cardsCreated.push(novaCarta);
        })
        let message = {
            type: 'cardsCreated',
            message: cardsCreated
        }
        player.ws.send(JSON.stringify(message));
    }
    
