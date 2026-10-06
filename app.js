const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ==========================================
// ВСТРОЕННЫЕ ИЛЛЮСТРАЦИИ
// ==========================================

function makeImage(emoji, title) {

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="800"
         height="500"
         viewBox="0 0 800 500">

        <rect width="800"
              height="500"
              fill="#f4f5f7"/>

        <circle
            cx="400"
            cy="210"
            r="150"
            fill="#ffffff"/>

        <text
            x="400"
            y="245"
            text-anchor="middle"
            font-size="150">
            ${emoji}
        </text>

        <text
            x="400"
            y="410"
            text-anchor="middle"
            font-family="Arial, sans-serif"
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
// ГОТОВАЯ КОЛОДА
// ==========================================

const defaultDeck = {

    id: "actions-20",

    name: "20 главных действий с предметами",

    cards: [

        {
            id: "action-01",
            front: "Pick up the phone.",
            back: "Подними / возьми телефон.",
            image: makeImage("📱", "Pick up")
        },

        {
            id: "action-02",
            front: "Put the cup down on the table.",
            back: "Поставь чашку на стол.",
            image: makeImage("☕", "Put down")
        },

        {
            id: "action-03",
            front: "Move the book aside.",
            back: "Отодвинь книгу в сторону.",
            image: makeImage("📖", "Move aside")
        },

        {
            id: "action-04",
            front: "Move the box over here.",
            back: "Передвинь / переставь коробку сюда.",
            image: makeImage("📦", "Move here")
        },

        {
            id: "action-05",
            front: "Put the key in your pocket.",
            back: "Положи ключ в карман.",
            image: makeImage("🔑", "Put inside")
        },

        {
            id: "action-06",
            front: "Take the key out of your pocket.",
            back: "Достань ключ из кармана.",
            image: makeImage("🔑", "Take out")
        },

        {
            id: "action-07",
            front: "Give me the pen.",
            back: "Дай мне ручку.",
            image: makeImage("🖊️", "Give me")
        },

        {
            id: "action-08",
            front: "Lift the box up.",
            back: "Подними коробку вверх.",
            image: makeImage("📦", "Lift up")
        },

        {
            id: "action-09",
            front: "Lower the box slowly.",
            back: "Медленно опусти коробку.",
            image: makeImage("📦", "Lower")
        },

        {
            id: "action-10",
            front: "Tilt the bottle slightly.",
            back: "Слегка наклони бутылку.",
            image: makeImage("🍾", "Tilt")
        },

        {
            id: "action-11",
            front: "Keep the bottle upright.",
            back: "Держи бутылку вертикально.",
            image: makeImage("🧴", "Keep upright")
        },

        {
            id: "action-12",
            front: "Bring the phone closer.",
            back: "Поднеси телефон ближе.",
            image: makeImage("📱", "Bring closer")
        },

        {
            id: "action-13",
            front: "Move the phone farther away.",
            back: "Отодвинь / отнеси телефон подальше.",
            image: makeImage("📱", "Move away")
        },

        {
            id: "action-14",
            front: "Give the bottle a good shake.",
            back: "Хорошенько встряхни бутылку.",
            image: makeImage("🧴", "Shake")
        },

        {
            id: "action-15",
            front: "Be careful! Don't drop the glass.",
            back: "Осторожно! Не урони стакан.",
            image: makeImage("🥛", "Don't drop")
        },

        {
            id: "action-16",
            front: "Carry the laptop carefully.",
            back: "Неси ноутбук осторожно.",
            image: makeImage("💻", "Carry")
        },

        {
            id: "action-17",
            front: "Set the plate down gently.",
            back: "Аккуратно поставь тарелку.",
            image: makeImage("🍽️", "Set down")
        },

        {
            id: "action-18",
            front: "Turn the phone around.",
            back: "Разверни телефон.",
            image: makeImage("📱", "Turn around")
        },

        {
            id: "action-19",
            front: "Turn the cup upside down.",
            back: "Переверни чашку вверх дном.",
            image: makeImage("☕", "Turn upside down")
        },

        {
            id: "action-20",
            front: "Leave the keys there.",
            back: "Оставь ключи там.",
            image: makeImage("🔑", "Leave there")
        }

    ]

};


// ==========================================
// ЗАГРУЗКА КОЛОД
// ==========================================

let decks = [];

let currentDeckId = null;

let currentStudyCards = [];

let currentCardIndex = 0;

let knownCards = [];


// ==========================================
// ХРАНИЛИЩЕ TELEGRAM
// ==========================================

const STORAGE_KEY = "flashcards_decks";


// ==========================================
// ЗАГРУЗКА ДАННЫХ
// ==========================================

function loadData() {

    tg.CloudStorage.getItem(
        STORAGE_KEY,
        function(error, value) {

            if (error) {

                decks = [];

                addDefaultDeck();

                return;
            }


            if (value) {

                try {

                    decks = JSON.parse(value);

                } catch {

                    decks = [];

                }

            } else {

                decks = [];

            }


            // Добавляем нашу готовую колоду,
            // если её ещё нет

            const exists =
                decks.some(
                    deck =>
                        deck.id === defaultDeck.id
                );


            if (!exists) {

                decks.unshift(defaultDeck);

                saveData(function() {

                    showHome();

                });

            } else {

                showHome();

            }

        }
    );
}


// ==========================================
// ДОБАВЛЕНИЕ ГОТОВОЙ КОЛОДЫ
// ==========================================

function addDefaultDeck() {

    decks = [defaultDeck];

    saveData(function() {

        showHome();

    });

}


// ==========================================
// СОХРАНЕНИЕ
// ==========================================

function saveData(callback) {

    tg.CloudStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(decks),

        function(error) {

            if (error) {

                console.log(error);

                alert(
                    "Ошибка сохранения данных."
                );

                return;

            }


            if (callback) {

                callback();

            }

        }

    );

}


