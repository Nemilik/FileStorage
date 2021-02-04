// const person1 = {
//   name: 'Алексей',
//   family: 'Данчин',
//   sayHello() {
//       console.log(`Имя: ${this.name}, Фамилия: ${this.family}`)
//   }
// }

// person1.sayHello

// const person2 = {
//   name: 'Евгений',
//   family: 'Цыпляев'
// }

// sayHello.bind(person1)()
// sayHello.bind(person2)()

// function sayHello() {
//   console.log(`Имя: ${this.name}, Фамилия: ${this.family}`)
// }

class Person {
  constructor (name, family) {
    this.name = name
    this.family = family
  }

  hallo() {
    console.log(`Имя: ${this.name} Фамилия: ${this.family}`)
  }
}

const person = new Person('Женя', 'Цыпляев')

person.hallo()