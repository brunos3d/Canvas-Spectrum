// previne que seja executado antes de carregar o arquivo de audio
window.onload = function () {
	const audio = document.getElementById("audio-control");
	const canvas = document.getElementById("canvas-board");

	const context = canvas.getContext("2d");

	const width = canvas.width;
	const height = canvas.height;

	const audio_context = new AudioContext();
	const source = audio_context.createMediaElementSource(audio);
	const analyser = audio_context.createAnalyser();

	source.connect(analyser);
	analyser.connect(audio_context.destination);

	analyser.fftSize = 64;

	const buffer_length = analyser.frequencyBinCount;
	const data_array = new Uint8Array(buffer_length);

	function OnGUI() {
		ClearCanvas();

		analyser.getByteFrequencyData(data_array);

		let max_size = 0;
		let wave_size = 0;

		for (let id = 0; id < buffer_length; id++) {
			let bar_height = data_array[id];
			if (bar_height > max_size) {
				max_size = bar_height;
			}
			wave_size += bar_height;
		}

		wave_size /= buffer_length;

		const wave_count = Math.max(Math.min(Math.ceil(wave_size / 32), 11), 3);
		const start_padding = 100;

		const pos_y = height / 2;
		const size_x = (width - start_padding * 2) / wave_count;

		context.beginPath();
		context.lineWidth = 5;
		context.strokeStyle = "white";
		context.moveTo(0, pos_y);
		context.lineTo(start_padding, pos_y);

		for (let id = 0; id < wave_count; id++) {
			const pos_x = start_padding + id * size_x;
			context.bezierCurveTo(pos_x + size_x / 2, pos_y + wave_size, pos_x + size_x / 2, pos_y - wave_size, pos_x + size_x, pos_y);
		}
		context.lineTo(wave_count * size_x + start_padding * 2, pos_y);
		context.stroke();

		// loop
		requestAnimationFrame(OnGUI);
	}

	function ClearCanvas(color) {
		if (color) {
			context.fillStyle = color;
			context.fillRect(0, 0, width, height);
		}
		else {
			context.clearRect(0, 0, width, height);
		}
	}

	// Inicializa tudo
	OnGUI();
}