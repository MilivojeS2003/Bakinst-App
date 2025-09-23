////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES



/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e', 'f'];

// // SLICE
// console.log(arr.slice(2,4));
// console.log(arr.slice(-3));
// console.log(arr.slice(1,-2));

// console.log('-------------------------------')

// // SPLICE -> Delete 

// //console.log(arr.splice(2));
// //console.log(arr.splice(-1));
// console.log(arr.splice(1,4));
// console.log(arr)


// // REVERSE

// const arr2 = ['f' , 'l' , 'j' , 'm' ,'k'];
// console.log(arr2.reverse());
// console.log(arr2)


// // CONCAT 

// let letter = arr.concat(arr2);
// console.log(letter);

// // AT

// let noviNiz = [12,13,14]
// console.log(noviNiz.at(0));
// console.log(noviNiz.slice(-1)[0]);

// FOR EACH

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


// for (const i in movements){
//   if(movements[i] > 0){
//     console.log(`Negativa ${movements[i]}`);
//   }else{
//     console.log(`Pozitivan ${movements[i]}`);
//   }
// }

movements.forEach(function(movement,index){
  if(movement > 0){
    console.log(`Item ${index}: negativa ${movement}`);
  }else{
    console.log(`Item ${index}: pozitivan ${movement}`);
  }
})

// 0: function(200)
// 1: function(450)
// 2: function(-400)


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value,key,map){
  console.log(`${key}: ${value}`);
})

const currenciesUnique = new Set(['USD', 'GBP', 'EUR', 'EUR'])
console.log(currenciesUnique);