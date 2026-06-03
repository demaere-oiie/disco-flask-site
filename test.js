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

        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const blob = await imageCapture.takePhoto();

        const img = document.querySelector('img');
        img.src = URL.createObjectURL(blob);

        const formData = new FormData();
        formData.append('file',blob,'snapshot.jpeg');

        const response = await fetch('/rpsd', {
                method: 'POST',
                body: formData
        });
        const foo = await response.text();
        alert(foo[5]);
    });
}

main();
