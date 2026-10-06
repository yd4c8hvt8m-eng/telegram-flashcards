/* =========================================================
   FLASH CARDS
   VERSION 1.2.1
========================================================= */

const APP_VERSION = "3.0.2";


/* =========================================================
   TELEGRAM
========================================================= */

const tg =
  window.Telegram?.WebApp || null;

if (tg) {
  try {
    tg.ready();
    tg.expand();
  } catch (error) {
    console.warn(
      "Telegram WebApp недоступен:",
      error
    );
  }
}


/* =========================================================
   SUPABASE
========================================================= */

/*
  ВАЖНО:

  Сюда вставь свои СТАРЫЕ рабочие значения
  из предыдущего app.js.

  НЕ вставляй Secret / service_role key.
*/

const SUPABASE_URL =
  "https://arnsfecpnwyjiuvmsoen.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_sj2rVuSxhsUtB3xKft2dDw_8-KwPsFM";


const IMAGE_BUCKET =
  "card-images";


/*
  Создаём Supabase только если библиотека
  действительно загрузилась и ключи указаны.
*/

let supabaseClient = null;

function initSupabase() {

  try {

    if (
      !window.supabase ||
      typeof window.supabase.createClient !==
        "function"
    ) {

      console.warn(
        "Supabase JS не загрузился."
      );

      return null;

    }


    if (
      !SUPABASE_URL ||
      !SUPABASE_KEY ||
      SUPABASE_URL.includes(
        "ВСТАВЬ_СЮДА"
      ) ||
      SUPABASE_KEY.includes(
        "ВСТАВЬ_СЮДА"
      )
    ) {

      console.warn(
        "Supabase ключи не указаны."
      );

      return null;

    }


    return window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

  } catch (error) {

    console.error(
      "Ошибка подключения Supabase:",
      error
    );

    return null;

  }

}


supabaseClient =
  initSupabase();


/* =========================================================
   LOCAL STORAGE
========================================================= */

const STORAGE_KEY =
  "flashcards_universal_v5";


/* =========================================================
   STATE
========================================================= */

let decks = [];

let currentDeckId = null;

let currentStudyCards = [];

let currentStudyIndex = 0;

let currentStudyDeck = null;

let selectedDeckIcon = "📚";

let editingDeckId = null;

let toastTimer = null;


/* =========================================================
   DOM
========================================================= */

const homeScreen =
  document.getElementById(
    "homeScreen"
  );

const createScreen =
  document.getElementById(
    "createScreen"
  );

const deckScreen =
  document.getElementById(
    "deckScreen"
  );

const studyScreen =
  document.getElementById(
    "studyScreen"
  );


/* =========================================================
   APP INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initApp();

  }
);


function initApp() {

  try {

    setVersion();

    loadDecks();

    setupEvents();

    renderHome();

  } catch (error) {

    console.error(
      "Ошибка запуска приложения:",
      error
    );

    /*
      Даже если что-то неожиданное
      произошло при запуске, пытаемся
      показать главный экран.
    */

    try {

      showScreen(
        "homeScreen"
      );

    } catch (screenError) {

      console.error(
        screenError
      );

    }

  }

}


/* =========================================================
   VERSION
========================================================= */

