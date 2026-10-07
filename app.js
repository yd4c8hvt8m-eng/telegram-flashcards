"use strict";

/* =========================================================
   FLASH CARDS
   Version 3.2
========================================================= */

const APP_VERSION = "3.2";

const STORAGE_KEY = "flashcards_universal_v5";

const IMAGE_BUCKET = "card-images";


/* =========================================================
   SUPABASE CONFIG
========================================================= */

/*
  ВСТАВЬ СЮДА СВОИ ДАННЫЕ ИЗ SUPABASE

  Project URL выглядит примерно так:
  https://xxxxxxxxxxxx.supabase.co

  Publishable key:
  sb_publishable_...

  Старый anon public key тоже поддерживается.
*/

const SUPABASE_URL =
  "https://arnsfecpnwyjiuvmsoen.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_sj2rVuSxhsUtB3xKft2dDw_8-KwPsFM";


/* =========================================================
   TELEGRAM
========================================================= */

const tg = window.Telegram?.WebApp || null;

if (tg) {
  try {
    tg.ready();
    tg.expand();
  } catch (error) {
    console.warn("Telegram WebApp недоступен:", error);
  }
}


/* =========================================================
   SUPABASE
========================================================= */

let supabaseClient = null;

let supabaseStatus = {
  configured: false,
  loaded: false,
  connected: false,
  error: ""
};


/*
  Очищаем случайные пробелы, кавычки и переносы строк.
  Это важно, если URL/key вставлялись вручную.
*/
function cleanConfigValue(value) {

  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();
}


/*
  Проверяем URL Supabase.
*/
function isValidSupabaseUrl(url) {

  try {

    const parsed = new URL(url);

    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".supabase.co")
    );

  } catch (error) {

    return false;

  }
}


/*
  Проверяем Publishable / anon key.

  Supabase сейчас использует:
  sb_publishable_...

  Также поддерживается старый:
  eyJ...
*/
function isValidSupabaseKey(key) {

  if (!key) {
    return false;
  }

  if (key.startsWith("sb_publishable_")) {
    return true;
  }

  if (key.startsWith("eyJ")) {
    return true;
  }

  return false;
}


/*
  Инициализация Supabase.
*/
function initSupabase() {

  const url = cleanConfigValue(SUPABASE_URL);

  const key = cleanConfigValue(SUPABASE_KEY);


  supabaseStatus = {
    configured: false,
    loaded: false,
    connected: false,
    error: ""
  };


  /*
    Проверяем, загрузилась ли библиотека.
  */

  if (
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
  ) {

    supabaseStatus.error =
      "Библиотека Supabase JS не загрузилась.";

    console.error(
      "Supabase JS не найден:",
      window.supabase
    );

    return null;
  }


  supabaseStatus.loaded = true;


  /*
    Проверяем URL.
  */

  if (!url) {

    supabaseStatus.error =
      "Не указан Supabase Project URL.";

    console.error(
      "SUPABASE_URL пустой."
    );

    return null;
  }


  if (!isValidSupabaseUrl(url)) {

    supabaseStatus.error =
      "Supabase Project URL имеет неправильный формат.";

    console.error(
      "Неправильный SUPABASE_URL:",
      url
    );

    return null;
  }


  /*
    Проверяем ключ.
  */

  if (!key) {

    supabaseStatus.error =
      "Не указан Supabase Publishable key.";

    console.error(
      "SUPABASE_KEY пустой."
    );

    return null;
  }


  if (!isValidSupabaseKey(key)) {

    supabaseStatus.error =
      "Supabase key имеет неправильный формат.";

    console.error(
      "Неправильный SUPABASE_KEY."
    );

    return null;
  }


  /*
    Создаём клиента.
  */

  try {

    const client =
      window.supabase.createClient(
        url,
        key
      );

    supabaseStatus.configured = true;

    console.log(
      "Supabase клиент успешно создан."
    );

    return client;

  } catch (error) {

    supabaseStatus.error =
      "Ошибка создания Supabase клиента.";

    console.error(
      "Ошибка Supabase:",
      error
    );

    return null;
  }
}


supabaseClient = initSupabase();


/* =========================================================
   OLD BUILT-IN DECKS
========================================================= */

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

