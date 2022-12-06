
let exit = false;
let synth = window.speechSynthesis;
let utterThis = new SpeechSynthesisUtterance();
utterThis.voice = speechSynthesis.getVoices()[0];

let response = document.getElementById("result-text");
let first = true;
// Hier kunnen we de variabelen updaten. Ik heb de variabelen opgedeeld in 3 arrays
let apiCall = {
    "producten": "",
    "maten": "",
    "kleuren": "",
}
let producten = {
    "t-shirts": 't-shirts',
    "shirts": 'shirts',
    "jeans": 'jeans',
    "broek": 'broek',
    "schoenen": 'schoenen',
    "spijkerbroeken": 'spijkerbroeken',
    "trainingspakken": 'trainingspakken',
}

let maten = {
    "klein": 'klein',
    "small": 'small',
    "medium": 'medium',
    "groot": 'groot',
    "extra-groot": 'extra-groot',
    "XL": 'XL',
    "large": 'large',
}

let kleuren = {
    "rood": 'rood',
    "blauw": 'blauw',
    "groen": 'groen',
    "geel": 'geel',
    "paars": 'paars',
    "lila": 'lila',
}

let kleurenList = [
    "rood",
    "blauw",
    "groen",
    "geel",
    "paars",
    "lila",
]
let matenList = [
    "klein",
    "small",
    "medium",
    "groot",
    "extra-groot",
    "XL",
    "large",
]

let altTekstenProductAfbeeldingen = [
    // Change one two three into Dutch 
    "1 - Active Sport Legging: De Dolly Sportsleggings zijn gesneden uit een hoogwaardige Italiaanse sportstof en hebben een glanzende afwerking voor de ultieme 80's look. Dit high-rise paar heeft een brede tailleband die de kern gladstrijkt en ondersteunt. Draag ze met de Dolly Sports BH en sneakers. Je kunt echt gaan sporten maar ook de legging rocken voor een actieve dag. Het model draagt maat extra small en is 1m70.",
    "2 - Nylon Sports Sweater: Deze nylon sporttrui wordt je nieuwe favoriete item tijdens het stelen van de show tijdens een workout buiten of tijdens een drankje. Sportief en layback qua pasvorm, stijlvol qua uiterlijk, met ons DS logo op de borst en Dolly logo op de rug. Een verborgen zak is toegevoegd in de zijnaad om je waardevolle spullen te bewaren tijdens de training. Combineer met de Classic trackpants of de Active Sportslegging. Het model draagt maat small en is 1m77.",
    "3 - Team Dolly Trackpants: De DS joggingbroek is een klassieker in je garderobe. Draag hem thuis, naar de sportschool of in de stad. Voorzien van heupzakken, DS-borduursel en een elastische tailleband met een flexibel trekkoord voor een comfortabele pasvorm. Combineer hem met het DS sweatshirt voor de volledige Dolly-look of mix hem. Rol de broekspijpen op als de lengte te lang is of combineer hem met onze DS-sokken. Dit kledingstuk is geverfd waardoor het na verloop van tijd een verwassen, vintage look krijgt. Het model is 1,75 en draagt maat S. 100% katoen, binnenstebuiten wassen op max 40 graden, niet strijken, lage temperatuur drogen. Dit is een limited edition en wordt binnen 48 uur naar u verzonden. Omdat we een limited edition merk zijn hebben we geen voorraad. Daarom kunnen we niet altijd een omruiling in maat of kleur honoreren.",

]
let productKeys = {
    "een": "een",
    "twee": "twee",
    "drie": "drie",
    "four": "four",
    "five": "five",
    "six": "six",
}
let textToNumber = {
    // Change one two three into Dutch 

    "een": altTekstenProductAfbeeldingen[0],
    "twee": altTekstenProductAfbeeldingen[1],
    "drie": altTekstenProductAfbeeldingen[2],


}

