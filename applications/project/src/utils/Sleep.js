const sleep = (seconds) => {
    let milliseconds = seconds * 1000;
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export default sleep;