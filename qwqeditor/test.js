const mymodule = require('./build/Release/mymodule');

const person = mymodule.createPerson("Alice", 3230);
console.log("Person:", person);  // 输出 { name: 'Alice', age: 30 }
