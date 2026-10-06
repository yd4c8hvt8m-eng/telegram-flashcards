// ============================================================
// TELEGRAM
// ============================================================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ============================================================
// SUPABASE
// ============================================================
//
// ВСТАВЬ СЮДА СВОИ ДАННЫЕ ИЗ SUPABASE
//

const SUPABASE_URL = "https://arnsfecpnwyjiuvmsoen.supabase.co";

const SUPABASE_KEY = "sb_publishable_sj2rVuSxhsUtB3xKft2dDw_8-KwPsFM";


// ============================================================
// SUPABASE CLIENT
// ============================================================

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ============================================================
// НАСТРОЙКИ
// ============================================================

const STORAGE_KEY = "flashcards_universal_v5";

const IMAGE_BUCKET = "card-images";


// ============================================================
// СОСТОЯНИЕ
// ============================================================

let decks = [];

let currentDeckId = null;

let currentStudyCards = [];

let currentStudyIndex = 0;

let currentStudyDeck = null;

let selectedDeckIcon = "📚";

let toastTimer = null;


// ============================================================
// ЭЛЕМЕНТЫ
// ============================================================

const homeScreen = document.getElementById("homeScreen");
const createScreen = document.getElementById("createScreen");
const deckScreen = document.getElementById("deckScreen");
const studyScreen = document.getElementById("studyScreen");

const decksList = document.getElementById("decksList");

const createDeckBtn = document.getElementById("createDeckBtn");

const backFromCreate = document.getElementById("backFromCreate");

const backFromDeck = document.getElementById("backFromDeck");

const backFromStudy = document.getElementById("backFromStudy");

const deckNameInput = document.getElementById("deckNameInput");

const deckIconSelector = document.getElementById("deckIconSelector");

const newCardsList = document.getElementById("newCardsList");

const addCardBtn = document.getElementById("addCardBtn");

const saveDeckBtn = document.getElementById("saveDeckBtn");

const deckIcon = document.getElementById("deckIcon");

const deckTitle = document.getElementById("deckTitle");

const deckCount = document.getElementById("deckCount");

const startStudyBtn = document.getElementById("startStudyBtn");

const toggleContentBtn = document.getElementById("toggleContentBtn");

const contentContainer = document.getElementById("contentContainer");

const deleteDeckBtn = document.getElementById("deleteDeckBtn");

const flashcard = document.getElementById("flashcard");

const studyDeckIcon = document.getElementById("studyDeckIcon");

const studyDeckName = document.getElementById("studyDeckName");

const progressText = document.getElementById("progressText");

const progressFill = document.getElementById("progressFill");

const studyFront = document.getElementById("studyFront");

const studyBack = document.getElementById("studyBack");

const studyEmoji = document.getElementById("studyEmoji");

const studyEmojiBack = document.getElementById("studyEmojiBack");

const studyImage = document.getElementById("studyImage");

const studyImageBack = document.getElementById("studyImageBack");

const dontKnowBtn = document.getElementById("dontKnowBtn");

const knowBtn = document.getElementById("knowBtn");

const nextBtn = document.getElementById("nextBtn");

const toast = document.getElementById("toast");

const confirmOverlay = document.getElementById("confirmOverlay");

const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");


// ============================================================
// DEFAULT DECK
// ============================================================