function setVersion() {

  document
    .querySelectorAll(
      ".version-value"
    )
    .forEach(
      element => {

        element.textContent =
          APP_VERSION;

      }
    );

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  const createDeckButton =
    document.getElementById(
      "createDeckButton"
    );

  if (createDeckButton) {

    createDeckButton.addEventListener(
      "click",
      openCreateScreen
    );

  }


  const backFromCreate =
    document.getElementById(
      "backFromCreate"
    );

  if (backFromCreate) {

    backFromCreate.addEventListener(
      "click",
      () => showScreen(
        "homeScreen"
      )
    );

  }


  const backFromDeck =
    document.getElementById(
      "backFromDeck"
    );

  if (backFromDeck) {

    backFromDeck.addEventListener(
      "click",
      () => showScreen(
        "homeScreen"
      )
    );

  }


  const backFromStudy =
    document.getElementById(
      "backFromStudy"
    );

  if (backFromStudy) {

    backFromStudy.addEventListener(
      "click",
      () => showScreen(
        "deckScreen"
      )
    );

  }


  const addCardButton =
    document.getElementById(
      "addCardButton"
    );

  if (addCardButton) {

    addCardButton.addEventListener(
      "click",
      () => addNewCardBlock()
    );

  }


  const saveDeckButton =
    document.getElementById(
      "saveDeckButton"
    );

  if (saveDeckButton) {

    saveDeckButton.addEventListener(
      "click",
      saveDeckFromEditor
    );

  }


  const studyDeckButton =
    document.getElementById(
      "studyDeckButton"
    );

  if (studyDeckButton) {

    studyDeckButton.addEventListener(
      "click",
      startStudy
    );

  }


  const contentDeckButton =
    document.getElementById(
      "contentDeckButton"
    );

  if (contentDeckButton) {

    contentDeckButton.addEventListener(
      "click",
      toggleDeckContent
    );

  }


  const editDeckButton =
    document.getElementById(
      "editDeckButton"
    );

  if (editDeckButton) {

    editDeckButton.addEventListener(
      "click",
      editCurrentDeck
    );

  }


  const deleteDeckButton =
    document.getElementById(
      "deleteDeckButton"
    );

  if (deleteDeckButton) {

    deleteDeckButton.addEventListener(
      "click",
      deleteCurrentDeck
    );

  }


  const cancelDeleteButton =
    document.getElementById(
      "cancelDeleteButton"
    );

  if (cancelDeleteButton) {

    cancelDeleteButton.addEventListener(
      "click",
      closeDeleteModal
    );

  }


  const confirmDeleteButton =
    document.getElementById(
      "confirmDeleteButton"
    );

  if (confirmDeleteButton) {

    confirmDeleteButton.addEventListener(
      "click",
      confirmDeleteDeck
    );

  }


  const flashcard =
    document.getElementById(
      "flashcard"
    );

  if (flashcard) {

    flashcard.addEventListener(
      "click",
      flipCard
    );

  }


  const dontKnowButton =
    document.getElementById(
      "dontKnowButton"
    );

  if (dontKnowButton) {

    dontKnowButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        answerCard(false);

      }
    );

  }


  const knowButton =
    document.getElementById(
      "knowButton"
    );

  if (knowButton) {

    knowButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        answerCard(true);

      }
    );

  }


  const nextButton =
    document.getElementById(
      "nextButton"
    );

  if (nextButton) {

    nextButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        nextCard();

      }
    );

  }


  document
    .querySelectorAll(
      ".deck-icon-option"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            selectedDeckIcon =
              button.dataset.icon;

            document
              .querySelectorAll(
                ".deck-icon-option"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "selected"
                  )
              );

            button.classList.add(
              "selected"
            );

          }
        );

      }
    );

}


/* =========================================================
   SCREEN NAVIGATION
========================================================= */

function showScreen(
  screenId
) {

  document
    .querySelectorAll(
      ".screen"
    )
    .forEach(
      screen =>
        screen.classList.remove(
          "active"
        )
    );


  const screen =
    document.getElementById(
      screenId
    );


  if (!screen) return;


  screen.classList.add(
    "active"
  );


  window.scrollTo({
    top: 0,
    behavior: "instant"
  });

}


/* =========================================================
   LOAD DECKS
========================================================= */

function loadDecks() {

  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (saved) {

    try {

      const parsed =
        JSON.parse(saved);


      if (
        Array.isArray(parsed)
      ) {

        decks =
          parsed;

      } else {

        decks = [];

      }

    } catch (error) {

      console.error(
        "Ошибка чтения localStorage:",
        error
      );

      decks = [];

    }

  } else {

    decks = [];

  }


  /*
    Всегда проверяем наличие
    стандартной демо-колоды.
  */

  ensureDemoDeck();

  saveDecks();

}


/* =========================================================
   SAVE DECKS
========================================================= */

function saveDecks() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(decks)
    );

  } catch (error) {

    console.error(
      "Ошибка сохранения колод:",
      error
    );

    showToast(
      "Не удалось сохранить данные"
    );

  }

}


/* =========================================================
   DEMO DECK
========================================================= */

