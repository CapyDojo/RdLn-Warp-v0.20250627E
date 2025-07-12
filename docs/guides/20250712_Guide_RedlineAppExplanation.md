## How Your Text Becomes a Redline: A Simple Guide

Imagine you have two versions of a document, and you want to see exactly what changed between them. That's what this app does! It takes your "Original" text and your "Revised" text, compares them word by word, and then shows you the differences, much like how editors mark up changes with red lines.

### The Core Team: Who Does What?

Think of our app as a small, efficient team working together:

1.  **The "Brain" (MyersAlgorithm.ts):**
    *   **What it is:** This is the super-smart part of our app. It's a special algorithm (a set of instructions) that's incredibly good at finding the shortest path to transform one text into another.
    *   **What it does:** When you give it your "Original" and "Revised" texts, it meticulously compares them. It doesn't just say "they're different"; it figures out *exactly* which words were added, which were deleted, and which stayed the same.
    *   **Why it's important:** Without the Brain, we wouldn't know *what* changed, only *that* something changed. It provides the precise instructions for the Display to show.
    *   **Junior Coder Tip:** This file (`src/algorithms/MyersAlgorithm.ts`) is where the magic happens. Look for the main function, often called `diff` or `compare`. It takes two lists of words and returns a list of "changes" (like "add this word," "delete that word," or "keep this word"). Don't worry too much about the complex math inside, just understand its input and output.

2.  **The "Display" (RedlineOutput.tsx):**
    *   **What it is:** This is the part of the app that you actually see – the area where the redlined text appears.
    *   **What it does:** It takes the detailed instructions from the "Brain" (MyersAlgorithm) and translates them into visual changes. If the Brain says "this word was deleted," the Display shows it in red with a strikethrough. If it says "this word was added," it shows it in green.
    *   **Why it's important:** It makes the differences easy for you to understand at a glance.
    *   **Junior Coder Tip:** This file (`src/components/RedlineOutput.tsx`) is all about presentation. You'll see how it loops through the "changes" provided by the `MyersAlgorithm` and applies different styles (like `color: red`, `text-decoration: line-through`, `color: green`) to each word or phrase based on whether it was added, deleted, or kept. Look for how it receives `props` (data passed into it) from its parent component.

### The Supporting Cast: Other Important Components

These components help the Brain and Display do their jobs:

| Component | Function/Prop | Description |
|---|---|---|
| **MyersAlgorithm.ts** | `diff` or `compare` (function) | The main function that takes two texts and calculates the differences (additions, deletions, unchanged parts). |
| | `tokenize(text)` | Breaks down a continuous string of text into smaller, meaningful units (tokens) like words, numbers, punctuation, and even whitespace. This is crucial because the diffing algorithm compares these tokens, not individual characters. If the redline output is splitting words incorrectly or not recognizing certain phrases as single units, this is where you'd investigate. |
| | `myers(a, b)` | The core Myers diff algorithm implementation. It finds the shortest sequence of additions and deletions to transform one sequence of tokens (`a`) into another (`b`). This is a complex algorithm; for most enhancements, you'll focus on improving its input (tokenization, trimming) or how its raw output is processed. |
| | `backtrack(a, b, trace, d)` | Translates the optimal path found by the `myers` algorithm into a sequence of raw "added," "removed," or "unchanged" tokens. You generally won't need to modify this function. |
| | `preciseChunking(changes)` | Intelligently groups the raw "added," "removed," and "unchanged" tokens into more meaningful "chunks" for display (e.g., combining a deletion and an addition into a single "changed" chunk for substitutions). If substitutions aren't correctly identified, investigate here. |
| | `trimCommonPrefixSuffix(originalText, revisedText)` | A crucial performance optimization that identifies and removes identical text at the beginning (prefix) and end (suffix) of the documents *before* sending them to the core `myers` algorithm. This significantly speeds up comparisons. |
| | `trimCommonParagraphs(originalText, revisedText)` | Another performance optimization that identifies and removes identical paragraphs from the beginning and end of the documents *before* character-level trimming. Effective for very long documents with minor changes. |
| | `splitIntoParagraphsSinglePass(text)` | Efficiently breaks a large block of text into an array of individual paragraphs. Used by `trimCommonParagraphs`. If paragraph-level trimming struggles with specific document formats, you might refine this logic. |
| | `streamingMyers(...)` | Designed to handle extremely large documents by processing them in smaller "chunks" and yielding control back to the UI periodically, preventing the browser from freezing. If the app becomes unresponsive with large files, this is the function to understand. |
| | `reconstructWithCombinedTrimming(...)` | After the core `myers` algorithm runs on the trimmed content, this function re-inserts the previously trimmed common prefixes, suffixes, and paragraphs back into the final result, ensuring the output reflects the entire document. |
| **RedlineOutput.tsx** | `changes` (prop) | A list of instructions (from `MyersAlgorithm`) detailing what words were added, deleted, or kept. This prop tells the component what to display. |
| | Internal Rendering Logic | This is the code inside `RedlineOutput` that reads the `changes` prop and applies visual styles (like red for deleted, green for added) to each word. |
| **ComparisonInterface.tsx** | `originalText` (state) | Stores the text entered into the "Original" input box. |
| | `revisedText` (state) | Stores the text entered into the "Revised" input box. |
| | `handleOriginalTextChange` (function) | Updates the `originalText` state whenever the user types in the "Original" input. |
| | `handleRevisedTextChange` (function) | Updates the `revisedText` state whenever the user types in the "Revised" input. |
| | `handleCompareClick` (function) | Triggered when the "Compare" button is clicked. It takes the `originalText` and `revisedText`, sends them to `MyersAlgorithm`, and then passes the results to `RedlineOutput`. |
| **TextInputPanel.tsx** | `value` (prop) | The actual text content displayed inside the input box. |
| | `onChange` (prop) | A function that gets called whenever the user types or changes the text in the input box. This allows the parent component (`ComparisonInterface`) to update its state. |
| | `placeholder` (prop) | The light gray hint text shown in the input box before the user types anything. |
| **OutputLayout.tsx** | `children` (prop) | This prop represents any other components or content that `OutputLayout` needs to arrange and display within its layout structure (e.g., the `RedlineOutput` component). |



