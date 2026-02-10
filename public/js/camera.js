let video = document.getElementById('camera-display');
let canvas = document.getElementById('snapshot');
let startBtn = document.getElementById('start');
let stopBtn = document.getElementById('stop');
let captureBtn = document.getElementById('capture');
let removeBtn = document.getElementById('remove');

let stream = null;

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user'
            },
            audio: false
        });

        video.srcObject = stream;
    } catch (error) {
        console.error('Camera access denied: ', error);
        alert('Could not access camera');
    }
}

function stopCamera() {
    try {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
    } catch (error) {
        console.error('something went wrong stopping the camera: ', error);
    }
}

function capturePicture() {
    canvas.hidden = false;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    uploadPhoto();
}

function removePicture() {
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, 1500, 1500);
    canvas.hidden = true;

    fetch('delete.php', {
        method: 'POST'
    });
}

function uploadPhoto() {
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append('photo', blob, 'photo.jpg');

        fetch('upload.php', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Saved as: ' + data.filename);
            } else {
                alert('Upload failed');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Upload error');
        });
    }, "image/jpeg", 0.9);
}

startBtn.addEventListener('click', startCamera);
stopBtn.addEventListener('click', stopCamera);
captureBtn.addEventListener('click', capturePicture);
removeBtn.addEventListener('click', removePicture);

window.addEventListener('beforeunload', stopCamera);