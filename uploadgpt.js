const button = document.createElement("button");
button.innerText = "Submit File";
button.style.backgroundColor = "green";
button.style.color = "white";
button.style.padding = "5px";
button.style.border = "none";
button.style.borderRadius = "8px";
button.style.margin = "5px";

// Find the target element to insert the button and progress elements before
const targetElement = document.querySelector(
  ".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4"
);

// Insert the button before the parent element
targetElement.parentNode.insertBefore(button, targetElement);

// Create the progress bar container element
const progressContainer = document.createElement("div");
progressContainer.style.width = "99%";
progressContainer.style.height = "5px";
progressContainer.style.backgroundColor = "grey";
progressContainer.style.margin = "5px";
progressContainer.style.borderRadius = "5px";

// Create the progress bar element
const progressBar = document.createElement("div");
progressBar.style.width = "0%";
progressBar.style.height = "100%";
progressBar.style.backgroundColor = "blue";

// Append the progress bar to the progress element
progressContainer.appendChild(progressBar);

// Insert the progress bar container before the target element
targetElement.parentNode.insertBefore(progressContainer, targetElement);

// Function to handle file selection
button.addEventListener("click", async () => {
  // Create the input element
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt,.js,.py,.html,.css,.json,.csv";

  // Handle file selection
  input.addEventListener("change", async () => {
    // Read the file as text
    const file = input.files[0];
    const text = await file.text();
    // Split the file into chunks of size 15000
    const chunkSize = 15000;
    const numChunks = Math.ceil(text.length / chunkSize);
    for (let i = 0; i < numChunks; i++) {
      const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);

      // Submit the chunk to the conversation
      await submitConversation(chunk, i + 1, file.name);

      // Update the progress bar
      progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

      // Wait for chat-GPT to be ready
      let chatgptReady = false;
      while (!chatgptReady) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        chatgptReady = !document.querySelector(
          ".text-2xl > span:not(.invisible)"
        );
      }
    }
    // Finish updating the progress bar
    progressBar.style.backgroundColor = "blue";
  });

  // Trigger the file selection dialog
  input.click();
});

// Function to submit a conversation
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}: \n\n ${text}`;
  textarea.dispatchEvent(enterKeyEvent);
}