let editingDeckId = null;

let selectedIcon = "📚";

let currentStudyCards = [];

let currentStudyIndex = 0;


/* =========================================================
   DOM
========================================================= */

const homeScreen =
  document.getElementById("homeScreen");

const createScreen =
  document.getElementById("createScreen");

const deckScreen =
  document.getElementById("deckScreen");

const studyScreen =
  document.getElementById("studyScreen");


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {

  const toast =
    document.getElementById("toast");

  if (!toast) {
    return;
  }

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);
}


/* =========================================================
   SCREEN NAVIGATION
========================================================= */

function showScreen(screen) {

  [
    homeScreen,
    createScreen,
    deckScreen,
    studyScreen
  ].forEach(item => {

    if (item) {
      item.classList.remove("active");
    }

  });

  screen.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
}


/* =========================================================
   LOCAL STORAGE
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
      "Не удалось сохранить данные."
    );
  }
}


function removeOldBuiltInDecks() {

  const before = decks.length;

  decks = decks.filter(
    deck =>
      !OLD_BUILT_IN_DECK_IDS.includes(deck.id)
  );

  if (decks.length !== before) {
    saveDecks();
  }
}


/* =========================================================
   DEFAULT DECK
========================================================= */

function createDefaultActionsDeck() {

  const existing =
    decks.find(
      deck =>
        deck.id === DEFAULT_ACTIONS_DECK_ID
    );


  /*
    Если набор уже есть —
    НЕ перезаписываем его.

    Это важно:
    пользователь мог уже добавить фотографии.
  */

  if (existing) {
    return;
  }


  const now =
    new Date().toISOString();


  const defaultDeck = {

    id: DEFAULT_ACTIONS_DECK_ID,

    name: "Actions — Действия",

    icon: "🎯",

    cards: DEFAULT_ACTIONS_CARDS.map(card => ({
      ...card
    })),

    createdAt: now,

    updatedAt: now

  };


  decks.unshift(defaultDeck);

  saveDecks();
}


/* =========================================================
   LOAD DECKS
========================================================= */

