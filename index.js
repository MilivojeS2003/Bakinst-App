
'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = (movements) => {
  containerMovements.innerHTML = '';
    movements.forEach(function(mov,i){
      console.log(i,mov);
      const type = mov > 0 ? 'deposit' : 'withdrawal';
      const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin',html);
      
    })
}

displayMovements(account1.movements)
const user = 'Steven Thomas Williams' //swt


// let username = user.toLowerCase()
// const usernameArr = username.split(' ')
// console.log(usernameArr);
// username = '';
// usernameArr.forEach(n => {
//   console.log(n[0])
//   username += n[0] 
// })
// console.log(username);

//Pametni nacin
const createUsername = function(accs){
    accs.forEach(acc => {
        let user = acc.owner
        let username = user.toLowerCase().split(' ').map(name => name[0]).join('')
        acc.username = username
        console.log(acc);
    })
    
}

const calcDisplayBalance = function(movements){
  console.log(movements);
    let balance = movements.reduce((mov,currentValue) => currentValue += mov,0)
    //console.log(`EVO GA BILANS:${balance}`);
    labelBalance.innerText = balance + '$'
}


createUsername(accounts)
calcDisplayBalance(account1.movements)



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

const movements = [200,300,400,-450,900,-600,1200,-240]

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
const current = 0;
const balance = movements.reduce((mov,curVal) => curVal + mov, 0)
console.log(balance);

const maxVal = movements.reduce((acc,mov) => {
  console.log(`OVO JE ACC: ${acc}, OVO JE MOV: ${mov}`);
  if(acc > mov){
    return acc;
  }else{
    return mov;
  }
},movements[0])
console.log(maxVal);