const defaultDeck = {

    id: "actions-20",

    name: "20 главных действий с предметами",

    icon: "⚙️",

    builtIn: true,

    universal: true,

    cards: [

        {
            id: "action-1",
            front: "Открывать",
            back: "Open",
            emoji: "🚪",
            imageUrl: ""
        },

        {
            id: "action-2",
            front: "Закрывать",
            back: "Close",
            emoji: "🚪",
            imageUrl: ""
        },

        {
            id: "action-3",
            front: "Брать",
            back: "Take",
            emoji: "✋",
            imageUrl: ""
        },

        {
            id: "action-4",
            front: "Класть",
            back: "Put",
            emoji: "📦",
            imageUrl: ""
        },

        {
            id: "action-5",
            front: "Давать",
            back: "Give",
            emoji: "🤝",
            imageUrl: ""
        },

        {
            id: "action-6",
            front: "Делать",
            back: "Do",
            emoji: "🔨",
            imageUrl: ""
        },

        {
            id: "action-7",
            front: "Использовать",
            back: "Use",
            emoji: "🛠️",
            imageUrl: ""
        },

        {
            id: "action-8",
            front: "Мыть",
            back: "Wash",
            emoji: "🧼",
            imageUrl: ""
        },

        {
            id: "action-9",
            front: "Резать",
            back: "Cut",
            emoji: "🔪",
            imageUrl: ""
        },

        {
            id: "action-10",
            front: "Наливать",
            back: "Pour",
            emoji: "🥤",
            imageUrl: ""
        },

        {
            id: "action-11",
            front: "Есть",
            back: "Eat",
            emoji: "🍽️",
            imageUrl: ""
        },

        {
            id: "action-12",
            front: "Пить",
            back: "Drink",
            emoji: "🥤",
            imageUrl: ""
        },

        {
            id: "action-13",
            front: "Включать",
            back: "Turn on",
            emoji: "🔌",
            imageUrl: ""
        },

        {
            id: "action-14",
            front: "Выключать",
            back: "Turn off",
            emoji: "🔌",
            imageUrl: ""
        },

        {
            id: "action-15",
            front: "Поднимать",
            back: "Lift",
            emoji: "🏋️",
            imageUrl: ""
        },

        {
            id: "action-16",
            front: "Опускать",
            back: "Lower",
            emoji: "⬇️",
            imageUrl: ""
        },

        {
            id: "action-17",
            front: "Нести",
            back: "Carry",
            emoji: "📦",
            imageUrl: ""
        },

        {
            id: "action-18",
            front: "Двигать",
            back: "Move",
            emoji: "↔️",
            imageUrl: ""
        },

        {
            id: "action-19",
            front: "Ставить",
            back: "Place",
            emoji: "📍",
            imageUrl: ""
        },

        {
            id: "action-20",
            front: "Находить",
            back: "Find",
            emoji: "🔎",
            imageUrl: ""
        }

    ]

};


// ============================================================
// ЗАПУСК
// ============================================================

init();


// ============================================================
// INIT
// ============================================================

function init() {

    loadDecks();

    setupEvents();

    renderHome();

}


// ============================================================
// ЗАГРУЗКА ДАННЫХ
// ============================================================

function loadDecks() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {

            decks = JSON.parse(saved);

        } else {

            decks = [structuredClone(defaultDeck)];

            saveDecks();

        }

    } catch (error) {

        console.error(error);

        decks = [structuredClone(defaultDeck)];

    }

}


// ============================================================
// СОХРАНЕНИЕ ДАННЫХ
// ============================================================

function saveDecks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(decks)
    );

}


// ============================================================
// СОБЫТИЯ
// ============================================================

function setupEvents() {

    createDeckBtn.addEventListener(
        "click",
        openCreateScreen
    );


    backFromCreate.addEventListener(
        "click",
        () => showScreen(homeScreen)
    );


    backFromDeck.addEventListener(
        "click",
        () => showScreen(homeScreen)
    );


    backFromStudy.addEventListener(
        "click",
        () => showScreen(deckScreen)
    );


    addCardBtn.addEventListener(
        "click",
        () => addNewCardBlock()
    );


    saveDeckBtn.addEventListener(
        "click",
        saveNewDeck
    );


    startStudyBtn.addEventListener(
        "click",
        startStudy
    );


    toggleContentBtn.addEventListener(
        "click",
        toggleContent
    );


    deleteDeckBtn.addEventListener(
        "click",
        openDeleteConfirmation
    );


    cancelDeleteBtn.addEventListener(
        "click",
        closeDeleteConfirmation
    );


    confirmDeleteBtn.addEventListener(
        "click",
        deleteCurrentDeck
    );


    flashcard.addEventListener(
        "click",
        flipCard
    );


    dontKnowBtn.addEventListener(
        "click",
        () => answerCard(false)
    );


    knowBtn.addEventListener(
        "click",
        () => answerCard(true)
    );


    nextBtn.addEventListener(
        "click",
        nextCard
    );


    deckIconSelector
        .querySelectorAll(".emoji-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deckIconSelector
                        .querySelectorAll(".emoji-option")
                        .forEach(item =>
                            item.classList.remove("selected")
                        );

                    button.classList.add("selected");

                    selectedDeckIcon =
                        button.dataset.icon;

                }
            );

        });

}


