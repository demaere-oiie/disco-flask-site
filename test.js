async function main() {
    navigator = window.navigator;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    const video = document.querySelector('video');
    video.srcObject = stream;
    video.play();

    const button = document.querySelector('button');
    button.addEventListener('click', async (event) => {

        setTimeout(() => {
        const pre = document.querySelector('pre');
        pre.innerHTML = "3...";
        }, 1000);
        setTimeout(() => {
        const pre = document.querySelector('pre');
        pre.innerHTML = "2...";
        }, 2000);
        setTimeout(() => {
        const pre = document.querySelector('pre');
        pre.innerHTML = "1...";
        }, 3000);
        setTimeout(async () => {
        const pre = document.querySelector('pre');
        pre.innerHTML = "shoot";
        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const blob = await imageCapture.takePhoto();

        const formData = new FormData();
        formData.append('file',blob,'snapshot.jpeg');

        const response = await fetch('/rpsd', {
                method: 'POST',
                body: formData
        });
        const foo = await response.text();

        tostr = {
        "R": "Rock",
        "P": "Paper",
        "S": "Scissors",
        "D": "???",
        };

        pre.innerHTML = tostr[foo[5]];
        }, 4000);
    });
}

main();
