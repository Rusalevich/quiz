
// загрузка всех вопросов из избранного

const favoriteQuestions = JSON.parse(localStorage.getItem('favorites')) || [];

const favoritesContainer = document.getElementById('favoritesContainer');
const favoriteTemplate = document.getElementById('favoriteTemplate');


// функция обработки вопросов, и добавления в контейнер и удаления вопросов из избранного

function renderFavoriteQuestions(){
    favoritesContainer.innerHTML ='';
    favoriteQuestions.forEach((questionData, index)=>{
       
        const questionElement = favoriteTemplate.content.cloneNode(true) //клонируем наш шаблон полностью
        //дальше внутри этого шаблона мы будем выбирать элементы, которые хотим взять
        questionElement.querySelector('.questionText').textContent = `${index+1}. ${questionData.question}`
        const optionsContainer = questionElement.getElementById('optionsContainer');
        questionData.options.forEach((option, optionIndex) =>{

            //кнопка удаления из избранного 

            const deleteButton = questionElement.querySelector('#deleteButton');
            
            deleteButton.addEventListener('click',()=>{
                const newFavorite = favoriteQuestions.filter((questions, index)=>{
                return index !== favoriteQuestions.findIndex(questionToDelete => questionToDelete.question === questionData.question)
                })
                const stringToDelete = JSON.stringify(newFavorite); 
                localStorage.setItem('favorites', stringToDelete) ;
                location.reload() 
            })

            const optionDiv = document.createElement('div');
            optionDiv.classList.add('option');
            if(optionIndex === questionData.correctAnswer){
                optionDiv.classList.add('correct');
            };
            optionDiv.innerHTML = `
                <input type ='radio' disabled name = 'option - ${index} id='option - ${index} - ${optionIndex}'/>
                <label for= 'option - ${index} - ${optionIndex}'></label>
                `;
                optionDiv.querySelector('label').textContent = option;
             optionsContainer.appendChild(optionDiv);

        })
        
        
        questionElement.querySelector('.correctAnswer').textContent = `правильный ответ : ${questionData.options[questionData.correctAnswer]}`
        questionElement.querySelector('.explanation').textContent = questionData.explanation;
        questionElement.querySelector('.theme').textContent = `тема : ${questionData.theme}`
        favoritesContainer.appendChild(questionElement)
})
};

renderFavoriteQuestions()

console.log("1");
setTimeout(() => console.log("2"), 0);
new Promise((resolve) => {
    console.log("3");
    setTimeout(() => resolve(), 0);
}).then(() => console.log("4"));
console.log("5");