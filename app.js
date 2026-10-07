const APP_VERSION = "1.3.0";


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

  Здесь должны стоять ТВОИ рабочие данные
  из текущего app.js.

  Используй:
  - Project URL
  - Publishable Key

  Secret / service_role key сюда НЕ вставлять.
*/

const SUPABASE_URL =
  "https://arnsfecpnwyjiuvmsoen.supabase.co";


const SUPABASE_KEY =
  "sb_publishable_sj2rVuSxhsUtB3xKft2dDw_8-KwPsFM";


const IMAGE_BUCKET =
  "card-images";


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
        "https://arnsfecpnwyjiuvmsoen.supabase.co"
      ) ||
      SUPABASE_KEY.includes(
        "sb_publishable_sj2rVuSxhsUtB3xKft2dDw_8-KwPsFM"
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
      "Ошибка Supabase:",
      error
    );

    return null;
  }

}


supabaseClient =
  initSupabase();


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY =
  "flashcards_universal_v5";


/*
  Старую memory-demo-deck удаляем.

  Actions — Действия НЕ удаляем,
  потому что теперь это наша постоянная
  стандартная колода.
*/

const OLD_BUILT_IN_DECK_IDS = [
  "memory-demo-deck"
];


/* =========================================================
   DEFAULT ACTIONS DECK
========================================================= */

const DEFAULT_ACTIONS_DECK_ID =
  "actions-20";


const DEFAULT_ACTIONS_CARDS = [

  {
    id: "action-01",
    front: "Pick up the phone.",
    back: "Подними / возьми телефон.",
    imageUrl: ""
  },

  {
    id: "action-02",
    front: "Put the cup down on the table.",
    back: "Поставь чашку на стол.",
    imageUrl: ""
  },

  {
    id: "action-03",
    front: "Move the book aside.",
    back: "Отодвинь книгу в сторону.",
    imageUrl: ""
  },

  {
    id: "action-04",
    front: "Move the box over here.",
    back: "Передвинь / переставь коробку сюда.",
    imageUrl: ""
  },

  {
    id: "action-05",
    front: "Put the key in your pocket.",
    back: "Положи ключ в карман.",
    imageUrl: ""
  },

  {
    id: "action-06",
    front: "Take the key out of your pocket.",
    back: "Достань ключ из кармана.",
    imageUrl: ""
  },

  {
    id: "action-07",
    front: "Give me the pen.",
    back: "Дай мне ручку.",
    imageUrl: ""
  },

  {
    id: "action-08",
    front: "Lift the box up.",
    back: "Подними коробку вверх.",
    imageUrl: ""
  },

  {
    id: "action-09",
    front: "Lower the box slowly.",
    back: "Медленно опусти коробку.",
    imageUrl: ""
  },

  {
    id: "action-10",
    front: "Tilt the bottle slightly.",
    back: "Слегка наклони бутылку.",
    imageUrl: ""
  },

  {
    id: "action-11",
    front: "Keep the bottle upright.",
    back: "Держи бутылку вертикально.",
    imageUrl: ""
  },

  {
    id: "action-12",
    front: "Bring the phone closer.",
    back: "Поднеси телефон ближе.",
    imageUrl: ""
  },

  {
    id: "action-13",
    front: "Move the phone farther away.",
    back: "Отодвинь / отнеси телефон подальше.",
    imageUrl: ""
  },

  {
    id: "action-14",
    front: "Give the bottle a good shake.",
    back: "Хорошенько встряхни бутылку.",
    imageUrl: ""
  },

  {
    id: "action-15",
    front: "Be careful! Don’t drop the glass.",
    back: "Осторожно! Не урони стакан.",
    imageUrl: ""
  },

  {
    id: "action-16",
    front: "Carry the laptop carefully.",
    back: "Неси ноутбук осторожно.",
    imageUrl: ""
  },

  {
    id: "action-17",
    front: "Set the plate down gently.",
    back: "Аккуратно поставь тарелку.",
    imageUrl: ""
  },

  {
    id: "action-18",
    front: "Turn the phone around.",
    back: "Разверни телефон.",
    imageUrl: ""
  },

  {
    id: "action-19",
    front: "Turn the cup upside down.",
    back: "Переверни чашку вверх дном.",
    imageUrl: ""
  },

  {
    id: "action-20",
    front: "Leave the keys there.",
    back: "Оставь ключи там.",
    imageUrl: ""
  }

];


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

