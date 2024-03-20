class Student {
    #name;
    #age;
    #role;
    #city;

    constructor(name, age, role, city) {
        this.#name = name;
        this.#age = age;
        this.#role = role;
        this.#city = city;
    }

    passerExamen() {
        return `${this.#name} a passé l'examen quand il a eu ${this.#age} ans à ${this.#city}`;
    }
}

let john = new Student('John', 34, 'student', 'Paris');

console.log(john.passerExamen());