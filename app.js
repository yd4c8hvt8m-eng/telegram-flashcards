// ==========================================
// TELEGRAM
// ==========================================

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();


// ==========================================
// КАРТОЧКИ
// ==========================================

const cards = [

    {
        image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
        front: "\u042f \u0438\u0434\u0443 \u0434\u043e\u043c\u043e\u0439",
        back: "I'm going home"
    },

    {
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
        front: "\u041c\u043d\u0435 \u043d\u0443\u0436\u043d\u0430 \u043f\u043e\u043c\u043e\u0449\u044c",
        back: "I need help"
    },

    {
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        front: "\u0413\u0434\u0435 \u043d\u0430\u0445\u043e\u0434\u0438\u0442\u0441\u044f \u043c\u0430\u0433\u0430\u0437\u0438\u043d?",
        back: "Where is the shop?"
    },

    {
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
        front: "\u042f \u043d\u0435 \u043f\u043e\u043d\u0438\u043c\u0430\u044e",
        back: "I don't understand"
    },

    {
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
        front: "\u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u043d\u0430\u0447\u043d\u0435\u043c",
        back: "Let's start"
    },

    {
        image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=800&q=80",
        front: "\u042f \u0445\u043e\u0447\u0443 \u0437\u0430\u043a\u0430\u0437\u0430\u0442\u044c",
        back: "I want to order"
    },

    {
        image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80",
        front: "\u041a\u0430\u043a\u0430\u044f \u0441\u0435\u0433\u043e\u0434\u043d\u044f \u043f\u043e\u0433\u043e\u0434\u0430?",
        back: "What's the weather like today?"
    },

    {
        image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80",
        front: "\u0414\u043e \u0432\u0441\u0442\u0440\u0435\u0447\u0438",
        back: "See you"
    },

    {
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        front: "\u0427\u0442\u043e \u044d\u0442\u043e \u0437\u043d\u0430\u0447\u0438\u0442?",
        back: "What does it mean?"
    },

    {
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        front: "\u041c\u043e\u0436\u043d\u043e \u0441\u0447\u0435\u0442, \u043f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430?",
        back: "Can I have the bill, please?"
    }

];


// ==========================================
// СОСТОЯНИЕ
// ==========================================

let currentCard = 0;

let knownCards = [];

let unknownCards = [];


// ==========================================
// ЭЛЕМЕНТЫ
// ==========================================

const card = document.getElementById("card");

const frontText = document.getElementById("frontText");

const backText = document.getElementById("backText");

const cardImage = document.getElementById("cardImage");

const cardImageBack = document.getElementById("cardImageBack");

const progress = document.getElementById("progress");


// ==========================================
// ПОКАЗАТЬ КАРТОЧКУ
// ==========================================

function showCard() {

    const item = cards[currentCard];

    card.classList.remove("flipped");

    frontText.textContent = item.front;

    backText.textContent = item.back;

    cardImage.src = item.image;

    cardImageBack.src = item.image;

    progress.textContent =
        `${currentCard + 1} / ${cards.length}`;
}


// ==========================================
// ПЕРЕВОРОТ
// ==========================================

card.addEventListener("click", function () {

    card.classList.toggle("flipped");

});


// ==========================================
// ОТВЕТ
// ==========================================

function answer(known) {

    if (known) {

        knownCards.push(currentCard);

        if (tg.HapticFeedback) {

            tg.HapticFeedback.notificationOccurred("success");

        }

    } else {

        unknownCards.push(currentCard);

        if (tg.HapticFeedback) {

            tg.HapticFeedback.notificationOccurred("error");

        }

    }

    nextCard();
}


// ==========================================
// СЛЕДУЮЩАЯ КАРТОЧКА
// ==========================================

function nextCard() {

    currentCard++;

    if (currentCard >= cards.length) {

        finishLesson();

        return;

    }

    showCard();
}


// ==========================================
// КОНЕЦ УРОКА
// ==========================================

function finishLesson() {

    const total = cards.length;

    const known = knownCards.length;

    const percent =
        Math.round((known / total) * 100);

    alert(
        "\u0423\u0440\u043e\u043a \u0437\u0430\u043a\u043e\u043d\u0447\u0435\u043d!\n\n" +
        "\u0417\u043d\u0430\u0435\u0442\u0435: " +
        known +
        " \u0438\u0437 " +
        total +
        "\n\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442: " +
        percent +
        "%"
    );

    currentCard = 0;

    knownCards = [];

    unknownCards = [];

    showCard();
}


// ==========================================
// ЗАПУСК
// ==========================================

showCard();