const screens = {

  homeScreen:
    document.getElementById(
      "homeScreen"
    ),

  createScreen:
    document.getElementById(
      "createScreen"
    ),

  deckScreen:
    document.getElementById(
      "deckScreen"
    ),

  studyScreen:
    document.getElementById(
      "studyScreen"
    )

};


/* =========================================================
   LOAD DECKS
========================================================= */

function loadDecks() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (!saved) {

      decks = [];

    } else {

      const parsed =
        JSON.parse(saved);


      decks =
        Array.isArray(parsed)
          ? parsed
          : [];

    }

  } catch (error) {

    console.error(
      "Ошибка загрузки колод:",
      error
    );

    decks = [];
  }


  removeOldBuiltInDecks();


  /*
    Добавляем стандартную Actions-колоду,
    если её ещё нет.

    Если пользователь уже её редактировал,
    ничего не перезаписываем.
  */

  createDefaultActionsDeck();
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
      "Ошибка сохранения:",
      error
    );

    showToast(
      "Не удалось сохранить данные"
    );

  }

}


/* =========================================================
   REMOVE OLD BUILT-IN DECKS
========================================================= */

function removeOldBuiltInDecks() {

  const before =
    decks.length;


  decks =
    decks.filter(
      deck =>
        !OLD_BUILT_IN_DECK_IDS.includes(
          deck.id
        )
    );


  if (
    decks.length !==
    before
  ) {

    saveDecks();

  }

}


/* =========================================================
   CREATE DEFAULT ACTIONS DECK
========================================================= */

function createDefaultActionsDeck() {

  const existingDeck =
    decks.find(
      deck =>
        deck.id ===
        DEFAULT_ACTIONS_DECK_ID
    );


  /*
    Уже существует —
    ничего не делаем.
  */

  if (existingDeck) {

    return;

  }


  decks.unshift({

    id:
      DEFAULT_ACTIONS_DECK_ID,

    name:
      "Actions — Действия",

    icon:
      "🎯",

    cards:
      DEFAULT_ACTIONS_CARDS.map(
        card => ({
          ...card
        })
      ),

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString()

  });


  saveDecks();

}


/* =========================================================
   SHOW SCREEN
========================================================= */

function showScreen(
  screenId
) {

  Object.values(
    screens
  ).forEach(
    screen => {

      screen.classList.remove(
        "active"
      );

    }
  );


  const screen =
    document.getElementById(
      screenId
    );


  if (screen) {

    screen.classList.add(
      "active"
    );

  }


  window.scrollTo({

    top: 0,

    behavior: "instant"

  });

}


/* =========================================================
   HOME
========================================================= */

