'use strict'


class Engredient {
    name
    price
    kcal
    id
    type
    constructor(name, price, kcal, id, type){
        this.name = name;
        this.price = price;
        this.kcal = kcal;
        this.id = id;
        this.type = type;
    }
}

const whiteBread = new Engredient ('белый хлеб', 50, 150, 'whiteBread', 'bread');
const sesameBread = new Engredient ('хлеб с кунжутом', 40, 120, 'sesameBread', 'bread');
const beefСutlet = new Engredient ('говяжья котлета', 100, 300, 'beefСutlet', 'meat');
const chickenСutlet = new Engredient ('куриная котлета', 80, 250, 'chickenСutlet', 'meat');
const fishСutlet = new Engredient ('рыбная котлета', 90, 270, 'fishСutlet', 'meat');
const veganСutlet = new Engredient ('веганская котлета', 70, 200, 'veganСutlet', 'meat');
const tomato = new Engredient ('помидор', 20, 15, 'tomato', 'vegetables');
const cucumber = new Engredient ('огурец', 15, 10, 'cucumber', 'vegetables');
const salad = new Engredient ('салат', 10, 5, 'salad', 'vegetables');
const onion = new Engredient ('лук', 10, 5, 'onion', 'vegetables');
const chedder = new Engredient ('сыр чеддер', 30, 80, 'chedder', 'cheese');
const smoked = new Engredient ('копченый сыр', 20, 100, 'smoked', 'cheese');
const mozzarella = new Engredient ('моцарелла', 20, 70, 'mozzarella', 'cheese');

let allIngredients = [
    whiteBread, sesameBread,
    beefСutlet, chickenСutlet, fishСutlet, veganСutlet,
    tomato, cucumber, salad, onion, 
    chedder, smoked, mozzarella
];

let selectedIngredientsArr = []

console.log(allIngredients)
const ingredientKEY = 'ingredientKEY';
let SelectedIngredient ;
const ingredientsSelection = document.querySelector('.ingredientsSelection');
const selectedIngredients = document.getElementById('selectedIngredients');
const basket = document.querySelector('.basket');


const menuPicture = {
    bread: document.querySelector('.menuPictureBread'),
    vegetables: document.querySelector('.menuPictureVegetables'),
    cheese: document.querySelector('.menuPictureCheese'),
    meat: document.querySelector('.menuPictureMeat')
}

const ingredientPhoto = document.getElementById('ingredientPhoto');
const addIngredients = document.getElementById('addIngredients');

//при наведении на элемент бургера - он становится цветным 
for (let ingredient in menuPicture){
    
    menuPicture[ingredient].addEventListener('mouseover', function(){
         menuPicture[ingredient].setAttribute('src', `/img/${ingredient}.png`);
    });
    menuPicture[ingredient].addEventListener('mouseout', function(){
            menuPicture[ingredient].setAttribute('src', `/img/${ingredient}BW.png`)
        });
    }
    
//функция открытия - закрытия окна для добавления ингридиентов
function toggleAddIngredientsWindow(){
    if (addIngredients.classList.contains('coverHidden')){
        addIngredients.classList.remove('coverHidden')
    }else{addIngredients.classList.add('coverHidden')
        document.querySelector('.ingredientsSelection').innerHTML=''
    };
}

//по клику на бургер открываем окно для выбора ингредиентов
for (let ingredient in menuPicture){
    menuPicture[ingredient].addEventListener('click', function(){
        SelectedIngredient = ingredient;                         //использую в renderIngredients для сравнения с типом ингридиента
        renderIngredients(allIngredients)
        toggleAddIngredientsWindow();
    });
}

// наполняем окно ингредиентами 
const renderIngredients = (ingredientsToRender) => {
                
    ingredientsToRender.forEach((ingredient)=>{
        if(SelectedIngredient === ingredient.type){
            const ingredientSelectionList = document.createElement('li');
            const ingredientSelectionClass= 'ingredient';
            const ingredientSelectionHTML = 
                `<button id="ingredientPhoto">
                    <img class="ingredientPhoto" id="${ingredient.id}" src="/img/bread/${ingredient.id}.jpg" alt="хлеб">
                </button> 
                <div id="ingredientName"> 
                    <div>${ingredient.name}</div>
                    <div class='ingredientCharacteristics'>+ ${ingredient.price} руб.</div>
                    <div class='ingredientCharacteristics'> ${ingredient.kcal} ккал</div>
                </div>`
            ingredientSelectionList.innerHTML = `<li class="${ingredientSelectionClass}">${ingredientSelectionHTML}</li>`
            ingredientsSelection.appendChild(ingredientSelectionList);


        } 
    });
}
                
