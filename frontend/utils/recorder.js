const record = document.querySelector('.record');
const stop = document.querySelector('.stop');

//* some constants that may be useful later
// const playhead = document.querySelector('.playhead');
// const armed = document.querySelector('.armed');
// const play = document.querySelector('.play');

stop.disabled = true;

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {

        let chunks = [];
        const mediaRecorder = new MediaRecorder(stream);

        record.onclick = function() {
            // Optional count_in feature
            // count_in.start();
            mediaRecorder.start();
            
            // playhead.start();
            stop.disabled = false;
            record.disabled = true;

            setTimeout(() => {
                mediaRecorder.stop();
                
                stop.disabled = true;
                record.disabled = false;
            }, 3000);   //* Dummy value, to change later
        }

        stop.onclick = function() {
            mediaRecorder.stop();

            // playhead.stop();
            stop.disabled = true;
            record.disabled = false;
        }

        mediaRecorder.addEventListener("dataavailable", event => {
            chunks.push(event.data);
        })

        mediaRecorder.onstop = function(event) {
            const blob = new Blob(chunks);
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.play();
        }
});