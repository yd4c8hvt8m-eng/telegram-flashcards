// ==========================================
// TELEGRAM
// ==========================================

const tg =
    window.Telegram.WebApp;


tg.ready();

tg.expand();


// ==========================================
// ХРАНИЛИЩЕ
// ==========================================

const STORAGE_KEY =
    "flashcards_universal_v4";


let decks = [];

let currentDeckId =
    null;

let studyCards = [];

let currentCard =
    0;

let knownCards = [];

let selectedDeckEmoji =
    "📚";

let toastTimer =
    null;


// ==========================================
// ЭМОДЗИ
// ==========================================

const CARD_EMOJIS = [
    "📚",
    "🧠",
    "💼",
    "📊",
    "🐟",
    "🚗",
    "⚙️",
    "⭐",
    "📱",
    "📦",
    "🔑",
    "💰",
    "🏠",
    "🎯",
    "📅",
    "📝",
    "💡",
    "🎓",
    "🌍",
    "❤️"
];


// ==========================================
// БЕЗОПАСНЫЙ HTML
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
// УВЕДОМЛЕНИЕ
// ==========================================

function showToast(
    message,
    icon = "✓"
) {

    const toast =
        document.getElementById(
            "toast"
        );


    const toastIcon =
        document.getElementById(
            "toastIcon"
        );


    const toastText =
        document.getElementById(
            "toastText"
        );


    toastIcon.textContent =
        icon;


    toastText.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            1800
        );

}


// ==========================================
// HAPTIC
// ==========================================

function haptic(type = "light") {

    try {

        if (
            tg.HapticFeedback
        ) {

            tg.HapticFeedback
                .impactOccurred(
                    type
                );

        }

    } catch {

        // Ничего не делаем

    }

}


// ==========================================
// КАРТИНКА ПО УМОЛЧАНИЮ
// ==========================================

function makeDefaultImage(
    emoji
) {

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

            <text
                x="400"
                y="280"
                text-anchor="middle"
                font-family="Arial"
                font-size="180"
            >
                ${emoji}
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

        icon:
            "📚",

        builtIn:
            true,

        universal:
            true,

        cards: [

            {
                id: "a1",

                front:
                    "Подними / возьми телефон.",

                back:
                    "Pick up the phone.",

                emoji:
                    "📱"
            },


            {
                id: "a2",

                front:
                    "Поставь чашку на стол.",

                back:
                    "Put the cup down on the table.",

                emoji:
                    "☕"
            },


            {
                id: "a3",

                front:
                    "Отодвинь книгу в сторону.",

                back:
                    "Move the book aside.",

                emoji:
                    "📖"
            },


            {
                id: "a4",

                front:
                    "Передвинь / переставь коробку сюда.",

                back:
                    "Move the box over here.",

                emoji:
                    "📦"
            },


            {
                id: "a5",

                front:
                    "Положи ключ в карман.",

                back:
                    "Put the key in your pocket.",

                emoji:
                    "🔑"
            },


            {
                id: "a6",

                front:
                    "Достань ключ из кармана.",

                back:
                    "Take the key out of your pocket.",

                emoji:
                    "🔑"
            },


            {
                id: "a7",

                front:
                    "Дай мне ручку.",

                back:
                    "Give me the pen.",

                emoji:
                    "🖊️"
            },


            {
                id: "a8",

                front:
                    "Подними коробку вверх.",

                back:
                    "Lift the box up.",

                emoji:
                    "📦"
            },


            {
                id: "a9",

                front:
                    "Медленно опусти коробку.",

                back:
                    "Lower the box slowly.",

                emoji:
                    "📦"
            },


            {
                id: "a10",

                front:
                    "Слегка наклони бутылку.",

                back:
                    "Tilt the bottle slightly.",

                emoji:
                    "🍾"
            },


            {
                id: "a11",

                front:
                    "Держи бутылку вертикально.",

                back:
                    "Keep the bottle upright.",

                emoji:
                    "🧴"
            },


            {
                id: "a12",

                front:
                    "Поднеси телефон ближе.",

                back:
                    "Bring the phone closer.",

                emoji:
                    "📱"
            },


            {
                id: "a13",

                front:
                    "Отодвинь / отнеси телефон подальше.",

                back:
                    "Move the phone farther away.",

                emoji:
                    "📱"
            },


            {
                id: "a14",

                front:
                    "Хорошенько встряхни бутылку.",

                back:
                    "Give the bottle a good shake.",

                emoji:
                    "🧴"
            },


            {
                id: "a15",

                front:
                    "Осторожно! Не урони стакан.",

                back:
                    "Be careful! Don't drop the glass.",

                emoji:
                    "🥛"
            },


            {
                id: "a16",

                front:
                    "Неси ноутбук осторожно.",

                back:
                    "Carry the laptop carefully.",

                emoji:
                    "💻"
            },


            {
                id: "a17",

                front:
                    "Аккуратно поставь тарелку.",

                back:
                    "Set the plate down gently.",

                emoji:
                    "🍽️"
            },


            {
                id: "a18",

                front:
                    "Разверни телефон.",

                back:
                    "Turn the phone around.",

                emoji:
                    "📱"
            },


            {
                id: "a19",

                front:
                    "Переверни чашку вверх дном.",

                back:
                    "Turn the cup upside down.",

                emoji:
                    "☕"
            },


            {
                id: "a20",

                front:
                    "Оставь ключи там.",

                back:
                    "Leave the keys there.",

                emoji:
                    "🔑"
            }

        ]

    };

}


