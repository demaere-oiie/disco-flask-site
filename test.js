navigator = window.navigator;

navigator.mediaDevices.getUserMedia({
  video: { width: 320, height: 240, resizeMode: "crop-and-scale" },
  audio: false
}).then((stream) => {
    video = document.querySelector('video');
    video.srcObject = stream;
    video.play();

    button = document.querySelector('button');
    console.log(button);
    button.addEventListener('click', (event) => {

    navigator.mediaDevices
      .getUserMedia({ video:  { width: 320, height: 240, resizeMode: "crop-and-scale" } })
      .then((mediaStream) => {
        const track = mediaStream.getVideoTracks()[0];
        imageCapture = new ImageCapture(track);
        imageCapture
          .takePhoto({ imageHeight: 240, imageWidth: 320 })
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