function renderHome() {

  const deckList =
    document.getElementById(
      "deckList"
    );


  const emptyState =
    document.getElementById(
      "emptyDeckState"
    );


  deckList.innerHTML = "";


  if (!decks.length) {

    emptyState.classList.add(
      "visible"
    );

    return;

  }


  emptyState.classList.remove(
    "visible"
  );


  decks.forEach(
    deck => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "deck-item";


      item.innerHTML = `

        <div class="deck-item-icon">
          ${escapeHtml(
            deck.icon ||
            "📚"
          )}
        </div>


        <div class="deck-item-info">

          <div class="deck-item-name">
            ${escapeHtml(
              deck.name
            )}
          </div>


          <div class="deck-item-count">
            ${getCardsCountText(
              deck.cards.length
            )}
          </div>

        </div>


        <div class="deck-item-arrow">
          →
        </div>

      `;


      item.addEventListener(
        "click",
        () =>
          openDeck(
            deck.id
          )
      );


      deckList.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   CREATE NEW DECK
========================================================= */

function openCreateScreen() {

  editingDeckId = null;

  selectedDeckIcon =
    "📚";


  document.getElementById(
    "createTitle"
  ).textContent =
    "Новая колода";


  document.getElementById(
    "deckNameInput"
  ).value =
    "";


  setSelectedIcon(
    "📚"
  );


  document.getElementById(
    "newCardsList"
  ).innerHTML =
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

  if (!currentDeckId) {

    return;

  }


  const deck =
    decks.find(
      item =>
        item.id ===
        currentDeckId
    );


  if (!deck) {

    return;

  }


  editingDeckId =
    deck.id;


  selectedDeckIcon =
    deck.icon ||
    "📚";


  document.getElementById(
    "createTitle"
  ).textContent =
    "Редактировать колоду";


  document.getElementById(
    "deckNameInput"
  ).value =
    deck.name ||
    "";


  setSelectedIcon(
    selectedDeckIcon
  );


  const list =
    document.getElementById(
      "newCardsList"
    );


  list.innerHTML =
    "";


  if (
    Array.isArray(
      deck.cards
    ) &&
    deck.cards.length
  ) {

    deck.cards.forEach(
      card =>
        addNewCardBlock(
          card
        )
    );

  } else {

    addNewCardBlock();

  }


  showScreen(
    "createScreen"
  );

}


/* =========================================================
   ADD NEW CARD BLOCK
========================================================= */

function addNewCardBlock(
  existingCard = null
) {

  const list =
    document.getElementById(
      "newCardsList"
    );


  const cardId =
    existingCard?.id ||
    generateId(
      "card"
    );


  const block =
    document.createElement(
      "div"
    );


  block.className =
    "card-editor";


  block.dataset.cardId =
    cardId;


  const imageUrl =
    existingCard?.imageUrl ||
    "";


  block.innerHTML = `

    <div class="card-editor-top">

      <div class="card-editor-title">
        Карточка
      </div>


      <button
        type="button"
        class="remove-card-button"
      >
        Удалить
      </button>

    </div>


    <div class="card-field">

      <label class="field-label">
        Лицевая сторона
      </label>


      <textarea
        class="card-textarea front-input"
        placeholder="Введите текст"
      >${escapeHtml(
        existingCard?.front ||
        ""
      )}</textarea>

    </div>


    <div class="card-field">

      <label class="field-label">
        Обратная сторона
      </label>


      <textarea
        class="card-textarea back-input"
        placeholder="Введите ответ"
      >${escapeHtml(
        existingCard?.back ||
        ""
      )}</textarea>

    </div>


    <div class="card-field">

      <label class="field-label">
        Фото
      </label>


      <div class="card-photo-area">

        <div class="photo-preview">

          <img
            class="photo-preview-image"
            alt=""
            src="${escapeHtml(
              imageUrl
            )}"
            ${
              imageUrl
                ? ""
                : 'style="display:none;"'
            }
          >


          <div
            class="photo-placeholder"
            ${
              imageUrl
                ? 'style="display:none;"'
                : ""
            }
          >
            Фото не добавлено
          </div>

        </div>


        <div class="photo-buttons">

          <button
            type="button"
            class="photo-upload-button"
          >
            📷 Добавить фото
          </button>


          <button
            type="button"
            class="photo-remove-button"
          >
            Удалить фото
          </button>

        </div>


        <input
          type="file"
          class="photo-file-input"
          accept="image/*"
          style="display:none;"
        >

      </div>

    </div>

  `;


  /* =========================================
     REMOVE CARD
  ========================================== */

  block
    .querySelector(
      ".remove-card-button"
    )
    .addEventListener(
      "click",
      () => {

        const blocks =
          list.querySelectorAll(
            ".card-editor"
          );


        if (
          blocks.length <=
          1
        ) {

          showToast(
            "В колоде должна остаться хотя бы одна карточка"
          );

          return;

        }


        block.remove();


        renumberEditorCards();

      }
    );


  /* =========================================
     UPLOAD IMAGE
  ========================================== */

  const uploadButton =
    block.querySelector(
      ".photo-upload-button"
    );


  const fileInput =
    block.querySelector(
      ".photo-file-input"
    );


  uploadButton.addEventListener(
    "click",
    () =>
      fileInput.click()
  );


  fileInput.addEventListener(
    "change",
    async event => {

      const file =
        event.target.files?.[0];


      if (!file) {

        return;

      }


      try {

        showToast(
          "Загрузка фото..."
        );


        const url =
          await uploadImage(
            file
          );


        block.dataset.imageUrl =
          url;


        const image =
          block.querySelector(
            ".photo-preview-image"
          );


        const placeholder =
          block.querySelector(
            ".photo-placeholder"
          );


        image.src =
          url;


        image.style.display =
          "block";


        placeholder.style.display =
          "none";


        showToast(
          "Фото добавлено"
        );

      } catch (error) {

        console.error(
          error
        );


        showToast(
          error.message ||
          "Не удалось загрузить фото"
        );

      }


      fileInput.value =
        "";

    }
  );


  /* =========================================
     REMOVE IMAGE
  ========================================== */

  block
    .querySelector(
      ".photo-remove-button"
    )
    .addEventListener(
      "click",
      () => {

        block.dataset.imageUrl =
          "";


        const image =
          block.querySelector(
            ".photo-preview-image"
          );


        const placeholder =
          block.querySelector(
            ".photo-placeholder"
          );


        image.src =
          "";


        image.style.display =
          "none";


        placeholder.style.display =
          "flex";

      }
    );


  if (imageUrl) {

    block.dataset.imageUrl =
      imageUrl;

  }


  list.appendChild(
    block
  );


  renumberEditorCards();

}


/* =========================================================
   RENUMBER EDITOR CARDS
========================================================= */

function renumberEditorCards() {

  const cards =
    document.querySelectorAll(
      "#newCardsList .card-editor"
    );


  cards.forEach(
    (
      card,
      index
    ) => {

      const title =
        card.querySelector(
          ".card-editor-title"
        );


      if (title) {

        title.textContent =
          `Карточка ${index + 1}`;

      }

    }
  );

}


/* =========================================================
   ICON
========================================================= */

function setSelectedIcon(
  icon
) {

  selectedDeckIcon =
    icon;


  document
    .querySelectorAll(
      ".icon-option"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "selected",
          button.dataset.icon ===
            icon
        );

      }
    );

}