// ==========================================
// ЗАГРУЗКА
// ==========================================

function loadData() {

    if (
        tg.CloudStorage &&
        typeof tg.CloudStorage.getItem ===
        "function"
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
                            JSON.parse(
                                value
                            );

                    } catch {

                        decks =
                            [];

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


        return JSON.parse(
            value
        );

    } catch {

        return [];

    }

}


// ==========================================
// СОХРАНЕНИЕ
// ==========================================

function saveData(
    callback
) {

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
        typeof tg.CloudStorage.setItem ===
        "function"
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
// СТАНДАРТНАЯ КОЛОДА
// ==========================================

function ensureDefaultDeck() {

    const exists =
        decks.some(
            deck =>
                deck.id ===
                "actions-20"
        );


    if (!exists) {

        decks.unshift(
            createDefaultDeck()
        );


        saveData();

    }

}


// ==========================================
// ПОКАЗ ЭКРАНА
// ==========================================

function showScreen(
    id
) {

    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(
            screen =>
                screen.classList.add(
                    "hidden"
                )
        );


    document
        .getElementById(
            id
        )
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


    list.innerHTML =
        "";


    if (
        decks.length === 0
    ) {

        list.innerHTML = `

            <div class="deck-item">

                <div class="deck-icon">
                    📚
                </div>

                <div class="deck-info">

                    <div class="deck-name">
                        Пока нет колод
                    </div>

                    <div class="deck-count">
                        Создайте первую колоду
                    </div>

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

                <div class="deck-icon">
                    ${escapeHtml(
                        deck.icon ||
                        "📚"
                    )}
                </div>


                <div class="deck-info">

                    <div class="deck-name">
                        ${escapeHtml(
                            deck.name
                        )}
                    </div>


                    <div class="deck-count">
                        ${deck.cards.length}
                        карточек
                    </div>

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

    selectedDeckEmoji =
        "📚";


    showScreen(
        "createScreen"
    );


    document
        .getElementById(
            "deckName"
        )
        .value =
            "";


    document
        .getElementById(
            "newCardsList"
        )
        .innerHTML =
            "";


    document
        .querySelectorAll(
            ".emoji-choice"
        )
        .forEach(
            button => {

                button.classList
                    .remove(
                        "selected"
                    );


                if (
                    button.dataset.emoji ===
                    "📚"
                ) {

                    button.classList
                        .add(
                            "selected"
                        );

                }

            }
        );


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

            Карточка
            ${number}

        </div>


        <!-- ЭМОДЗИ -->

        <div class="card-emoji-select">

            <div
                class="selected-card-emoji"
            >
                💡
            </div>


            <div class="card-emoji-buttons">

                ${CARD_EMOJIS
                    .slice(0, 10)
                    .map(
                        emoji => `

                            <button
                                type="button"
                                class="card-emoji-button"
                                data-emoji="${emoji}"
                            >
                                ${emoji}
                            </button>

                        `
                    )
                    .join("")
                }

            </div>

        </div>


        <!-- ЛИЦЕВАЯ -->

        <div class="field">

            <label>
                Лицевая сторона
            </label>


            <textarea
                class="new-front"
                placeholder="Что хотите запомнить?"
            ></textarea>

        </div>


        <!-- ОБРАТНАЯ -->

        <div class="field">

            <label>
                Обратная сторона
            </label>


            <textarea
                class="new-back"
                placeholder="Ответ, объяснение или дополнительная информация"
            ></textarea>

        </div>


        <button
            type="button"
            class="remove-card"
        >
            Удалить карточку
        </button>

    `;


    // ======================================
    // ВЫБОР ЭМОДЗИ
    // ======================================

    block
        .querySelectorAll(
            ".card-emoji-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        const emoji =
                            this.dataset.emoji;


                        block
                            .querySelector(
                                ".selected-card-emoji"
                            )
                            .textContent =
                                emoji;


                        block.dataset.emoji =
                            emoji;


                        haptic(
                            "light"
                        );

                    }
                );

            }
        );


    // ======================================
    // УДАЛЕНИЕ КАРТОЧКИ
    // ======================================

    block
        .querySelector(
            ".remove-card"
        )
        .addEventListener(
            "click",
            function() {

                block.classList.add(
                    "removing"
                );


                setTimeout(
                    function() {

                        block.remove();

                        renumberCards();

                        showToast(
                            "Карточка удалена",
                            "✓"
                        );

                    },
                    220
                );

            }
        );


    block.dataset.emoji =
        "💡";


    list.appendChild(
        block
    );


    haptic(
        "light"
    );

}


