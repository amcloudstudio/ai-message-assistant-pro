import { postMessage } from "../../shared/api/api.js";
import { initThemeToggle } from "../../shared/theme/theme.js";

const $ = (id) => document.getElementById(id);

const root = $("ai-widget-root");
const launcher = $("aiWidgetLauncher");
const panel = $("aiWidgetPanel");
const closeBtn = $("aiWidgetCloseBtn");

const form = $("aiWidgetForm");
const messageTypeEl = $("w_messageType");
const recipientTypeEl = $("w_recipientType");
const topicEl = $("w_topic");
const contextEl = $("w_context");
const goalEl = $("w_goal");

const generateBtn = $("w_generateBtn");
const generateLabel = $("w_generateLabel");
const clearBtn = $("w_clearBtn");
const copyBtn = $("w_copyBtn");

const statusDot = $("w_statusDot");
const statusText = $("w_statusText");
const errorContainer = $("w_errorContainer");

const resultSection = $("w_resultSection");
const resultBox = $("w_resultBox");
const metaBadge = $("w_metaBadge");

const toggle = $("themeToggle");

function setStatus(state, message) {
  if (!statusDot || !statusText) return;

  statusDot.classList.remove("busy", "error");

  if (state === "ready") statusText.textContent = message || "Ready";
  if (state === "busy") {
    statusDot.classList.add("busy");
    statusText.textContent = message || "Generating…";
  }
  if (state === "error") {
    statusDot.classList.add("error");
    statusText.textContent = message || "Error";
  }
}

function setLoading(isLoading) {
  if (!generateBtn || !generateLabel) return;

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
  if (!errorContainer) return;
  errorContainer.style.display = "block";
  errorContainer.textContent = msg;
  setStatus("error", "Error");
}

function clearError() {
  if (!errorContainer) return;
  errorContainer.style.display = "none";
  errorContainer.textContent = "";
}

function resetResult() {
  if (resultSection) resultSection.style.display = "none";
  if (resultBox) resultBox.value = "";
  if (metaBadge) {
    metaBadge.textContent = "";
    metaBadge.title = "";
  }
}

function clearForm() {
  if (topicEl) topicEl.value = "";
  if (contextEl) contextEl.value = "";
  if (goalEl) goalEl.value = "";
}

function openPanel() {
  if (!panel || !launcher) return;
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  launcher.classList.add("hidden");
}

function closePanel() {
  if (!panel || !launcher) return;
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  launcher.classList.remove("hidden");
}

async function handleSubmit(e) {
  e.preventDefault();
  clearError();
  resetResult();

  const messageType = messageTypeEl?.value || "";
  const recipientType = recipientTypeEl?.value || "";
  const topic = (topicEl?.value || "").trim();
  const context = (contextEl?.value || "").trim();
  const goal = (goalEl?.value || "").trim();

  if (!topic || !context) {
    showError("Please fill in at least Subject and Context.");
    return;
  }

  const meta = `${messageType} → ${recipientType}`;
  if (metaBadge) {
    metaBadge.textContent = meta;
    metaBadge.title = meta;
  }

  setLoading(true);

  try {
    const data = await postMessage({ messageType, recipientType, topic, context, goal });
    const msg = data?.message || "";

    if (resultBox) resultBox.value = msg;
    if (resultSection) resultSection.style.display = "block";

    setStatus("ready", "Done");
  } catch (err) {
    console.error(err);
    showError("Something went wrong while generating the message. Please try again.");
  } finally {
    setLoading(false);
  }
}

async function handleCopy() {
  const textToCopy = (resultBox?.value || "").trim();
  if (!textToCopy) return;

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

if (launcher) launcher.addEventListener("click", openPanel);
if (closeBtn) closeBtn.addEventListener("click", closePanel);

if (form) form.addEventListener("submit", handleSubmit);
if (clearBtn) clearBtn.addEventListener("click", handleClear);
if (copyBtn) copyBtn.addEventListener("click", handleCopy);

initThemeToggle(root, toggle, "ai-widget-theme");
setStatus("ready", "Ready");