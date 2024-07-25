
export class Carta {
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
    cost.textContent = `${this.currentCost}`; // Adiciona "cost:" para clareza
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
  
