
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

const displayMovements = (acc,sort = false) => {
  containerMovements.innerHTML = '';
  let movements = [...acc.movements]
  if(sort){
      movements = movements.sort((a,b) => a-b);
  }
    console.log(`OVO JE SORTIRANI NIZ: ${acc.movements}`);
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

displayMovements(account1)
const user = 'Steven Thomas Williams' //swt

const createUsername = function(accs){
    accs.forEach(acc => {
        let user = acc.owner
        let username = user.toLowerCase().split(' ').map(name => name[0]).join('')
        acc.username = username
        //console.log(acc);
    })
    
}
createUsername(accounts)

const calcDisplayBalance = function(acc){
    let balance = acc.movements.reduce((mov,currentValue) => currentValue += mov,0)
    //console.log(`EVO GA BILANS:${balance}`);
    acc.balance = balance
    labelBalance.innerText = balance + '$'
}

const calcdisplaySummary = function(acc){
    let incomes = acc.movements.filter(mov => mov > 0).reduce((sum,mov) => mov+sum, 0)
    labelSumIn.innerText = `${incomes}€`;

    let outcomes = acc.movements.filter(mov => mov < 0).reduce((sum,mov) => sum+mov, 0)
    labelSumOut.innerText = `${Math.abs(outcomes)}€`;

    let interest = acc.movements.filter(mov => mov > 0).map(mov => mov * 1.2 / 100).reduce((sum,mov) => sum+mov, 0)
    labelSumInterest.innerText = `${interest}€`;
}

//UPDATE UI
const updateUi = function(acc){
  calcDisplayBalance(acc)
  calcdisplaySummary(acc)
  displayMovements(acc)
}




// EVENT HANDLER

let currentAccount;

btnLogin.addEventListener("click", (e)=>{
    e.preventDefault();
    //console.log(inputLoginUsername.value, inputLoginPin.value);

    let username = inputLoginUsername.value;
    let pin = inputLoginPin.value;
    inputLoginUsername.value = '';
    inputLoginPin.value = ''
    currentAccount = accounts.find(acc => {
      if(acc.username === username && acc.pin.toString() === pin){
        labelWelcome.textContent = `Welcome back, ${acc.owner.split(' ')[0]}`
        containerApp.style.opacity = "1";
        //console.log(`NALOG KOJI JE PROSAO ${acc.owner}`);
        return acc
        //const loginAccount = acc;
        // console.log(`NALOG KOJI JE ULOGOVAN ${loginAccount}`);
      }
    })

    //console.log(currentAccount);
    if(currentAccount){
      updateUi(currentAccount)
    }else{
      alert('ERROR')
    }
    

})


// TRANSFER LOGIC

btnTransfer.addEventListener("click", (e)=> {
  e.preventDefault();

  const inputTransferToValue = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc.username === inputTransferToValue)

  inputTransferTo.value =  inputTransferAmount.value =  '';
  
  if(receiverAccount && amount > 0 && amount <= currentAccount.balance && currentAccount.username !== receiverAccount.username){
      console.log('TRANSAKCIJA JE MOGUCA');
      // Doing the tranform
      currentAccount.movements.push(-amount);
      receiverAccount.movements.push(amount);
      updateUi(currentAccount)

  }else{
    alert('Error')
  }

})


// CLOSE ACCOUNT

btnClose.addEventListener("click", (e)=>{
  e.preventDefault();

  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);


  
  if(currentAccount.username === username && currentAccount.pin === pin){
    const indexAcc = accounts.findIndex((acc) => acc.username === username)
    console.log(indexAcc);

    accounts.splice(indexAcc,1);
    containerApp.style.opacity = "0";

    labelWelcome.textContent = `Log in to get started`;
    inputCloseUsername.value = '';
    inputClosePin.value = '';
  }
})


btnLoan.addEventListener("click", (e)=>{
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov>= amount*0.1)){
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }

})


// SORT LOGIC

let sort = false;
btnSort.addEventListener("click", (e)=>{
    e.preventDefault();
    sort = !(sort)
    console.log(`OVO JE SORT: ${sort}`);
    displayMovements(currentAccount, sort)

})


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

let newArray = [1,2,3,4,5,6,7,9,8,10]

// OPADAJUCE SORTIRANJE
newArray.sort((a,b) => {
  if(a>b) return -1;
  if(b>a) return 1;
})

// NORMALNO SORTIRANJE
newArray.sort((a,b) => {
  if(a>b) return 1;
  if(b>a) return -1;
})

console.log(newArray);

newArray.sort((a,b) => b-a);
console.log(newArray);

newArray.sort((a,b) => a-b);
console.log(newArray);


const movements = [200,300,400,-450,900,-600,2200,-240]

const groupedMovement = Object.groupBy(movements, mov => mov > 0 ? 'deposit' : 'withdrawalas')
console.log(groupedMovement);

const groupByActive = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;

  if(movementCount > 5) return 'very active';
  if(movementCount > 3) return 'active';
  if(movementCount > 1) return 'inactive';

})
console.log(groupByActive);