// ============================================================
// ЭКРАНЫ
// ============================================================

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(item =>
            item.classList.remove("active")
        );

    screen.classList.add("active");

    window.scrollTo(0, 0);

}


// ============================================================
// ГЛАВНАЯ
// ============================================================

function renderHome() {

    decksList.innerHTML = "";

    if (decks.length === 0) {

        decksList.innerHTML = `
            <div class="empty-state">
                У тебя пока нет колод.
            </div>
        `;

        return;

    }


    decks.forEach(deck => {

        const item =
            document.createElement("div");

        item.className = "deck-item";

        item.innerHTML = `

            <div class="deck-item-icon">
                ${escapeHtml(deck.icon || "📚")}
            </div>

            <div class="deck-item-info">

                <div class="deck-item-title">
                    ${escapeHtml(deck.name)}
                </div>

                <div class="deck-item-count">
                    ${deck.cards.length}
                    ${getCardWord(deck.cards.length)}
                </div>

            </div>

        `;


        item.addEventListener(
            "click",
            () => openDeck(deck.id)
        );


        decksList.appendChild(item);

    });

}


// ============================================================
// СОЗДАНИЕ КОЛОДЫ
// ============================================================

function openCreateScreen() {

    deckNameInput.value = "";

    selectedDeckIcon = "📚";

    deckIconSelector
        .querySelectorAll(".emoji-option")
        .forEach((button, index) => {

            button.classList.toggle(
                "selected",
                index === 0
            );

        });


    newCardsList.innerHTML = "";

    addNewCardBlock();

    showScreen(createScreen);

}


// ============================================================
// ДОБАВЛЕНИЕ БЛОКА КАРТОЧКИ
// ============================================================