function ensureDemoDeck() {

  const demoId =
    "memory-demo-deck";


  const demoDeck = {

    id:
      demoId,

    name:
      "Проверь свою память",

    icon:
      "🧠",

    builtIn:
      true,

    universal:
      true,

    cards: [

      {
        id:
          "memory-demo-1",

        front:
          "Что помогает лучше запоминать информацию?",

        back:
          "Повторение через интервалы времени.",

        imageUrl:
          ""
      },


      {
        id:
          "memory-demo-2",

        front:
          "Что такое ассоциация?",

        back:
          "Связь новой информации с уже знакомой.",

        imageUrl:
          ""
      },


      {
        id:
          "memory-demo-3",

        front:
          "Какой сон важен для закрепления воспоминаний?",

        back:
          "Полноценный ночной сон.",

        imageUrl:
          ""
      },


      {
        id:
          "memory-demo-4",

        front:
          "Что часто запоминается лучше: текст или образ?",

        back:
          "Образ, особенно вместе с текстом.",

        imageUrl:
          ""
      },


      {
        id:
          "memory-demo-5",

        front:
          "Зачем большой материал делить на части?",

        back:
          "Так его легче удерживать и вспоминать.",

        imageUrl:
          ""
      },


      {
        id:
          "memory-demo-6",

        front:
          "Что такое активное вспоминание?",

        back:
          "Попытка вспомнить ответ без подсказки.",

        imageUrl:
          ""
      },


      {
        id:
          "memory-demo-7",

        front:
          "Что мешает хорошему запоминанию?",

        back:
          "Постоянное переключение внимания.",

        imageUrl:
          ""
      },


      {
        id:
          "memory-demo-8",

        front:
          "Зачем использовать яркие ассоциации?",

        back:
          "Они создают дополнительные связи в памяти.",

        imageUrl:
          ""
      },


      {
        id:
          "memory-demo-9",

        front:
          "Что полезнее: учить один раз или повторять?",

        back:
          "Короткие повторения через интервалы.",

          imageUrl:
          ""
      },


      {
        id:
          "memory-demo-10",

        front:
          "Главный принцип хорошего запоминания?",

        back:
          "Вспомнить самому, повторить и связать с известным.",

        imageUrl:
          ""
      }

    ]

  };


  const existingIndex =
    decks.findIndex(
      deck =>
        deck.id === demoId
    );


  /*
    Если демо-колоды нет —
    создаём её.
  */

  if (
    existingIndex === -1
  ) {

    decks.unshift(
      demoDeck
    );

    return;

  }


  /*
    Если старая демо-колода есть —
    обновляем её.

    Это нужно, чтобы после новой
    версии у тебя гарантированно
    была правильная демонстрационная
    колода.
  */

  decks[existingIndex] =
    demoDeck;

}


/* =========================================================
   HOME
========================================================= */

function renderHome() {

  const deckList =
    document.getElementById(
      "deckList"
    );


  if (!deckList) return;


  deckList.innerHTML = "";


  decks.forEach(
    deck => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "deck-item";


      item.addEventListener(
        "click",
        () =>
          openDeck(
            deck.id
          )
      );


      const icon =
        document.createElement(
          "div"
        );

      icon.className =
        "deck-item-icon";

      icon.textContent =
        deck.icon ||
        "📚";


      const info =
        document.createElement(
          "div"
        );

      info.className =
        "deck-item-info";


      const name =
        document.createElement(
          "div"
        );

      name.className =
        "deck-item-name";

      name.textContent =
        deck.name;


      const count =
        document.createElement(
          "div"
        );

      count.className =
        "deck-item-count";

      count.textContent =
        getCardCountText(
          Array.isArray(deck.cards)
            ? deck.cards.length
            : 0
        );


      info.appendChild(
        name
      );

      info.appendChild(
        count
      );


      const arrow =
        document.createElement(
          "div"
        );

      arrow.className =
        "deck-item-arrow";

      arrow.textContent =
        "›";


      item.appendChild(
        icon
      );

      item.appendChild(
        info
      );

      item.appendChild(
        arrow
      );


      deckList.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   CARD COUNT
========================================================= */

function getCardCountText(
  count
) {

  if (
    count % 10 === 1 &&
    count % 100 !== 11
  ) {

    return `${count} карточка`;

  }


  if (
    count >= 2 &&
    count <= 4
  ) {

    return `${count} карточки`;

  }


  return `${count} карточек`;

}


/* =========================================================
   CREATE SCREEN
========================================================= */

function openCreateScreen() {

  editingDeckId =
    null;

  selectedDeckIcon =
    "📚";


  document
    .getElementById(
      "createTitle"
    )
    .textContent =
      "Новая колода";


  document
    .getElementById(
      "deckNameInput"
    )
    .value =
      "";


  document
    .querySelectorAll(
      ".deck-icon-option"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "selected",
          button.dataset.icon ===
            selectedDeckIcon
        );

      }
    );


  document
    .getElementById(
      "newCardsList"
    )
    .innerHTML =
      "";


  addNewCardBlock();


  showScreen(
    "createScreen"
  );

}


