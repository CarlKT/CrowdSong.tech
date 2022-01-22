
function record_audio() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
        });

        setTimeout(() => {
        mediaRecorder.stop();
        }, 3000);
  });
}

record_audio