function createChatBotMessage(message) {
    let messageElement = document.createElement("div");
    messageElement.classList.add("chat-box-body-send");
    let Textmessage = document.createElement("p");
    Textmessage.innerHTML = message;

    messageElement.appendChild(Textmessage);
    let chatBox = document.querySelector(".chat-box-body");
    chatBox.appendChild(messageElement);
}

function appendUserMessage(message) {
    let messageElement = document.createElement("div");
    messageElement.classList.add("chat-box-body-receive");
    let Textmessage = document.createElement("p");
    Textmessage.innerHTML = message;

    messageElement.appendChild(Textmessage);
    let chatBox = document.querySelector(".chat-box-body");
    chatBox.appendChild(messageElement);
}

function welcomeMessage() {

    setTimeout(async () => {
        utterThis.text = "Hallo daar! Wij zijn Team Dolly en wij laten je elke dag als een trofee schijnen! Klik op de tab toets om te starten";
        await speak(utterThis).then(() => {
            document.getElementsByClassName('chat-button')[0].click();

        });
    }, 100);

}


let isListening = false;
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'nl-NL';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let filterBy = {
    "size": false,
    "color": false,
}
let productFound = false;
let isSpeaking = false;
let isSelectingProduct = false;
let isSelectingColor = false;
let isSelectingSize = false;

async function speak(text) {
    isSpeaking = true;
    console.log(text.text);
    utterThis.text = text.text;
    synth.speak(utterThis);
    utterThis.onstart = function (event) {
        console.log("Started speaking");
    }
    return new Promise(resolve => {
        utterThis.onend = () => {
            synth.cancel();
            isSpeaking = false;
            return resolve();
        };

    });
}

async function startSpeechRecognition() {
    recognition.start();
    recognition.onresult = async function (event) {

        const speechResult = event.results[0][0].transcript.toLowerCase();
        appendUserMessage(speechResult);
        // response.value = response.value + "\n" + speechResult;

        let splitText = speechResult.split(" ");
        let matchFound = false;

        for (let j = 0; j < splitText.length; j++) {



            if (!isSelectingSize && splitText.includes('sizes') || splitText.includes('opmaat') || splitText.includes('maten')) {
                console.log("IsSelecting Size " + isSelectingSize);
                utterThis.text =
                    `Welke maat heb normaal? ${matenList.toString()}`;
                apiCall.maten = maten[splitText[j]];
                createChatBotMessage(utterThis.text);
                recognition.stop();
                await speak(utterThis);
                matchFound = true;
                filterBy.size = true;
                isSelectingSize = true;
            }

            if (splitText.includes(maten[splitText[j]]) && filterBy.size == true) {
                // List the products
                utterThis.text = `We hebben ${altTekstenProductAfbeeldingen.length} producten voor je gevonden.`;
                createChatBotMessage(utterThis.text);
                await speak(utterThis);

                for (let i = 0; i < altTekstenProductAfbeeldingen.length; i++) {
                    utterThis.text = altTekstenProductAfbeeldingen[i];
                    createChatBotMessage(utterThis.text);
                    await speak(utterThis);
                }

                utterThis.text = `Welk product nummer wil je bekijken?`;
                createChatBotMessage(utterThis.text);
                await speak(utterThis);
                apiCall.maten = maten[splitText[j]];
                matchFound = true;
                productFound = true;
            }

            if (!isSelectingColor && speechResult.includes("kleuren") || speechResult.includes("kleur") || speechResult.includes("color")) {
                console.log("IsSelecting Color " + isSelectingColor);
                utterThis.text = `Wij hebben deze mooie kleuren: ${kleurenList.toString()} ! Welke is voor jou?`;
                createChatBotMessage(utterThis.text);
                recognition.stop();
                await speak(utterThis);
                filterBy.color = true;
                console.log("Setting filterBy.color to true");
                matchFound = true;
            }
            if (speechResult.includes(kleuren[splitText[j]]) && filterBy.color == true) {
                // List the products
                utterThis.text = `We hebben ${altTekstenProductAfbeeldingen.length} producten voor je gevonden.`;
                createChatBotMessage(utterThis.text);
                await speak(utterThis);

                for (let i = 0; i < altTekstenProductAfbeeldingen.length; i++) {
                    utterThis.text = altTekstenProductAfbeeldingen[i];
                    createChatBotMessage(utterThis.text);
                    await speak(utterThis);
                }

                utterThis.text = `Welk product nummer wil je bekijken?`;
                createChatBotMessage(utterThis.text);
                await speak(utterThis);
                apiCall.kleuren = kleuren[splitText[j]];
                matchFound = true;
                productFound = true;


            }
            console.log("productFound: " + textToNumber[splitText[j]], splitText[j]);

            if (speechResult.includes(productKeys[splitText[j]]) || altTekstenProductAfbeeldingen.includes(splitText) && productFound == true) {
                utterThis.text = "Top! Wil je naar de productpagina?"
                createChatBotMessage(utterThis.text);
                await speak(utterThis);
                recognition.stop();
                matchFound = true;
            }
            if (speechResult.includes("yes") || speechResult.includes("ja") && (apiCall
                .kleuren != "" || apiCall.maten != "")) {
                // Move to product page exit code follows
                // This code only runs if product, size and color is selected by user and the item is available
                utterThis.text = "Top! Ik breng je naar de productpagina."
                createChatBotMessage(utterThis.text);
                await speak(utterThis);
                recognition.stop();
                exit = true;
                matchFound = true;
                window.open('https://www.dollysports.com/products/nylon-sports-sweater-2', '_blank');
            }

        }
        if (!matchFound) {
            utterThis.text = "Dat heb ik niet verstaan, kun je het alsjeblieft nog een keer zeggen."
            createChatBotMessage(utterThis.text);
            await speak(utterThis);
            matchFound = false;
        }
    }

    recognition.onspeechend = function () {
        recognition.stop();
        document.getElementById("mic").classList.add("fa-microphone-slash");
        document.getElementById("mic").classList.remove("fa-microphone");
        isListening = false;
    }

    recognition.onerror = function (event) {

    }
}

