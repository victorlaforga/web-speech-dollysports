# simple-speech-recognition

### Mozilla Web Speech API

[https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)

Voor de chatbot heb ik gebruik gemaakt van de WebSpeech API van mozilla. Voor het bouwen van mijn chatbot zijn twee engines nodig zoals ik eerder beschreef in mijn concepten. De eerste is speech to text, dit wil zeggen dat er geluid wordt ingesproken en dit vervolgens naar text omgezet moet worden zodat het apparaat kan weten wat er gezegd is. Op basis daarvan kunnen we bepaalde arrays maken met keywords die dan herkend worden. Hierdoor kunnen we een beetje dynamiek brengen in het project. De tweede engine is text to speech, hiermee wordt het antwoord (de output) omgezet in speech zodat mijn doelgroep die kan verstaan. 

Deze API biedt twee soorten functionaliteiten aan: spraakherkenning en spraaksynthese, die dus ook zoals beschreven, interessante mogelijkheden bieden voor zowel toegankelijkheid als control mechanisme.