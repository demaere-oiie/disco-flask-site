navigator = window.navigator;

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
}).then((stream) => {
    video = document.querySelector('video');
    video.srcObject = stream;
    video.play();

    button = document.querySelector('button');
    console.log(button);
    button.addEventListener('click', (event) => {

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        const track = mediaStream.getVideoTracks()[0];
        imageCapture = new ImageCapture(track);
        imageCapture
          .takePhoto()
          .then((blob) => {
            console.log(blob);
            img = document.querySelector('img');
            img.src = URL.createObjectURL(blob);
        });
      })
      .catch((error) => console.error(error));

    });
})
.catch((error) => console.error(error));
