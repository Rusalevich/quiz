'use strict'
document.addEventListener("DOMContentLoaded", () => {
const welcomeScreen = document.getElementById("welcomeScreen");
const questionScreen = document.getElementById("questionScreen");
const resultScreen = document.getElementById("resultScreen");

const playerForm = document.getElementById("playerForm");
const playerNameInput = document.getElementById("playerName");
const questionsThemeSelect = document.getElementById("questionsThemeSelect");
const questionsLimitSelect = document.getElementById("questionsLimitSelect");
const rebootButton = document.getElementById('rebootButton');
const startButton = document.getElementById('startButton');
// const loadingCoverCircle1 = document.getElementById('loadingCoverCircle-1');
// const loadingCoverCircle2 = document.getElementById('loadingCoverCircle-2');
// const loadingCoverCircle3 = document.getElementById('loadingCoverCircle-3');
const loadingContainer = document.querySelector('.loadingContainer');
const explanation = document.querySelector('#explanation');
const showAdminFormButton = document.getElementById('showAdminForm');

const adminForm = document.getElementById('adminForm');
const adminAction = document.getElementById('adminAction');

const currentPlayerDisplay = document.getElementById("currentPlayer");
const currentQuestionDisplay = document.getElementById("currentQuestion");
const totalQuestionsDisplay = document.getElementById("totalQuestions");
const currentScoreDisplay = document.getElementById("currentScore");

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const optionTemplate = document.getElementById("optionTemplate");

const feedBackContainer = document.getElementById("feedbackContainer");
const feedbackText = document.getElementById("feedbackText");
const nextButton = document.getElementById("nextButton");
const addFavoriteButton = document.getElementById('favoriteHeart')


const continueOrExit = document.getElementById("continueOrExit");
const continueButton = document.getElementById("continueButton");
const exitButton = document.getElementById("exitButton");

const resultPlayerName = document.getElementById("resultPlayerName");
const resultScore = document.getElementById("resultScore");
const resultTotal = document.getElementById("resultTotal");
const resultPercentage = document.getElementById("resultPerсent");
const restartButton = document.getElementById("restartButton");



let currentQuestion = 0;
let score = 0;
let currentPlayer = "";
let hasAnswered = false;
let quizQuestions = [];
let page = 1;
let isQuestionSaved = false

let questionsCount = quizQuestions.length;
        // resultTotal.innerText = questionsCount;
        // totalQuestionsDisplay.innerText = questionsCount;

let isLoading = true;
let isError = false;


//стартовое окошко
playerForm.addEventListener('submit', startGame);

nextButton.addEventListener("click",()=>{
    isQuestionSaved = false;
    document.querySelector('.addFavorite').style.color='#d3d3d3';
    questionScreen.classList.add("fadeOut")
    feedBackContainer.classList.add("hidden");
    setTimeout(()=>{
        currentQuestion++;
        hasAnswered = false;
        questionScreen.classList.remove("fadeOut");
                
        
        if(currentQuestion < questionsCount){
            redHeart ();
            loadQuestion(currentQuestion);
        }else {
            questionScreen.classList.remove("active");
            continueOrExit.classList.add("active");
        }
    },300)

    if(document.querySelector('.addedFavorite')){
        document.querySelector('.addedFavorite').remove()
    }
    
});





restartButton.addEventListener("click", resetQuiz) 

exitButton.addEventListener('click', showResults)

addFavoriteButton.addEventListener('click',ifQuestionFav);

showAdminFormButton.addEventListener('click', ()=>{
    adminForm.classList.toggle('hidden');
    
    if(adminForm.classList.contains('hidden')){
        showAdminFormButton.innerText = 'Показать форму администратора';
    }else{
        showAdminFormButton.innerText='Скрыть форму администратора';
    }
    
})

//кнопка продолжения игры
continueButton.addEventListener('click', ()=>{
    currentQuestion = 0;
    page++;
    const theme = questionsThemeSelect.value;
    requestNewQuestions(`https://js-quiz-questions-server.vercel.app/api/questions?limit=2&theme=${theme}&page=${page}`)
    .then(()=>{
        continueOrExit.classList.remove("active");
        questionScreen.classList.add("active");
        loadQuestion(currentQuestion);
    })
}
)

//кнопка перезагрузки на стартовом экране, если вопросы не прилетели с сервера
rebootButton.addEventListener('click', ()=>{
    startGame
})

//админ хочет удалить какой-то вопрос с сервера 
adminAction.addEventListener('click', ()=>{
    console.log(adminAction.value)
    if(adminAction.value === 'delete'){
        document.querySelector(".allOptions").classList.add('hidden');
        explanation.classList.add('hidden');
        adminForm.querySelector('#questionInput').classList.add('hidden');
        adminForm.querySelector('#correctAnswer').placeholder = 'номер вопроса'
    }else{
        document.querySelector(".allOptions").classList.remove('hidden');
        explanation.classList.remove('hidden');
        adminForm.querySelector('#questionInput').classList.remove('hidden');
        adminForm.querySelector('#correctAnswer').placeholder = 'правильный вариант'
    }
});

adminForm.addEventListener('submit',handleAdminSubmit)

function loadQuestion(index){
    currentQuestionDisplay.textContent = index + 1;
    const question = quizQuestions[index];
    console.log(question.question)
    questionText.innerText = question.question;
    optionsContainer.innerHTML = "";
    feedBackContainer.classList.add("hidden");
    feedBackContainer.classList.remove("correct");
    feedBackContainer.classList.remove("incorrect");

    question.options.forEach((option, i) => {
        const optionLement = optionTemplate.content.cloneNode(true);
        const radioInput = optionLement.querySelector("input");
        const label = optionLement.querySelector("label");

        const optionId = `option-${index}-${i}`;
        radioInput.id = optionId;
        label.htmlFor = optionId;
        label.innerText = option;

        const optionContainer = optionLement.querySelector(".option");
        optionContainer.addEventListener("click", () =>{
            if(!hasAnswered){
                selectOption(i);
            }
        })
        optionsContainer.appendChild(optionLement);
    })
    timerForQuestions()
};

//выбор ответа игроком
function selectOption(selectedIndex){


    if(hasAnswered) return; //если пользователь уже ответил, то менять ответ нельзя 
    
    hasAnswered = true;
    const question = quizQuestions[currentQuestion]; 
    const options = optionsContainer.querySelectorAll('.option')
    feedBackContainer.classList.remove("hidden");

//после ответа очищаем варианты ответов
    options.forEach(opt => { 
        opt.classList.remove("correct");
        opt.classList.remove("incorrect");
    })

    //проверяем правильный ли дали ответ или не правильный
    const isCorrect = selectedIndex === question.correctAnswer;

    if(isCorrect){
        score++; 
        options[selectedIndex].classList.add("correct");
        feedBackContainer.classList.add("correct");
        feedbackText.innerText = `Верно! ${question.explanation}`;
        currentScoreDisplay.innerText = score;
    } else {
        options[selectedIndex].classList.add("incorrect");
        feedBackContainer.classList.add("incorrect");
        feedbackText.innerText = `Не верно! ${question.explanation}`;
    }
}


//результаты
function showResults(){
    let questionsCount = quizQuestions.length*page;
    resultTotal.innerText = questionsCount;
    totalQuestionsDisplay.innerText = questionsCount;

    
    continueOrExit.classList.remove("active");
    resultScreen.classList.add("active");

    const percentage = Math.round((score / questionsCount) * 100)
    resultPercentage.innerText = `${percentage}%`;
    resultScore.innerText = score;

    savingData(percentage)
    .then((message)=>{
        alert(message)
    });
}

// начать квиз заново
function resetQuiz(){
    page = 1;
    questionsCount = quizQuestions.length;
    currentQuestion = 0;
    score = 0;
    currentPlayer = "";
    hasAnswered = false;
    currentPlayerDisplay.innerText = "";
    currentQuestionDisplay.innerText = currentQuestion;
    feedBackContainer.classList.remove("correct", "incorrect");
    playerNameInput.value = "";
    welcomeScreen.classList.add("active");
    resultScreen.classList.remove("active");
    playerForm.classList.remove('hidden');
    startButton.classList.remove('hidden');
    questionsThemeSelect.classList.remove('hidden');
    questionsLimitSelect.classList.remove('hidden');
    loadingContainer.classList.add('hidden')
    welcomeScreen.querySelector('h1').innerText='Ну давай поиграем'
    redHeart ();
}

// начать игру
function startGame(e) {
    e.preventDefault();

    currentPlayer = playerNameInput.value.trim() // <- если ввел лишние пробелы, то убрать их
    checkUserName()
    .then((message)=>{
        console.log(message);
        const theme = questionsThemeSelect.value;
        const limit = questionsLimitSelect.value;
    
        startButton.classList.add('hidden');
        questionsThemeSelect.classList.add('hidden');
        questionsLimitSelect.classList.add('hidden');
        loadingContainer.classList.remove('hidden')
    
        requestNewQuestions(`https://js-quiz-questions-server.vercel.app/api/questions?limit=${limit}&theme=${theme}`)
        .then(()=>{
    
            if(isLoading || isError) return;
    
            let countdown = 3;
            const countdownElement = document.createElement('div');
            countdownElement.classList.add('countdown');
            welcomeScreen.appendChild(countdownElement);
            countdownElement.innerText = countdown
            playerForm.classList.add('hidden');
            document.querySelector('h1').innerText=`${currentPlayer}, приготовься!`
            const timer = setInterval(()=>{
                
                countdown--;
                countdownElement.innerText = countdown;
                if(countdown <= 0){
                    countdownElement.remove();
                    clearInterval(timer);
        
                    currentPlayerDisplay.innerText = currentPlayer;
                    resultPlayerName.innerText = currentPlayer;
                    welcomeScreen.classList.remove("active");
                    questionScreen.classList.add("active");

                    redHeart ();
                    loadQuestion(currentQuestion);
                }
            },1000)
        })
    })
    .catch((error)=>{
        alert(error);
        return;
    });


}

//даем выбрать: продолжить или закончить квиз



//время, отведенное на каждый вопрос
function timerForQuestions(){
    let countdown = 10;
    const countdownElement = document.createElement('div');
    countdownElement.classList.add('timer');
    optionsContainer.appendChild(countdownElement);
    countdownElement.innerText = `${countdown} сек.`
    

    const timer = setInterval (()=>{ 
        countdown--;
        countdownElement.innerText =  `${countdown} сек.`;
        
        if(countdown <= 0 && !hasAnswered){
            clearInterval(timer);
            hasAnswered = true;
            feedBackContainer.classList.remove('hidden');
            feedBackContainer.classList.add("incorrect");
            feedbackText.innerText = `вермя вышло! ${quizQuestions[currentQuestion].explanation}`;
        }
        else if(hasAnswered){
            clearInterval(timer);
        }
    },1000)
}


function requestNewQuestions(url){
    return fetch(url)
    .then((res)=>res.json())
     .then((responseObject)=>{
          // console.log(responseObject)
        quizQuestions=responseObject.data
        console.log(quizQuestions)
        questionsCount = quizQuestions.length;
        resultTotal.innerText = questionsCount;
        totalQuestionsDisplay.innerText = questionsCount;
        isLoading=false;
        isError=false;
            // rebootButton.classList.add('hidden');
    })
    .catch((error)=>{
        isLoading=false;
        isError=true;
        rebootButton.classList.remove('hidden')
        })
}
       

//добавление новых вопросов 
function handleAdminSubmit(event){
    event.preventDefault();
    const action = adminAction.value
    const questionData = {
        action,
        question: adminForm.querySelector('#questionInput').value,
        options: [
            adminForm.querySelector('#option1').value,
            adminForm.querySelector('#option2').value,
            adminForm.querySelector('#option3').value,
            adminForm.querySelector('#option4').value
        ],
        correctAnswer: parseInt(adminForm.querySelector('#correctAnswer').value),
        explanation: explanation.value,
        theme: adminForm.querySelector('#theme').value,
        userName: 'ghjh'
    }


    if(action.toUpperCase() === 'POST'){
        submitNewQuestion(questionData);
    }else if (action.toUpperCase() === 'PUT'){
        updateNewQuestionNewQuestion(questionData);
    }else if (action.toUpperCase() === 'DELETE'){
        deleteQuestionData(questionData.correctAnswer, questionData.theme);
    }else{
        alert ('invalid action')
    }

    function submitNewQuestion(questionData){
        fetch('https://js-quiz-questions-server.vercel.app/api/resource',{
            method: 'POST',
            body:JSON.stringify(questionData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    function updateNewQuestion(questionData){
        fetch('https://js-quiz-questions-server.vercel.app/api/resource',{
            method: 'PUT',
            body:JSON.stringify(questionData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    function deleteQuestionData(questionNumber, theme){
        fetch(`https://js-quiz-questions-server.vercel.app/api/resource?theme=${theme}&question=${questionNumber}`,{
            method: 'DELETE',
        })
    }
}


//иммитация проверки имени пользователя (в 50% случаях будет отказ типа).асинхронная функция

async function checkUserName() {
    return new Promise ((res)=>{
        setTimeout(()=>{ //типа сервер думает 0,5 сек подходит имя или нет
            res('user name is available');
        },50)
    })
}

//иммитация сохранения данных после успешного завершения квиза

async function savingData(data) {
    return new Promise ((resolve)=>{
        setTimeout(()=>{
            resolve('Ваш результат сохранен')
        },1000)
    })
}

//добавление в избранное

function ifQuestionFav(){

    const question = quizQuestions[currentQuestion]; //получим всю информацию о вопросе по его порядковому номеру 
    const favoritesString = localStorage.getItem('favorites'); //получаем все избранное 
    const favorites = favoritesString ? JSON.parse(favoritesString) : []; //если favoritesString === null, то станет пустым массивом, что бы всегда работать с данными, как с массивом
    // favorites.push(question)

    if (favorites.find(favoriteQuestion => favoriteQuestion.question === question.question))
        {isQuestionSaved = true}
    
    if(isQuestionSaved){
        document.querySelector('.addFavorite').style.color='#d3d3d3';
        console.log(isQuestionSaved)
        deleteQuestionFromFavorites()
        isQuestionSaved=false; 
    }else{
        const addedFavorite = document.createElement('span')
        addedFavorite.classList.add('addedFavorite');
        addedFavorite.innerText = '❤';
        document.querySelector('.favoriteToggle').appendChild(addedFavorite);
        
        if(!favorites.length){
            savingToFav(favorites, question);  
            document.querySelector('.addFavorite').style.color='#e74c3c';
        }else{
            savingToFav(favorites, question); 
            document.querySelector('.addFavorite').style.color='#e74c3c';
        }
        isQuestionSaved=true;  
    } 
}

function savingToFav(favorites, question){
    const newFavorites=[...favorites, question]; //создаем новое избранное: старое избр+новый вопрос
    const newFavoritesString = JSON.stringify(newFavorites); // превращаем новое избранное в строчку
    localStorage.setItem('favorites', newFavoritesString) // засовываем новую строчку в localStorage
}

function redHeart (){
    const question = quizQuestions[currentQuestion]; //получим всю информацию о вопросе по его порядковому номеру 
    const favoritesString = localStorage.getItem('favorites'); //получаем все избранное 
    const favorites = favoritesString ? JSON.parse(favoritesString) : []; //если favoritesString === null, то станет пустым массивом, что бы всегда работать с данными, как с массивом

                
    if (favorites.find(favoriteQuestion => favoriteQuestion.question === question.question)){
    document.querySelector('.addFavorite').style.color='#e74c3c'}
}
//удаление вопроса из избранного 

const deleteQuestionFromFavorites = () => {
    const question = quizQuestions[currentQuestion]; //получим всю информацию о вопросе по его порядковому номеру 
    const favoritesString = localStorage.getItem('favorites'); //получаем все избранное 
    const favorites = JSON.parse(favoritesString)
    
    const QuestionToDelete = favorites.findIndex(favoriteQuestion => favoriteQuestion.question === question.question)
    const newFavorites = favorites.filter((questions, index)=>{return index !== QuestionToDelete})
    
    console.log(newFavorites)
    const stringToDelete = JSON.stringify(newFavorites); // превращаем новое избранное в строчку
    localStorage.setItem('favorites', stringToDelete) // засовываем новую строчку в localStorage
}


})