function addNewCardBlock() {

    const cardNumber =
        newCardsList.children.length + 1;


    const block =
        document.createElement("div");

    block.className = "new-card";


    block.innerHTML = `

        <div class="card-header">

            <div class="card-number">
                Карточка ${cardNumber}
            </div>

            <button
                class="remove-card-btn"
                type="button"
            >
                ×
            </button>

        </div>


        <div class="card-field">

            <label>
                Лицевая сторона
            </label>

            <textarea
                class="front-input"
                placeholder="Например: Молоток"
            ></textarea>

        </div>


        <div class="card-field">

            <label>
                Обратная сторона
            </label>

            <textarea
                class="back-input"
                placeholder="Например: Hammer"
            ></textarea>

        </div>


        <div class="card-field">

            <label>
                Значок
            </label>

            <div class="emoji-selector card-emoji-selector">

                <button
                    type="button"
                    class="emoji-option selected"
                    data-emoji="📚"
                >
                    📚
                </button>

                <button
                    type="button"
                    class="emoji-option"
                    data-emoji="🧠"
                >
                    🧠
                </button>

                <button
                    type="button"
                    class="emoji-option"
                    data-emoji="🔧"
                >
                    🔧
                </button>

                <button
                    type="button"
                    class="emoji-option"
                    data-emoji="📦"
                >
                    📦
                </button>

                <button
                    type="button"
                    class="emoji-option"
                    data-emoji="🐟"
                >
                    🐟
                </button>

                <button
                    type="button"
                    class="emoji-option"
                    data-emoji="⭐"
                >
                    ⭐
                </button>

            </div>

        </div>


        <div class="card-field photo-upload">

            <label>
                Изображение
            </label>

            <label class="photo-button">

                📷 Добавить фотографию

                <input
                    type="file"
                    class="photo-input"
                    accept="image/*"
                >

            </label>


            <div class="photo-preview-wrapper">

                <img
                    class="photo-preview"
                    alt="Предпросмотр"
                >

                <button
                    type="button"
                    class="remove-photo-btn"
                >
                    ×
                </button>

            </div>

        </div>

    `;


    // ========================================================
    // УДАЛЕНИЕ КАРТОЧКИ
    // ========================================================

    const removeButton =
        block.querySelector(".remove-card-btn");


    removeButton.addEventListener(
        "click",
        () => {

            if (newCardsList.children.length <= 1) {

                showToast(
                    "В колоде должна остаться хотя бы одна карточка."
                );

                return;

            }


            block.classList.add("removing");


            setTimeout(() => {

                block.remove();

                updateCardNumbers();

            }, 200);

        }
    );


    // ========================================================
    // ЭМОДЗИ
    // ========================================================

    block
        .querySelectorAll(".card-emoji-selector .emoji-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    block
                        .querySelectorAll(".card-emoji-selector .emoji-option")
                        .forEach(item =>
                            item.classList.remove("selected")
                        );

                    button.classList.add("selected");

                }
            );

        });


    // ========================================================
    // ФОТО
    // ========================================================

    const photoInput =
        block.querySelector(".photo-input");

    const previewWrapper =
        block.querySelector(".photo-preview-wrapper");

    const preview =
        block.querySelector(".photo-preview");

    const removePhoto =
        block.querySelector(".remove-photo-btn");


    photoInput.addEventListener(
        "change",
        async () => {

            const file = photoInput.files[0];

            if (!file) {
                return;
            }


            if (!file.type.startsWith("image/")) {

                showToast(
                    "Можно загружать только изображения."
                );

                photoInput.value = "";

                return;

            }


            const maxSize =
                5 * 1024 * 1024;


            if (file.size > maxSize) {

                showToast(
                    "Максимальный размер фотографии — 5 МБ."
                );

                photoInput.value = "";

                return;

            }


            const localUrl =
                URL.createObjectURL(file);


            preview.src = localUrl;

            previewWrapper.classList.add("visible");


            // Загружаем фотографию сразу

            showToast(
                "Загружаем фотографию..."
            );


            const uploadedUrl =
                await uploadImage(file);


            if (uploadedUrl) {

                block.dataset.imageUrl =
                    uploadedUrl;

                showToast(
                    "Фотография загружена"
                );

            } else {

                previewWrapper.classList.remove(
                    "visible"
                );

                photoInput.value = "";

            }

        }
    );


    removePhoto.addEventListener(
        "click",
        () => {

            photoInput.value = "";

            block.dataset.imageUrl = "";

            preview.src = "";

            previewWrapper.classList.remove(
                "visible"
            );

            showToast(
                "Фотография удалена из карточки"
            );

        }
    );


    newCardsList.appendChild(block);

    updateCardNumbers();

}


// ============================================================
// НУМЕРАЦИЯ КАРТОЧЕК
// ============================================================

function updateCardNumbers() {

    [...newCardsList.children]
        .forEach((card, index) => {

            const number =
                card.querySelector(".card-number");

            number.textContent =
                `Карточка ${index + 1}`;

        });

}


// ============================================================
// СОХРАНЕНИЕ НОВОЙ КОЛОДЫ
// ============================================================

function saveNewDeck() {

    const name =
        deckNameInput.value.trim();


    if (!name) {

        showToast(
            "Введите название колоды."
        );

        return;

    }


    const cardBlocks =
        [...newCardsList.children];


    const cards = [];


    for (let i = 0; i < cardBlocks.length; i++) {

        const block =
            cardBlocks[i];


        const front =
            block
                .querySelector(".front-input")
                .value
                .trim();


        const back =
            block
                .querySelector(".back-input")
                .value
                .trim();


        if (!front && !back) {

            showToast(
                `Заполните карточку ${i + 1}.`
            );

            return;

        }


        const selectedEmoji =
            block.querySelector(
                ".card-emoji-selector .selected"
            );


        const emoji =
            selectedEmoji
                ? selectedEmoji.dataset.emoji
                : "📚";


        cards.push({

            id:
                "card-" +
                Date.now() +
                "-" +
                i,

            front,

            back,

            emoji,

            imageUrl:
                block.dataset.imageUrl || ""

        });

    }


    const newDeck = {

        id:
            "deck-" +
            Date.now(),

        name,

        icon:
            selectedDeckIcon,

        builtIn: false,

        universal: true,

        cards

    };


    decks.push(newDeck);

    saveDecks();


    showToast(
        "Колода создана"
    );


    setTimeout(() => {

        openDeck(newDeck.id);

    }, 500);

}


