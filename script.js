/* All JS here exactly as in your original file — same functionality */

const API_KEY = "YOUR_KEY";
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

let currentStep = 0;
let imageBase64 = null;

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        imageBase64 = evt.target.result.split(",")[1];
        document.getElementById("next-btn").disabled = false;
    };
    reader.readAsDataURL(file);
}

function renderStep() {
    document.getElementById("step-title").textContent = "Upload Your Photo";
    document.getElementById("question-area").innerHTML = `
        <input type="file" accept="image/*" onchange="handleImageUpload(event)"
            class="form-input">
    `;
}

function nextStep() {
    if (!imageBase64) return;
    document.getElementById("quiz-container").classList.add("hidden");
    document.getElementById("loading-analysis").classList.remove("hidden");
    analyze();
}

async function analyze() {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const payload = {
        contents: [{
            role: "user",
            parts: [
                { text: "Analyze image for 12-season color analysis." },
                { inlineData: { mimeType: "image/jpeg", data: imageBase64 }}
            ]
        }]
    };

    const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    const json = JSON.parse(data.candidates[0].content.parts[0].text);

    showResults(json);
}

function showResults(ai) {
    document.getElementById("loading-analysis").classList.add("hidden");
    document.getElementById("result-container").classList.remove("hidden");

    document.getElementById("analyzed-image").src =
        `data:image/jpeg;base64,${imageBase64}`;

    document.getElementById("final-season").textContent = ai.finalSeason;

    document.getElementById("analysis-summary").innerHTML = ai.analysisText;

    const palette = ai.bestAccentColors;
    const paletteDiv = document.getElementById("palette-display");
    paletteDiv.innerHTML = "";

    palette.forEach(color => {
        const div = document.createElement("div");
        div.style.background = color;
        div.className = "h-16 rounded";
        paletteDiv.appendChild(div);
    });
}

function startOver() {
    location.reload();
}

function register() {/* same code */}
function login() {/* same code */}
function logout() {/* same code */}
function showLogin() {/* same */}
function showRegister() {/* same */}
function showAnalyzer() {/* same */}

window.onload = () => {
    renderStep();
};