/* =========================================================
   EDIT CURRENT DECK
========================================================= */

function editCurrentDeck() {

  const deck =
    decks.find(
      item =>
        item.id ===
        currentDeckId
    );


  if (!deck) return;


  if (deck.builtIn) {

    showToast(
      "Эта колода предназначена для знакомства с приложением"
    );

    return;

  }


  editingDeckId =
    deck.id;


  selectedDeckIcon =
    deck.icon ||
    "📚";


  document
    .getElementById(
      "createTitle"
    )
    .textContent =
      "Редактировать колоду";


  document
    .getElementById(
      "deckNameInput"
    )
    .value =
      deck.name;


  document
    .querySelectorAll(
      ".deck-icon-option"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "selected",
          button.dataset.icon ===
            selectedDeckIcon
        );

      }
    );


  const cardsList =
    document.getElementById(
      "newCardsList"
    );


  cardsList.innerHTML =
    "";


  deck.cards.forEach(
    card =>
      addNewCardBlock(
        card
      )
  );


  showScreen(
    "createScreen"
  );

}


/* =========================================================
   EDIT CARD
========================================================= */

function editCard(
  cardId
) {

  const deck =
    decks.find(
      item =>
        item.id ===
        currentDeckId
    );


  if (!deck) return;


  if (deck.builtIn) {

    showToast(
      "Демо-колоду нельзя редактировать"
    );

    return;

  }


  editCurrentDeck();


  setTimeout(
    () => {

      const card =
        document.querySelector(
          `[data-card-id="${cardId}"]`
        );


      if (card) {

        card.scrollIntoView({
          behavior:
            "smooth",

          block:
            "center"
        });

      }

    },
    100
  );

}


/* =========================================================
   ADD CARD BLOCK
========================================================= */

