// ===============================
// ELEMENTS
// ===============================

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const transcript = document.getElementById("transcript");
const language = document.getElementById("language");

const wordCount = document.getElementById("wordCount");

const statusText = document.getElementById("statusText");
const statusDot = document.getElementById("statusDot");

const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");


// ===============================
// SPEECH RECOGNITION
// ===============================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (!SpeechRecognition) {

    alert(
        "Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
    );

    startBtn.disabled = true;

} else {

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.lang = language.value;


    let finalTranscript = "";


    // ===============================
    // LANGUAGE CHANGE
    // ===============================

    language.addEventListener("change", () => {

        recognition.lang = language.value;

        if (isRecording) {

            recognition.stop();

        }

    });


    // ===============================
    // START RECORDING
    // ===============================

    let isRecording = false;


    startBtn.addEventListener("click", () => {

        finalTranscript = transcript.value;

        recognition.lang = language.value;

        recognition.start();

        isRecording = true;

        startBtn.disabled = true;
        stopBtn.disabled = false;

        startBtn.classList.add("recording");

        startBtn.innerHTML = "🔴 Recording...";

        statusText.textContent = "Listening";

        statusDot.style.background = "#ef4444";

    });


    // ===============================
    // SPEECH RESULT
    // ===============================

    recognition.onresult = (event) => {

        let interimTranscript = "";


        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const result = event.results[i];

            const text = result[0].transcript;


            if (result.isFinal) {

                finalTranscript += text + " ";

            } else {

                interimTranscript += text;

            }

        }


        transcript.value =
            finalTranscript + interimTranscript;


        updateWordCount();

    };


    // ===============================
    // STOP RECORDING
    // ===============================

    stopBtn.addEventListener("click", () => {

        recognition.stop();

    });


    // ===============================
    // RECOGNITION END
    // ===============================

    recognition.onend = () => {

        isRecording = false;

        startBtn.disabled = false;
        stopBtn.disabled = true;

        startBtn.classList.remove("recording");

        startBtn.innerHTML = "🎙️ Start Recording";

        statusText.textContent = "Ready";

        statusDot.style.background = "#22c55e";

    };


    // ===============================
    // ERROR HANDLING
    // ===============================

    recognition.onerror = (event) => {

        console.error(
            "Speech recognition error:",
            event.error
        );


        if (event.error === "not-allowed") {

            alert(
                "Microphone permission was denied. Please allow microphone access in your browser."
            );

        } else if (event.error === "no-speech") {

            statusText.textContent =
                "No speech detected";

        } else {

            statusText.textContent =
                "Recognition error";

        }

    };

}


// ===============================
// WORD COUNTER
// ===============================

function updateWordCount() {

    const text = transcript.value.trim();


    if (text === "") {

        wordCount.textContent = "0";

        return;

    }


    const words = text.split(/\s+/);

    wordCount.textContent = words.length;

}


// Update count when user manually types
transcript.addEventListener(
    "input",
    updateWordCount
);


// ===============================
// COPY BUTTON
// ===============================

copyBtn.addEventListener("click", async () => {

    const text = transcript.value.trim();


    if (text === "") {

        alert("There is no text to copy.");

        return;

    }


    try {

        await navigator.clipboard.writeText(text);

        copyBtn.textContent = "✅ Copied!";


        setTimeout(() => {

            copyBtn.textContent = "📋 Copy";

        }, 1500);

    } catch (error) {

        alert(
            "Unable to copy the text."
        );

    }

});


// ===============================
// CLEAR BUTTON
// ===============================

clearBtn.addEventListener("click", () => {

    transcript.value = "";

    updateWordCount();

});


// ===============================
// DOWNLOAD BUTTON
// ===============================

downloadBtn.addEventListener("click", () => {

    const text = transcript.value.trim();


    if (text === "") {

        alert(
            "There is no transcription to download."
        );

        return;

    }


    const blob = new Blob(
        [text],
        {
            type: "text/plain"
        }
    );


    const url = URL.createObjectURL(blob);


    const link = document.createElement("a");

    link.href = url;

    link.download = "speech-transcript.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

});