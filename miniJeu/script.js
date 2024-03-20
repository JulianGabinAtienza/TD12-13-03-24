const game = document.querySelector('.game')


// Création de la classe Game 
class Game {
    static new() {
        game.innerHTML = `
            <h2>Welcome !</h2>
            <input type="text" placeholder="Your hero's name here ...">
            <h2>Choose your profile : </h2>
            <select>
                <option value="Warrior">Warrior</option>
                <option value="Wizard">Wizard</option>
                <option value="Barbarian">Barbarian</option>
                <option value="Mercenary">Mercenary</option>
            </select>
            <button>GO</button>
        `
        const btn = document.querySelector('button')
        
        btn.addEventListener('click', () => {
            const name = document.querySelector('input').value
            const profile = document.querySelector('select').value

            if (name.length > 0) {
                // Création de la zone pour les dés et les messages suite aux attaques
                game.innerHTML = "<div class=\"zone\"></div>"
    
                // Création du joueur 1 (nous) et du joueur 2 (ennemi)
                const player1 = new Player(name, profile)
                const player2 = new Player('Kratos', 'Barbare')
    
                player1.setOpponent(player2)
                player2.setOpponent(player1)

            } else {
                const error = document.createElement('p')
                error.innerHTML += "<p class=\"error\" style=\"color: darkred\"><b>Please give a name to your hero !</b></p>"
                game.appendChild(error)
            }
        })
    }

    static newDice() {
        // On génère un chiffre aléatoire entre 1 et 6
        const random = Math.floor(Math.random() * 6) + 1

        const img = document.createElement('img')
        img.classList.add('dice')

        img.src = `./assets/dice-six-faces-${random}.png`

        return img
    }

    static rollDice() {
        const zone = document.querySelector('.zone')
        let newDice = this.newDice()

        zone.appendChild(newDice)

        const interval = setInterval(() => {
            let diceImg = document.querySelector('.dice')
            let newDice = this.newDice()

            diceImg.src = newDice.src
        }, 80)

        setTimeout(() => {
            clearInterval(interval)
        }, 1500)
    }
}


// Création de la classe PLayer
class Player {
    constructor(name, spec) {
        this.name = name
        this.health = 100
        this.mana = 100
        this.spec = spec
        this.opponent = null

        this.card = this.createPlayer()
    }

    // getDetails retourne le nom et la spé du joueur
    getDetails() {
        return `${this.name} (${this.spec})`
    }

    // attack qui attaque notre opposant
    attack() {
        const zone = document.querySelector('.zone')
        const dice = document.querySelector('.dice')
        const diceFace = dice.src.slice(-5, -4)

        if (diceFace > 3) {
            zone.innerHTML += "<h2 style=\"color: darkgreen\">Attack successful !</h2>" 

            if (this.opponent.health > 10) {
                this.opponent.health -= 10
                this.opponent.card.querySelector('.health').textContent = `Health : ${this.opponent.health}`
            } else {
                this.opponent.card.textContent = "You are dead ..."
            }
        } else {
            zone.innerHTML += "<h2 style=\"color: darkred\">Attack failed</h2>" 

        }
    }

    // createPlayer
    createPlayer() {
        // Je crée ma "card" pour mon joueur, c'est à dire son affichage
        const card = document.createElement('div')
        card.classList.add(`${this.name}-card`)

        card.innerHTML = `
            <h2>${this.getDetails()}</h2>
            <p class="health">Health : ${this.health}</p>
            <p class="mana">Mana : ${this.mana}</p>
            <button class="attack-btn">Attack</button>
            <button class="spec-btn">Special Attack</button>
        `
        const attackBtn = card.querySelector('.attack-btn')

        // Écouteur d'événement pour l'attaque
        attackBtn.addEventListener('click', () => {
            document.querySelector('.zone').innerHTML = ""

            Game.rollDice()

            setTimeout(() => {
                this.attack()
            }, 1550)
        })

        // J'ajoute ma card à mon jeu
        game.appendChild(card)

        return card
    }

    // setOpponent pour précisr qui est l'ennemi
    setOpponent(opponent) {
        this.opponent = opponent
    }
}

Game.new()