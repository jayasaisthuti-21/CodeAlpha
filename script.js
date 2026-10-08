const LANGUAGES = [
  ["en", "English"], ["hi", "Hindi"], ["te", "Telugu"], ["mr", "Marathi"],
  ["ta", "Tamil"], ["kn", "Kannada"], ["bn", "Bengali"], ["gu", "Gujarati"],
  ["es", "Spanish"], ["fr", "French"], ["de", "German"], ["it", "Italian"],
  ["pt", "Portuguese"], ["ru", "Russian"], ["ja", "Japanese"], ["ko", "Korean"],
  ["zh-CN", "Chinese (Simplified)"], ["ar", "Arabic"], ["ur", "Urdu"],
  ["tr", "Turkish"], ["vi", "Vietnamese"], ["nl", "Dutch"]
];

const sourceSel = document.getElementById("sourceLang");
const targetSel = document.getElementById("targetLang");

LANGUAGES.forEach(([code, label]) => {
  sourceSel.add(new Option(label, code));
  targetSel.add(new Option(label, code));
});

sourceSel.value = "en";
targetSel.value = "hi";

document.getElementById("swapBtn").addEventListener("click", () => {
  const tmp = sourceSel.value;
  sourceSel.value = targetSel.value;
  targetSel.value = tmp;
});

const translateBtn = document.getElementById("translateBtn");
const statusEl = document.getElementById("status");
const resultBox = document.getElementById("resultBox");
const resultText = document.getElementById("resultText");

async function translate() {
  const text = document.getElementById("inputText").value.trim();
  if (!text) {
    statusEl.textContent = "Please enter some text first.";
    statusEl.className = "status error";
    return;
  }

  const source = sourceSel.value;
  const target = targetSel.value;

  translateBtn.disabled = true;
  statusEl.textContent = "Translating...";
  statusEl.className = "status";

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.responseStatus !== 200 && data.responseStatus !== "200") {
      throw new Error(data.responseDetails || "Translation failed");
    }

    const translated = data.responseData.translatedText;
    resultText.textContent = translated;
    resultBox.classList.add("show");
    resultBox.dataset.lang = target;
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
    statusEl.className = "status error";
  } finally {
    translateBtn.disabled = false;
  }
}

translateBtn.addEventListener("click", translate);

document.getElementById("copyBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(resultText.textContent).then(() => {
    statusEl.textContent = "Copied to clipboard!";
    statusEl.className = "status";
  });
});

document.getElementById("speakBtn").addEventListener("click", () => {
  const utter = new SpeechSynthesisUtterance(resultText.textContent);
  utter.lang = resultBox.dataset.lang || "en";
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
});