// ============================================================
// ОТКРЫТИЕ КОЛОДЫ
// ============================================================

function openDeck(deckId) {

    const deck =
        decks.find(
            item => item.id === deckId
        );


    if (!deck) {
        return;
    }


    currentDeckId = deckId;


    deckIcon.textContent =
        deck.icon || "📚";


    deckTitle.textContent =
        deck.name;


    deckCount.textContent =
        `${deck.cards.length} ${getCardWord(deck.cards.length)}`;


    contentContainer.classList.add(
        "hidden"
    );


    toggleContentBtn.textContent =
        "☰ Содержание колоды";


    renderDeckContent(deck);


    showScreen(deckScreen);

}


// ============================================================
// СОДЕРЖАНИЕ КОЛОДЫ
// ============================================================

function renderDeckContent(deck) {

    contentContainer.innerHTML = "";


    deck.cards.forEach(
        (card, index) => {

            const item =
                document.createElement("div");

            item.className =
                "content-card";


            item.innerHTML = `

                <div class="content-card-top">

                    <div class="content-card-emoji">
                        ${escapeHtml(card.emoji || "📚")}
                    </div>

                    <div class="content-card-number">
                        Карточка ${index + 1}
                    </div>

                </div>

                <div class="content-front">
                    ${escapeHtml(card.front || "")}
                </div>

                <div class="content-back">
                    ${escapeHtml(card.back || "")}
                </div>

            `;


            contentContainer.appendChild(item);

        }
    );

}


// ============================================================
// ПЕРЕКЛЮЧЕНИЕ СОДЕРЖАНИЯ
// ============================================================

function toggleContent() {

    const hidden =
        contentContainer.classList.contains(
            "hidden"
        );


    if (hidden) {

        contentContainer.classList.remove(
            "hidden"
        );

        toggleContentBtn.textContent =
            "↑ Скрыть содержание";

    } else {

        contentContainer.classList.add(
            "hidden"
        );

        toggleContentBtn.textContent =
            "☰ Содержание колоды";

    }

}


// ============================================================
// УДАЛЕНИЕ КОЛОДЫ
// ============================================================

function openDeleteConfirmation() {

    const deck =
        getCurrentDeck();


    if (!deck) {
        return;
    }


    if (deck.builtIn) {

        showToast(
            "Стандартную колоду удалить нельзя."
        );

        return;

    }


    confirmOverlay.classList.remove(
        "hidden"
    );

}


function closeDeleteConfirmation() {

    confirmOverlay.classList.add(
        "hidden"
    );

}


function deleteCurrentDeck() {

    const deck =
        getCurrentDeck();


    if (!deck) {
        return;
    }


    if (deck.builtIn) {

        closeDeleteConfirmation();

        return;

    }


    decks =
        decks.filter(
            item => item.id !== deck.id
        );


    saveDecks();


    closeDeleteConfirmation();


    showToast(
        "Колода удалена"
    );


    setTimeout(() => {

        renderHome();

        showScreen(homeScreen);

    }, 400);

}


// ============================================================
// ОБУЧЕНИЕ
// ============================================================

function startStudy() {

    const deck =
        getCurrentDeck();


    if (!deck) {
        return;
    }


    if (!deck.cards.length) {

        showToast(
            "В этой колоде нет карточек."
        );

        return;

    }


    currentStudyDeck =
        deck;


    currentStudyCards =
        [...deck.cards];


    currentStudyIndex = 0;


    studyDeckIcon.textContent =
        deck.icon || "📚";


    studyDeckName.textContent =
        deck.name;


    flashcard.classList.remove(
        "flipped"
    );


    showScreen(studyScreen);


    renderStudyCard();

}


// ============================================================
// ОТОБРАЖЕНИЕ КАРТОЧКИ
// ============================================================

