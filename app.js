"use strict";


/* =========================================================
   VERSION
========================================================= */

const APP_VERSION = "4.0";


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

  СЮДА ВСТАВЬ СВОИ ДАННЫЕ ИЗ ТЕКУЩЕЙ РАБОЧЕЙ ВЕРСИИ.

  Использовать нужно:
  - Project URL
  - Publishable key

  НЕ Secret key.
*/

const SUPABASE_URL =
  "https://arnsfecpnwyjiuvmsoen.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_sj2rVuSxhsUtB3xKft2dDw_8-KwPsFM";


const IMAGE_BUCKET =
  "card-images";


let supabaseClient = null;


function initSupabase() {

  if (
    !window.supabase ||
    typeof window.supabase.createClient !==
      "function"
  ) {

    console.error(
      "Supabase JS не загружен."
    );

    return null;

  }


  const url =
    SUPABASE_URL.trim();

  const key =
    SUPABASE_KEY.trim();


  if (
    !url ||
    url.includes("ВСТАВЬ")
  ) {

    console.warn(
      "Supabase URL не настроен."
    );

    return null;

  }


  if (
    !key ||
    key.includes("ВСТАВЬ")
  ) {

    console.warn(
      "Supabase key не настроен."
    );

    return null;

  }


  try {

    return window.supabase.createClient(
      url,
      key
    );

  } catch (error) {

    console.error(
      "Ошибка создания Supabase клиента:",
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
  "flashcards_universal_v6";


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


const deckList =
  document.getElementById(
    "deckList"
  );

const emptyDeckState =
  document.getElementById(
    "emptyDeckState"
  );


const createDeckButton =
  document.getElementById(
    "createDeckButton"
  );

const createBackButton =
  document.getElementById(
    "createBackButton"
  );

const deckBackButton =
  document.getElementById(
    "deckBackButton"
  );

const studyBackButton =
  document.getElementById(
    "studyBackButton"
  );


const deckNameInput =
  document.getElementById(
    "deckNameInput"
  );

const newCardsList =
  document.getElementById(
    "newCardsList"
  );

const addCardButton =
  document.getElementById(
    "addCardButton"
  );

const saveDeckButton =
  document.getElementById(
    "saveDeckButton"
  );


const deckHeroIcon =
  document.getElementById(
    "deckHeroIcon"
  );

const deckHeroTitle =
  document.getElementById(
    "deckHeroTitle"
  );

const deckHeroCount =
  document.getElementById(
    "deckHeroCount"
  );


const studyDeckButton =
  document.getElementById(
    "studyDeckButton"
  );

const contentDeckButton =
  document.getElementById(
    "contentDeckButton"
  );

const editDeckButton =
  document.getElementById(
    "editDeckButton"
  );

const deckContent =
  document.getElementById(
    "deckContent"
  );

const deleteDeckButton =
  document.getElementById(
    "deleteDeckButton"
  );


const studyDeckName =
  document.getElementById(
    "studyDeckName"
  );

const studyProgress =
  document.getElementById(
    "studyProgress"
  );

const studyProgressBar =
  document.getElementById(
    "studyProgressBar"
  );


const flashcard =
  document.getElementById(
    "flashcard"
  );


const studyFrontImage =
  document.getElementById(
    "studyFrontImage"
  );

const studyFrontPlaceholder =
  document.getElementById(
    "studyFrontPlaceholder"
  );

const studyFrontText =
  document.getElementById(
    "studyFrontText"
  );


const studyBackText =
  document.getElementById(
    "studyBackText"
  );


const prevButton =
  document.getElementById(
    "prevButton"
  );

const nextButton =
  document.getElementById(
    "nextButton"
  );


const toast =
  document.getElementById(
    "toast"
  );


const deleteModal =
  document.getElementById(
    "deleteModal"
  );

const cancelDeleteButton =
  document.getElementById(
    "cancelDeleteButton"
  );

const confirmDeleteButton =
  document.getElementById(
    "confirmDeleteButton"
  );


const createTitle =
  document.getElementById(
    "createTitle"
  );


/* =========================================================
   SCREEN
========================================================= */

function showScreen(screen) {

  document
    .querySelectorAll(".screen")
    .forEach(item => {

      item.classList.remove(
        "active"
      );

    });


  screen.classList.add(
    "active"
  );


  window.scrollTo(
    0,
    0
  );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

  if (!toast) return;


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
   STORAGE
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

  try {

    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (!raw) {

      decks = [];

    } else {

      const parsed =
        JSON.parse(raw);

      decks =
        Array.isArray(parsed)
          ? parsed
          : [];

    }

  } catch (error) {

    console.error(
      "Ошибка чтения данных:",
      error
    );

    decks = [];

  }


  renderDeckList();

}


/* =========================================================
   DECK LIST
========================================================= */

function renderDeckList() {

  deckList.innerHTML =
    "";


  if (!decks.length) {

    emptyDeckState.classList.remove(
      "hidden"
    );

  } else {

    emptyDeckState.classList.add(
      "hidden"
    );

  }


  decks.forEach(
    deck => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";

      button.className =
        "deck-card";


      const icon =
        document.createElement(
          "div"
        );


      icon.className =
        "deck-card-icon";

      icon.textContent =
        deck.icon ||
        "📚";


      const info =
        document.createElement(
          "div"
        );


      info.className =
        "deck-card-info";


      const title =
        document.createElement(
          "div"
        );


      title.className =
        "deck-card-title";

      title.textContent =
        deck.name ||
        "Без названия";


      const count =
        document.createElement(
          "div"
        );


      count.className =
        "deck-card-count";

      count.textContent =
        `${deck.cards?.length || 0} карточек`;


      info.appendChild(
        title
      );

      info.appendChild(
        count
      );


      button.appendChild(
        icon
      );

      button.appendChild(
        info
      );


      button.addEventListener(
        "click",
        () => {

          openDeck(
            deck.id
          );

        }
      );


      deckList.appendChild(
        button
      );

    }
  );

}


/* =========================================================
   OPEN DECK
========================================================= */

function openDeck(deckId) {

  const deck =
    decks.find(
      item =>
        item.id === deckId
    );


  if (!deck) return;


  currentDeckId =
    deckId;


  deckHeroIcon.textContent =
    deck.icon ||
    "📚";


  deckHeroTitle.textContent =
    deck.name ||
    "Без названия";


  deckHeroCount.textContent =
    `${deck.cards?.length || 0} карточек`;


  deckContent.classList.add(
    "hidden"
  );


  contentDeckButton.textContent =
    "Карточки";


  renderDeckContent();


  showScreen(
    deckScreen
  );

}


/* =========================================================
   DECK CONTENT
========================================================= */

function renderDeckContent() {

  const deck =
    decks.find(
      item =>
        item.id === currentDeckId
    );


  if (!deck) return;


  deckContent.innerHTML =
    "";


  if (!deck.cards?.length) {

    deckContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h2>Нет карточек</h2>
        <p>
          Отредактируй колоду и добавь первую карточку.
        </p>
      </div>
    `;

    return;

  }


  deck.cards.forEach(
    (card, index) => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "content-card";


      const number =
        document.createElement(
          "div"
        );


      number.className =
        "content-card-number";

      number.textContent =
        `КАРТОЧКА ${index + 1}`;


      const front =
        document.createElement(
          "div"
        );


      front.className =
        "content-card-front";

      front.textContent =
        card.front ||
        "";


      const back =
        document.createElement(
          "div"
        );


      back.className =
        "content-card-back";

      back.textContent =
        card.back ||
        "";


      item.appendChild(
        number
      );

      item.appendChild(
        front
      );

      item.appendChild(
        back
      );


      deckContent.appendChild(
        item
      );

    }
  );

}


function toggleDeckContent() {

  const hidden =
    deckContent.classList.contains(
      "hidden"
    );


  if (hidden) {

    renderDeckContent();


    deckContent.classList.remove(
      "hidden"
    );


    contentDeckButton.textContent =
      "Скрыть карточки";

  } else {

    deckContent.classList.add(
      "hidden"
    );


    contentDeckButton.textContent =
      "Карточки";

  }

}


/* =========================================================
   CREATE / EDIT DECK
========================================================= */

function openCreateScreen(
  deckId = null
) {

  editingDeckId =
    deckId;


  newCardsList.innerHTML =
    "";


  if (deckId) {

    const deck =
      decks.find(
        item =>
          item.id === deckId
      );


    if (!deck) return;


    createTitle.textContent =
      "Редактировать колоду";


    deckNameInput.value =
      deck.name ||
      "";


    selectedDeckIcon =
      deck.icon ||
      "📚";


    updateIconSelection();


    if (
      Array.isArray(
        deck.cards
      )
    ) {

      deck.cards.forEach(
        card => {

          addCardEditor(
            card
          );

        }
      );

    }

  } else {

    createTitle.textContent =
      "Новая колода";


    deckNameInput.value =
      "";


    selectedDeckIcon =
      "📚";


    updateIconSelection();


    addCardEditor();

  }


  showScreen(
    createScreen
  );

}


/* =========================================================
   ICON
========================================================= */

function updateIconSelection() {

  document
    .querySelectorAll(
      ".icon-option"
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

}


/* =========================================================
   CARD EDITOR
========================================================= */

function addCardEditor(
  card = null
) {

  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.className =
    "card-editor";


  const header =
    document.createElement(
      "div"
    );


  header.className =
    "card-editor-header";


  const number =
    document.createElement(
      "div"
    );


  number.className =
    "card-number";


  number.textContent =
    `КАРТОЧКА ${newCardsList.children.length + 1}`;


  const deleteButton =
    document.createElement(
      "button"
    );


  deleteButton.type =
    "button";


  deleteButton.className =
    "delete-card-button";


  deleteButton.textContent =
    "×";


  deleteButton.addEventListener(
    "click",
    () => {

      wrapper.remove();

      renumberCards();

    }
  );


  header.appendChild(
    number
  );


  header.appendChild(
    deleteButton
  );


  /* =====================================
     FRONT TEXT
  ====================================== */

  const frontField =
    document.createElement(
      "div"
    );


  frontField.className =
    "card-editor-field";


  const frontLabel =
    document.createElement(
      "label"
    );


  frontLabel.textContent =
    "Лицевая сторона";


  const frontInput =
    document.createElement(
      "textarea"
    );


  frontInput.placeholder =
    "Что должно быть написано на лицевой стороне?";


  frontInput.value =
    card?.front ||
    "";


  frontField.appendChild(
    frontLabel
  );


  frontField.appendChild(
    frontInput
  );


  /* =====================================
     BACK TEXT
  ====================================== */

  const backField =
    document.createElement(
      "div"
    );


  backField.className =
    "card-editor-field";


  const backLabel =
    document.createElement(
      "label"
    );


  backLabel.textContent =
    "Обратная сторона";


  const backInput =
    document.createElement(
      "textarea"
    );


  backInput.placeholder =
    "Что должно быть написано на обратной стороне?";


  backInput.value =
    card?.back ||
    "";


  backField.appendChild(
    backLabel
  );


  backField.appendChild(
    backInput
  );


  /* =====================================
     IMAGE
  ====================================== */

  const imageField =
    document.createElement(
      "div"
    );


  imageField.className =
    "card-editor-field";


  const imageLabel =
    document.createElement(
      "label"
    );


  imageLabel.textContent =
    "Картинка на лицевой стороне";


  const imageActions =
    document.createElement(
      "div"
    );


  imageActions.className =
    "image-actions";


  const uploadButton =
    document.createElement(
      "button"
    );


  uploadButton.type =
    "button";


  uploadButton.className =
    "image-button";


  uploadButton.textContent =
    "📷 Добавить картинку";


  const removeButton =
    document.createElement(
      "button"
    );


  removeButton.type =
    "button";


  removeButton.className =
    "image-button";


  removeButton.textContent =
    "Удалить картинку";


  const fileInput =
    document.createElement(
      "input"
    );


  fileInput.type =
    "file";


  fileInput.accept =
    "image/*";


  fileInput.style.display =
    "none";


  const preview =
    document.createElement(
      "img"
    );


  preview.className =
    "image-preview hidden";


  let imageUrl =
    card?.imageUrl ||
    "";


  if (imageUrl) {

    preview.src =
      imageUrl;


    preview.classList.remove(
      "hidden"
    );

  }


  uploadButton.addEventListener(
    "click",
    () => {

      fileInput.click();

    }
  );


  fileInput.addEventListener(
    "change",
    async event => {

      const file =
        event.target.files?.[0];


      if (!file) return;


      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

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
          "Максимальный размер — 10 МБ."
        );

        return;

      }


      uploadButton.disabled =
        true;


      uploadButton.textContent =
        "Загрузка...";


      try {

        imageUrl =
          await uploadImage(
            file
          );


        preview.src =
          imageUrl;


        preview.classList.remove(
          "hidden"
        );


        showToast(
          "Картинка загружена."
        );


      } catch (error) {

        console.error(
          error
        );


        showToast(
          "Не удалось загрузить картинку."
        );

      } finally {

        uploadButton.disabled =
          false;


        uploadButton.textContent =
          "📷 Добавить картинку";


        fileInput.value =
          "";

      }

    }
  );


  removeButton.addEventListener(
    "click",
    () => {

      imageUrl =
        "";


      preview.removeAttribute(
        "src"
      );


      preview.classList.add(
        "hidden"
      );


      showToast(
        "Картинка удалена."
      );

    }
  );


  imageActions.appendChild(
    uploadButton
  );


  imageActions.appendChild(
    removeButton
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


  wrapper.appendChild(
    header
  );


  wrapper.appendChild(
    frontField
  );


  wrapper.appendChild(
    backField
  );


  wrapper.appendChild(
    imageField
  );


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

function renumberCards() {

  document
    .querySelectorAll(
      ".card-editor"
    )
    .forEach(
      (editor, index) => {

        const number =
          editor.querySelector(
            ".card-number"
          );


        if (number) {

          number.textContent =
            `КАРТОЧКА ${index + 1}`;

        }

      }
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
    .querySelectorAll(
      ".card-editor"
    )
    .forEach(
      editor => {

        if (
          typeof editor._getCardData ===
          "function"
        ) {

          cards.push(
            editor._getCardData()
          );

        }

      }
    );


  if (!cards.length) {

    showToast(
      "Добавьте хотя бы одну карточку."
    );

    return;

  }


  for (
    const card
    of cards
  ) {

    if (!card.front) {

      showToast(
        "Заполните лицевую сторону."
      );

      return;

    }


    if (!card.back) {

      showToast(
        "Заполните обратную сторону."
      );

      return;

    }

  }


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


  setTimeout(
    () => {

      if (editingDeckId) {

        openDeck(
          editingDeckId
        );

      } else {

        showScreen(
          homeScreen
        );

      }

    },
    250
  );

}


/* =========================================================
   SUPABASE IMAGE
========================================================= */

async function uploadImage(
  file
) {

  if (!supabaseClient) {

    throw new Error(
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

    console.error(
      "Supabase upload:",
      result.error
    );

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
    !publicResult.data?.publicUrl
  ) {

    throw new Error(
      "Не удалось получить URL картинки."
    );

  }


  return publicResult
    .data
    .publicUrl;

}


/* =========================================================
   STUDY
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
      "В этой колоде нет карточек."
    );

    return;

  }


  currentStudyCards =
    [...deck.cards];


  currentStudyIndex =
    0;


  studyDeckName.textContent =
    deck.name;


  renderStudyCard();


  showScreen(
    studyScreen
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
      ? (
          current /
          total
        ) * 100
      : 0;


  studyProgressBar.style.width =
    `${progress}%`;


  /*
    ЛИЦЕВАЯ СТОРОНА:
    - картинка
    - текст

    ОБРАТНАЯ СТОРОНА:
    - только текст
  */


  studyFrontText.textContent =
    card.front ||
    "";


  studyBackText.textContent =
    card.back ||
    "";


  renderFrontImage(
    card.imageUrl
  );


  prevButton.disabled =
    currentStudyIndex <= 0;


  nextButton.disabled =
    currentStudyIndex >=
    total - 1;

}


/* =========================================================
   FRONT IMAGE
========================================================= */

function renderFrontImage(
  imageUrl
) {

  if (imageUrl) {

    studyFrontImage.style.backgroundImage =
      `url("${imageUrl}")`;


    studyFrontImage.classList.remove(
      "hidden"
    );


    studyFrontPlaceholder.classList.add(
      "hidden"
    );

  } else {

    studyFrontImage.style.backgroundImage =
      "";


    studyFrontImage.classList.add(
      "hidden"
    );


    studyFrontPlaceholder.classList.remove(
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

  if (
    currentStudyIndex <= 0
  ) {

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
   DELETE DECK
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

  pendingDeleteDeckId =
    null;


  deleteModal.classList.add(
    "hidden"
  );

}


function confirmDeleteDeck() {

  if (
    !pendingDeleteDeckId
  ) {

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


  currentDeckId =
    null;


  renderDeckList();


  showScreen(
    homeScreen
  );


  showToast(
    "Колода удалена."
  );

}


/* =========================================================
   NAVIGATION
========================================================= */

function goHome() {

  currentDeckId =
    null;


  showScreen(
    homeScreen
  );


  renderDeckList();

}


function goBackFromCreate() {

  if (editingDeckId) {

    openDeck(
      editingDeckId
    );

  } else {

    showScreen(
      homeScreen
    );

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
      active.tagName ===
        "INPUT" ||
      active.tagName ===
        "TEXTAREA"
    )
  ) {

    active.blur();

  }

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {


  /* CREATE */

  createDeckButton.addEventListener(
    "click",
    () => {

      openCreateScreen();

    }
  );


  createBackButton.addEventListener(
    "click",
    goBackFromCreate
  );


  addCardButton.addEventListener(
    "click",
    () => {

      addCardEditor();

      renumberCards();

    }
  );


  saveDeckButton.addEventListener(
    "click",
    saveCurrentDeck
  );


  /* ICON */

  document
    .querySelectorAll(
      ".icon-option"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            selectedDeckIcon =
              button.dataset.icon;

            updateIconSelection();

          }
        );

      }
    );


  /* DECK */

  deckBackButton.addEventListener(
    "click",
    goHome
  );


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


  /* STUDY */

  studyBackButton.addEventListener(
    "click",
    () => {

      openDeck(
        currentDeckId
      );

    }
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


  /* DELETE */

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


  /* KEYBOARD */

  document.addEventListener(
    "pointerdown",
    event => {

      const target =
        event.target;


      if (
        target.closest(
          "input"
        ) ||
        target.closest(
          "textarea"
        )
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