function addNewCardBlock(
  existingCard = null
) {

  const cardsList =
    document.getElementById(
      "newCardsList"
    );


  const block =
    document.createElement(
      "div"
    );

  block.className =
    "new-card";


  if (existingCard) {

    block.dataset.cardId =
      existingCard.id;

    block.dataset.imageUrl =
      existingCard.imageUrl ||
      "";

  }


  const cardNumber =
    document.createElement(
      "div"
    );

  cardNumber.className =
    "card-number";

  cardNumber.textContent =
    `КАРТОЧКА ${
      cardsList.children.length + 1
    }`;


  const removeButton =
    document.createElement(
      "button"
    );

  removeButton.className =
    "remove-card-button";

  removeButton.type =
    "button";

  removeButton.textContent =
    "×";


  removeButton.addEventListener(
    "click",
    () => {

      block.classList.add(
        "removing"
      );


      setTimeout(
        () => {

          block.remove();

          updateCardNumbers();

        },
        200
      );

    }
  );


  const frontLabel =
    document.createElement(
      "div"
    );

  frontLabel.className =
    "card-editor-label";

  frontLabel.textContent =
    "ЛИЦЕВАЯ СТОРОНА";


  const frontInput =
    document.createElement(
      "textarea"
    );

  frontInput.className =
    "card-textarea front-input";

  frontInput.placeholder =
    "Например: Что такое столица Франции?";

  frontInput.value =
    existingCard?.front ||
    "";


  const backLabel =
    document.createElement(
      "div"
    );

  backLabel.className =
    "card-editor-label";

  backLabel.textContent =
    "ОБРАТНАЯ СТОРОНА";


  const backInput =
    document.createElement(
      "textarea"
    );

  backInput.className =
    "card-textarea back-input";

  backInput.placeholder =
    "Например: Париж";

  backInput.value =
    existingCard?.back ||
    "";


  const photoSection =
    document.createElement(
      "div"
    );

  photoSection.className =
    "photo-section";


  const photoLabel =
    document.createElement(
      "div"
    );

  photoLabel.className =
    "card-editor-label";

  photoLabel.textContent =
    "ФОТО";


  const uploadLabel =
    document.createElement(
      "label"
    );

  uploadLabel.className =
    "photo-upload-label";

  uploadLabel.textContent =
    "📷 Добавить фотографию";


  const fileInput =
    document.createElement(
      "input"
    );

  fileInput.type =
    "file";

  fileInput.accept =
    "image/*";

  fileInput.className =
    "photo-upload-input";


  uploadLabel.appendChild(
    fileInput
  );


  const previewContainer =
    document.createElement(
      "div"
    );

  previewContainer.className =
    "photo-preview-wrapper";

  previewContainer.style.display =
    existingCard?.imageUrl
      ? "block"
      : "none";


  const preview =
    document.createElement(
      "img"
    );

  preview.className =
    "photo-preview";

  preview.alt =
    "Фото карточки";


  if (
    existingCard?.imageUrl
  ) {

    preview.src =
      existingCard.imageUrl;

  }


  const removePhoto =
    document.createElement(
      "button"
    );

  removePhoto.type =
    "button";

  removePhoto.className =
    "remove-photo-button";

  removePhoto.textContent =
    "×";


  removePhoto.addEventListener(
    "click",
    () => {

      block.dataset.imageUrl =
        "";

      preview.src =
        "";

      previewContainer.style.display =
        "none";

    }
  );


  previewContainer.appendChild(
    preview
  );

  previewContainer.appendChild(
    removePhoto
  );


  fileInput.addEventListener(
    "change",
    async event => {

      const file =
        event.target.files[0];


      if (!file) return;


      /*
        Если Supabase не подключён,
        приложение НЕ падает.
      */

      if (!supabaseClient) {

        showToast(
          "Supabase не подключён. Проверь ключи."
        );

        fileInput.value =
          "";

        return;

      }


      try {

        showToast(
          "Загружаю фотографию..."
        );


        const imageUrl =
          await uploadImage(
            file
          );


        block.dataset.imageUrl =
          imageUrl;


        preview.src =
          imageUrl;


        previewContainer.style.display =
          "block";


        showToast(
          "Фотография добавлена"
        );


      } catch (error) {

        console.error(
          "Ошибка загрузки фотографии:",
          error
        );


        showToast(
          "Не удалось загрузить фотографию"
        );

      }

    }
  );


  photoSection.appendChild(
    photoLabel
  );

  photoSection.appendChild(
    uploadLabel
  );

  photoSection.appendChild(
    previewContainer
  );


  block.appendChild(
    cardNumber
  );

  block.appendChild(
    removeButton
  );

  block.appendChild(
    frontLabel
  );

  block.appendChild(
    frontInput
  );

  block.appendChild(
    backLabel
  );

  block.appendChild(
    backInput
  );

  block.appendChild(
    photoSection
  );


  cardsList.appendChild(
    block
  );

}


/* =========================================================
   CARD NUMBERS
========================================================= */

function updateCardNumbers() {

  document
    .querySelectorAll(
      "#newCardsList .new-card"
    )
    .forEach(
      (card, index) => {

        const number =
          card.querySelector(
            ".card-number"
          );


        if (number) {

          number.textContent =
            `КАРТОЧКА ${
              index + 1
            }`;

        }

      }
    );

}


/* =========================================================
   SAVE DECK
========================================================= */

