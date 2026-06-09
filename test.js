function playround(play, tostr) {
    const plays = ["R","P","S"];
    const mach = plays[Math.floor(Math.random() * plays.length)];
    if(play == mach) { winner = "No"; }
    else if((play == "R" && mach == "S") ||
            (play == "P" && mach == "R") ||
            (play == "S" && mach == "P")) { winner = "You"; }
    else { winner = "I"; }
    return ("\nI play " + tostr[mach] +
            "\n" + winner + " win...")
}

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

        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        function getCanvasBlob(mycanvas) {
          return new Promise(function(resolve, reject) {
            mycanvas.toBlob((blob) => {
              resolve(blob)
            })
          })
        }
        blob = await getCanvasBlob(canvas, 'image/jpeg');

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
        pre.innerHTML += foo.slice(6,foo.indexOf('@'));
        if (foo[5] != "D") {
            pre.innerHTML += playround(foo[5],tostr);
        }
        console.log(foo);
        }, 4000);
    });
}

main();