// ==========================================
// ЭКРАНЫ
// ==========================================

function hideAllScreens() {

    document
        .querySelectorAll(".screen")
        .forEach(
            screen =>
                screen.classList.add("hidden")
        );

}


function showHome() {

    hideAllScreens();

    document
        .getElementById("homeScreen")
        .classList.remove("hidden");

    renderDecks();

}


// ==========================================
// СПИСОК КОЛОД
// ==========================================

function renderDecks() {

    const container =
        document.getElementById("decksList");

    container.innerHTML = "";


    if (decks.length === 0) {

        const empty =
            document.createElement("div");

        empty.className = "deck-item";

        empty.innerHTML = `
            <div class="deck-name">
                Нет колод
            </div>

            <div class="deck-count">
                Создайте первую колоду
            </div>
        `;

        container.appendChild(empty);

        return;

    }


    decks.forEach(deck => {

        const item =
            document.createElement("div");

        item.className = "deck-item";

        item.onclick =
            () => openDeck(deck.id);


        item.innerHTML = `

            <div class="deck-name">
                ${escapeHtml(deck.name)}
            </div>

            <div class="deck-count">
                ${deck.cards.length}
                карточек
            </div>

        `;


        container.appendChild(item);

    });

}


// ==========================================
// ОТКРЫТИЕ КОЛОДЫ
// ==========================================

function openDeck(id) {

    const deck =
        decks.find(
            item => item.id === id
        );


    if (!deck) {

        showHome();

        return;

    }


    currentDeckId = id;


    hideAllScreens();


    document
        .getElementById("deckScreen")
        .classList.remove("hidden");


    document
        .getElementById("deckTitle")
        .textContent =
            deck.name;


    renderDeckCards(deck);

}


// ==========================================
// СПИСОК КАРТОЧЕК
// ==========================================

function renderDeckCards(deck) {

    const container =
        document.getElementById("deckCardsList");

    container.innerHTML = "";


    deck.cards.forEach(
        (card, index) => {

            const row =
                document.createElement("div");

            row.className =
                "deck-card-row";


            row.innerHTML = `

                <div class="deck-card-front">
                    ${index + 1}.
                    ${escapeHtml(card.front)}
                </div>

                <div class="deck-card-back">
                    ${escapeHtml(card.back)}
                </div>

            `;


            container.appendChild(row);

        }
    );

}


// ==========================================
// НАЧАЛО ОБУЧЕНИЯ
// ==========================================

function startCurrentDeck() {

    const deck =
        decks.find(
            item =>
                item.id === currentDeckId
        );


    if (!deck) {

        return;

    }


    currentStudyCards =
        [...deck.cards];


    currentCardIndex = 0;

    knownCards = [];


    hideAllScreens();


    document
        .getElementById("studyScreen")
        .classList.remove("hidden");


    document
        .getElementById("studyDeckName")
        .textContent =
            deck.name;


    showStudyCard();

}


// ==========================================
// ПОКАЗ КАРТОЧКИ
// ==========================================

function showStudyCard() {

    const item =
        currentStudyCards[
            currentCardIndex
        ];


    if (!item) {

        finishLesson();

        return;

    }


    const card =
        document.getElementById("card");


    card.classList.remove(
        "flipped"
    );


    document
        .getElementById("frontText")
        .textContent =
            item.front;


    document
        .getElementById("backText")
        .textContent =
            item.back;


    document
        .getElementById("progress")
        .textContent =
            `${currentCardIndex + 1} / ${currentStudyCards.length}`;


    document
        .getElementById("cardImage")
        .src =
            item.image;


    document
        .getElementById("cardImageBack")
        .src =
            item.image;

}


// ==========================================
// ПЕРЕВОРОТ
// ==========================================

document
    .getElementById("card")
    .addEventListener(
        "click",
        function() {

            this.classList.toggle(
                "flipped"
            );

        }
    );


// ==========================================
// ЗНАЮ / НЕ ЗНАЮ
// ==========================================

function answer(known) {

    const current =
        currentStudyCards[
            currentCardIndex
        ];


    if (!current) {

        return;

    }


    if (known) {

        knownCards.push(
            current.id
        );


        currentCardIndex++;


    } else {

        // Убираем карточку
        // из текущей позиции

        currentStudyCards.splice(
            currentCardIndex,
            1
        );


        // И ставим её в конец

        currentStudyCards.push(
            current
        );


        currentCardIndex++;

    }


    if (
        currentCardIndex >=
        currentStudyCards.length
    ) {

        finishLesson();

        return;

    }


    showStudyCard();

}


// ==========================================
// СЛЕДУЮЩАЯ
// ==========================================

function nextCard() {

    currentCardIndex++;


    if (
        currentCardIndex >=
        currentStudyCards.length
    ) {

        finishLesson();

        return;

    }


    showStudyCard();

}


// ==========================================
// ЗАВЕРШЕНИЕ
// ==========================================

function finishLesson() {

    const deck =
        decks.find(
            item =>
                item.id === currentDeckId
        );


    hideAllScreens();


    document
        .getElementById("deckScreen")
        .classList.remove("hidden");


    if (deck) {

        document
            .getElementById("deckTitle")
            .textContent =
                deck.name;


        renderDeckCards(deck);

    }


    alert(
        "Урок завершён!\n\n" +
        "Колода: " +
        (deck
            ? deck.name
            : "") +
        "\nКарточек: " +
        knownCards.length
    );

}


// ==========================================
// БЕЗОПАСНЫЙ ВЫВОД ТЕКСТА
// ==========================================

function escapeHtml(text) {

    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ==========================================
// ЗАПУСК
// ==========================================

loadData();
