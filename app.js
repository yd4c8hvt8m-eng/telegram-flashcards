// ==========================================
// TELEGRAM
// ==========================================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ==========================================
// ИЛЛЮСТРАЦИИ
// ==========================================

function makeImage(emoji, title) {

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="800"
         height="500"
         viewBox="0 0 800 500">

        <rect
            width="800"
            height="500"
            fill="#f4f5f7"
        />

        <circle
            cx="400"
            cy="210"
            r="155"
            fill="#ffffff"
        />

        <text
            x="400"
            y="245"
            text-anchor="middle"
            font-size="140">
            ${emoji}
        </text>

        <text
            x="400"
            y="410"
            text-anchor="middle"
            font-family="Arial"
            font-size="30"
            font-weight="600"
            fill="#555">
            ${title}
        </text>

    </svg>
    `;

    return "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg);
}


// ==========================================
// НАША КОЛОДА
// ==========================================

const cards = [

    {
        id: 1,
        front: "Pick up the phone.",
        back: "Подними / возьми телефон.",
        image: makeImage("📱", "Pick up")
    },

    {
        id: 2,
        front: "Put the cup down on the table.",
        back: "Поставь чашку на стол.",
        image: makeImage("☕", "Put down")
    },

    {
        id: 3,
        front: "Move the book aside.",
        back: "Отодвинь книгу в сторону.",
        image: makeImage("📖", "Move aside")
    },

    {
        id: 4,
        front: "Move the box over here.",
        back: "Передвинь / переставь коробку сюда.",
        image: makeImage("📦", "Move here")
    },

    {
        id: 5,
        front: "Put the key in your pocket.",
        back: "Положи ключ в карман.",
        image: makeImage("🔑", "Put inside")
    },

    {
        id: 6,
        front: "Take the key out of your pocket.",
        back: "Достань ключ из кармана.",
        image: makeImage("🔑", "Take out")
    },

    {
        id: 7,
        front: "Give me the pen.",
        back: "Дай мне ручку.",
        image: makeImage("🖊️", "Give me")
    },

    {
        id: 8,
        front: "Lift the box up.",
        back: "Подними коробку вверх.",
        image: makeImage("📦", "Lift up")
    },

    {
        id: 9,
        front: "Lower the box slowly.",
        back: "Медленно опусти коробку.",
        image: makeImage("📦", "Lower")
    },

    {
        id: 10,
        front: "Tilt the bottle slightly.",
        back: "Слегка наклони бутылку.",
        image: makeImage("🍾", "Tilt")
    },

    {
        id: 11,
        front: "Keep the bottle upright.",
        back: "Держи бутылку вертикально.",
        image: makeImage("🧴", "Keep upright")
    },

    {
        id: 12,
        front: "Bring the phone closer.",
        back: "Поднеси телефон ближе.",
        image: makeImage("📱", "Bring closer")
    },

    {
        id: 13,
        front: "Move the phone farther away.",
        back: "Отодвинь / отнеси телефон подальше.",
        image: makeImage("📱", "Move away")
    },

    {
        id: 14,
        front: "Give the bottle a good shake.",
        back: "Хорошенько встряхни бутылку.",
        image: makeImage("🧴", "Shake")
    },

    {
        id: 15,
        front: "Be careful! Don't drop the glass.",
        back: "Осторожно! Не урони стакан.",
        image: makeImage("🥛", "Don't drop")
    },

    {
        id: 16,
        front: "Carry the laptop carefully.",
        back: "Неси ноутбук осторожно.",
        image: makeImage("💻", "Carry")
    },

    {
        id: 17,
        front: "Set the plate down gently.",
        back: "Аккуратно поставь тарелку.",
        image: makeImage("🍽️", "Set down")
    },

    {
        id: 18,
        front: "Turn the phone around.",
        back: "Разверни телефон.",
        image: makeImage("📱", "Turn around")
    },

    {
        id: 19,
        front: "Turn the cup upside down.",
        back: "Переверни чашку вверх дном.",
        image: makeImage("☕", "Upside down")
    },

    {
        id: 20,
        front: "Leave the keys there.",
        back: "Оставь ключи там.",
        image: makeImage("🔑", "Leave there")
    }

];


// ==========================================
// СОСТОЯНИЕ
// ==========================================

let currentCard = 0;

let studyCards = [...cards];

let knownCards = [];


// ==========================================
// ЭЛЕМЕНТЫ
// ==========================================

const card =
    document.getElementById("card");

const frontText =
    document.getElementById("frontText");

const backText =
    document.getElementById("backText");

const cardImage =
    document.getElementById("cardImage");

const cardImageBack =
    document.getElementById("cardImageBack");

const progress =
    document.getElementById("progress");


// ==========================================
// ПОКАЗ КАРТОЧКИ
// ==========================================

function showCard() {

    if (studyCards.length === 0) {

        finishLesson();

        return;
    }


    if (currentCard >= studyCards.length) {

        currentCard = 0;

    }


    const item =
        studyCards[currentCard];


    // Убираем переворот

    card.classList.remove("flipped");


    // Текст

    frontText.textContent =
        item.front;

    backText.textContent =
        item.back;


    // Картинка

    cardImage.src =
        item.image;

    cardImageBack.src =
        item.image;


    // Прогресс

    progress.textContent =
        `${currentCard + 1} / ${studyCards.length}`;

}


// ==========================================
// ПЕРЕВОРОТ
// ==========================================

card.addEventListener(
    "click",
    function() {

        card.classList.toggle(
            "flipped"
        );

    }
);


// ==========================================
// ЗНАЮ / НЕ ЗНАЮ
// ==========================================

function answer(known) {

    if (
        !studyCards[currentCard]
    ) {

        return;

    }


    const item =
        studyCards[currentCard];


    if (known) {

        // Запоминаем выученную карточку

        knownCards.push(item.id);


        // Удаляем её из текущего обучения

        studyCards.splice(
            currentCard,
            1
        );


        // Если больше карточек нет

        if (
            studyCards.length === 0
        ) {

            finishLesson();

            return;

        }


        // После удаления индекс
        // остаётся на текущей позиции

        if (
            currentCard >=
            studyCards.length
        ) {

            currentCard = 0;

        }


    } else {

        // Если не знаешь —
        // отправляем карточку в конец

        const failedCard =
            studyCards.splice(
                currentCard,
                1
            )[0];


        studyCards.push(
            failedCard
        );


        if (
            currentCard >=
            studyCards.length
        ) {

            currentCard = 0;

        }

    }


    showCard();

}


// ==========================================
// СЛЕДУЮЩАЯ
// ==========================================

function nextCard() {

    currentCard++;


    if (
        currentCard >=
        studyCards.length
    ) {

        currentCard = 0;

    }


    showCard();

}


// ==========================================
// ОКОНЧАНИЕ
// ==========================================

function finishLesson() {

    const total =
        cards.length;


    const known =
        knownCards.length;


    alert(

        "Урок завершён!\n\n" +

        "Колода: 20 главных действий с предметами\n\n" +

        "Выучено: " +
        known +
        " из " +
        total

    );


    // Начинаем заново

    studyCards =
        [...cards];

    currentCard = 0;

    knownCards = [];


    showCard();

}


// ==========================================
// ЗАПУСК
// ==========================================

showCard();