function saveDeckFromEditor() {

  const name =
    document
      .getElementById(
        "deckNameInput"
      )
      .value
      .trim();


  if (!name) {

    showToast(
      "Введите название колоды"
    );

    return;

  }


  const blocks =
    Array.from(
      document.querySelectorAll(
        "#newCardsList .new-card"
      )
    );


  if (!blocks.length) {

    showToast(
      "Добавьте хотя бы одну карточку"
    );

    return;

  }


  const cards = [];


  for (
    let i = 0;
    i < blocks.length;
    i++
  ) {

    const block =
      blocks[i];


    const front =
      block
        .querySelector(
          ".front-input"
        )
        .value
        .trim();


    const back =
      block
        .querySelector(
          ".back-input"
        )
        .value
        .trim();


    if (!front || !back) {

      showToast(
        `Заполните карточку ${
          i + 1
        }`
      );

      return;

    }


    cards.push({

      id:
        block.dataset.cardId ||
        generateId(),

      front,

      back,

      imageUrl:
        block.dataset.imageUrl ||
        ""

    });

  }


  /*
    РЕДАКТИРОВАНИЕ
  */

  if (editingDeckId) {

    const deck =
      decks.find(
        item =>
          item.id ===
          editingDeckId
      );


    if (!deck) return;


    if (deck.builtIn) {

      showToast(
        "Эту колоду нельзя редактировать"
      );

      return;

    }


    deck.name =
      name;

    deck.icon =
      selectedDeckIcon;

    deck.cards =
      cards;


    currentDeckId =
      deck.id;


    saveDecks();

    renderHome();

    openDeck(
      deck.id
    );


    showToast(
      "Колода обновлена"
    );


    return;

  }


  /*
    НОВАЯ КОЛОДА
  */

  const newDeck = {

    id:
      generateId(),

    name:
      name,

    icon:
      selectedDeckIcon,

    builtIn:
      false,

    universal:
      true,

    cards:
      cards

  };


  decks.push(
    newDeck
  );


  currentDeckId =
    newDeck.id;


  saveDecks();

  renderHome();

  openDeck(
    newDeck.id
  );


  showToast(
    "Колода создана"
  );

}


/* =========================================================
   OPEN DECK
========================================================= */

function openDeck(
  deckId
) {

  const deck =
    decks.find(
      item =>
        item.id ===
        deckId
    );


  if (!deck) return;


  currentDeckId =
    deckId;


  document
    .getElementById(
      "deckHeadingIcon"
    )
    .textContent =
      deck.icon ||
      "📚";


  document
    .getElementById(
      "deckHeadingTitle"
    )
    .textContent =
      deck.name;


  document
    .getElementById(
      "deckHeadingCount"
    )
    .textContent =
      getCardCountText(
        deck.cards.length
      );


  const editButton =
    document.getElementById(
      "editDeckButton"
    );


  const deleteButton =
    document.getElementById(
      "deleteDeckButton"
    );


  if (deck.builtIn) {

    editButton.style.display =
      "none";

    deleteButton.style.display =
      "none";

  } else {

    editButton.style.display =
      "block";

    deleteButton.style.display =
      "block";

  }


  document
    .getElementById(
      "deckContent"
    )
    .classList.remove(
      "visible"
    );


  renderDeckContent(
    deck
  );


  showScreen(
    "deckScreen"
  );

}


/* =========================================================
   DECK CONTENT
========================================================= */

function toggleDeckContent() {

  const content =
    document.getElementById(
      "deckContent"
    );


  content.classList.toggle(
    "visible"
  );

}


