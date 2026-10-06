const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const cards = [
    {
        image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
        front: "Я иду домой",
        back: "I'm going home"
    },
    {
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
        front: "Мне нужна помощь",
        back: "I need help"
    },
    {
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        front: "Где находится магазин?",
        back: "Where is the shop?"
    },
    {
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
        front: "Я не понимаю",
        back: "I don't understand"
    },
    {
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
        front: "Давайте начнем",
        back: "Let's start"
    },
    {
        image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=800&q=80",
        front: "Я хочу заказать",
        back: "I want to order"
    },
    {
        image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80",
        front: "Какая сегодня погода?",
        back: "What's the weather like today?"
    },
    {
        image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80",
        front: "До встречи",
        back: "See you"
    },
    {
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        front: "Что это значит?",
        back: "What does it mean?"
    },
    {
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        front: "Можно счет, пожалуйста?",
        back: "Can I have the bill, please?"
    }
];

let currentCard = 0;
let knownCards = [];
let unknownCards = [];

const card = document.getElementById("card");
const frontText = document.getElementById("frontText");
const backText = document.getElementById("backText");
const cardImage = document.getElementById("cardImage");
const cardImageBack = document.getElementById("cardImageBack");
const progress = document.getElementById("progress");

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

card.addEventListener("click", function () {

    card.classList.toggle("flipped");

});

function answer(known) {

    if (known) {

        knownCards.push(currentCard);

        tg.HapticFeedback.notificationOccurred("success");

    } else {

        unknownCards.push(currentCard);

        tg.HapticFeedback.notificationOccurred("error");

    }

    nextCard();
}

function nextCard() {

    currentCard++;

    if (currentCard >= cards.length) {

        finishLesson();

        return;
    }

    showCard();
}

function finishLesson() {

    const total = cards.length;

    const known = knownCards.length;

    const percent =
        Math.round((known / total) * 100);

    alert(
        `Урок закончен!\n\n` +
        `Знаете: ${known} из ${total}\n` +
        `Результат: ${percent}%`
    );

    currentCard = 0;

    knownCards = [];

    unknownCards = [];

    showCard();
}

showCard();
