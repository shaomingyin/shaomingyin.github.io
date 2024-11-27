document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('startRecording');
    const stopButton = document.getElementById('stopRecording');
    const recordedVideo = document.getElementById('recordedVideo');

    let mediaRecorder;
    let recordedChunks = [];

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: 'screen' }
            });

            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.onstop = handleStop;

            mediaRecorder.start();
            startButton.disabled = true;
            stopButton.disabled = false;
        } catch (err) {
            console.error('Error: ' + err);
        }
    }

    function handleDataAvailable(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    }

    function handleStop() {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        recordedChunks = [];
        const url = URL.createObjectURL(blob);
        recordedVideo.src = url;
        recordedVideo.style.display = 'block';
        recordedVideo.play();
    }

    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', () => {
        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
    });
});
