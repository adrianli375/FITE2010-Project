// utility functions to handle mouse events in the clipboard

export const handleMouseEnter = () => {
    document.querySelector(".copy-tooltip").textContent = "Copy";
}

export const handleMouseLeave = () => {
  document.querySelector(".copy-tooltip").textContent = "";
}

export const handleCopy = (textToCopy, clipboardText) => {
    navigator.clipboard.writeText(textToCopy)
    .then(() => {
        document.querySelector(".copy-tooltip").innerHTML = clipboardText;
    })
    .catch((error) => console.error(error));
};
