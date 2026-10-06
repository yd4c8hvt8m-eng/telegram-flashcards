// ==========================================
// TELEGRAM
// ==========================================

const tg = window.Telegram.WebApp;

tg.ready();

tg.expand();


// ==========================================
// ХРАНИЛИЩЕ
// ==========================================

const STORAGE_KEY =
    "flashcards_decks_v3";


let decks = [];

let currentDeckId = null;

let studyCards = [];

let currentCard = 0;

let knownCards = [];


// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================

function escapeHtml(text) {

    return String(text)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ==========================================
// КАРТИНКА ПО УМОЛЧАНИЮ
// ==========================================

function makeDefaultImage(title) {

    const safeTitle =
        escapeHtml(title);


    const svg = `

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800"
            height="500"
            viewBox="0 0 800 500"
        >

            <rect
                width="800"
                height="500"
                fill="#f4f5f7"
            />

            <circle
                cx="400"
                cy="210"
                r="150"
                fill="#ffffff"
            />

            <text
                x="400"
                y="220"
                text-anchor="middle"
                font-family="Arial"
                font-size="38"
                font-weight="700"
                fill="#222"
            >
                Flash Cards
            </text>

            <text
                x="400"
                y="280"
                text-anchor="middle"
                font-family="Arial"
                font-size="22"
                fill="#888"
            >
                ${safeTitle}
            </text>

        </svg>

    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


// ==========================================
// СТАНДАРТНАЯ КОЛОДА
// ==========================================

function createDefaultDeck() {

    return {

        id:
            "actions-20",

        name:
            "20 главных действий с предметами",

        builtIn:
            true,

        russianFirst:
            true,

        cards: [

            {
                id: "a1",

                front:
                    "Подними / возьми телефон.",

                back:
                    "Pick up the phone.",

                image:
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a2",

                front:
                    "Поставь чашку на стол.",

                back:
                    "Put the cup down on the table.",

                image:
                    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a3",

                front:
                    "Отодвинь книгу в сторону.",

                back:
                    "Move the book aside.",

                image:
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a4",

                front:
                    "Передвинь / переставь коробку сюда.",

                back:
                    "Move the box over here.",

                image:
                    "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a5",

                front:
                    "Положи ключ в карман.",

                back:
                    "Put the key in your pocket.",

                image:
                    "https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a6",

                front:
                    "Достань ключ из кармана.",

                back:
                    "Take the key out of your pocket.",

                image:
                    "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a7",

                front:
                    "Дай мне ручку.",

                back:
                    "Give me the pen.",

                image:
                    "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a8",

                front:
                    "Подними коробку вверх.",

                back:
                    "Lift the box up.",

                image:
                    "https://images.unsplash.com/photo-1586528116493-da8b2e6b1f4d?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a9",

                front:
                    "Медленно опусти коробку.",

                back:
                    "Lower the box slowly.",

                image:
                    "https://images.unsplash.com/photo-1601758123927-19640b8c2b5f?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a10",

                front:
                    "Слегка наклони бутылку.",

                back:
                    "Tilt the bottle slightly.",

                image:
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a11",

                front:
                    "Держи бутылку вертикально.",

                back:
                    "Keep the bottle upright.",

                image:
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a12",

                front:
                    "Поднеси телефон ближе.",

                back:
                    "Bring the phone closer.",

                image:
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a13",

                front:
                    "Отодвинь / отнеси телефон подальше.",

                back:
                    "Move the phone farther away.",

                image:
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a14",

                front:
                    "Хорошенько встряхни бутылку.",

                back:
                    "Give the bottle a good shake.",

                image:
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a15",

                front:
                    "Осторожно! Не урони стакан.",

                back:
                    "Be careful! Don't drop the glass.",

                image:
                    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a16",

                front:
                    "Неси ноутбук осторожно.",

                back:
                    "Carry the laptop carefully.",

                image:
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a17",

                front:
                    "Аккуратно поставь тарелку.",

                back:
                    "Set the plate down gently.",

                image:
                    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a18",

                front:
                    "Разверни телефон.",

                back:
                    "Turn the phone around.",

                image:
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a19",

                front:
                    "Переверни чашку вверх дном.",

                back:
                    "Turn the cup upside down.",

                image:
                    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80"
            },


            {
                id: "a20",

                front:
                    "Оставь ключи там.",

                back:
                    "Leave the keys there.",

                image:
                    "https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&w=800&q=80"
            }

        ]

    };

}


// ==========================================
// ЗАГРУЗКА ДАННЫХ
// ==========================================

function loadData() {

    if (
        tg.CloudStorage &&
        typeof tg.CloudStorage.getItem === "function"
    ) {

        tg.CloudStorage.getItem(
            STORAGE_KEY,
            function(error, value) {

                if (
                    !error &&
                    value
                ) {

                    try {

                        decks =
                            JSON.parse(value);

                    } catch {

                        decks = [];

                    }

                } else {

                    decks =
                        loadLocalData();

                }


                ensureDefaultDeck();

                renderHome();

            }
        );

    } else {

        decks =
            loadLocalData();

        ensureDefaultDeck();

        renderHome();

    }

}


// ==========================================
// LOCAL STORAGE
// ==========================================

function loadLocalData() {

    try {

        const value =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!value) {

            return [];

        }


        return JSON.parse(value);

    } catch {

        return [];

    }

}


// ==========================================
// СОХРАНЕНИЕ
// ==========================================

function saveData(callback) {

    const data =
        JSON.stringify(
            decks
        );


    try {

        localStorage.setItem(
            STORAGE_KEY,
            data
        );

    } catch {

        console.log(
            "LocalStorage unavailable"
        );

    }


    if (
        tg.CloudStorage &&
        typeof tg.CloudStorage.setItem === "function"
    ) {

        tg.CloudStorage.setItem(
            STORAGE_KEY,
            data,
            function(error) {

                if (error) {

                    console.log(
                        "CloudStorage error:",
                        error
                    );

                }


                if (callback) {

                    callback();

                }

            }
        );

    } else {

        if (callback) {

            callback();

        }

    }

}


// ==========================================
// ПРОВЕРКА СТАНДАРТНОЙ КОЛОДЫ
// ==========================================

function ensureDefaultDeck() {

    const existingDeck =
        decks.find(
            deck =>
                deck.id ===
                "actions-20"
        );


    if (!existingDeck) {

        decks.unshift(
            createDefaultDeck()
        );


        saveData();


        return;

    }


    /*
        Если пользователь открыл приложение
        после старой версии, где английский
        был первым, исправляем порядок.
    */

    if (
        !existingDeck.russianFirst
    ) {

        existingDeck.cards =
            existingDeck.cards.map(
                card => {

                    return {

                        ...card,

                        front:
                            card.back,

                        back:
                            card.front

                    };

                }
            );


        existingDeck.russianFirst =
            true;


        saveData();

    }

}


// ==========================================
// ПОКАЗ ЭКРАНА
// ==========================================

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(
            screen =>
                screen.classList.add(
                    "hidden"
                )
        );


    document
        .getElementById(id)
        .classList.remove(
            "hidden"
        );

}


// ==========================================
// ГЛАВНЫЙ ЭКРАН
// ==========================================

function renderHome() {

    showScreen(
        "homeScreen"
    );


    const list =
        document.getElementById(
            "decksList"
        );


    list.innerHTML = "";


    if (
        decks.length === 0
    ) {

        list.innerHTML = `

            <div class="deck-item">

                <div class="deck-name">
                    Пока нет колод
                </div>

                <div class="deck-count">
                    Создайте первую колоду
                </div>

            </div>

        `;


        return;

    }


    decks.forEach(
        deck => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "deck-item";


            item.innerHTML = `

                <div class="deck-name">
                    ${escapeHtml(
                        deck.name
                    )}
                </div>

                <div class="deck-count">
                    ${deck.cards.length}
                    карточек
                </div>

            `;


            item.addEventListener(
                "click",
                function() {

                    openDeck(
                        deck.id
                    );

                }
            );


            list.appendChild(
                item
            );

        }
    );

}


// ==========================================
// СОЗДАНИЕ КОЛОДЫ
// ==========================================

function openCreateDeck() {

    showScreen(
        "createScreen"
    );


    document
        .getElementById(
            "deckName"
        )
        .value = "";


    document
        .getElementById(
            "newCardsList"
        )
        .innerHTML = "";


    addNewCard();

}


// ==========================================
// ДОБАВЛЕНИЕ КАРТОЧКИ
// ==========================================

function addNewCard() {

    const list =
        document.getElementById(
            "newCardsList"
        );


    const number =
        list.children.length + 1;


    const block =
        document.createElement(
            "div"
        );


    block.className =
        "new-card";


    block.innerHTML = `

        <div class="card-number">
            Карточка ${number}
        </div>


        <div class="field">

            <label>
                Русский
            </label>

            <textarea
                class="new-front"
                placeholder="Например: Мне нужна помощь"
            ></textarea>

        </div>


        <div class="field">

            <label>
                English
            </label>

            <textarea
                class="new-back"
                placeholder="For example: I need some help"
            ></textarea>

        </div>


        <div class="field">

            <label>
                Ссылка на картинку
            </label>

            <input
                class="new-image"
                type="url"
                placeholder="https://..."
            >

        </div>


        <button
            class="remove-card"
            type="button"
        >
            Удалить карточку
        </button>

    `;


    block
        .querySelector(
            ".remove-card"
        )
        .addEventListener(
            "click",
            function() {

                block.remove();

                renumberCards();

            }
        );


    list.appendChild(
        block
    );

}


// ==========================================
// НУМЕРАЦИЯ КАРТОЧЕК
// ==========================================

function renumberCards() {

    document
        .querySelectorAll(
            ".new-card"
        )
        .forEach(
            (block, index) => {

                block
                    .querySelector(
                        ".card-number"
                    )
                    .textContent =
                        `Карточка ${index + 1}`;

            }
        );

}


// ==========================================
// СОХРАНЕНИЕ НОВОЙ КОЛОДЫ
// ==========================================

function saveNewDeck() {

    const name =
        document
            .getElementById(
                "deckName"
            )
            .value
            .trim();


    if (!name) {

        alert(
            "Введите название колоды."
        );


        return;

    }


    const blocks =
        document.querySelectorAll(
            ".new-card"
        );


    const newCards = [];


    blocks.forEach(
        block => {

            const front =
                block
                    .querySelector(
                        ".new-front"
                    )
                    .value
                    .trim();


            const back =
                block
                    .querySelector(
                        ".new-back"
                    )
                    .value
                    .trim();


            const image =
                block
                    .querySelector(
                        ".new-image"
                    )
                    .value
                    .trim();


            if (
                front &&
                back
            ) {

                newCards.push({

                    id:
                        "card-" +
                        Date.now() +
                        "-" +
                        Math.random()
                            .toString(36)
                            .slice(2),

                    front:
                        front,

                    back:
                        back,

                    image:
                        image ||
                        makeDefaultImage(
                            front
                        )

                });

            }

        }
    );


    if (
        newCards.length === 0
    ) {

        alert(
            "Добавьте хотя бы одну карточку."
        );


        return;

    }


    const newDeck = {

        id:
            "deck-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2),

        name:
            name,

        builtIn:
            false,

        russianFirst:
            true,

        cards:
            newCards

    };


    decks.push(
        newDeck
    );


    currentDeckId =
        newDeck.id;


    saveData(
        function() {

            openDeck(
                newDeck.id
            );

        }
    );

}


// ==========================================
// ОТКРЫТИЕ КОЛОДЫ
// ==========================================

function openDeck(id) {

    const deck =
        decks.find(
            item =>
                item.id ===
                id
        );


    if (!deck) {

        renderHome();

        return;

    }


    currentDeckId =
        id;


    showScreen(
        "deckScreen"
    );


    document
        .getElementById(
            "deckTitle"
        )
        .textContent =
            deck.name;


    /*
        Каждый раз при открытии колоды
        содержание скрыто.
    */

    const content =
        document.getElementById(
            "deckCardsContainer"
        );


    content.classList.add(
        "hidden"
    );


    document
        .getElementById(
            "contentButton"
        )
        .textContent =
            "☰ Содержание колоды";


    renderDeckCards(
        deck
    );

}


// ==========================================
// СОДЕРЖАНИЕ КОЛОДЫ
// ==========================================

function renderDeckCards(deck) {

    const list =
        document.getElementById(
            "deckCardsList"
        );


    list.innerHTML = "";


    deck.cards.forEach(
        (card, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "deck-card-row";


            row.innerHTML = `

                <div class="deck-card-front">
                    ${index + 1}.
                    ${escapeHtml(
                        card.front
                    )}
                </div>

                <div class="deck-card-back">
                    ${escapeHtml(
                        card.back
                    )}
                </div>

            `;


            list.appendChild(
                row
            );

        }
    );

}


// ==========================================
// ПОКАЗ / СКРЫТИЕ СОДЕРЖАНИЯ
// ==========================================

function toggleDeckContent() {

    const container =
        document.getElementById(
            "deckCardsContainer"
        );


    const button =
        document.getElementById(
            "contentButton"
        );


    const hidden =
        container.classList.contains(
            "hidden"
        );


    if (hidden) {

        container.classList.remove(
            "hidden"
        );


        button.textContent =
            "⌃ Скрыть содержание";

    } else {

        container.classList.add(
            "hidden"
        );


        button.textContent =
            "☰ Содержание колоды";

    }

}


// ==========================================
// УДАЛЕНИЕ КОЛОДЫ
// ==========================================

function deleteCurrentDeck() {

    const deck =
        decks.find(
            item =>
                item.id ===
                currentDeckId
        );


    if (!deck) {

        return;

    }


    if (
        deck.builtIn
    ) {

        alert(
            "Стандартную колоду удалить нельзя."
        );


        return;

    }


    const confirmed =
        confirm(
            "Удалить эту колоду?"
        );


    if (!confirmed) {

        return;

    }


    decks =
        decks.filter(
            item =>
                item.id !==
                currentDeckId
        );


    currentDeckId =
        null;


    saveData(
        function() {

            renderHome();

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
                item.id ===
                currentDeckId
        );


    if (
        !deck ||
        deck.cards.length === 0
    ) {

        alert(
            "В этой колоде нет карточек."
        );


        return;

    }


    studyCards =
        [...deck.cards];


    currentCard =
        0;


    knownCards =
        [];


    showScreen(
        "studyScreen"
    );


    document
        .getElementById(
            "studyDeckName"
        )
        .textContent =
            deck.name;


    showStudyCard();

}


// ==========================================
// ПОКАЗ КАРТОЧКИ
// ==========================================

function showStudyCard() {

    if (
        studyCards.length === 0
    ) {

        finishLesson();

        return;

    }


    if (
        currentCard >=
        studyCards.length
    ) {

        currentCard =
            0;

    }


    const item =
        studyCards[
            currentCard
        ];


    const card =
        document.getElementById(
            "card"
        );


    card.classList.remove(
        "flipped"
    );


    /*
        ПЕРЕДНЯЯ СТОРОНА:
        РУССКИЙ
    */

    document
        .getElementById(
            "frontText"
        )
        .textContent =
            item.front;


    /*
        ОБРАТНАЯ СТОРОНА:
        АНГЛИЙСКИЙ
    */

    document
        .getElementById(
            "backText"
        )
        .textContent =
            item.back;


    /*
        КАРТИНКА
    */

    document
        .getElementById(
            "cardImage"
        )
        .src =
            item.image;


    document
        .getElementById(
            "cardImageBack"
        )
        .src =
            item.image;


    /*
        ПРОГРЕСС
    */

    document
        .getElementById(
            "progress"
        )
        .textContent =
            `${currentCard + 1} / ${studyCards.length}`;

}


// ==========================================
// ПЕРЕВОРОТ
// ==========================================

function flipCard() {

    document
        .getElementById(
            "card"
        )
        .classList
        .toggle(
            "flipped"
        );

}


// ==========================================
// ЗНАЮ / НЕ ЗНАЮ
// ==========================================

function answer(known) {

    const item =
        studyCards[
            currentCard
        ];


    if (!item) {

        return;

    }


    if (known) {

        /*
            ЗНАЮ:
            удаляем карточку
            из текущего круга
        */

        knownCards.push(
            item.id
        );


        studyCards.splice(
            currentCard,
            1
        );


        if (
            studyCards.length === 0
        ) {

            finishLesson();

            return;

        }


        if (
            currentCard >=
            studyCards.length
        ) {

            currentCard =
                0;

        }

    } else {

        /*
            НЕ ЗНАЮ:
            переносим карточку
            в конец списка
        */

        studyCards.splice(
            currentCard,
            1
        );


        studyCards.push(
            item
        );


        if (
            currentCard >=
            studyCards.length
        ) {

            currentCard =
                0;

        }

    }


    showStudyCard();

}


// ==========================================
// СЛЕДУЮЩАЯ КАРТОЧКА
// ==========================================

function nextCard() {

    currentCard++;


    if (
        currentCard >=
        studyCards.length
    ) {

        currentCard =
            0;

    }


    showStudyCard();

}


// ==========================================
// ЗАВЕРШЕНИЕ УРОКА
// ==========================================

function finishLesson() {

    const deck =
        decks.find(
            item =>
                item.id ===
                currentDeckId
        );


    alert(

        "Урок завершён!\n\n" +

        "Колода: " +

        (
            deck
                ? deck.name
                : ""
        ) +

        "\n\nВыучено: " +

        knownCards.length

    );


    if (deck) {

        openDeck(
            deck.id
        );

    } else {

        renderHome();

    }

}


// ==========================================
// КНОПКИ
// ==========================================

document
    .getElementById(
        "createDeckButton"
    )
    .addEventListener(
        "click",
        openCreateDeck
    );


document
    .getElementById(
        "backToHomeButton"
    )
    .addEventListener(
        "click",
        renderHome
    );


document
    .getElementById(
        "deckBackButton"
    )
    .addEventListener(
        "click",
        renderHome
    );


document
    .getElementById(
        "addCardButton"
    )
    .addEventListener(
        "click",
        addNewCard
    );


document
    .getElementById(
        "saveDeckButton"
    )
    .addEventListener(
        "click",
        saveNewDeck
    );


document
    .getElementById(
        "contentButton"
    )
    .addEventListener(
        "click",
        toggleDeckContent
    );


document
    .getElementById(
        "startDeckButton"
    )
    .addEventListener(
        "click",
        startCurrentDeck
    );


document
    .getElementById(
        "deleteDeckButton"
    )
    .addEventListener(
        "click",
        deleteCurrentDeck
    );


document
    .getElementById(
        "dontKnowButton"
    )
    .addEventListener(
        "click",
        function() {

            answer(false);

        }
    );


document
    .getElementById(
        "knowButton"
    )
    .addEventListener(
        "click",
        function() {

            answer(true);

        }
    );


document
    .getElementById(
        "nextButton"
    )
    .addEventListener(
        "click",
        nextCard
    );


document
    .getElementById(
        "card"
    )
    .addEventListener(
        "click",
        flipCard
    );


// ==========================================
// ЗАПУСК
// ==========================================

loadData();