$('.chat-button').on('click', async function () {
    $('.chat-button').css({ "display": "none" });
    $('.chat-box').css({ "visibility": "visible" });
    setTimeout(() => {
        document.getElementsByClassName('btn-mic')[0].focus();
    }, 1000);
    // utterThis.text = "Hallo! Welkom bij Dolly Sports. Hoe kunnen we je vandaag helpen?";
    // createChatBotMessage(utterThis.text);
    // await speak(utterThis).then(async () => {


    // });
    utterThis.text = "Zou je op maat of kleur naar je favoriete product willen zoeken?";
    createChatBotMessage(utterThis.text);
    await speak(utterThis).then(() => {
        isListening = true;
        startSpeechRecognition();
    });

});

document.getElementById("mic").onclick = async () => {
    if (isSpeaking) return;
    if (isListening) {
        if (document.getElementById("mic").classList.contains("fa-microphone")) {
            document.getElementById("mic").classList.remove("fa-microphone");
            document.getElementById("mic").classList.add("fa-microphone-slash");
            isListening = true;
            console.log("Setting true");
            recognition.stop();
        }

    }
    else {
        if (document.getElementById("mic").classList.contains("fa-microphone-slash")) {
            document.getElementById("mic").classList.remove("fa-microphone-slash");
            document.getElementById("mic").classList.add("fa-microphone");
            isListening = false;
            console.log("Setting false");
            recognition.start();
        }
    }
};
$('.chat-box .chat-box-header p').on('click', function () {
    if (isSpeaking) return;
    $('.chat-button').css({ "display": "block" });
    $('.chat-box').css({ "visibility": "hidden" });
    $('.chat-box-body').empty();
    recognition.stop();
})
document.onkeypress = function (e) {
    if (isSpeaking) return;
    e = e || window.event;
    if (e.keyCode == 32) {
        document.getElementById("mic").click();
    }
}