*   **The "Control Panel" (ComparisonInterface.tsx):**
    *   **What it is:** This is the main screen where you interact with the app. It's like the dashboard of a car, bringing everything together.
    *   **What it does:** It holds the input boxes, the "Compare" button, and the area where the redline output is shown. It's responsible for coordinating the flow: taking your input, sending it to the Brain, and then giving the Brain's results to the Display.
    *   **Why it's important:** It makes the differences easy for you to understand at a glance.
    *   **Junior Coder Tip:** (`src/components/ComparisonInterface.tsx`) This is a great place to start to understand the overall flow. You'll see how it manages the "state" (the current text in the input boxes), and how it calls the `MyersAlgorithm` when you click "Compare."

*   **The "Input Boxes" (TextInputPanel.tsx):**
    *   **What it is:** These are the simple boxes where you type or paste your "Original" and "Revised" texts.
    *   **What it does:** They capture your text and make it available to the "Control Panel."
    *   **Junior Coder Tip:** (`src/components/TextInputPanel.tsx`) This is a relatively straightforward component. It shows how basic user input is handled and passed up to a parent component.

*   **The "Arranger" (OutputLayout.tsx):**
    *   **What it is:** This component helps organize how the redline output is presented on the screen.
    *   **What it does:** It ensures that the redlined text is displayed neatly, perhaps side-by-side with the original, or in a single combined view, depending on the app's design.
    *   **Junior Coder Tip:** (`src/components/OutputLayout.tsx`) This component focuses on layout and structure. It's a good example of how to arrange other components on the screen.

### The Workflow: From Your Keyboard to Redlines

Here's the simplified journey of your text:

1.  **You Type/Paste:** You enter your "Original" text into one `TextInputPanel` and your "Revised" text into another.
2.  **Control Panel Takes Over:** The `ComparisonInterface` (Control Panel) collects these two texts.
3.  **Brain Time!** When you click "Compare," the `ComparisonInterface` sends both texts to the `MyersAlgorithm` (the Brain).
4.  **Brain Calculates:** The `MyersAlgorithm` crunches the numbers, comparing every word and identifying additions, deletions, and common parts. It then sends back a list of these "changes."
5.  **Display Shows:** The `ComparisonInterface` then passes this list of "changes" to the `RedlineOutput` (the Display).
6.  **Redlines Appear:** The `RedlineOutput` reads each "change" instruction and renders the text on your screen with the appropriate colors and styles (red for deleted, green for added, normal for unchanged).

### Navigating as a Junior Coder

To understand how this app works, start here:

1.  **Start with the `ComparisonInterface.tsx`:** This is your entry point. Look at how it imports and uses `TextInputPanel` and `RedlineOutput`. See how it handles the "Compare" button click and calls the `MyersAlgorithm`.
2.  **Follow the Data Flow:**
    *   How does text from `TextInputPanel` get to `ComparisonInterface`? (Hint: Look for `onChange` props and state updates).
    *   How does `ComparisonInterface` send text to `MyersAlgorithm`? (It's usually a direct function call).
    *   How does the result from `MyersAlgorithm` get to `RedlineOutput`? (It's passed as a `prop`).
3.  **Examine `RedlineOutput.tsx`:** Understand how it takes the `props` (the list of changes) and uses them to render the different parts of the text.
4.  **Peek into `MyersAlgorithm.ts`:** You don't need to master the algorithm itself, but understand that it takes two arrays of words and returns a structured list of differences. Look at the *type* of data it returns – this is crucial for `RedlineOutput` to understand.
5.  **Use Your Browser's Developer Tools:**
    *   **Inspect Elements:** Right-click on the redlined text in your browser and choose "Inspect." See how the HTML elements are structured and what CSS styles are applied to make the text red, green, or struck through. This will directly show you what `RedlineOutput.tsx` is doing.
    *   **Console Logs:** If you're running the app locally, you can add `console.log()` statements in `ComparisonInterface.tsx` or `RedlineOutput.tsx` to see the data at different stages of the process. For example, `console.log("Changes from Myers:", changes);` after the algorithm runs.

By following these steps, you'll gain a solid understanding of how this redlining application functions from input to output!