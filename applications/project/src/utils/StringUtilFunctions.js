// utility function to perform string conversion for seating plan

function convertNumberToLetter(number) {
    // Convert number to ASCII code
    const asciiCode = number + 64;

    // Convert ASCII code to letter
    const letter = String.fromCharCode(asciiCode);

    return letter;
}


export default convertNumberToLetter;
