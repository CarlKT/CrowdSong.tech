//! DEPRECATED: Use AudioClip instead 
const audio_record = document.querySelector('.record');
const audio_stop = document.querySelector('.stop');
const audio_play = document.querySelector('.play');

//* some constants that may be useful later
// const playhead = document.querySelector('.playhead');
// const armed = document.querySelector('.armed');

audio_stop.disabled = true;

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {

        let chunks = [];
        const mediaRecorder = new MediaRecorder(stream);

        audio_record.onclick = function() {
            // Optional count_in feature
            // count_in.start();
            mediaRecorder.start();
            
            // playhead.start();
            audio_stop.disabled = false;
            audio_record.disabled = true;
            audio_record.style.background = "red";

            setTimeout(() => {
                mediaRecorder.stop();
                
                audio_stop.disabled = true;
                audio_record.disabled = false;
                
                audio_record.style.background = "";
                audio_record.style.color = "";
            }, 3000);   //* Dummy value, to change later
        }

        audio_stop.onclick = function() {
            mediaRecorder.stop();

            // playhead.stop();
            audio_stop.disabled = true;
            audio_record.disabled = false;
            audio_record.style.background = "";
            audio_record.style.color = "";
        }

        mediaRecorder.addEventListener("dataavailable", event => {
            chunks.push(event.data);
        })

        // mediaRecorder.onstop = function(e) {
        //     const blob = new Blob(chunks);
        //     const audioUrl = URL.createObjectURL(blob);
        //     const audio = new Audio(audioUrl);
        //     audio.play();
        // }

        audio_play.onclick = function () {
            console.log("Preparing and playing audio")
            const blob = new Blob(chunks);
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.play();
        }
});



// audioClip.record()