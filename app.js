"use strict";

const APP_VERSION = "3.4";

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

const SUPABASE_URL = "ВСТАВЬ_СЮДА_СВОЙ_PROJECT_URL";
const SUPABASE_KEY = "ВСТАВЬ_СЮДА_СВОЙ_PUBLISHABLE_KEY";

const IMAGE_BUCKET = "card-images";

let supabaseClient = null;

let supabaseStatus = {
  configured: false,
  loaded: false,
  connected: false,
  error: ""
};


function cleanConfigValue(value) {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();
}


function isValidSupabaseUrl(url) {
  try {
    const parsed = new URL(url);

    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
}


function isValidSupabaseKey(key) {
  if (!key) return false;

  if (key.startsWith("sb_publishable_")) return true;

  if (key.startsWith("eyJ")) return true;

  return false;
}


function initSupabase() {
  const url = cleanConfigValue(SUPABASE_URL);
  const key = cleanConfigValue(SUPABASE_KEY);

  supabaseStatus = {
    configured: false,
    loaded: false,
    connected: false,
    error: ""
  };

  if (
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
  ) {
    supabaseStatus.error =
      "Библиотека Supabase JS не загрузилась.";

    console.error(supabaseStatus.error);

    return null;
  }

  supabaseStatus.loaded = true;

  if (!url) {
    supabaseStatus.error =
      "Не указан Supabase Project URL.";

    return null;
  }

  if (!isValidSupabaseUrl(url)) {
    supabaseStatus.error =
      "Supabase Project URL имеет неправильный формат.";

    return null;
  }

  if (!key) {
    supabaseStatus.error =
      "Не указан Supabase Publishable key.";

    return null;
  }

  if (!isValidSupabaseKey(key)) {
    supabaseStatus.error =
      "Supabase key имеет неправильный формат.";

    return null;
  }

  try {
    const client =
      window.supabase.createClient(url, key);

    supabaseStatus.configured = true;

    console.log("Supabase клиент создан.");

    return client;
  } catch (error) {
    supabaseStatus.error =
      "Ошибка создания Supabase клиента.";

    console.error(error);

    return null;
  }
}


supabaseClient = initSupabase();


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "flashcards_universal_v5";

const OLD_BUILT_IN_DECK_IDS = [
  "memory-demo-deck"
];


/* =========================================================
   ACTIONS — ДЕЙСТВИЯ
========================================================= */

const ACTIONS_CARDS = [
  {
    id: "action-1",
    front: "Подними / возьми телефон.",
    back: "Pick up the phone."
  },
  {
    id: "action-2",
    front: "Поставь чашку на стол.",
    back: "Put the cup down on the table."
  },
  {
    id: "action-3",
    front: "Отодвинь книгу в сторону.",
    back: "Move the book aside."
  },
  {
    id: "action-4",
    front: "Передвинь / переставь коробку сюда.",
    back: "Move the box over here."
  },
  {
    id: "action-5",
    front: "Положи ключ в карман.",
    back: "Put the key in your pocket."
  },
  {
    id: "action-6",
    front: "Достань ключ из кармана.",
    back: "Take the key out of your pocket."
  },
  {
    id: "action-7",
    front: "Дай мне ручку.",
    back: "Give me the pen."
  },
  {
    id: "action-8",
    front: "Подними коробку вверх.",
    back: "Lift the box up."
  },
  {
    id: "action-9",
    front: "Медленно опусти коробку.",
    back: "Lower the box slowly."
  },
  {
    id: "action-10",
    front: "Слегка наклони бутылку.",
    back: "Tilt the bottle slightly."
  },
  {
    id: "action-11",
    front: "Держи бутылку вертикально.",
    back: "Keep the bottle upright."
  },
  {
    id: "action-12",
    front: "Поднеси телефон ближе.",
    back: "Bring the phone closer."
  },
  {
    id: "action-13",
    front: "Отодвинь / отнеси телефон подальше.",
    back: "Move the phone farther away."
  },
  {
    id: "action-14",
    front: "Хорошенько встряхни бутылку.",
    back: "Give the bottle a good shake."
  },
  {
    id: "action-15",
    front: "Осторожно! Не урони стакан.",
    back: "Be careful! Don’t drop the glass."
  },
  {
    id: "action-16",
    front: "Неси ноутбук осторожно.",
    back: "Carry the laptop carefully."
  },
  {
    id: "action-17",
    front: "Аккуратно поставь тарелку.",
    back: "Set the plate down gently."
  },
  {
    id: "action-18",
    front: "Разверни телефон.",
    back: "Turn the phone around."
  },
  {
    id: "action-19",
    front: "Переверни чашку вверх дном.",
    back: "Turn the cup upside down."
  },
  {
    id: "action-20",
    front: "Оставь ключи там.",
    back: "Leave the keys there."
  }
];


function createDefaultActionsDeck() {
  return {
    id: "actions-20",
    name: "Actions — Действия",
    icon: "🎯",

    cards: ACTIONS_CARDS.map(card => ({
      ...card
    })),

    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}


/* =========================================================
   STATE
========================================================= */

let decks = [];

let currentDeckId = null;

let editingDeckId = null;

let currentStudyCards = [];

let currentStudyIndex = 0;

let selectedDeckIcon = "📚";

let pendingDeleteDeckId = null;


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

const deckList =
  document.getElementById("deckList");

const emptyDeckState =
  document.getElementById("emptyDeckState");

const createDeckButton =
  document.getElementById("createDeckButton");

const createBackButton =
  document.getElementById("createBackButton");

const deckBackButton =
  document.getElementById("deckBackButton");

const studyBackButton =
  document.getElementById("studyBackButton");

const deckNameInput =
  document.getElementById("deckNameInput");

const newCardsList =
  document.getElementById("newCardsList");

const addCardButton =
  document.getElementById("addCardButton");

const saveDeckButton =
  document.getElementById("saveDeckButton");

const deckHeroIcon =
  document.getElementById("deckHeroIcon");

const deckHeroTitle =
  document.getElementById("deckHeroTitle");

const deckHeroCount =
  document.getElementById("deckHeroCount");

const studyDeckButton =
  document.getElementById("studyDeckButton");

const contentDeckButton =
  document.getElementById("contentDeckButton");

const editDeckButton =
  document.getElementById("editDeckButton");

const deckContent =
  document.getElementById("deckContent");

const deleteDeckButton =
  document.getElementById("deleteDeckButton");

const studyDeckName =
  document.getElementById("studyDeckName");

const studyProgress =
  document.getElementById("studyProgress");

const studyProgressBar =
  document.getElementById("studyProgressBar");

const flashcard =
  document.getElementById("flashcard");

const studyFrontImage =
  document.getElementById("studyFrontImage");

const studyFrontPlaceholder =
  document.getElementById("studyFrontPlaceholder");

const studyFrontText =
  document.getElementById("studyFrontText");

const studyBackImage =
  document.getElementById("studyBackImage");

const studyBackPlaceholder =
  document.getElementById("studyBackPlaceholder");

const studyBackText =
  document.getElementById("studyBackText");

const prevButton =
  document.getElementById("prevButton");

const nextButton =
  document.getElementById("nextButton");

const toast =
  document.getElementById("toast");

const deleteModal =
  document.getElementById("deleteModal");

const cancelDeleteButton =
  document.getElementById("cancelDeleteButton");

const confirmDeleteButton =
  document.getElementById("confirmDeleteButton");

const createTitle =
  document.getElementById("createTitle");


/* =========================================================
   SCREEN
========================================================= */

function showScreen(screen) {
  document
    .querySelectorAll(".screen")
    .forEach(item => {
      item.classList.remove("active");
    });

  screen.classList.add("active");

  window.scrollTo(0, 0);
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


/* =========================================================
   SAVE / LOAD
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


function loadDecks() {
  let saved = [];

  try {
    const raw =
      localStorage.getItem(STORAGE_KEY);

    if (raw) {
      saved = JSON.parse(raw);
    }
  } catch (error) {
    console.error(
      "Ошибка чтения localStorage:",
      error
    );

    saved = [];
  }

  if (!Array.isArray(saved)) {
    saved = [];
  }

  saved = saved.filter(deck => {
    return !OLD_BUILT_IN_DECK_IDS.includes(
      deck.id
    );
  });

  decks = saved;

  const existingActions =
    decks.find(
      deck => deck.id === "actions-20"
    );

  if (!existingActions) {
    decks.push(
      createDefaultActionsDeck()
    );

    saveDecks();
  }

  renderDeckList();
}


/* =========================================================
   DECK LIST
========================================================= */

function renderDeckList() {
  deckList.innerHTML = "";

  if (!decks.length) {
    emptyDeckState.classList.remove(
      "hidden"
    );

    return;
  }

  emptyDeckState.classList.add(
    "hidden"
  );

  decks.forEach(deck => {
    const button =
      document.createElement("button");

    button.type = "button";
    button.className = "deck-card";

    const icon =
      document.createElement("div");

    icon.className =
      "deck-card-icon";

    icon.textContent =
      deck.icon || "📚";

    const info =
      document.createElement("div");

    info.className =
      "deck-card-info";

    const title =
      document.createElement("div");

    title.className =
      "deck-card-title";

    title.textContent =
      deck.name || "Без названия";

    const count =
      document.createElement("div");

    count.className =
      "deck-card-count";

    count.textContent =
      `${deck.cards?.length || 0} карточек`;

    info.appendChild(title);
    info.appendChild(count);

    button.appendChild(icon);
    button.appendChild(info);

    button.addEventListener(
      "click",
      () => openDeck(deck.id)
    );

    deckList.appendChild(button);
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

  if (!deck) return;

  currentDeckId = deckId;

  deckHeroIcon.textContent =
    deck.icon || "📚";

  deckHeroTitle.textContent =
    deck.name || "Без названия";

  deckHeroCount.textContent =
    `${deck.cards?.length || 0} карточек`;

  deckContent.classList.add("hidden");

  contentDeckButton.textContent =
    "Карточки";

  renderDeckContent();

  showScreen(deckScreen);
}


/* =========================================================
   DECK CONTENT
========================================================= */

function renderDeckContent() {
  const deck =
    decks.find(
      item => item.id === currentDeckId
    );

  if (!deck) return;

  deckContent.innerHTML = "";

  if (!deck.cards?.length) {
    const empty =
      document.createElement("div");

    empty.className =
      "empty-state";

    empty.style.padding =
      "30px 10px";

    empty.innerHTML = `
      <div class="empty-icon">📚</div>
      <h2>Нет карточек</h2>
      <p>Добавь карточки в эту колоду.</p>
    `;

    deckContent.appendChild(empty);

    return;
  }

  deck.cards.forEach((card, index) => {
    const item =
      document.createElement("div");

    item.className =
      "content-card";

    const number =
      document.createElement("div");

    number.className =
      "content-card-number";

    number.textContent =
      `КАРТОЧКА ${index + 1}`;

    const front =
      document.createElement("div");

    front.className =
      "content-card-front";

    front.textContent =
      card.front || "";

    const back =
      document.createElement("div");

    back.className =
      "content-card-back";

    back.textContent =
      card.back || "";

    item.appendChild(number);
    item.appendChild(front);
    item.appendChild(back);

    deckContent.appendChild(item);
  });
}


function toggleDeckContent() {
  const container =
    document.getElementById(
      "deckContent"
    );

  const button =
    document.getElementById(
      "contentDeckButton"
    );

  if (!container || !button) return;

  const isHidden =
    container.classList.contains(
      "hidden"
    );

  if (isHidden) {
    renderDeckContent();

    container.classList.remove(
      "hidden"
    );

    button.textContent =
      "Скрыть карточки";
  } else {
    container.classList.add(
      "hidden"
    );

    button.textContent =
      "Карточки";
  }
}


/* =========================================================
   CREATE / EDIT
========================================================= */

function openCreateScreen(deckId = null) {
  editingDeckId = deckId;

  newCardsList.innerHTML = "";

  if (deckId) {
    const deck =
      decks.find(
        item => item.id === deckId
      );

    if (!deck) return;

    createTitle.textContent =
      "Редактировать колоду";

    deckNameInput.value =
      deck.name || "";

    selectedDeckIcon =
      deck.icon || "📚";

    updateIconSelection();

    if (Array.isArray(deck.cards)) {
      deck.cards.forEach(card => {
        addCardEditor(card);
      });
    }
  } else {
    createTitle.textContent =
      "Новая колода";

    deckNameInput.value = "";

    selectedDeckIcon = "📚";

    updateIconSelection();

    addCardEditor();
  }

  showScreen(createScreen);
}


/* =========================================================
   ICONS
========================================================= */

function updateIconSelection() {
  document
    .querySelectorAll(".icon-option")
    .forEach(button => {
      button.classList.toggle(
        "selected",
        button.dataset.icon ===
          selectedDeckIcon
      );
    });
}


/* =========================================================
   CARD EDITOR
========================================================= */

function addCardEditor(card = null) {
  const wrapper =
    document.createElement("div");

  wrapper.className =
    "card-editor";

  const header =
    document.createElement("div");

  header.className =
    "card-editor-header";

  const number =
    document.createElement("div");

  number.className =
    "card-number";

  number.textContent =
    `КАРТОЧКА ${newCardsList.children.length + 1}`;

  const deleteButton =
    document.createElement("button");

  deleteButton.type = "button";

  deleteButton.className =
    "delete-card-button";

  deleteButton.textContent = "×";

  deleteButton.addEventListener(
    "click",
    () => {
      wrapper.remove();

      renumberCardEditors();
    }
  );

  header.appendChild(number);
  header.appendChild(deleteButton);


  /* РУССКИЙ */

  const frontField =
    document.createElement("div");

  frontField.className =
    "card-editor-field";

  const frontLabel =
    document.createElement("label");

  frontLabel.textContent =
    "Русский";

  const frontInput =
    document.createElement("textarea");

  frontInput.placeholder =
    "Введите фразу на русском";

  frontInput.value =
    card?.front || "";

  frontField.appendChild(frontLabel);
  frontField.appendChild(frontInput);


  /* АНГЛИЙСКИЙ */

  const backField =
    document.createElement("div");

  backField.className =
    "card-editor-field";

  const backLabel =
    document.createElement("label");

  backLabel.textContent =
    "English";

  const backInput =
    document.createElement("textarea");

  backInput.placeholder =
    "Введите фразу на английском";

  backInput.value =
    card?.back || "";

  backField.appendChild(backLabel);
  backField.appendChild(backInput);


  /* IMAGE */

  const imageField =
    document.createElement("div");

  imageField.className =
    "card-editor-field";

  const imageLabel =
    document.createElement("label");

  imageLabel.textContent =
    "Изображение";

  const imageActions =
    document.createElement("div");

  imageActions.className =
    "image-actions";

  const uploadButton =
    document.createElement("button");

  uploadButton.type = "button";

  uploadButton.className =
    "image-button";

  uploadButton.textContent =
    "📷 Добавить фото";

  const removeImageButton =
    document.createElement("button");

  removeImageButton.type =
    "button";

  removeImageButton.className =
    "image-button";

  removeImageButton.textContent =
    "Удалить фото";

  const fileInput =
    document.createElement("input");

  fileInput.type = "file";

  fileInput.accept = "image/*";

  fileInput.style.display =
    "none";

  const preview =
    document.createElement("img");

  preview.className =
    "image-preview hidden";

  let imageUrl =
    card?.imageUrl || "";

  if (imageUrl) {
    preview.src = imageUrl;

    preview.classList.remove(
      "hidden"
    );
  }

  uploadButton.addEventListener(
    "click",
    () => fileInput.click()
  );

  fileInput.addEventListener(
    "change",
    async event => {
      const file =
        event.target.files?.[0];

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showToast(
          "Можно выбрать только изображение."
        );

        return;
      }

      if (
        file.size >
        10 * 1024 * 1024
      ) {
        showToast(
          "Максимальный размер фото — 10 МБ."
        );

        return;
      }

      uploadButton.disabled = true;

      uploadButton.textContent =
        "Загрузка...";

      try {
        imageUrl =
          await uploadImage(file);

        if (imageUrl) {
          preview.src =
            imageUrl;

          preview.classList.remove(
            "hidden"
          );

          showToast(
            "Фото загружено."
          );
        }
      } catch (error) {
        console.error(error);

        showToast(
          "Не удалось загрузить фото."
        );
      } finally {
        uploadButton.disabled =
          false;

        uploadButton.textContent =
          "📷 Добавить фото";

        fileInput.value = "";
      }
    }
  );

  removeImageButton.addEventListener(
    "click",
    () => {
      imageUrl = "";

      preview.removeAttribute(
        "src"
      );

      preview.classList.add(
        "hidden"
      );

      showToast(
        "Фото удалено."
      );
    }
  );

  imageActions.appendChild(
    uploadButton
  );

  imageActions.appendChild(
    removeImageButton
  );

  imageField.appendChild(
    imageLabel
  );

  imageField.appendChild(
    imageActions
  );

  imageField.appendChild(
    fileInput
  );

  imageField.appendChild(
    preview
  );


  wrapper.appendChild(header);
  wrapper.appendChild(frontField);
  wrapper.appendChild(backField);
  wrapper.appendChild(imageField);


  wrapper._getCardData =
    function () {
      return {
        id:
          card?.id ||
          generateId(),

        front:
          frontInput.value.trim(),

        back:
          backInput.value.trim(),

        imageUrl:
          imageUrl
      };
    };


  newCardsList.appendChild(
    wrapper
  );
}


/* =========================================================
   RENUMBER
========================================================= */

function renumberCardEditors() {
  document
    .querySelectorAll(".card-editor")
    .forEach((editor, index) => {
      const number =
        editor.querySelector(
          ".card-number"
        );

      if (number) {
        number.textContent =
          `КАРТОЧКА ${index + 1}`;
      }
    });
}


/* =========================================================
   ID
========================================================= */

function generateId() {
  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 10)
  );
}


/* =========================================================
   SAVE DECK
========================================================= */

function saveCurrentDeck() {
  const name =
    deckNameInput.value.trim();

  if (!name) {
    showToast(
      "Введите название колоды."
    );

    deckNameInput.focus();

    return;
  }

  const cards = [];

  document
    .querySelectorAll(".card-editor")
    .forEach(editor => {
      if (
        typeof editor._getCardData ===
        "function"
      ) {
        cards.push(
          editor._getCardData()
        );
      }
    });

  if (!cards.length) {
    showToast(
      "Добавьте хотя бы одну карточку."
    );

    return;
  }

  for (const card of cards) {
    if (!card.front) {
      showToast(
        "Заполните русскую сторону карточки."
      );

      return;
    }

    if (!card.back) {
      showToast(
        "Заполните английскую сторону карточки."
      );

      return;
    }
  }

  if (editingDeckId) {
    const index =
      decks.findIndex(
        deck =>
          deck.id === editingDeckId
      );

    if (index !== -1) {
      decks[index] = {
        ...decks[index],

        name,

        icon:
          selectedDeckIcon,

        cards,

        updatedAt:
          Date.now()
      };
    }
  } else {
    decks.push({
      id:
        generateId(),

      name,

      icon:
        selectedDeckIcon,

      cards,

      createdAt:
        Date.now(),

      updatedAt:
        Date.now()
    });
  }

  saveDecks();

  renderDeckList();

  showToast(
    "Колода сохранена."
  );

  setTimeout(() => {
    if (editingDeckId) {
      openDeck(editingDeckId);
    } else {
      showScreen(homeScreen);
    }
  }, 300);
}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

async function uploadImage(file) {
  if (!supabaseClient) {
    throw new Error(
      supabaseStatus.error ||
      "Supabase не настроен."
    );
  }

  const extension =
    (
      file.name
        .split(".")
        .pop() ||
      "jpg"
    ).toLowerCase();

  const fileName =
    `card_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}.${extension}`;

  const {
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

    throw error;
  }

  const {
    data
  } =
    supabaseClient
      .storage
      .from(IMAGE_BUCKET)
      .getPublicUrl(fileName);

  if (!data?.publicUrl) {
    throw new Error(
      "Не удалось получить URL изображения."
    );
  }

  return data.publicUrl;
}


/* =========================================================
   STUDY
========================================================= */

function startStudy() {
  const deck =
    decks.find(
      item =>
        item.id === currentDeckId
    );

  if (!deck) return;

  if (!deck.cards?.length) {
    showToast(
      "В этой колоде нет карточек."
    );

    return;
  }

  currentStudyCards =
    [...deck.cards];

  currentStudyIndex = 0;

  studyDeckName.textContent =
    deck.name;

  flashcard.classList.remove(
    "flipped"
  );

  renderStudyCard();

  showScreen(studyScreen);
}


/* =========================================================
   STUDY CARD
========================================================= */

function renderStudyCard() {
  const card =
    currentStudyCards[
      currentStudyIndex
    ];

  if (!card) return;

  flashcard.classList.remove(
    "flipped"
  );

  const total =
    currentStudyCards.length;

  const current =
    currentStudyIndex + 1;

  studyProgress.textContent =
    `${current} / ${total}`;

  const progress =
    total > 0
      ? (current / total) * 100
      : 0;

  studyProgressBar.style.width =
    `${progress}%`;


  /*
   * ВАЖНО:
   *
   * ЛИЦЕВАЯ СТОРОНА = РУССКИЙ
   * ОБРАТНАЯ СТОРОНА = АНГЛИЙСКИЙ
   */

  studyFrontText.textContent =
    card.front || "";

  studyBackText.textContent =
    card.back || "";


  renderStudyImage(
    studyFrontImage,
    studyFrontPlaceholder,
    card.imageUrl
  );

  renderStudyImage(
    studyBackImage,
    studyBackPlaceholder,
    card.imageUrl
  );


  prevButton.disabled =
    currentStudyIndex <= 0;

  nextButton.disabled =
    currentStudyIndex >=
    currentStudyCards.length - 1;
}


/* =========================================================
   STUDY IMAGE
========================================================= */

function renderStudyImage(
  imageElement,
  placeholderElement,
  imageUrl
) {
  if (imageUrl) {
    imageElement.src =
      imageUrl;

    imageElement.classList.remove(
      "hidden"
    );

    placeholderElement.classList.add(
      "hidden"
    );
  } else {
    imageElement.removeAttribute(
      "src"
    );

    imageElement.classList.add(
      "hidden"
    );

    placeholderElement.classList.add(
      "hidden"
    );
  }
}


/* =========================================================
   FLIP
========================================================= */

function flipCard() {
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
   DELETE
========================================================= */

function openDeleteModal() {
  if (!currentDeckId) return;

  pendingDeleteDeckId =
    currentDeckId;

  deleteModal.classList.remove(
    "hidden"
  );
}


function closeDeleteModal() {
  pendingDeleteDeckId = null;

  deleteModal.classList.add(
    "hidden"
  );
}


function confirmDeleteDeck() {
  if (!pendingDeleteDeckId) {
    return;
  }

  decks =
    decks.filter(
      deck =>
        deck.id !==
        pendingDeleteDeckId
    );

  saveDecks();

  closeDeleteModal();

  currentDeckId = null;

  renderDeckList();

  showScreen(homeScreen);

  showToast(
    "Колода удалена."
  );
}


/* =========================================================
   NAVIGATION
========================================================= */

function goHome() {
  currentDeckId = null;

  showScreen(homeScreen);

  renderDeckList();
}


function goBackFromCreate() {
  if (editingDeckId) {
    openDeck(editingDeckId);
  } else {
    showScreen(homeScreen);
  }
}


/* =========================================================
   KEYBOARD
========================================================= */

function closeKeyboard() {
  const active =
    document.activeElement;

  if (
    active &&
    (
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA"
    )
  ) {
    active.blur();
  }
}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  createDeckButton.addEventListener(
    "click",
    () => openCreateScreen()
  );


  createBackButton.addEventListener(
    "click",
    goBackFromCreate
  );


  deckBackButton.addEventListener(
    "click",
    goHome
  );


  studyBackButton.addEventListener(
    "click",
    () => openDeck(currentDeckId)
  );


  addCardButton.addEventListener(
    "click",
    () => {
      addCardEditor();

      renumberCardEditors();
    }
  );


  saveDeckButton.addEventListener(
    "click",
    saveCurrentDeck
  );


  document
    .querySelectorAll(".icon-option")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          selectedDeckIcon =
            button.dataset.icon;

          updateIconSelection();
        }
      );
    });


  studyDeckButton.addEventListener(
    "click",
    startStudy
  );


  contentDeckButton.addEventListener(
    "click",
    toggleDeckContent
  );


  editDeckButton.addEventListener(
    "click",
    () => {
      if (currentDeckId) {
        openCreateScreen(
          currentDeckId
        );
      }
    }
  );


  deleteDeckButton.addEventListener(
    "click",
    openDeleteModal
  );


  flashcard.addEventListener(
    "click",
    flipCard
  );


  prevButton.addEventListener(
    "click",
    previousCard
  );


  nextButton.addEventListener(
    "click",
    nextCard
  );


  cancelDeleteButton.addEventListener(
    "click",
    closeDeleteModal
  );


  confirmDeleteButton.addEventListener(
    "click",
    confirmDeleteDeck
  );


  const modalOverlay =
    deleteModal.querySelector(
      ".modal-overlay"
    );

  if (modalOverlay) {
    modalOverlay.addEventListener(
      "click",
      closeDeleteModal
    );
  }


  /* КЛАВИАТУРА */

  document.addEventListener(
    "pointerdown",
    event => {
      const target =
        event.target;

      if (
        target.closest("input") ||
        target.closest("textarea")
      ) {
        return;
      }

      closeKeyboard();
    },
    true
  );


  document.addEventListener(
    "touchend",
    event => {
      const target =
        event.target;

      if (
        target.closest("input") ||
        target.closest("textarea")
      ) {
        return;
      }

      closeKeyboard();
    },
    true
  );


  document.addEventListener(
    "click",
    event => {
      const target =
        event.target;

      if (
        target.closest("input") ||
        target.closest("textarea")
      ) {
        return;
      }

      closeKeyboard();
    },
    true
  );
}


/* =========================================================
   START
========================================================= */

setupEvents();

loadDecks();

console.log(
  `Flash Cards ${APP_VERSION} запущен.`
);