// ==========================================
// НУМЕРАЦИЯ
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
// СОХРАНЕНИЕ КОЛОДЫ
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


    const newCards =
        [];


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


            const emoji =
                block.dataset.emoji ||
                "💡";


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

                    emoji:
                        emoji

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

        icon:
            selectedDeckEmoji,

        builtIn:
            false,

        universal:
            true,

        cards:
            newCards

    };


    /*
        Добавляем колоду
    */

    decks.push(
        newDeck
    );


    currentDeckId =
        newDeck.id;


    /*
        Сохраняем
    */

    saveData(
        function() {

            haptic(
                "medium"
            );


            showToast(
                "Колода создана",
                "✓"
            );


            setTimeout(
                function() {

                    openDeck(
                        newDeck.id
                    );

                },
                500
            );

        }
    );

}


// ==========================================
// ОТКРЫТИЕ КОЛОДЫ
// ==========================================

function openDeck(
    id
) {

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


    document
        .getElementById(
            "deckIcon"
        )
        .textContent =
            deck.icon ||
            "📚";


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

function renderDeckCards(
    deck
) {

    const list =
        document.getElementById(
            "deckCardsList"
        );


    list.innerHTML =
        "";


    deck.cards.forEach(
        (card, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "deck-card-row";


            row.innerHTML = `

                <div class="deck-card-number">
                    ${index + 1}
                </div>


                <div class="deck-card-content">

                    <div class="deck-card-front">
                        ${escapeHtml(
                            card.front
                        )}
                    </div>


                    <div class="deck-card-back">
                        ${escapeHtml(
                            card.back
                        )}
                    </div>

                </div>

            `;


            list.appendChild(
                row
            );

        }
    );

}


// ==========================================
// ПОКАЗ СОДЕРЖАНИЯ
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
// ОТКРЫТИЕ ПОДТВЕРЖДЕНИЯ
// ==========================================

function openDeleteConfirmation() {

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

        showToast(
            "Стандартную колоду удалить нельзя",
            "!"
        );


        return;

    }


    document
        .getElementById(
            "confirmOverlay"
        )
        .classList
        .remove(
            "hidden"
        );

}


// ==========================================
// ЗАКРЫТИЕ ПОДТВЕРЖДЕНИЯ
// ==========================================

function closeDeleteConfirmation() {

    document
        .getElementById(
            "confirmOverlay"
        )
        .classList
        .add(
            "hidden"
        );

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

        closeDeleteConfirmation();

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


    closeDeleteConfirmation();


    haptic(
        "medium"
    );


    saveData(
        function() {

            showToast(
                "Колода удалена",
                "✓"
            );


            setTimeout(
                function() {

                    renderHome();

                },
                500
            );

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

        showToast(
            "В колоде нет карточек",
            "!"
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


    document
        .getElementById(
            "studyDeckIcon"
        )
        .textContent =
            deck.icon ||
            "📚";


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
        ЛИЦЕВАЯ
    */

    document
        .getElementById(
            "frontText"
        )
        .textContent =
            item.front;


    /*
        ОБРАТНАЯ
    */

    document
        .getElementById(
            "backText"
        )
        .textContent =
            item.back;


    /*
        ЭМОДЗИ
    */

    document
        .getElementById(
            "cardEmoji"
        )
        .textContent =
            item.emoji ||
            "💡";


    document
        .getElementById(
            "cardEmojiBack"
        )
        .textContent =
            item.emoji ||
            "💡";


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


    haptic(
        "light"
    );

}


// ==========================================
// ОТВЕТ
// ==========================================

function answer(
    known
) {

    const item =
        studyCards[
            currentCard
        ];


    if (!item) {

        return;

    }


    if (known) {

        /*
            ЗНАЮ
        */

        knownCards.push(
            item.id
        );


        studyCards.splice(
            currentCard,
            1
        );


        haptic(
            "light"
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
            НЕ ЗНАЮ
        */

        studyCards.splice(
            currentCard,
            1
        );


        studyCards.push(
            item
        );


        haptic(
            "light"
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
// СЛЕДУЮЩАЯ
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


    haptic(
        "medium"
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
// ВЫБОР ЭМОДЗИ КОЛОДЫ
// ==========================================

document
    .querySelectorAll(
        ".emoji-choice"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function() {

                    selectedDeckEmoji =
                        this.dataset.emoji;


                    document
                        .querySelectorAll(
                            ".emoji-choice"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "selected"
                                    )
                        );


                    this.classList.add(
                        "selected"
                    );


                    haptic(
                        "light"
                    );

                }
            );

        }
    );


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
        openDeleteConfirmation
    );


document
    .getElementById(
        "cancelDeleteButton"
    )
    .addEventListener(
        "click",
        closeDeleteConfirmation
    );


document
    .getElementById(
        "confirmDeleteButton"
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
