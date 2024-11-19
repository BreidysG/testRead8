document.addEventListener('DOMContentLoaded', function() {
    const titleInit = document.getElementById("titleInit");
    const paragraphInit = document.getElementById("paragraphInit");
    const startButton = document.getElementById('startButton');
    const textContainer = document.getElementById('textContainer');
    const finishButton = document.getElementById('finishButton');
    const questionnaire = document.getElementById('questionnaire');
    const quizForm = document.getElementById('quizForm');
    const results = document.getElementById('results');
    const timerValue = document.getElementById('timerValue');
    let time = [];

    let wordCount = 0;
    let startTime, endTime;
    let quizCompleted = false;
    let timerInterval;

    // Texto para las preguntas del cuestionario
    const questions = [
        { 
            question: "¿Qué labor hacía el protagonista de la lectura?", 
            answers: [
                "Cosechaba frutas", 
                "Pescador", 
                "Marinero", 
                "Vigilante de la playa"
            ], 
            correctAnswer: "Pescador" 
        },
        { 
            question: "¿Con quién se encontró el pescador?", 
            answers: [
                "Otros pescadores", 
                "Su mujer y sus hijos", 
                "El espíritu del rio", 
                "Ladrón de joyas"
            ], 
            correctAnswer: "El espíritu del rio" 
        },
        { 
            question: "¿Cómo le ayudó el espíritu al pescador?", 
            answers: [
                "Le dio una libreta, una caja de fósforos y una bolsa, con 4 pistas para hallar la cueva con riquezas", 
                "Lo guio por el rio hasta la cueva donde encontraría riquezas", 
                "Le entregó un crucigrama para que lo llenará y así encontrar el tesoro", 
                "Le entregó una bolsa para que guardará los peces que encontrará en el rio"
            ], 
            correctAnswer: "Lo guio por el rio hasta la cueva donde encontraría riquezas" 
        },
        { 
            question: "¿Qué le dijo el espíritu del rio, antes de desaparecer en la oscuridad?", 
            answers: [
                "Debes recoger todo el tesoro y llevarlo a casa", 
                "Debes salir del bosque antes de que aclare el día o lo perderás todo", 
                "Debes contarle a tus amigos sobre el tesoro y compartirlo", 
                "Debes salir del bosque antes de que aclare el día con todo lo que encuentres"
            ], 
            correctAnswer: "Debes salir del bosque antes de que aclare el día con todo lo que encuentres" 
        },
        { 
            question: "¿Por qué perdió todo el pescador?", 
            answers: [
                "Se llenó de avaricia y se puso a recoger más de lo que cabía en la bolsa", 
                "Por lo pesado de la carga no pudo salir del bosque antes de que aclarara el día", 
                "No tuvo en cuenta la advertencia del espíritu del rio", 
                "Todas las respuestas son correctas"
            ], 
            correctAnswer: "Todas las respuestas son correctas" 
        }
    ];
    
 // Función para contar las palabras en el texto
 function countWords(text) {
    return text.split(/\s+/).length;
}

// Función para calcular la velocidad de lectura (palabras por minuto)
function calculateReadingSpeed(startTime, endTime, wordCount) {
    const minutes = (endTime - startTime) / 60000; // Convertir a minutos
    return Math.round(wordCount / minutes);
}

// Función para calcular el tiempo por palabra en milisegundos
function calculateTimePerWord(ppm) {
    return Math.round(60000 / ppm); // ms por palabra
}

// Función para mostrar las preguntas del cuestionario
function displayQuestions() {
    const questionList = document.getElementById('questionList');
    questionList.innerHTML = '';
    
    questions.forEach((question, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <p>${question.question}</p>
            <div class="question-options">
                ${question.answers.map((answer, i) => `
                    <label>
                        <input type="radio" name="answer${index}" value="${answer}">
                        ${answer}
                    </label>
                `).join('')}
            </div>
        `;
        questionList.appendChild(listItem);
    });
}

// Evento para comenzar el test al hacer clic en "Empezar"
startButton.addEventListener('click', function() {
    textContainer.classList.remove('hidden');
    paragraphInit.classList.add("hidden");
    startButton.classList.add('hidden');
    startTime = Date.now();
    // Iniciar el contador
    timerInterval = setInterval(updateTimer, 1000);
});

// Función para actualizar el contador de tiempo
function updateTimer() {
    const currentTime = Math.floor((Date.now() - startTime) / 1000); // Tiempo transcurrido en segundos
    timerValue.textContent = currentTime;
    time.push(currentTime);
}

// Evento para finalizar el test al hacer clic en "Terminar Test"
finishButton.addEventListener('click', function() {
    clearInterval(timerInterval); // Detener el contador
    titleInit.classList.add("hidden");
    textContainer.classList.add('hidden');
    finishButton.classList.add('hidden');
    endTime = Date.now();
    wordCount = countWords(document.getElementById('textToRead').textContent);
    const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount);
    questionnaire.classList.remove('hidden');
    displayQuestions();
});

// Evento para enviar el cuestionario
quizForm.addEventListener('submit', function(event) {
    event.preventDefault();
    if (!quizCompleted) {
        let anyAnswerSelected = true;

        questions.forEach((question, index) => {
            const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
            if (!selectedAnswer) {
                anyAnswerSelected = false;
                return;
            }
        });

        if (!anyAnswerSelected) {
            alert("Debes seleccionar una opción para cada pregunta antes de terminar.");
            return;
        }

        let correctAnswers = 0;
        let totalQuestions = questions.length;

        questions.forEach((question, index) => {
            const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
            if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
                correctAnswers++;
            }
        });

        let comprehensionPercentage = (correctAnswers / totalQuestions) * 100;
        let timeResult = time[time.length-1];

        const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount); // Usar la velocidad de lectura real
        const timePerWordInMs = calculateTimePerWord(readingSpeed); // Ajustar el tiempo por palabra basado en la velocidad de lectura real
        
        quizCompleted = true;
        results.classList.remove('hidden');
        questionnaire.classList.add('hidden');
        document.getElementById('wordCountValue').textContent = wordCount;
        document.getElementById('readingSpeedValue').textContent = `${readingSpeed}`;
        document.getElementById('comprehensionValue').textContent = `${comprehensionPercentage}`;
        document.getElementById('timeResultValue').textContent = `${timeResult}`;

        // Mostrar tiempo por palabra ajustado
        document.getElementById('results').innerHTML += `
            <p class="lastParagrah">Toma nota de tu velocidad de lectura para poder realizar ajustes en los próximos ejercicios.</p>
            <p class="finalMessage">Puedes salir y pasar a la siguiente clase.</p>
            <p>Ajusta esta velocidad en tus ejercicios: ${timePerWordInMs} milisegundos por palabra</p>
        `;
    }
});
});
