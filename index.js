'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});


// MAP 

// const movements = [200,300,400,-450,900,-600,1200,-240]

// const eutToUsd = 1.1;
// console.log('OVO JE ZA MAP');
// const movementsInUSD = movements.map((move,i,arr) =>{
//     const eurToUsd = 1.1;
//     const usdPrice = move * eurToUsd;
//     const type = usdPrice > 0 ? 'positiv' : 'negative';
//     console.log(`Number ${i+1} is ${type}`);
//     return usdPrice
// })
// console.log(movementsInUSD);


// // Moze i sa prolazenjem kroz niz u push metodom == MAP
// const movementsInUSDfor = [];
// for(const mov of movements){
//   movementsInUSDfor.push(mov * eutToUsd);
// }

// console.log(movementsInUSDfor);


// FILTER

// const movements = [200,300,400,-450,900,-600,2200,-240]

// const deposit = movements.filter(mov =>{
//   console.log(mov);
//   if(mov>0){
//     return 1;
//   }else{
//     return 2;
//   }
//     //return mov > 0;
// })

// console.log(deposit);


// REDUCE
// const current = 0;
// const balance = movements.reduce((mov,curVal) => curVal + mov, 0)
// console.log(balance);

// const maxVal = movements.reduce((acc,mov) => {
//   console.log(`OVO JE ACC: ${acc}, OVO JE MOV: ${mov}`);
//   if(acc > mov){
//     return acc;
//   }else{
//     return mov;
//   }
// },movements[0])
// console.log(maxVal);


// FIND METHOD

// const firstNegative = movements.find(mov => mov < 0);
// console.log(firstNegative);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis')
// console.log(account);


// const lastWithdrawal = movements.findLast(mov => mov < 0)
// console.log(lastWithdrawal);

// const lastInd = movements.findLastIndex(mov => Math.abs(mov) > 2000)
// console.log(lastInd);

// console.log(movements.includes(-130));


// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];


// const newBreeds = breeds.find(breed => breed.activities.includes('fetch') && breed.activities.includes('running'))
// console.log(newBreeds);


// // let allActivitie = [];
// // allActivitie.push(breeds.find(breed => breed.activities))
// // console.log(allActivitie);
// let newArray = [];
// breeds.map(breed => {
//   console.log(breed.activities);
//   newArray.push(breed.activities)
// })
// console.log(newArray.flat());

// let allActivitie = [...new Set(newArray.flat())]
// console.log(allActivitie);

// //let swimmingAdjancet = [];
// newArray = []
// breeds.map(breed => {  
//   if(breed.activities.includes('swimming')){
//       newArray.push(breed.activities)
//   }

//   })
// let swimmingAdjancet = newArray.flat()
// swimmingAdjancet = swimmingAdjancet.filter(item => item !== 'swimming')
// console.log(swimmingAdjancet);

// let averageWeight = breeds.map(breed => breed.averageWeight)
// console.log(averageWeight.every(item => item > 10));

// console.log(breeds.every(breed => breed.averageWeight > 10));

// const fetchBreeds = breeds.filter(breed => breed.activities.includes('fetch')).map(breed => breed.averageWeight)
// const avgFetchBreeds = fetchBreeds.reduce((sum,item) => sum+item,0) / fetchBreeds.length
// console.log(fetchBreeds);
// console.log(avgFetchBreeds);


// SORT 

//let newArray = [1,2,3,4,5,6,7,9,8,10]

// OPADAJUCE SORTIRANJE
// newArray.sort((a,b) => {
//   if(a>b) return -1;
//   if(b>a) return 1;
// })

// // NORMALNO SORTIRANJE
// newArray.sort((a,b) => {
//   if(a>b) return 1;
//   if(b>a) return -1;
// })

// console.log(newArray);

// newArray.sort((a,b) => b-a);
// console.log(newArray);

// newArray.sort((a,b) => a-b);
// console.log(newArray);


// const movements = [200,300,400,-450,900,-600,2200,-240]

// const groupedMovement = Object.groupBy(movements, mov => mov > 0 ? 'deposit' : 'withdrawalas')
// console.log(groupedMovement);

// const groupByActive = Object.groupBy(accounts, account => {
//   const movementCount = account.movements.length;

//   if(movementCount > 5) return 'very active';
//   if(movementCount > 3) return 'active';
//   if(movementCount > 1) return 'inactive';

// })
// console.log(groupByActive);

// // FROM METOD

// let arr1 = Array.from("MILIVOJE")
// console.log(arr1);

// let arr2 = [2,3,4]
// let arr3 = Array.from(arr2,x => x*2)
// console.log(arr3);

// labelBalance.addEventListener("click", ()=>{
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent) * 2
//   )

//   console.log(movementsUI);
// })


// Kopija vrijednosti niza iz arr4 u arr5 na novoj adresi
// let arr4 = [1,2,3,4,5,6,7]
// let arr5 = [...arr4]

// console.log(arr4);


// //
// console.log(arr5.slice(1,4));
// let arr6 = arr4.slice().reverse()
// console.log(arr6);
// console.log(arr4);

// let arr7 = arr6.toReversed()
// console.log(arr7);



/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:


GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => dog.recFood = Math.floor(dog.weight ** 0.75 * 28))
console.log(dogs);

const sarahDogs = dogs.filter(dog => dog.owners.includes('Sarah'))
console.log(sarahDogs);
sarahDogs.forEach(dog => {
  if(dog.curFood > dog.recFood){
    console.log(`Dog is eat to much`);
  }else{
    console.log(`Dog is not eat to much`);
  }
})


const ownersTooMuch = dogs.filter(dog => dog.curFood > dog.recFood).map(dog => dog.owners).flat()
console.log(ownersTooMuch);


const randomGenerator = (min,max) => {
  let random = Math.random() // GEN NUMBER 0 -> 1
  console.log(`GEN NUMBER: ${random}`);
  return (Math.trunc(random * (max-min) + 1) + min) 

}


console.log(randomGenerator(10,20));
console.log(randomGenerator(1,4));


