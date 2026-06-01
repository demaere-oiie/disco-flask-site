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

        const track = stream.getVideoTracks()[0];
        imageCapture = new ImageCapture(track);
        imageCapture
          .takePhoto()
          .then((blob) => {
            console.log(blob);
            img = document.querySelector('img');
            img.src = URL.createObjectURL(blob);

            const formData = new FormData();
            formData.append('file',blob,'snapshot.jpeg');

            fetch('/rps', {
                method: 'POST',
                body: formData
            }).then((response) => {
                response.text()
                .then((foo) =>
                    alert(foo));
            })
            .catch((error) => console.error(error));
        });

    });
})
.catch((error) => console.error(error));