function renderDeckContent(
  deck
) {

  const container =
    document.getElementById(
      "deckContent"
    );


  container.innerHTML =
    "";


  deck.cards.forEach(
    (card, index) => {

      const cardElement =
        document.createElement(
          "div"
        );

      cardElement.className =
        "content-card";


      const number =
        document.createElement(
          "div"
        );

      number.className =
        "content-card-number";

      number.textContent =
        `КАРТОЧКА ${
          index + 1
        }`;


      cardElement.appendChild(
        number
      );


      if (card.imageUrl) {

        const image =
          document.createElement(
            "img"
          );

        image.className =
          "content-card-image";

        image.src =
          card.imageUrl;

        image.alt =
          "Фото карточки";


        image.onerror =
          () => {

            image.style.display =
              "none";

          };


        cardElement.appendChild(
          image
        );

      } else {

        const placeholder =
          document.createElement(
            "div"
          );

        placeholder.className =
          "content-card-image-placeholder";

        placeholder.textContent =
          "📷";


        cardElement.appendChild(
          placeholder
        );

      }


      const front =
        document.createElement(
          "div"
        );

      front.className =
        "content-card-front";

      front.innerHTML =
        `
        <span class="content-label">
          ЛИЦЕВАЯ СТОРОНА
        </span>
        `;


      const frontText =
        document.createElement(
          "div"
        );

      frontText.textContent =
        card.front;


      front.appendChild(
        frontText
      );


      const back =
        document.createElement(
          "div"
        );

      back.className =
        "content-card-back";

      back.innerHTML =
        `
        <span class="content-label">
          ОБРАТНАЯ СТОРОНА
        </span>
        `;


      const backText =
        document.createElement(
          "div"
        );

      backText.textContent =
        card.back;


      back.appendChild(
        backText
      );


      cardElement.appendChild(
        front
      );

      cardElement.appendChild(
        back
      );


      if (!deck.builtIn) {

        const editButton =
          document.createElement(
            "button"
          );

        editButton.className =
          "content-edit-button";

        editButton.textContent =
          "✏️ Редактировать";


        editButton.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            editCard(
              card.id
            );

          }
        );


        cardElement.appendChild(
          editButton
        );

      }


      container.appendChild(
        cardElement
      );

    }
  );

}


/* =========================================================
   DELETE DECK
========================================================= */

function deleteCurrentDeck() {

  const deck =
    decks.find(
      item =>
        item.id ===
        currentDeckId
    );


  if (!deck) return;


  if (deck.builtIn) {

    showToast(
      "Стандартную колоду удалить нельзя"
    );

    return;

  }


  document
    .getElementById(
      "deleteModal"
    )
    .classList.add(
      "show"
    );

}


function closeDeleteModal() {

  document
    .getElementById(
      "deleteModal"
    )
    .classList.remove(
      "show"
    );

}


function confirmDeleteDeck() {

  const deck =
    decks.find(
      item =>
        item.id ===
        currentDeckId
    );


  if (
    !deck ||
    deck.builtIn
  ) {

    closeDeleteModal();

    return;

  }


  decks =
    decks.filter(
      item =>
        item.id !==
        currentDeckId
    );


  saveDecks();

  closeDeleteModal();

  renderHome();

  showScreen(
    "homeScreen"
  );


  showToast(
    "Колода удалена"
  );

}


/* =========================================================
   START STUDY
========================================================= */

function startStudy() {

  const deck =
    decks.find(
      item =>
        item.id ===
        currentDeckId
    );


  if (!deck) return;


  if (
    !deck.cards ||
    !deck.cards.length
  ) {

    showToast(
      "В колоде нет карточек"
    );

    return;

  }


  currentStudyDeck =
    deck;


  currentStudyCards =
    [...deck.cards];


  currentStudyIndex =
    0;


  document
    .getElementById(
      "studyDeckName"
    )
    .textContent =
      deck.name;


  showScreen(
    "studyScreen"
  );


  renderStudyCard();

}


/* =========================================================
   RENDER STUDY CARD
========================================================= */

function renderStudyCard() {

  const card =
    currentStudyCards[
      currentStudyIndex
    ];


  if (!card) return;


  const flashcard =
    document.getElementById(
      "flashcard"
    );


  flashcard.classList.remove(
    "flipped"
  );


  document
    .getElementById(
      "studyProgress"
    )
    .textContent =
      `${currentStudyIndex + 1} / ${
        currentStudyCards.length
      }`;


  const progress =
    (
      (currentStudyIndex + 1) /
      currentStudyCards.length
    ) * 100;


  document
    .getElementById(
      "studyProgressBar"
    )
    .style.width =
      `${progress}%`;


  document
    .getElementById(
      "studyFrontText"
    )
    .textContent =
      card.front;


  document
    .getElementById(
      "studyBackText"
    )
    .textContent =
      card.back;


  setupStudyImage(
    card.imageUrl,
    "studyFrontImage",
    "studyFrontPlaceholder"
  );


  setupStudyImage(
    card.imageUrl,
    "studyBackImage",
    "studyBackPlaceholder"
  );

}


/* =========================================================
   STUDY IMAGE
========================================================= */