function loadDecks() {

  try {

    const raw =
      localStorage.getItem(STORAGE_KEY);


    if (raw) {

      const parsed =
        JSON.parse(raw);


      if (Array.isArray(parsed)) {

        decks = parsed;

      } else {

        decks = [];

      }

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


  /*
    Сначала удаляем старый demo deck.
  */

  removeOldBuiltInDecks();


  /*
    Затем создаём стандартный набор,
    если его ещё нет.
  */

  createDefaultActionsDeck();


  renderDeckList();
}


/* =========================================================
   DECK LIST
========================================================= */

function renderDeckList() {

  const list =
    document.getElementById("deckList");

  const empty =
    document.getElementById("emptyDeckState");


  if (!list) {
    return;
  }


  list.innerHTML = "";


  if (!decks.length) {

    empty?.classList.remove("hidden");

    return;

  }


  empty?.classList.add("hidden");


  decks.forEach(deck => {

    const item =
      document.createElement("button");

    item.className = "deck-item";

    item.type = "button";


    const icon =
      document.createElement("div");

    icon.className = "deck-item-icon";

    icon.textContent =
      deck.icon || "📚";


    const info =
      document.createElement("div");

    info.className =
      "deck-item-info";


    const title =
      document.createElement("div");

    title.className =
      "deck-item-title";

    title.textContent =
      deck.name || "Без названия";


    const count =
      document.createElement("div");

    count.className =
      "deck-item-count";

    count.textContent =
      `${deck.cards?.length || 0} карточек`;


    info.appendChild(title);

    info.appendChild(count);


    item.appendChild(icon);

    item.appendChild(info);


    item.addEventListener(
      "click",
      () => openDeck(deck.id)
    );


    list.appendChild(item);

  });
}


/* =========================================================
   OPEN DECK
========================================================= */

function openDeck(deckId) {

  const deck =
    decks.find(
      item => item.id === deckId
    );


  if (!deck) {
    return;
  }


  currentDeckId = deckId;


  document.getElementById(
    "deckHeroIcon"
  ).textContent =
    deck.icon || "📚";


  document.getElementById(
    "deckHeroTitle"
  ).textContent =
    deck.name || "Без названия";


  document.getElementById(
    "deckHeroCount"
  ).textContent =
    `${deck.cards?.length || 0} карточек`;


  document
    .getElementById("deckContent")
    .classList.add("hidden");


  showScreen(deckScreen);
}


/* =========================================================
   RENDER DECK CONTENT
========================================================= */

function renderDeckContent() {

  const deck =
    decks.find(
      item => item.id === currentDeckId
    );


  const container =
    document.getElementById("deckContent");


  if (!deck || !container) {
    return;
  }


  container.innerHTML = "";


  (deck.cards || []).forEach(
    (card, index) => {

      const row =
        document.createElement("div");

      row.className =
        "content-card";


      if (card.imageUrl) {

        const img =
          document.createElement("img");

        img.className =
          "content-card-image";

        img.src =
          card.imageUrl;

        img.alt = "";

        row.appendChild(img);

      } else {

        const noImage =
          document.createElement("div");

        noImage.className =
          "content-card-no-image";

        noImage.textContent =
          "Нет фото";

        row.appendChild(noImage);
      }


      const info =
        document.createElement("div");

      info.className =
        "content-card-info";


      const front =
        document.createElement("div");

      front.className =
        "content-card-front";

      front.textContent =
        `${index + 1}. ${card.front || ""}`;


      const back =
        document.createElement("div");

      back.className =
        "content-card-back";

      back.textContent =
        card.back || "";


      info.appendChild(front);

      info.appendChild(back);


      row.appendChild(info);


      container.appendChild(row);

    }
  );


  container.classList.remove("hidden");
}


/* =========================================================
   CREATE DECK
========================================================= */

function openCreateDeck() {

  editingDeckId = null;

  selectedIcon = "📚";


  document.getElementById(
    "createTitle"
  ).textContent =
    "Новый набор";


  document.getElementById(
    "deckNameInput"
  ).value = "";


  document.querySelectorAll(
    ".icon-option"
  ).forEach(button => {

    button.classList.toggle(
      "selected",
      button.dataset.icon === selectedIcon
    );

  });


  renderEditorCards([
    createEmptyCard()
  ]);


  showScreen(createScreen);
}


/* =========================================================
   EDIT DECK
========================================================= */

function openEditDeck() {

  const deck =
    decks.find(
      item => item.id === currentDeckId
    );


  if (!deck) {
    return;
  }


  editingDeckId = deck.id;

  selectedIcon =
    deck.icon || "📚";


  document.getElementById(
    "createTitle"
  ).textContent =
    "Редактировать набор";


  document.getElementById(
    "deckNameInput"
  ).value =
    deck.name || "";


  document.querySelectorAll(
    ".icon-option"
  ).forEach(button => {

    button.classList.toggle(
      "selected",
      button.dataset.icon === selectedIcon
    );

  });


  renderEditorCards(
    deck.cards?.length
      ? deck.cards
      : [createEmptyCard()]
  );


  showScreen(createScreen);
}


/* =========================================================
   EMPTY CARD
========================================================= */

function createEmptyCard() {

  return {

    id:
      "card_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2),

    front: "",

    back: "",

    imageUrl: ""

  };
}


/* =========================================================
   RENDER EDITOR
========================================================= */

function renderEditorCards(cards) {

  const list =
    document.getElementById(
      "newCardsList"
    );


  list.innerHTML = "";


  cards.forEach(card => {

    addEditorCard(card);

  });
}


/* =========================================================
   ADD EDITOR CARD
========================================================= */

function addEditorCard(card = null) {

  const list =
    document.getElementById(
      "newCardsList"
    );


  const cardData =
    card || createEmptyCard();


  const wrapper =
    document.createElement("div");

  wrapper.className =
    "editor-card";


  wrapper.dataset.cardId =
    cardData.id;


  const header =
    document.createElement("div");

  header.className =
    "editor-card-header";


  const number =
    document.createElement("div");

  number.className =
    "editor-card-number";


  const removeButton =
    document.createElement("button");

  removeButton.type =
    "button";

  removeButton.className =
    "remove-card-button";

  removeButton.textContent =
    "Удалить";


  removeButton.addEventListener(
    "click",
    () => {

      wrapper.remove();

      renumberEditorCards();

    }
  );


  header.appendChild(number);

  header.appendChild(
    removeButton
  );


  /* FRONT */

  const frontLabel =
    document.createElement("label");

  frontLabel.className =
    "editor-label";

  frontLabel.textContent =
    "Лицевая сторона";


  const frontInput =
    document.createElement("textarea");

  frontInput.className =
    "front-input";

  frontInput.placeholder =
    "Например: Pick up the phone.";

  frontInput.value =
    cardData.front || "";


  /* BACK */

  const backLabel =
    document.createElement("label");

  backLabel.className =
    "editor-label";

  backLabel.textContent =
    "Обратная сторона";


  const backInput =
    document.createElement("textarea");

  backInput.className =
    "back-input";

  backInput.placeholder =
    "Например: Подними телефон.";

  backInput.value =
    cardData.back || "";


  /* IMAGE */

  const imageEditor =
    document.createElement("div");

  imageEditor.className =
    "image-editor";


  const imagePreviewWrap =
    document.createElement("div");

  imagePreviewWrap.className =
    "image-preview-wrap";


  const imagePreview =
    document.createElement("img");

  imagePreview.className =
    "image-preview";


  const imagePlaceholder =
    document.createElement("div");

  imagePlaceholder.className =
    "image-placeholder";

  imagePlaceholder.textContent =
    "Фото не добавлено";


  if (cardData.imageUrl) {

    imagePreview.src =
      cardData.imageUrl;

    imagePlaceholder.classList.add(
      "hidden"
    );

  } else {

    imagePreview.classList.add(
      "hidden"
    );

  }


  imagePreviewWrap.appendChild(
    imagePreview
  );

  imagePreviewWrap.appendChild(
    imagePlaceholder
  );


  const actions =
    document.createElement("div");

  actions.className =
    "image-actions";


  const uploadButton =
    document.createElement("button");

  uploadButton.type =
    "button";

  uploadButton.className =
    "image-upload-button";

  uploadButton.textContent =
    "Добавить фото";


  const removeImageButton =
    document.createElement("button");

  removeImageButton.type =
    "button";

  removeImageButton.className =
    "image-remove-button";

  removeImageButton.textContent =
    "Удалить фото";


  const fileInput =
    document.createElement("input");

  fileInput.type =
    "file";

  fileInput.accept =
    "image/*";

  fileInput.className =
    "hidden-file-input";


  uploadButton.addEventListener(
    "click",
    () => fileInput.click()
  );


  removeImageButton.addEventListener(
    "click",
    () => {

      cardData.imageUrl = "";

      imagePreview.src = "";

      imagePreview.classList.add(
        "hidden"
      );

      imagePlaceholder.classList.remove(
        "hidden"
      );

    }
  );


  fileInput.addEventListener(
    "change",
    async event => {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      uploadButton.disabled = true;

      uploadButton.textContent =
        "Загрузка...";


      try {

        const url =
          await uploadImage(file);


        if (url) {

          cardData.imageUrl =
            url;


          imagePreview.src =
            url;


          imagePreview.classList.remove(
            "hidden"
          );


          imagePlaceholder.classList.add(
            "hidden"
          );


          showToast(
            "Фото загружено."
          );

        }

      } catch (error) {

        console.error(
          "Ошибка загрузки фото:",
          error
        );

        showToast(
          error.message ||
          "Не удалось загрузить фото."
        );

      } finally {

        uploadButton.disabled = false;

        uploadButton.textContent =
          "Заменить фото";

        fileInput.value = "";

      }

    }
  );


  actions.appendChild(
    uploadButton
  );

  actions.appendChild(
    removeImageButton
  );


  imageEditor.appendChild(
    imagePreviewWrap
  );

  imageEditor.appendChild(
    actions
  );

  imageEditor.appendChild(
    fileInput
  );


  wrapper.appendChild(
    header
  );

  wrapper.appendChild(
    frontLabel
  );

  wrapper.appendChild(
    frontInput
  );

  wrapper.appendChild(
    backLabel
  );

  wrapper.appendChild(
    backInput
  );

  wrapper.appendChild(
    imageEditor
  );


  list.appendChild(wrapper);


  renumberEditorCards();
}


/* =========================================================
   RENUMBER CARDS
========================================================= */

function renumberEditorCards() {

  document
    .querySelectorAll(".editor-card")
    .forEach((card, index) => {

      const number =
        card.querySelector(
          ".editor-card-number"
        );

      if (number) {

        number.textContent =
          `Карточка ${index + 1}`;

      }

    });
}


/* =========================================================
   COLLECT EDITOR CARDS
========================================================= */

function collectEditorCards() {

  const cards = [];


  document
    .querySelectorAll(".editor-card")
    .forEach(wrapper => {

      const front =
        wrapper
          .querySelector(".front-input")
          ?.value
          .trim() || "";


      const back =
        wrapper
          .querySelector(".back-input")
          ?.value
          .trim() || "";


      const existingId =
        wrapper.dataset.cardId ||
        "";


      /*
        Получаем текущую картинку.

        Она хранится в img.src,
        если фото уже было загружено.
      */

      const image =
        wrapper.querySelector(
          ".image-preview"
        );


      let imageUrl = "";

      if (
        image &&
        !image.classList.contains("hidden") &&
        image.src
      ) {

        imageUrl = image.src;

      }


      cards.push({

        id:
          existingId ||
          "card_" +
          Date.now() +
          "_" +
          Math.random()
            .toString(36)
            .slice(2),

        front,

        back,

        imageUrl

      });

    });


  return cards;
}


/* =========================================================
   SAVE DECK
========================================================= */

function saveDeck() {

  const name =
    document.getElementById(
      "deckNameInput"
    ).value.trim();


  if (!name) {

    showToast(
      "Введите название набора."
    );

    return;
  }


  const cards =
    collectEditorCards();


  if (!cards.length) {

    showToast(
      "Добавьте хотя бы одну карточку."
    );

    return;
  }


  const invalidCard =
    cards.find(
      card =>
        !card.front &&
        !card.back &&
        !card.imageUrl
    );


  if (invalidCard) {

    showToast(
      "Заполните карточки или удалите пустую."
    );

    return;
  }


  const now =
    new Date().toISOString();


  if (editingDeckId) {

    const deck =
      decks.find(
        item =>
          item.id === editingDeckId
      );


    if (!deck) {
      return;
    }


    deck.name = name;

    deck.icon = selectedIcon;

    deck.cards = cards;

    deck.updatedAt = now;


    currentDeckId =
      editingDeckId;

  } else {

    const newDeck = {

      id:
        "deck_" +
        Date.now() +
        "_" +
        Math.random()
          .toString(36)
          .slice(2),

      name,

      icon: selectedIcon,

      cards,

      createdAt: now,

      updatedAt: now

    };


    decks.unshift(newDeck);

    currentDeckId =
      newDeck.id;
  }


  saveDecks();

  renderDeckList();

  showToast(
    "Набор сохранён."
  );


  setTimeout(() => {

    openDeck(currentDeckId);

  }, 250);
}


/* =========================================================
   DELETE DECK
========================================================= */

function openDeleteModal() {

  document
    .getElementById("deleteModal")
    .classList.remove("hidden");
}


function closeDeleteModal() {

  document
    .getElementById("deleteModal")
    .classList.add("hidden");
}


function deleteCurrentDeck() {

  if (!currentDeckId) {
    return;
  }


  decks =
    decks.filter(
      deck =>
        deck.id !== currentDeckId
    );


  saveDecks();

  currentDeckId = null;

  closeDeleteModal();

  renderDeckList();

  showScreen(homeScreen);

  showToast(
    "Набор удалён."
  );
}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

async function uploadImage(file) {

  /*
    Проверяем Supabase.
  */

  if (!supabaseClient) {

    let message =
      "Supabase не настроен.";

    if (supabaseStatus.error) {

      message +=
        " " +
        supabaseStatus.error;
    }

    throw new Error(message);
  }


  /*
    Проверяем файл.
  */

  if (!file) {

    throw new Error(
      "Файл не выбран."
    );
  }


  if (!file.type.startsWith("image/")) {

    throw new Error(
      "Можно загружать только изображения."
    );
  }


  /*
    Максимум 10 МБ.
  */

  if (file.size > 10 * 1024 * 1024) {

    throw new Error(
      "Размер изображения не должен превышать 10 МБ."
    );
  }


  /*
    Определяем расширение.
  */

  let extension = "jpg";


  if (
    file.type === "image/png"
  ) {

    extension = "png";

  } else if (
    file.type === "image/webp"
  ) {

    extension = "webp";

  } else if (
    file.type === "image/gif"
  ) {

    extension = "gif";
  }


  /*
    Уникальное имя.
  */

  const fileName =
    `card_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;


  console.log(
    "Начинаем загрузку:",
    fileName
  );


  /*
    Upload.
  */

  const {
    data,
    error
  } =
    await supabaseClient
      .storage
      .from(IMAGE_BUCKET)
      .upload(
        fileName,
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


    throw new Error(
      `Ошибка Supabase: ${error.message}`
    );
  }


  console.log(
    "Файл загружен:",
    data
  );


  /*
    Получаем публичную ссылку.
  */

  const {
    data: publicData
  } =
    supabaseClient
      .storage
      .from(IMAGE_BUCKET)
      .getPublicUrl(fileName);


  if (
    !publicData ||
    !publicData.publicUrl
  ) {

    throw new Error(
      "Supabase не вернул публичную ссылку на фото."
    );
  }


  console.log(
    "Public URL:",
    publicData.publicUrl
  );


  /*
    Соединение считаем подтверждённым.
  */

  supabaseStatus.connected = true;


  return publicData.publicUrl;
}


/* =========================================================
   SUPABASE DIAGNOSTIC
========================================================= */

async function testSupabaseConnection() {

  if (!supabaseClient) {

    console.warn(
      "Supabase test пропущен:",
      supabaseStatus.error
    );

    return false;
  }


  try {

    /*
      Получаем список файлов из bucket.

      Это одновременно проверяет:
      - клиент
      - URL
      - ключ
      - bucket
      - доступ Storage
    */

    const {
      data,
      error
    } =
      await supabaseClient
        .storage
        .from(IMAGE_BUCKET)
        .list(
          "",
          {
            limit: 1
          }
        );


    if (error) {

      console.warn(
        "Supabase Storage test:",
        error
      );

      /*
        Если bucket существует, но list запрещён,
        это ещё не обязательно означает,
        что upload не работает.

        Поэтому не ломаем приложение.
      */

      return false;
    }


    supabaseStatus.connected = true;


    console.log(
      "Supabase Storage подключён.",
      data
    );


    return true;

  } catch (error) {

    console.warn(
      "Ошибка проверки Supabase:",
      error
    );

    return false;
  }
}


/* =========================================================
   STUDY MODE
========================================================= */

function startStudy() {

  const deck =
    decks.find(
      item =>
        item.id === currentDeckId
    );


  if (!deck) {
    return;
  }


  if (
    !deck.cards ||
    !deck.cards.length
  ) {

    showToast(
      "В этом наборе нет карточек."
    );

    return;
  }


  currentStudyCards =
    [...deck.cards];


  currentStudyIndex = 0;


  document.getElementById(
    "studyDeckName"
  ).textContent =
    deck.name;


  showScreen(studyScreen);


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


  if (!card) {
    return;
  }


  const flashcard =
    document.getElementById(
      "flashcard"
    );


  flashcard.classList.remove(
    "flipped"
  );


  const total =
    currentStudyCards.length;


  const current =
    currentStudyIndex + 1;


  document.getElementById(
    "studyProgress"
  ).textContent =
    `${current} / ${total}`;


  const percent =
    total > 0
      ? (current / total) * 100
      : 0;


  document.getElementById(
    "studyProgressBar"
  ).style.width =
    `${percent}%`;


  /*
    FRONT
  */

  document.getElementById(
    "studyFrontText"
  ).textContent =
    card.front || "";


  setStudyImage(
    "studyFrontImage",
    "studyFrontPlaceholder",
    card.imageUrl
  );


  /*
    BACK
  */

  document.getElementById(
    "studyBackText"
  ).textContent =
    card.back || "";


  setStudyImage(
    "studyBackImage",
    "studyBackPlaceholder",
    card.imageUrl
  );


  /*
    NAVIGATION
  */

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
      currentStudyIndex === 0;

  }


  if (nextButton) {

    nextButton.disabled =
      currentStudyIndex ===
      currentStudyCards.length - 1;

  }
}


/* =========================================================
   STUDY IMAGE
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


  if (!url) {

    image.src = "";

    image.classList.add(
      "hidden"
    );

    placeholder.classList.remove(
      "hidden"
    );

    return;
  }


  image.src = url;

  image.classList.remove(
    "hidden"
  );

  placeholder.classList.add(
    "hidden"
  );
}


/* =========================================================
   FLIP
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
   PREVIOUS
========================================================= */

function previousCard() {

  if (currentStudyIndex <= 0) {
    return;
  }


  currentStudyIndex--;

  renderStudyCard();
}


/* =========================================================
   NEXT
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
   EVENTS
========================================================= */

function setupEvents() {

  /*
    CREATE
  */

  document
    .getElementById(
      "createDeckButton"
    )
    .addEventListener(
      "click",
      openCreateDeck
    );


  /*
    CREATE BACK
  */

  document
    .getElementById(
      "createBackButton"
    )
    .addEventListener(
      "click",
      () => {

        if (editingDeckId) {

          openDeck(editingDeckId);

        } else {

          showScreen(homeScreen);

        }

      }
    );


  /*
    ICON SELECTOR
  */

  document
    .querySelectorAll(
      ".icon-option"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          selectedIcon =
            button.dataset.icon;


          document
            .querySelectorAll(
              ".icon-option"
            )
            .forEach(item => {

              item.classList.toggle(
                "selected",
                item === button
              );

            });

        }
      );

    });


  /*
    ADD CARD
  */

  document
    .getElementById(
      "addCardButton"
    )
    .addEventListener(
      "click",
      () => addEditorCard()
    );


  /*
    SAVE
  */

  document
    .getElementById(
      "saveDeckButton"
    )
    .addEventListener(
      "click",
      saveDeck
    );


  /*
    DECK BACK
  */

  document
    .getElementById(
      "deckBackButton"
    )
    .addEventListener(
      "click",
      () => {

        currentDeckId = null;

        showScreen(homeScreen);

      }
    );


  /*
    STUDY
  */

  document
    .getElementById(
      "studyDeckButton"
    )
    .addEventListener(
      "click",
      startStudy
    );


  /*
    CONTENT
  */

  document
    .getElementById(
      "contentDeckButton"
    )
    .addEventListener(
      "click",
      renderDeckContent
    );


  /*
    EDIT
  */

  document
    .getElementById(
      "editDeckButton"
    )
    .addEventListener(
      "click",
      openEditDeck
    );


  /*
    DELETE
  */

  document
    .getElementById(
      "deleteDeckButton"
    )
    .addEventListener(
      "click",
      openDeleteModal
    );


  document
    .getElementById(
      "cancelDeleteButton"
    )
    .addEventListener(
      "click",
      closeDeleteModal
    );


  document
    .getElementById(
      "confirmDeleteButton"
    )
    .addEventListener(
      "click",
      deleteCurrentDeck
    );


  /*
    STUDY BACK
  */

  document
    .getElementById(
      "studyBackButton"
    )
    .addEventListener(
      "click",
      () => {

        showScreen(deckScreen);

      }
    );


  /*
    FLASHCARD
  */

  document
    .getElementById(
      "flashcard"
    )
    .addEventListener(
      "click",
      flipCard
    );


  /*
    PREVIOUS
  */

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


  /*
    NEXT
  */

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
   START
========================================================= */

function startApp() {

  console.log(
    `FLASH CARDS ${APP_VERSION}`
  );


  console.log(
    "Supabase status:",
    supabaseStatus
  );


  setupEvents();

  loadDecks();


  /*
    Проверяем Supabase
    после загрузки интерфейса.
  */

  setTimeout(() => {

    testSupabaseConnection();

  }, 500);

}


/* =========================================================
   RUN
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    startApp
  );

} else {

  startApp();

}
