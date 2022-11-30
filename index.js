$('.chat-box .chat-box-header p').on('click', function () {
    $('.chat-button').css({ "display": "block" });
    $('.chat-box').css({ "visibility": "hidden" });
})
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

let altTekstenProductAfbeeldingen = {
    "product1": '',
    "product2": '',
    "product3": '',

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
        synth.speak(utterThis);
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
function startSpeechRecognition() {
    recognition.start();
    recognition.onresult = function (event) {

        const speechResult = event.results[0][0].transcript.toLowerCase();
        appendUserMessage(speechResult);
        // response.value = response.value + "\n" + speechResult;

        let splitText = speechResult.split(" ");
        let matchFound = false;

        for (let j = 0; j < splitText.length; j++) {

            if (speechResult.includes(producten[splitText[j]])) {
                // We can make API call to check if the product is available or not

                if (apiCall.producten == '') {

                    apiCall.producten = producten[splitText[j]];
                    utterThis.text = "Super goed! Welke maat wil je?";
                    createChatBotMessage(utterThis.text);
                    synth.speak(utterThis);
                    matchFound = true;
                }

            }

            if (splitText.includes(maten[splitText[j]]) && apiCall.producten != "") {
                // Make the api call with size and product and check if it is available and
                // This code only runs when product is selected by user
                // We can make API call to check if the product is available or not
                if (apiCall.maten == '') {

                    utterThis.text =
                        `We hebben 4 producten gevonden, welke kleur vind jij mooi? We hebben gele en paarse ${apiCall.producten}.`
                    apiCall.maten = maten[splitText[j]];
                    createChatBotMessage(utterThis.text);
                    synth.speak(utterThis);
                    matchFound = true;
                }


            }

            if (speechResult.includes(kleuren[splitText[j]]) && apiCall.maten != "" && apiCall.producten !=
                "") {
                // This code only runs if product and size is selected by user
                if (apiCall.kleuren == '') {
                    utterThis.text = "We hebben deze gevonden! Wil je naar de product pagina gaan?"
                    apiCall.kleuren = kleuren[splitText[j]];
                    createChatBotMessage(utterThis.text);
                    synth.speak(utterThis);
                    matchFound = true;

                }

            }

            if (speechResult.includes("yes") || speechResult.includes("ja") && apiCall.size != "" && apiCall.producten != "" && apiCall
                .kleuren != "") {
                // Move to product page exit code follows
                // This code only runs if product, size and color is selected by user and the item is available
                utterThis.text = "Top! Ik breng je naar de productpagina."
                createChatBotMessage(utterThis.text);
                synth.speak(utterThis);
                recognition.stop();
                exit = true;
                matchFound = true;
                window.open('https://www.dollysports.com/products/nylon-sports-sweater-2', '_blank');
            }



        }
        if (!matchFound) {
            utterThis.text = "Dat heb ik niet verstaan, kun je het alsjeblieft nog een keer zeggen."
            createChatBotMessage(utterThis.text);
            synth.speak(utterThis);
            matchFound = false;
        }
    }

    recognition.onspeechend = function () {
        recognition.stop();
        if (exit !== true) {
            setTimeout(() => {
                recognition.start();
            }, 1000);
        }
    }

    recognition.onerror = function (event) {
        if (exit !== true) {
            setTimeout(() => {
                recognition.start();
            }, 1000);
        }
        else {
            recognition.stop();
        }
    }
}
$('.chat-button').on('click', function () {
    $('.chat-button').css({ "display": "none" });
    isListening = true;
    setTimeout(async () => {
        startSpeechRecognition();
    }, 5000);
    utterThis.text = "Hallo! Welkom bij Dolly Sports. Hoe kunnen we je vandaag helpen?";
    synth.speak(utterThis);
    createChatBotMessage(utterThis.text);
    utterThis.text = "Wat voor product wil je kopen?";
    synth.speak(utterThis);
    createChatBotMessage(utterThis.text);
    $('.chat-box').css({ "visibility": "visible" });
});


document.getElementById("mic").onclick = async () => {
    if (isListening) {
        if (document.getElementById("mic").classList.contains("fa-microphone")) {
            document.getElementById("mic").classList.remove("fa-microphone");
            document.getElementById("mic").classList.add("fa-microphone-slash");
            isListening = false;
            console.log("Setting true");
            recognition.stop();
        }

    }
    else {
        if (document.getElementById("mic").classList.contains("fa-microphone-slash")) {
            document.getElementById("mic").classList.remove("fa-microphone-slash");
            document.getElementById("mic").classList.add("fa-microphone");
            isListening = true;
            console.log("Setting false");
            recognition.start();
        }
    }
};


