const game = document.querySelector('.game')


// Création de la classe Game 
class Game {
    static new() {
        game.innerHTML = `
            <h2>Welcome !</h2>
            <input class="inputbox" type="text" placeholder="Your hero's name here ...">
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

                const avatar = "https://letdream.ap-south-1.linodeobjects.com/opendream.ori/1af2d21e-0a2b-11ee-8118-f23c938336bc-15288-0.jpg"

                let url = `https://thronesapi.com/api/v2/Characters`

                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        let id = Math.floor(Math.random() * data.length)
                        const character = data[id]

                        const gotName = character.fullName
                        const gotTitle = character.title
                        const gotAvatar = character.imageUrl

                        const player1 = new Player(name, profile, avatar)

                        const vs = document.createElement('img')
                        vs.classList.add('vs')
                        vs.src = './assets/VS.png'

                        game.appendChild(vs)

                        const player2 = new Player(gotName, gotTitle, gotAvatar)

                        player1.setOpponent(player2)
                        player2.setOpponent(player1)
                    })
                    .catch(error => console.log(error))

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
    constructor(name, spec, avatar, current) {
        this.name = name
        this.health = 100
        this.mana = 90
        this.spec = spec
        this.opponent = null

        this.current = current

        this.avatar = avatar

        this.card = this.createPlayer()
    }

    // attack qui attaque notre opposant
    attack() {
        const zone = document.querySelector('.zone')
        const dice = document.querySelector('.dice')
        const diceFace = dice.src.slice(-5, -4)

        if (diceFace > 3) {
            zone.innerHTML += "<h2 style=\"color: darkgreen\">Attack successful !</h2>"

            if (this.opponent.health > 10) {
                // On enlève la vie de l'opponent et on s'ajoute la mana
                this.opponent.health -= 10
                this.mana += 10

                // On représente les changements de mana et santé sur les cartes des joueurs (l'affichage)
                this.opponent.card.querySelector('.health').textContent = `Health : ${this.opponent.health}`
                this.card.querySelector('.mana').textContent = `Mana : ${this.mana}`
            } else {
                this.opponent.card.textContent = "You are dead ..."
                this.mana += 10
            }
        } else {
            zone.innerHTML += "<h2 style=\"color: darkred\">Attack failed</h2>"
        }

        const nextTurn = document.createElement('button')
        nextTurn.classList.add('next-turn')
        nextTurn.textContent = "Next Turn"
        zone.appendChild(nextTurn)

        nextTurn.addEventListener('click', () => {

            console.log(this.name)
            console.log(card.querySelector('h2').textContent)

            if (this.name === card.querySelector('h2').textContent) {
                document.querySelector('.zone').innerHTML = ""
            
                Game.rollDice()
    
                setTimeout(() => {
                    this.opponent.attack()
                }, 1550)
            } 

            nextBtn.remove()
        })
    }

    specialAttack() {
        const zone = document.querySelector('.zone')
        const dice = document.querySelector('.dice')
        const diceFace = dice.src.slice(-5, -4)

        switch (diceFace) {
            case "6":
                this.opponent.health -= 35
                zone.innerHTML += "<h2 style=\"color: darkgreen\">Special Attack successful !</h2>"
                break
            case "5":
                this.opponent.health -= 30
                zone.innerHTML += "<h2 style=\"color: darkgreen\">Special Attack successful !</h2>"
                break
            case "4":
                this.opponent.health -= 20
                zone.innerHTML += "<h2 style=\"color: darkgreen\">Special Attack successful !</h2>"
                break
            case "3":
                this.health -= 5
                zone.innerHTML += "<h2 style=\"color: darkred\">Special Attack failed</h2>"
                break
            case "2":
                this.health -= 10
                zone.innerHTML += "<h2 style=\"color: darkred\">Special Attack failed</h2>"
                break
            case "1":
                this.health -= 20
                zone.innerHTML += "<h2 style=\"color: darkred\">Special Attack failed</h2>"
                break
            default:
                console.log("Error")
                break
        }
        this.card.querySelector('.health').textContent = `Health : ${this.health}`
        this.opponent.card.querySelector('.health').textContent = `Health : ${this.opponent.health}`
    }

    // createPlayer
    createPlayer() {

        // Je crée ma "card" pour mon joueur, c'est à dire son affichage
        const card = document.createElement('div')
        card.classList.add('card')

        if (this.current === true) {
            card.classList.add('current')
        } else {
            card.classList.remove('current')
        }

        card.innerHTML = `
            <img class="avatar" src="${this.avatar}">
            <h2>${this.name}</h2>
            <h3>${this.spec}</h3>
            <p class="health">Health : ${this.health}</p>
            <p class="mana">Mana : ${this.mana}</p>
            <button class="button attack-btn">Attack</button>
            <button class="button spec-btn">Special Attack</button>
        `
        const attackBtn = card.querySelector('.attack-btn')
        const specBtn = card.querySelector('.spec-btn')

        // Écouteur d'événement pour l'attaque
        attackBtn.addEventListener('click', () => {
            document.querySelector('.zone').innerHTML = ""

            Game.rollDice()

            setTimeout(() => {
                this.attack()
            }, 1550)

            attackBtn.disabled = true, attackBtn.style.opacity = 0.5
            specBtn.disabled = true, specBtn.style.opacity = 0.5
        })

        specBtn.addEventListener('click', () => {
            document.querySelector('.zone').innerHTML = ""

            if (this.mana >= 30) {
                this.mana -= 30
                card.querySelector('.mana').textContent = `Mana : ${this.mana}`
                Game.rollDice()
            } else if (this.mana < 30) {
                document.querySelector('.zone').innerHTML = "<h2 style=\"color: darkred\">You don't have enough mana !</h2>"
            }

            setTimeout(() => {
                this.specialAttack()
            }, 1550)

            attackBtn.disabled = true, attackBtn.style.opacity = 0.5
            specBtn.disabled = true, specBtn.style.opacity = 0.5
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