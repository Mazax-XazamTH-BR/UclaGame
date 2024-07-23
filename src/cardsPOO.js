
export class Carta {
  constructor(id, name, baseCost, currentCost, image, baseAttack, currentAttack, baseLife, currentLife, keywords) {
    this.id = id;
    this.name = name;
    this.baseCost = baseCost;
    this.currentCost = currentCost
    this.image = image;
    this.baseAttack = baseAttack;
    this.currentAttack = currentAttack;
    this.baseLife = baseLife;
    this.currentLife = currentLife;
    this.keywords = keywords;
    this.currentLife = baseLife;
    this.totalDamage = 0;
    this.killCount = 0;
  }

  atacar(alvo) {
    if (this.currentLife > 0) {
      alvo.receberDano(this.currentAttack);
      this.totalDamage += this.currentAttack;
      
      // Verifica se o alvo morreu
      if (alvo.currentLife <= 0) {
        this.killCount += 1; // Incrementa o kill count se o alvo morreu
      }
    }
  }

  receberDano(dano) {
    if (this.currentLife > 0) {
      this.currentLife -= dano;
      if (this.currentLife <= 0) {
        this.morrer();
      }
    }
  }

  morrer() {
    this.currentLife = 0;
    // Aumenta o killCount apenas se for um ataque bem-sucedido (já incrementado na função atacar)
  }
  // como eu posso transformar isso em algo que possa ser usado aqui e passado pro clientSide.js, que é quem efetivamente tem acesso ao DOM???? Minha mente tá bugando, essa vai ser difícil
  criarImagemDaCarta() {
    // Criação do elemento da carta
    const cartaDiv = document.createElement('div');
    cartaDiv.className = 'carta';
  
    // Adiciona a imagem
    const imagem = document.createElement('img');
    imagem.src = this.image;
    imagem.alt = this.name;
    imagem.classList.add('card-image');
    cartaDiv.appendChild(imagem);
  
    // Adiciona o custo
    const custo = document.createElement('div');
    custo.textContent = `Custo: ${this.baseCost}`; // Adiciona "Custo:" para clareza
    custo.classList.add('card-cost-display');
    cartaDiv.appendChild(custo);
  
    // Adiciona a div dos stats
    const statsDisplay = document.createElement('div');
    statsDisplay.classList.add('card-stats');
  
    // Adiciona o ataque
    const ataque = document.createElement('p');
    ataque.classList.add('attack');
    ataque.textContent = `Ataque: ${this.baseAttack}`;
    statsDisplay.appendChild(ataque);
  
    // Adiciona a vida
    const vida = document.createElement('p');
    vida.classList.add('life');
    vida.textContent = `Vida: ${this.currentLife}`; // Adiciona "Vida:" para clareza
    statsDisplay.appendChild(vida);
  
    cartaDiv.appendChild(statsDisplay);

    return cartaDiv;

  }

    }
  
