// Check if browser supports Web Audio API
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Access user microphone
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Define variables for background color changing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      document.body.appendChild(canvas);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Function to update background color based on microphone input
      function update() {
        requestAnimationFrame(update);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        const hue = Math.round(average);
        document.body.style.backgroundColor = `hsl(${hue}, 65%, 50%)`;
      }
      update();
    })
    .catch(function(err) {
      console.error('Error accessing microphone:', err);
    });
} else {
  console.error('getUserMedia not supported on your browser!');
}
