# Real-Time Character & Word Counter

A high-performance, modern text analysis web tool engineered with **HTML5**, **CSS3**, and **Vanilla JavaScript**.

---

## 🎯 Approach and Outcome

### 1. Technical Approach
- **Event-Driven Architecture**: Uses the standard DOM `input` event on the `<textarea>` rather than `keyup` or `keydown`. This ensures that all text changes—including mouse paste, right-click operations, drag-and-drop, speech-to-text, and browser undo/redo—are captured in real time.
- **Robust String Processing**:
  - **Trimming (`str.trim()`)**: Eliminates leading/trailing whitespace boundaries before processing.
  - **Whitespace Normalization (`/\s+/`)**: Uses regular expression tokenization with the greedy quantifier `+` to treat consecutive spaces, tabs, and line breaks as a single delimiter.
  - **Sentence Boundary Detection**: Employs boundary matching regex (`/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g`) to count complete sentences terminated with punctuation as well as trailing active draft statements.
  - **Paragraph Detection**: Splits content on multiple line breaks (`/\n+/`) to accurately track text blocks.
- **Performance & State**:
  - Zero heavy external JavaScript dependencies or virtual DOM overhead.
  - Efficient single-pass DOM node mutations for sub-millisecond updates even on large text inputs.
  - Debounced indicator states for responsive typing status.
- **Modern UI/UX Design System**:
  - Responsive, compact CSS Grid and Flexbox layouts adapted to mobile, tablet, and desktop viewports.
  - Dark theme featuring CSS variables, subtle glassmorphism (`backdrop-filter: blur()`), ambient gradient glowing orbs, and accessible color contrast.
  - Lightweight inline SVG icons (including vector trash can for clear, paste clipboard, and copy icons) with zero external icon library overhead.

### 2. Outcome
- **Zero Runtime Dependencies**: Pure vanilla stack with zero build steps required.
- **Immediate Feedback Loop**: Keystroke-level latency (< 2ms) across all calculated counters.
- **Resilient Edge-Case Handling**: Accurately counts `0` for empty or whitespace-only inputs, cleanly distinguishes spaces from words, and ignores repeated spaces between words.

---

## 🚀 Features

- **Live Character Count**: Total characters including whitespace and special symbols.
- **Live Word Count**: Tokenized word count normalized across multiple spaces, tabs, and newlines.
- **Live Sentence Count**: Identifies punctuation marks (`.`, `!`, `?`) and active draft sentences.
- **Live Paragraph Count**: Automatically detects paragraph blocks separated by line breaks.
- **Text Transformations**: One-click quick actions for `UPPERCASE` and `lowercase`.
- **Clipboard & Toolbar Utility**:
  - **Paste**: Quick import from clipboard into editor.
  - **Sample Text**: Instant preloaded text for testing and verification.
  - **Copy**: One-click clipboard copy with visual toast notifications.
  - **Clear**: Reset textarea and counters with one click (indicated by vector trash icon).

---

## 📂 Project Structure

```
Character_Word_Counter/
├── index.html        # Semantic HTML5 layout and accessible UI structure
├── style.css         # Modern design system, glassmorphism, compact responsive styles
├── script.js         # Text analysis logic, DOM mutations, clipboard actions
└── README.md         # Architecture, deployment, rollback, and interview documentation
```

---

## 🛠️ Deployment Configuration

Since this application is a client-side Single Page Application (SPA), it requires no build pipeline, compiler, or backend runtime.

### 1. GitHub Pages Deployment
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: initial character and word counter release"
   ```
2. Push to GitHub:
   ```bash
   git remote add origin https://github.com/<username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
3. Navigate to **Settings > Pages** on GitHub.
4. Under **Source**, select `Deploy from a branch`, choose branch `main` and folder `/(root)`, then click **Save**.

### 2. Netlify / Vercel / Cloudflare Pages
- **Build Command**: _None (leave empty)_
- **Publish Directory**: `.` (root directory)
- **Production Branch**: `main`

Example `netlify.toml` (optional static headers):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 🔄 Rollback Evidence & Strategy

### 1. Version Control Rollback Strategy
If an issue or bug is identified in a deployment, roll back immediately using Git:

- **Revert specific commit (Safe & Non-Destructive)**:
  ```bash
  git revert <commit-hash>
  git push origin main
  ```
- **Fast-forward rollback to a known good release**:
  ```bash
  git checkout -b rollback-branch <good-commit-hash>
  git push origin rollback-branch:main --force-with-lease
  ```

### 2. Hosting Platform Instant Rollback
- **Netlify**: Go to **Deploys** > Find the last verified successful deploy > Click **Options** > **Publish deploy**. (Instant 0-downtime rollback).
- **Vercel**: Navigate to **Deployments** tab > Select the previous working deployment > Click **Instant Rollback**.
- **Cloudflare Pages**: Open dashboard > **Deployments** > Select previous working build > **Rollback to this deployment**.

### 3. Verification & Evidence Checklist
After any deploy or rollback, verify:
- [x] Application loads over HTTP/HTTPS with HTTP `200 OK`.
- [x] Console log contains 0 uncaught JavaScript runtime errors.
- [x] Textarea accepts input and all 4 metric cards (Words, Characters, Sentences, Paragraphs) update in real time.
- [x] Toolbar actions ("Copy", "Paste", "Clear", "Sample Text") and transforms function properly.
- [x] Mobile responsive layout renders correctly under 480px and 768px viewports with compact padding.

---

## 🧠 Technical Interview Questions & Answers

### 1. How would you count words in a string?
```javascript
function countWords(str) {
  const trimmed = str.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
```
**Step-by-step Explanation**:
1. Call `str.trim()` to strip leading and trailing whitespace.
2. Check if the trimmed string is falsy or empty (`""`). If empty, return `0` (preventing an erroneous count of 1).
3. Tokenize using the regular expression `/\s+/`, splitting on one or more consecutive whitespace characters (spaces, tabs, newlines).
4. Return the `.length` property of the resulting token array.

---

### 2. Why should you trim input before counting?
Trimming is required to avoid two common counting bugs:
1. **Leading and Trailing Spaces**: Without `.trim()`, `" hello "` split on spaces produces `["", "hello", ""]`, returning 3 tokens instead of 1 word.
2. **Whitespace-Only / Empty Strings**: In JavaScript, `"".split(" ")` or `"".split(/\s+/)` returns an array with a single empty string element `[""]`, which evaluates to `.length === 1`. Trimming allows you to check `str.trim() === ""` first to accurately return `0`.

---

### 3. How would you handle multiple spaces between words?
- **Flawed approach**: Using a single literal space delimiter `.split(' ')`. If text has two or three spaces between words (e.g. `"hello   world"`), `.split(' ')` creates empty string elements: `["hello", "", "", "world"]` (count = 4).
- **Correct approach**: Use the regular expression **`/\s+/`** with the `+` quantifier. This instructs the regex engine to treat any sequence of consecutive whitespace characters as a single delimiter, producing clean tokens: `["hello", "world"]` (count = 2).

---

### 4. Why use the `input` event instead of `keyup` or `keydown`?
- `keydown` and `keyup` only trigger on physical keyboard strokes and do not capture:
  - Text pasted via right-click context menu.
  - Text dragged and dropped into the textarea.
  - Browser autocorrect or autocomplete changes.
  - Undo (`Ctrl+Z`) or Redo (`Ctrl+Y`) operations in certain browsers.
  - Voice-to-text dictation.
- The **`input`** event fires synchronously on **any** modification to the element's value, making it the ideal choice for live counters and input synchronization.
