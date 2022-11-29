$('.chat-button').on('click', function () {
    $('.chat-button').css({ "display": "none" });

    $('.chat-box').css({ "visibility": "visible" });
});

$('.chat-box .chat-box-header p').on('click', function () {
    $('.chat-button').css({ "display": "block" });
    $('.chat-box').css({ "visibility": "hidden" });
})

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


let exit = false;

document.getElementById("mic").onclick = async () => {
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
    let synth = window.speechSynthesis;
    let utterThis = new SpeechSynthesisUtterance();
    utterThis.voice = speechSynthesis.getVoices()[0];

    if (document.getElementById("mic").classList.contains("fa-microphone")) {
        document.getElementById("mic").classList.remove("fa-microphone");
        document.getElementById("mic").classList.add("fa-microphone-slash");
        if (first) {
            first = false;
            utterThis.text = "Wat voor product wil je kopen?";
            synth.speak(utterThis);
            createChatBotMessage(utterThis.text);
        }
        recognition.start();

    }
    else {
        document.getElementById("mic").classList.remove("fa-microphone-slash");
        document.getElementById("mic").classList.add("fa-microphone");
        exit = true;
        recognition.stop();

    }

    recognition.onresult = function (event) {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        appendUserMessage(speechResult);
        // response.value = response.value + "\n" + speechResult;

        let splitText = speechResult.split(" ");
        for (let j = 0; j < splitText.length; j++) {

            if (speechResult.includes(products[splitText[j]]) && apiCall.product == "") {
                apiCall.product = products[splitText[j]];
                utterThis.text = "Super goed! Welke maat wil je?";
                createChatBotMessage(utterThis.text);
                synth.speak(utterThis);
            }

            if (splitText.includes(sizes[splitText[j]]) && apiCall.product != "") {
                // Make the api call with size and product and check if it is available and
                // if it is available then ask for color
                utterThis.text =
                    `We hebben 4 producten gevonden, welke kleur vind jij mooi? We hebben gele en paarse ${apiCall.product}.`
                apiCall.size = sizes[splitText[j]];
                createChatBotMessage(utterThis.text);
                synth.speak(utterThis);
            }

            if (speechResult.includes(colors[splitText[j]]) && apiCall.size != "" && apiCall.product !=
                "") {
                utterThis.text = "We hebben deze gevonden! Wil je naar de product pagina gaan?"
                apiCall.color = "purple";
                createChatBotMessage(utterThis.text);
                synth.speak(utterThis);
            }

            if (speechResult.includes("yes") && apiCall.size != "" && apiCall.product != "" && apiCall
                .color != "") {
                // Move to product page exit code follows
                utterThis.text = "Top! Ik breng je naar de productpagina."
                createChatBotMessage(utterThis.text);

                synth.speak(utterThis);

                recognition.stop();

            }

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

};