// Predefined responses
const botResponses = {
    "hello": ["Hi there!", "Hello! How can I assist you?", "Hey!"],
    "how are you": ["I'm great! How about you?", "I'm just a bot, but I'm good!"],
    "what is your name": ["I'm a chatbot created using JavaScript!", "Call me ChatBot."],
    "bye": ["Goodbye!", "See you later!", "Take care!"],
    "default": ["I'm sorry, I don't understand.", "Can you rephrase that?", "I'm still learning!"]
};

// Function to get a random response from the bot
function getRandomResponse(key) {
    let responses = botResponses[key] || botResponses["default"];
    return Array.isArray(responses) ? responses[Math.floor(Math.random() * responses.length)] : responses;
}

// Function to send and display messages
function sendMessage() {
    let userInput = document.getElementById("user-input").value.toLowerCase().trim();
    if (!userInput) return;

    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<p class="message user"><strong>You:</strong> ${userInput}</p>`;

    let botReply = getRandomResponse("default");

    for (let key in botResponses) {
        if (userInput.includes(key)) {
            botReply = getRandomResponse(key);
            break;
        }
    }

    setTimeout(() => {
        chatBox.innerHTML += `<p class="message bot"><strong>Bot:</strong> ${botReply}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;

        // Use the Web Speech API to convert text to speech
        speak(botReply);
    }, 500);

    document.getElementById("user-input").value = "";
}

// Function to handle Enter key press
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Function to speak text using the Web Speech API
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US"; // You can change this for other languages
    speech.volume = 1;     // Volume: 0.0 (silent) to 1.0 (loudest)
    speech.rate = 1;       // Rate: 0.1 (slow) to 10 (fast)
    speech.pitch = 1;      // Pitch: 0 (low) to 2 (high)

    window.speechSynthesis.speak(speech);
}

// Function to start listening for voice input
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    // Check if recognition is available in the browser
    if (!recognition) {
        alert("Speech Recognition is not supported by your browser.");
        return;
    }

    recognition.lang = "en-US"; // You can change this for other languages
    recognition.interimResults = false; // To avoid intermediate results
    recognition.maxAlternatives = 1;

    // Start listening for speech input
    recognition.start();
    console.log("Voice recognition started...");

    recognition.onstart = function() {
        console.log("Speech recognition service has started.");
    };

    recognition.onresult = function(event) {
        let userInput = event.results[0][0].transcript.toLowerCase();
        console.log("You said: ", userInput); // Log the recognized speech

        // Display user's voice input in chat
        let chatBox = document.getElementById("chat-box");
        chatBox.innerHTML += `<p class="message user"><strong>You:</strong> ${userInput}</p>`;

        // Get bot's response
        let botReply = getRandomResponse("default");
        for (let key in botResponses) {
            if (userInput.includes(key)) {
                botReply = getRandomResponse(key);
                break;
            }
        }

        setTimeout(() => {
            chatBox.innerHTML += `<p class="message bot"><strong>Bot:</strong> ${botReply}</p>`;
            chatBox.scrollTop = chatBox.scrollHeight;

            // Use TTS to speak the response
            speak(botReply);
        }, 500);
    };

    recognition.onerror = function(event) {
        console.error("Speech Recognition Error: ", event.error);
        alert("Error occurred in speech recognition: " + event.error);
    };

    recognition.onend = function() {
        console.log("Speech recognition ended.");
    };
}

// Function to simulate a microphone button click to start voice recognition
function simulateMicAction() {
    startVoiceRecognition(); // Trigger the speech recognition when mic button is clicked
}