function renderStudyCard() {

    const card =
        currentStudyCards[
            currentStudyIndex
        ];


    if (!card) {
        return;
    }


    flashcard.classList.remove(
        "flipped"
    );


    studyFront.textContent =
        card.front || "";


    studyBack.textContent =
        card.back || "";


    studyEmoji.textContent =
        card.emoji || "📚";


    studyEmojiBack.textContent =
        card.emoji || "📚";


    setStudyImage(
        studyImage,
        card.imageUrl
    );


    setStudyImage(
        studyImageBack,
        card.imageUrl
    );


    const current =
        currentStudyIndex + 1;


    const total =
        currentStudyCards.length;


    progressText.textContent =
        `${current} / ${total}`;


    progressFill.style.width =
        `${(current / total) * 100}%`;


    nextBtn.textContent =
        current === total
            ? "Завершить"
            : "Следующая";

}


// ============================================================
// ИЗОБРАЖЕНИЕ В ОБУЧЕНИИ
// ============================================================

function setStudyImage(
    element,
    imageUrl
) {

    if (imageUrl) {

        element.src =
            imageUrl;

        element.classList.add(
            "visible"
        );

    } else {

        element.src = "";

        element.classList.remove(
            "visible"
        );

    }

}


// ============================================================
// FLIP
// ============================================================

function flipCard() {

    flashcard.classList.toggle(
        "flipped"
    );

    haptic();

}


// ============================================================
// ОТВЕТ
// ============================================================

function answerCard(known) {

    if (known) {

        showToast(
            "Знаю"
        );

    } else {

        showToast(
            "Повторим ещё раз"
        );

    }


    haptic();

    setTimeout(
        nextCard,
        250
    );

}


// ============================================================
// СЛЕДУЮЩАЯ
// ============================================================

function nextCard() {

    if (
        currentStudyIndex >=
        currentStudyCards.length - 1
    ) {

        showToast(
            "Колода закончена"
        );


        setTimeout(() => {

            showScreen(deckScreen);

        }, 500);


        return;

    }


    currentStudyIndex++;


    renderStudyCard();

}


// ============================================================
// ЗАГРУЗКА ФОТО В SUPABASE
// ============================================================

async function uploadImage(file) {

    try {

        const extension =
            getFileExtension(file.name);


        const fileName =
            "card_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 10) +
            "." +
            extension;


        const filePath =
            fileName;


        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from(IMAGE_BUCKET)
                .upload(
                    filePath,
                    file,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: file.type
                    }
                );


        if (error) {

            console.error(
                "Supabase upload error:",
                error
            );


            showToast(
                "Ошибка загрузки: " +
                error.message
            );


            return null;

        }


        console.log(
            "Uploaded:",
            data
        );


        const {
            data: publicData
        } =
            supabaseClient
                .storage
                .from(IMAGE_BUCKET)
                .getPublicUrl(
                    filePath
                );


        return publicData.publicUrl;


    } catch (error) {

        console.error(error);


        showToast(
            "Ошибка загрузки фотографии."
        );


        return null;

    }

}


// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

function getCurrentDeck() {

    return decks.find(
        deck =>
            deck.id === currentDeckId
    );

}


function getFileExtension(
    fileName
) {

    const parts =
        fileName.split(".");


    return (
        parts.length > 1
            ? parts.pop()
            : "jpg"
    ).toLowerCase();

}


function getCardWord(number) {

    if (
        number % 10 === 1 &&
        number % 100 !== 11
    ) {
        return "карточка";
    }


    if (
        number % 10 >= 2 &&
        number % 10 <= 4 &&
        (
            number % 100 < 10 ||
            number % 100 >= 20
        )
    ) {
        return "карточки";
    }


    return "карточек";

}


function showToast(message) {

    clearTimeout(toastTimer);


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

}


function haptic() {

    try {

        if (
            tg.HapticFeedback &&
            tg.HapticFeedback.impactOccurred
        ) {

            tg.HapticFeedback.impactOccurred(
                "light"
            );

        }

    } catch (error) {

        // Ничего не делаем

    }

}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
