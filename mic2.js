// Check if browser supports Web Audio API
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const micToggle = document.getElementById('micToggle');
    let isMicOn = false;
    let audioContext;
    let analyser;
  
    // Function to initialize microphone
    function initMicrophone() {
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          isMicOn = true;
          micToggle.checked = true;
          updateBackgroundColor(); // Initial update
        })
        .catch(function(err) {
          console.error('Error accessing microphone:', err);
        });
    }
  
    // Function to turn off microphone
    function turnOffMicrophone() {
      if (audioContext) {
        audioContext.close().then(function() {
          isMicOn = false;
          micToggle.checked = false;
          document.body.style.backgroundColor = '#f0f0f0'; // Reset background color
        });
      }
    }
  
    // Function to update background color based on microphone input
    function updateBackgroundColor() {
      if (isMicOn) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        const hue = Math.round(average);
        document.body.style.backgroundColor = `hsl(${hue}, 50%, 50%)`;
      }
      requestAnimationFrame(updateBackgroundColor);
    }
  
    // Event listener for toggle switch
    micToggle.addEventListener('change', function() {
      if (micToggle.checked) {
        initMicrophone();
      } else {
        turnOffMicrophone();
      }
    });
  } else {
    console.error('getUserMedia not supported on your browser!');
  }
  