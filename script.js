// DOM Elements
const textInput = document.getElementById('textInput');
const wordCountEl = document.getElementById('wordCount');
const charCountEl = document.getElementById('charCount');
const sentenceCountEl = document.getElementById('sentenceCount');
const paragraphCountEl = document.getElementById('paragraphCount');
const typingStatusEl = document.getElementById('typingStatus');

// Toolbar Buttons
const copyBtn = document.getElementById('copyBtn');
const copyBtnText = document.getElementById('copyBtnText');
const pasteBtn = document.getElementById('pasteBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');

// Transform Buttons
const upperBtn = document.getElementById('upperBtn');
const lowerBtn = document.getElementById('lowerBtn');

// Toast Notification
const toast = document.getElementById('toast');
let typingTimeout = null;
let toastTimeout = null;

/**
 * Calculates words in a given string
 * 1. Trims leading/trailing whitespace
 * 2. Checks for empty string to avoid false count of 1
 * 3. Splits by regex /\s+/ to gracefully handle multiple spaces/tabs/newlines
 */
function countWords(str) {
  const trimmed = str.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Calculates sentences in a string
 * Handles sentences ending in '.', '!', '?', as well as trailing text without punctuation
 */
function countSentences(str) {
  const trimmed = str.trim();
  if (!trimmed) return 0;

  // Match sentences ending with ., !, ? followed by whitespace/end, or trailing words
  const sentenceMatches = trimmed.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g);
  return sentenceMatches ? sentenceMatches.length : 0;
}

/**
 * Calculates paragraphs by splitting on multiple line breaks
 */
function countParagraphs(str) {
  const trimmed = str.trim();
  if (!trimmed) return 0;
  return str
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;
}

/**
/**
 * Core update function that updates all counters in the DOM
 */
function updateCounters() {
  const text = textInput.value;

  // Total Characters
  const totalChars = text.length;

  // Words
  const words = countWords(text);

  // Sentences
  const sentences = countSentences(text);

  // Paragraphs
  const paragraphs = countParagraphs(text);

  // Update DOM displays
  charCountEl.textContent = totalChars.toLocaleString();
  wordCountEl.textContent = words.toLocaleString();
  sentenceCountEl.textContent = sentences.toLocaleString();
  paragraphCountEl.textContent = paragraphs.toLocaleString();

  // Typing status indicator
  if (typingStatusEl) {
    typingStatusEl.textContent = 'Typing...';
    typingStatusEl.classList.add('typing');

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      typingStatusEl.textContent = 'Ready';
      typingStatusEl.classList.remove('typing');
    }, 600);
  }
}

/**
 * Shows a toast message
 */
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// Sample text for quick demonstration
const SAMPLE_TEXT = `Modern web development thrives on clean architecture, accessible markup, and responsive interactions.

Building tools like this live character and word counter reinforces fundamental JavaScript concepts: input event listeners, string trimming, regular expressions, and seamless DOM updates.

Try typing your own sentences, test with multiple spaces, or use the quick transform tools below!`;

// Event Listeners
textInput.addEventListener('input', updateCounters);

// Copy Text
copyBtn.addEventListener('click', async () => {
  const text = textInput.value;
  if (!text) {
    showToast('Nothing to copy!');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    copyBtnText.textContent = 'Copied!';
    showToast('✓ Text copied to clipboard');
    setTimeout(() => {
      copyBtnText.textContent = 'Copy';
    }, 1800);
  } catch (err) {
    // Fallback for older browsers
    textInput.select();
    document.execCommand('copy');
    showToast('✓ Text copied to clipboard');
  }
});

// Paste Text
pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      textInput.value = text;
      updateCounters();
      showToast('✓ Content pasted from clipboard');
      textInput.focus();
    } else {
      showToast('Clipboard is empty');
    }
  } catch (err) {
    showToast('Please press Ctrl+V to paste manually');
  }
});

// Clear Text
clearBtn.addEventListener('click', () => {
  if (!textInput.value) return;
  textInput.value = '';
  updateCounters();
  showToast('Text cleared');
  textInput.focus();
});

// Load Sample Text
sampleBtn.addEventListener('click', () => {
  textInput.value = SAMPLE_TEXT;
  updateCounters();
  showToast('Sample text loaded');
  textInput.focus();
});

// Text Transformations
upperBtn.addEventListener('click', () => {
  if (!textInput.value) return;
  textInput.value = textInput.value.toUpperCase();
  updateCounters();
  showToast('Converted to UPPERCASE');
});

lowerBtn.addEventListener('click', () => {
  if (!textInput.value) return;
  textInput.value = textInput.value.toLowerCase();
  updateCounters();
  showToast('Converted to lowercase');
});

// Initialize counter state on load
document.addEventListener('DOMContentLoaded', () => {
  updateCounters();
});