let cartTotal = 0; 
let totalPrice = 0;    
let totalKcal = 0; 



// наполняем корзину

ingredientsSelection.addEventListener('click', function(event){
    if(event.target.tagName === "IMG"){
        // const ingredientId = event.target.id;
        const ingredient = allIngredients.find(ingredient => ingredient.id === event.target.id);
        
        const foundElement = selectedIngredientsArr.find((ingr)=>{
            return ingr.id === ingredient.id
        })

        if(foundElement){
            foundElement.number ++;
        }else{
            selectedIngredientsArr.push(
                {
                    name: ingredient.name,
                    number: 1,
                    id: ingredient.id,
                    price: ingredient.price,
                    kcal: ingredient.kcal
                }
            )
        }
    };
    console.log(selectedIngredientsArr);
    
    renderBusket();
})

function renderBusket(){
    basket.innerHTML='';
    if(selectedIngredientsArr.length === 0){
        selectedIngredients.classList.add('coverHidden');
        document.querySelector('.finalPrice').innerHTML = `<div class="finalPrice">0  руб. </div>`
        document.querySelector('.finalKcal').innerHTML = `<div class="finalKcal">0  ккал. </div>`
        
        return
    };
    selectedIngredients.classList.remove('coverHidden')
    selectedIngredientsArr.forEach((ingredient)=>{

        const ingredientInBasket = document.createElement('li');
        const ingredientInBasketClass = 'ingredientInBasket';
        const ingredientInBasketHTML = 
                `<img src="/img/bread/${ingredient.id}.jpg" alt="огурец">
                    <div class="ingredientInBasketСharacteristic">
                        <div class="ingredientName">${ingredient.name}</div>
                        <p class="ingredientCharacteristics">${ingredient.kcal} ккал</p>
                    </div>
                    <div class="numberOfIngredientsInBasket">
                        <button class="numberOfIngredients minusButton" id="remove_${ingredient.id}">-</button>
                        <div class="numberOfIngredientsWindow" id="numberOf${ingredient.id}" >${ingredient.number}</div>
                        <button class="numberOfIngredients plusButton" id="add_${ingredient.id}">+</button>
                    </div>
                    <div class="ingredientPrice">${ingredient.price*ingredient.number} руб.</div>`
        ingredientInBasket.innerHTML = `<li class="${ingredientInBasketClass}">${ingredientInBasketHTML}</li>`;
        basket.appendChild(ingredientInBasket);
    }) 

    totalPrice = selectedIngredientsArr.reduce((acc, ingredient)=>{
        return acc+=ingredient.price*ingredient.number
    },0)

    totalKcal = selectedIngredientsArr.reduce((acc, ingredient)=>{
        return acc+=ingredient.kcal*ingredient.number
    },0)

    document.querySelector('.finalPrice').innerHTML = `<div class="finalPrice">${totalPrice}  руб. </div>`
    document.querySelector('.finalKcal').innerHTML = `<div class="finalKcal">${totalKcal}  ккал. </div>`
        
}

document.querySelector('.basket').addEventListener('click', function(event){
    const addIngredientId = event.target.id.split("_").splice(-1).join(""); 
    const foundIngr =  selectedIngredientsArr.find(ingredient => ingredient.id === addIngredientId);
    // console.log(foundIngr)
    if (event.target.classList.contains('plusButton')){
        foundIngr.number++;
        renderBusket()
    }else if(event.target.classList.contains('minusButton')){
        if(foundIngr.number > 1){
            foundIngr.number--;
            renderBusket()
        }else{
            selectedIngredientsArr = selectedIngredientsArr.filter((ingredient)=>{
                return  ingredient.id !== addIngredientId
            })
            renderBusket()
        }
    }
})

renderBusket()


  



