import { postMessage } from "../../shared/api/api.js";
import { initThemeToggle } from "../../shared/theme/theme.js";

const $ = (id) => document.getElementById(id);

const form = $("messageForm");
const messageTypeEl = $("messageType");
const recipientTypeEl = $("recipientType");
const topicEl = $("topic");
const contextEl = $("context");
const goalEl = $("goal");

const generateBtn = $("generateBtn");
const generateLabel = $("generateLabel");
const clearBtn = $("clearBtn");
const copyBtn = $("copyBtn");

const statusDot = $("statusDot");
const statusText = $("statusText");
const errorContainer = $("errorContainer");

const resultSection = $("resultSection");
const resultBox = $("resultBox");
const metaBadge = $("metaBadge");

const toggle = $("themeToggle");

let lastResult = "";

function setStatus(state, message) {
  statusDot.classList.remove("busy", "error");

  if (state === "ready") {
    statusText.textContent = message || "Ready";
  } else if (state === "busy") {
    statusDot.classList.add("busy");
    statusText.textContent = message || "Thinking…";
  } else if (state === "error") {
    statusDot.classList.add("error");
    statusText.textContent = message || "Error";
  }
}

function setLoading(isLoading) {
  if (isLoading) {
    generateBtn.disabled = true;
    generateLabel.textContent = "Generating…";
    generateBtn.classList.add("loading");
    setStatus("busy", "Generating with AI…");
  } else {
    generateBtn.disabled = false;
    generateLabel.textContent = "Generate";
    generateBtn.classList.remove("loading");
    setStatus("ready", "Ready");
  }
}

function showError(msg) {
  errorContainer.style.display = "block";
  errorContainer.textContent = msg;
  setStatus("error", "Error");
}

function clearError() {
  errorContainer.style.display = "none";
  errorContainer.textContent = "";
}

function resetResult() {
  resultSection.style.display = "none";
  resultBox.textContent = "";
  metaBadge.textContent = "";
  metaBadge.title = "";
  lastResult = "";
}

function clearForm() {
  topicEl.value = "";
  contextEl.value = "";
  goalEl.value = "";
  autoGrow(contextEl);
  autoGrow(goalEl);
}

async function handleSubmit(e) {
  e.preventDefault();
  clearError();
  resetResult();

  const messageType = messageTypeEl.value;
  const recipientType = recipientTypeEl.value;
  const topic = topicEl.value.trim();
  const context = contextEl.value.trim();
  const goal = goalEl.value.trim();

  if (!topic || !context) {
    showError("Please fill in at least Subject and Context.");
    return;
  }

  setLoading(true);

  const meta = `${messageType} → ${recipientType}`;
  metaBadge.textContent = meta;
  metaBadge.title = meta;

  try {
    const data = await postMessage({ messageType, recipientType, topic, context, goal });

    lastResult = data.message || "";
    resultBox.value = lastResult;
    resultSection.style.display = "block";
    setStatus("ready", "Done");
  } catch (err) {
    console.error(err);
    showError("Something went wrong while generating the message. Please try again.");
  } finally {
    setLoading(false);
  }
}

function autoGrow(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

function bindAutoGrow(el) {
  if (!el) return;
  ["input", "change"].forEach((evt) =>
    el.addEventListener(evt, () => autoGrow(el))
  );
  autoGrow(el);
}

bindAutoGrow(contextEl);
bindAutoGrow(goalEl);

async function handleCopy() {
  const textToCopy = resultBox.value || "";

  if (!textToCopy.trim()) return;

  try {
    await navigator.clipboard.writeText(textToCopy);
    setStatus("ready", "Copied to clipboard");
    setTimeout(() => setStatus("ready", "Ready"), 1500);
  } catch (e) {
    console.error(e);
    showError("Could not copy to clipboard.");
  }
}

function handleClear() {
  clearForm();
  resetResult();
  clearError();
  setStatus("ready", "Ready");
}

form.addEventListener("submit", handleSubmit);
clearBtn.addEventListener("click", handleClear);
copyBtn.addEventListener("click", handleCopy);

initThemeToggle(document.body, toggle, "minimal-theme");