var mwin = 0;
var pwin = 0;

const tostr = {
        "R": "Rock",
        "P": "Paper",
        "S": "Scissors",
        "D": "???",
};

const beats = { "R": "P", "P": "S", "S": "R", };

var last = "";

var memory = {};


function playround(play) {
    const plays = ["R","P","S"];
    var mach = "";
    if (last in memory) {
        mach = beats[memory[last]];
    } else {
        mach = plays[Math.floor(Math.random() * plays.length)];
    }
    if(play == mach) { winner = "No"; }
    else if((play == "R" && mach == "S") ||
            (play == "P" && mach == "R") ||
            (play == "S" && mach == "P")) { winner = "You"; pwin += 1; } 
    else { winner = "I"; mwin += 1; }
    if (last.length == 2) {
        memory[last] = play;
    }
    last = play+mach;
    return ("\nI play " + tostr[mach] +
            "\n" + winner + " win..." +
            "\n" + pwin + ":" + mwin)
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
        }, 500);
        setTimeout(() => {
        const pre = document.querySelector('pre');
        pre.innerHTML = "2...";
        }, 1000);
        setTimeout(() => {
        const pre = document.querySelector('pre');
        pre.innerHTML = "1...";
        }, 1500);
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

        pre.innerHTML = tostr[foo[5]];
        if (foo[5] != "D") {
            pre.innerHTML += playround(foo[5]);
        }
        console.log(foo);
        }, 2000);
    });
    document.addEventListener('keydown', (event) => {
        if(event.key == "r") {
            const pre = document.querySelector('pre');
            pre.innerHTML = tostr["R"]+playround("R");
        } else if(event.key == "p") {
            const pre = document.querySelector('pre');
            pre.innerHTML = tostr["P"]+playround("P");
        } else if(event.key == "s") {
            const pre = document.querySelector('pre');
            pre.innerHTML = tostr["S"]+playround("S");
        }
    });
}

main();
