
const { parse } = require("dotenv");
const WebSocket = require("ws");

const wss = new WebSocket.Server({port:8081});

let players = [];

wss.on("connection", ws => {
    ws.on("error", console.error);
    console.log("Servidor online e rodando na porta 8081.");
    const playerId = crypto.randomUUID();
    const clientIp = ws._socket.remoteAddress; // Captura o endereço IP do cliente
    console.log(`Novo cliente conectado: Cliente ${playerId} com IP ${clientIp}`);

     // Inicializa o jogador
     let player = {
        id: playerId,
        ip: clientIp,
        nickname: '',
        deck: {},
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
                    if (players.length > 1) {
                        startTheGame();
                    }
                } else {
                    console.error('Mensagem de login recebida sem nickname:', parsedMessage);
                }
                break;

                // Adicione mais cases conforme necessário para outras mensagens

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

const startTheGame = () => {
    players.forEach(player => {
        player.ws.send(JSON.stringify({
            type: "startGame",
            message: "Dois jogadores conectados e devidamente identificados. O jogo pode começar!"
        }));
    });
};