function setupStudyImage(
  imageUrl,
  imageId,
  placeholderId
) {

  const image =
    document.getElementById(
      imageId
    );

  const placeholder =
    document.getElementById(
      placeholderId
    );


  if (
    imageUrl &&
    imageUrl.trim()
  ) {

    image.src =
      imageUrl;

    image.style.display =
      "block";

    placeholder.style.display =
      "none";


    image.onerror =
      () => {

        image.style.display =
          "none";

        placeholder.style.display =
          "flex";

      };

  } else {

    image.src =
      "";

    image.style.display =
      "none";

    placeholder.style.display =
      "flex";

  }

}


/* =========================================================
   FLIP CARD
========================================================= */

function flipCard() {

  const flashcard =
    document.getElementById(
      "flashcard"
    );


  flashcard.classList.toggle(
    "flipped"
  );

}


/* =========================================================
   ANSWER
========================================================= */

function answerCard(
  known
) {

  if (known) {

    showToast(
      "Запомнил"
    );

  } else {

    showToast(
      "Повторим ещё раз"
    );

  }


  setTimeout(
    () => {

      nextCard();

    },
    350
  );

}


/* =========================================================
   NEXT CARD
========================================================= */

function nextCard() {

  if (
    currentStudyIndex <
    currentStudyCards.length - 1
  ) {

    currentStudyIndex++;

    renderStudyCard();

    return;

  }


  showToast(
    "Колода закончена"
  );


  setTimeout(
    () => {

      showScreen(
        "deckScreen"
      );

    },
    600
  );

}


/* =========================================================
   UPLOAD IMAGE
========================================================= */

async function uploadImage(
  file
) {

  /*
    Дополнительная защита:
    если Supabase не подключён,
    выбрасываем нормальную ошибку,
    а приложение продолжает работать.
  */

  if (!supabaseClient) {

    throw new Error(
      "Supabase не подключён"
    );

  }


  if (!file) {

    throw new Error(
      "Файл не выбран"
    );

  }


  /*
    Проверяем, что это действительно
    изображение.
  */

  if (
    !file.type ||
    !file.type.startsWith(
      "image/"
    )
  ) {

    throw new Error(
      "Можно загружать только изображения"
    );

  }


  /*
    Ограничение размера:
    10 МБ.
  */

  const maxSize =
    10 * 1024 * 1024;


  if (
    file.size >
    maxSize
  ) {

    throw new Error(
      "Фотография больше 10 МБ"
    );

  }


  const extension =
    getFileExtension(
      file.name
    );


  const fileName =
    "card_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(
        2,
        10
      ) +
    "." +
    extension;


  const result =
    await supabaseClient
      .storage
      .from(
        IMAGE_BUCKET
      )
      .upload(
        fileName,
        file,
        {
          cacheControl:
            "3600",

          upsert:
            false,

          contentType:
            file.type
        }
      );


  if (result.error) {

    throw result.error;

  }


  const publicResult =
    supabaseClient
      .storage
      .from(
        IMAGE_BUCKET
      )
      .getPublicUrl(
        fileName
      );


  if (
    !publicResult ||
    !publicResult.data ||
    !publicResult.data.publicUrl
  ) {

    throw new Error(
      "Не удалось получить URL фотографии"
    );

  }


  return publicResult.data.publicUrl;

}


/* =========================================================
   FILE EXTENSION
========================================================= */

function getFileExtension(
  fileName
) {

  const parts =
    fileName.split(".");


  if (
    parts.length < 2
  ) {

    return "jpg";

  }


  const extension =
    parts
      .pop()
      .toLowerCase();


  /*
    Не даём загрузить странное
    расширение.
  */

  const allowed = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif"
  ];


  if (
    !allowed.includes(
      extension
    )
  ) {

    return "jpg";

  }


  return extension;

}


/* =========================================================
   GENERATE ID
========================================================= */

function generateId() {

  return (
    Date.now()
      .toString(36) +

    Math.random()
      .toString(36)
      .substring(
        2,
        10
      )
  );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
  message
) {

  const toast =
    document.getElementById(
      "toast"
    );

  const text =
    document.getElementById(
      "toastText"
    );


  if (
    !toast ||
    !text
  ) {

    return;

  }


  text.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2200
    );

}