/* =========================================================
   SAVE DECK
========================================================= */

async function saveDeckFromEditor() {

  const nameInput =
    document.getElementById(
      "deckNameInput"
    );


  const name =
    nameInput.value.trim();


  if (!name) {

    showToast(
      "Введите название колоды"
    );


    nameInput.focus();


    return;

  }


  const blocks =
    document.querySelectorAll(
      "#newCardsList .card-editor"
    );


  if (!blocks.length) {

    showToast(
      "Добавьте хотя бы одну карточку"
    );


    return;

  }


  const cards = [];


  for (
    let index = 0;
    index < blocks.length;
    index++
  ) {

    const block =
      blocks[index];


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


    if (
      !front &&
      !back
    ) {

      showToast(
        `Заполните карточку ${index + 1}`
      );


      return;

    }


    cards.push({

      id:
        block.dataset.cardId ||
        generateId(
          "card"
        ),

      front,

      back,

      imageUrl:
        block.dataset.imageUrl ||
        ""

    });

  }


  const now =
    new Date().toISOString();


  /* =========================================
     EDIT EXISTING
  ========================================== */

  if (editingDeckId) {

    const index =
      decks.findIndex(
        deck =>
          deck.id ===
          editingDeckId
      );


    if (index !== -1) {

      decks[index] = {

        ...decks[index],

        name,

        icon:
          selectedDeckIcon,

        cards,

        updatedAt:
          now

      };

    }


  } else {


    /* =========================================
       CREATE NEW
    ========================================== */

    decks.push({

      id:
        generateId(
          "deck"
        ),

      name,

      icon:
        selectedDeckIcon,

      cards,

      createdAt:
        now,

      updatedAt:
        now

    });

  }


  saveDecks();


  renderHome();


  if (editingDeckId) {

    currentDeckId =
      editingDeckId;


    openDeck(
      currentDeckId
    );


  } else {

    showScreen(
      "homeScreen"
    );

  }


  showToast(
    "Колода сохранена"
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


  if (!deck) {

    return;

  }


  currentDeckId =
    deckId;


  document.getElementById(
    "deckHeroIcon"
  ).textContent =
    deck.icon ||
    "📚";


  document.getElementById(
    "deckHeroTitle"
  ).textContent =
    deck.name;


  document.getElementById(
    "deckHeroCount"
  ).textContent =
    getCardsCountText(
      deck.cards.length
    );


  document.getElementById(
    "deckContent"
  ).classList.remove(
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
   RENDER DECK CONTENT
========================================================= */

function renderDeckContent(
  deck
) {

  const container =
    document.getElementById(
      "deckContent"
    );


  container.innerHTML =
    "";


  if (
    !Array.isArray(
      deck.cards
    ) ||
    !deck.cards.length
  ) {

    container.innerHTML = `

      <div class="empty-state visible">

        <div class="empty-icon">
          📭
        </div>

        <div class="empty-title">
          Нет карточек
        </div>

      </div>

    `;


    return;

  }


  deck.cards.forEach(
    (
      card,
      index
    ) => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "content-card";


      let imageHtml =
        "";


      if (
        card.imageUrl
      ) {

        imageHtml = `

          <img
            class="content-card-image"
            src="${escapeHtml(
              card.imageUrl
            )}"
            alt=""
          >

        `;

      } else {

        imageHtml = `

          <div
            class="content-card-placeholder"
          >
            Фото не добавлено
          </div>

        `;

      }


      item.innerHTML = `

        <div class="content-card-number">
          КАРТОЧКА ${index + 1}
        </div>


        ${imageHtml}


        <div class="content-label">
          ЛИЦЕВАЯ СТОРОНА
        </div>


        <div class="content-text">
          ${escapeHtml(
            card.front ||
            "—"
          )}
        </div>


        <div class="content-label">
          ОБРАТНАЯ СТОРОНА
        </div>


        <div class="content-text">
          ${escapeHtml(
            card.back ||
            "—"
          )}
        </div>


        <button
          class="edit-card-button"
          data-card-id="${escapeHtml(
            card.id
          )}"
        >
          ✎ Редактировать карточку
        </button>

      `;


      item
        .querySelector(
          ".edit-card-button"
        )
        .addEventListener(
          "click",
          () =>
            editCard(
              card.id
            )
        );


      container.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   EDIT CARD
========================================================= */

function editCard(
  cardId
) {

  if (!currentDeckId) {

    return;

  }


  editCurrentDeck();


  setTimeout(
    () => {

      const cards =
        document.querySelectorAll(
          "#newCardsList .card-editor"
        );


      const index =
        Array.from(
          cards
        ).findIndex(
          block =>
            block.dataset.cardId ===
            cardId
        );


      if (index !== -1) {

        cards[index].scrollIntoView({

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
   DELETE CURRENT DECK
========================================================= */

function deleteCurrentDeck() {

  if (!currentDeckId) {

    return;

  }


  document
    .getElementById(
      "deleteModal"
    )
    .classList.add(
      "visible"
    );

}


/* =========================================================
   CONFIRM DELETE
========================================================= */

function confirmDeleteDeck() {

  if (!currentDeckId) {

    return;

  }


  decks =
    decks.filter(
      deck =>
        deck.id !==
        currentDeckId
    );


  saveDecks();


  currentDeckId =
    null;


  renderHome();


  document
    .getElementById(
      "deleteModal"
    )
    .classList.remove(
      "visible"
    );


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


  if (!deck) {

    return;

  }


  if (
    !Array.isArray(
      deck.cards
    ) ||
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


  document.getElementById(
    "studyDeckName"
  ).textContent =
    deck.name;


  renderStudyCard();


  showScreen(
    "studyScreen"
  );

}


/* =========================================================
   RENDER STUDY CARD
========================================================= */

function renderStudyCard() {

  const card =
    currentStudyCards[
      currentStudyIndex
    ];


  if (!card) {

    return;

  }


  const flashcard =
    document.getElementById(
      "flashcard"
    );


  /*
    При переходе назад или вперёд
    карточка автоматически
    возвращается на лицевую сторону.
  */

  flashcard.classList.remove(
    "flipped"
  );


  /* =========================================
     PROGRESS
  ========================================== */

  const total =
    currentStudyCards.length;


  const current =
    currentStudyIndex + 1;


  document.getElementById(
    "studyProgress"
  ).textContent =
    `${current} / ${total}`;


  const progress =
    total > 0
      ? (
          current /
          total
        ) * 100
      : 0;


  document.getElementById(
    "studyProgressBar"
  ).style.width =
    `${progress}%`;


  /* =========================================
     TEXT
  ========================================== */

  document.getElementById(
    "studyFrontText"
  ).textContent =
    card.front ||
    "";


  document.getElementById(
    "studyBackText"
  ).textContent =
    card.back ||
    "";


  /* =========================================
     IMAGE
  ========================================== */

  setStudyImage(

    "studyFrontImage",

    "studyFrontPlaceholder",

    card.imageUrl

  );


  setStudyImage(

    "studyBackImage",

    "studyBackPlaceholder",

    card.imageUrl

  );


  /* =========================================
     NAVIGATION
  ========================================== */

  const prevButton =
    document.getElementById(
      "prevButton"
    );


  const nextButton =
    document.getElementById(
      "nextButton"
    );


  if (prevButton) {

    prevButton.disabled =
      currentStudyIndex ===
      0;

  }


  if (nextButton) {

    nextButton.disabled =
      currentStudyIndex ===
      currentStudyCards.length - 1;

  }

}


/* =========================================================
   SET STUDY IMAGE
========================================================= */

function setStudyImage(

  imageId,

  placeholderId,

  url

) {

  const image =
    document.getElementById(
      imageId
    );


  const placeholder =
    document.getElementById(
      placeholderId
    );


  if (url) {

    image.src =
      url;


    image.classList.add(
      "visible"
    );


    placeholder.classList.add(
      "hidden"
    );


  } else {

    image.src =
      "";


    image.classList.remove(
      "visible"
    );


    placeholder.classList.remove(
      "hidden"
    );

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
   PREVIOUS CARD
========================================================= */

function previousCard() {

  if (
    currentStudyIndex <=
    0
  ) {

    return;

  }


  currentStudyIndex--;


  renderStudyCard();

}


/* =========================================================
   NEXT CARD
========================================================= */

function nextCard() {

  if (
    currentStudyIndex >=
    currentStudyCards.length - 1
  ) {

    return;

  }


  currentStudyIndex++;


  renderStudyCard();

}


/* =========================================================
   UPLOAD IMAGE
========================================================= */

async function uploadImage(
  file
) {

  if (!supabaseClient) {

    throw new Error(
      "Supabase не настроен"
    );

  }


  if (!file) {

    throw new Error(
      "Файл не выбран"
    );

  }


  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    throw new Error(
      "Можно загружать только изображения"
    );

  }


  const maxSize =
    10 * 1024 * 1024;


  if (
    file.size >
    maxSize
  ) {

    throw new Error(
      "Размер изображения не должен превышать 10 МБ"
    );

  }


  const extension =
    getFileExtension(
      file.name
    );


  const fileName =
    `card_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}.${extension}`;


  const filePath =
    fileName;


  const {
    error: uploadError
  } =
    await supabaseClient
      .storage
      .from(
        IMAGE_BUCKET
      )
      .upload(
        filePath,
        file,
        {
          cacheControl:
            "3600",

          upsert:
            false
        }
      );


  if (uploadError) {

    console.error(
      "Upload error:",
      uploadError
    );


    throw new Error(
      uploadError.message ||
      "Ошибка загрузки изображения"
    );

  }


  const {
    data
  } =
    supabaseClient
      .storage
      .from(
        IMAGE_BUCKET
      )
      .getPublicUrl(
        filePath
      );


  if (
    !data ||
    !data.publicUrl
  ) {

    throw new Error(
      "Не удалось получить ссылку на изображение"
    );

  }


  return data.publicUrl;

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


  const allowed = [

    "jpg",

    "jpeg",

    "png",

    "webp",

    "gif"

  ];


  return allowed.includes(
    extension
  )
    ? extension
    : "jpg";

}


/* =========================================================
   GENERATE ID
========================================================= */

function generateId(
  prefix
) {

  return (

    prefix +

    "_" +

    Date.now() +

    "_" +

    Math.random()
      .toString(36)
      .slice(2, 9)

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


  toast.textContent =
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


/* =========================================================
   CARD COUNT
========================================================= */

function getCardsCountText(
  count
) {

  const value =
    Number(count) ||
    0;


  if (
    value % 10 === 1 &&
    value % 100 !== 11
  ) {

    return `${value} карточка`;

  }


  if (
    [2, 3, 4].includes(
      value % 10
    ) &&
    ![12, 13, 14].includes(
      value % 100
    )
  ) {

    return `${value} карточки`;

  }


  return `${value} карточек`;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )

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


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {


  /* =========================================
     CREATE DECK
  ========================================== */

  document
    .getElementById(
      "createDeckButton"
    )
    .addEventListener(
      "click",
      openCreateScreen
    );


  /* =========================================
     CREATE BACK
  ========================================== */

  document
    .getElementById(
      "createBackButton"
    )
    .addEventListener(
      "click",
      () => {

        if (
          editingDeckId
        ) {

          openDeck(
            editingDeckId
          );

        } else {

          showScreen(
            "homeScreen"
          );

        }

      }
    );


  /* =========================================
     DECK BACK
  ========================================== */

  document
    .getElementById(
      "deckBackButton"
    )
    .addEventListener(
      "click",
      () => {

        currentDeckId =
          null;


        renderHome();


        showScreen(
          "homeScreen"
        );

      }
    );


  /* =========================================
     STUDY BACK
  ========================================== */

  document
    .getElementById(
      "studyBackButton"
    )
    .addEventListener(
      "click",
      () => {

        if (
          currentStudyDeck
        ) {

          openDeck(
            currentStudyDeck.id
          );

        } else {

          showScreen(
            "homeScreen"
          );

        }

      }
    );


  /* =========================================
     ICONS
  ========================================== */

  document
    .querySelectorAll(
      ".icon-option"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            setSelectedIcon(
              button.dataset.icon
            );

          }
        );

      }
    );


  /* =========================================
     ADD CARD
  ========================================== */

  document
    .getElementById(
      "addCardButton"
    )
    .addEventListener(
      "click",
      () => {

        addNewCardBlock();

      }
    );


  /* =========================================
     SAVE
  ========================================== */

  document
    .getElementById(
      "saveDeckButton"
    )
    .addEventListener(
      "click",
      saveDeckFromEditor
    );


  /* =========================================
     STUDY
  ========================================== */

  document
    .getElementById(
      "studyDeckButton"
    )
    .addEventListener(
      "click",
      startStudy
    );


  /* =========================================
     CONTENT
  ========================================== */

  document
    .getElementById(
      "contentDeckButton"
    )
    .addEventListener(
      "click",
      () => {

        const content =
          document.getElementById(
            "deckContent"
          );


        content.classList.toggle(
          "visible"
        );

      }
    );


  /* =========================================
     EDIT DECK
  ========================================== */

  document
    .getElementById(
      "editDeckButton"
    )
    .addEventListener(
      "click",
      editCurrentDeck
    );


  /* =========================================
     DELETE
  ========================================== */

  document
    .getElementById(
      "deleteDeckButton"
    )
    .addEventListener(
      "click",
      deleteCurrentDeck
    );


  /* =========================================
     DELETE CANCEL
  ========================================== */

  document
    .getElementById(
      "cancelDeleteButton"
    )
    .addEventListener(
      "click",
      () => {

        document
          .getElementById(
            "deleteModal"
          )
          .classList.remove(
            "visible"
          );

      }
    );


  /* =========================================
     DELETE CONFIRM
  ========================================== */

  document
    .getElementById(
      "confirmDeleteButton"
    )
    .addEventListener(
      "click",
      confirmDeleteDeck
    );


  /* =========================================
     FLASHCARD FLIP
  ========================================== */

  document
    .getElementById(
      "flashcard"
    )
    .addEventListener(
      "click",
      () => {

        flipCard();

      }
    );


  /* =========================================
     PREVIOUS
  ========================================== */

  document
    .getElementById(
      "prevButton"
    )
    .addEventListener(
      "click",
      event => {

        event.stopPropagation();


        previousCard();

      }
    );


  /* =========================================
     NEXT
  ========================================== */

  document
    .getElementById(
      "nextButton"
    )
    .addEventListener(
      "click",
      event => {

        event.stopPropagation();


        nextCard();

      }
    );

}


/* =========================================================
   INIT
========================================================= */

function init() {

  loadDecks();


  renderHome();


  setupEvents();


  showScreen(
    "homeScreen"
  );

}


init();
