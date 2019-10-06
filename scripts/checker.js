const handleClick = () => {
	const info = document.getElementById('garage-info');

	if (info.getAttribute('aria-hidden') === 'true') {
		info.setAttribute('aria-hidden', 'false');
	}
	else {
		info.setAttribute('aria-hidden', 'true');
	}
};

window.addEventListener('DOMContentLoaded', (event) => {
	const API_URL = 'https://firestore.googleapis.com/v1/projects/garage-a-info/databases/(default)/documents/latest_info/garage-a';

	const handleSuccess = data => {
		const info = document.getElementById('answer');
		const flavor = document.getElementById('flavor');

		if (data.percent_full >= 100) {
			info.innerHTML = 'Yes!';
			flavor.innerHTML = 'You may as well go home.'
			flavor.setAttribute('aria-hidden', false);
			document.getElementById('crying').setAttribute('aria-hidden', 'false');
		}
		else {
			info.innerHTML = 'No!'
			flavor.innerHTML = "Park to your heart's content.";
			flavor.setAttribute('aria-hidden', false);
			document.getElementById('garage-a').setAttribute('aria-hidden', 'false');
		}

		// show button for more info
		document.getElementById('garage-info-btn').setAttribute('aria-hidden', false);

		// get readable datetime
		const timestamp = data.date.stringValue;
		const date = `${timestamp.slice(5, 7)}/${timestamp.slice(8, 10)}/${timestamp.slice(0, 4)}`;

		let hour = parseInt(timestamp.slice(11, 13));
		let am = true;

		// adjust to 12 hour clock
		if (hour > 12) {
			hour -= 12;
			am = false;
		}

		if (hour === 0) {
			hour = 12;
		}

		// adjust to eastern time
		if (hour - 4 < 1) {
			hour = 12 - (4 - hour);
		}
		else {
			hour -= 4;
		}

		const time = `${hour}:${timestamp.slice(14, 16)}:${timestamp.slice(17, 19)} ${am ? 'AM':'PM'} EST`;

		const readableDateTime = `${date} at ${time}`;

		document.getElementById('last-updated').innerHTML = readableDateTime;
		document.getElementById('total-spaces').innerHTML = data.max_spaces.integerValue;
		document.getElementById('percent-full').innerHTML = `${data.percent_full.doubleValue}%`;
		document.getElementById('spaces-filled').innerHTML = data.spaces_filled.integerValue;
		document.getElementById('spaces-left').innerHTML = data.spaces_left.integerValue;
	};

	const handleFailure = () => {
		const info =document.getElementById('answer');
		info.innerHTML = "Failed to get garage status. Check the console if you are interested why.";
	};

	const getData = new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();

		request.open('GET', API_URL);
		request.onload = () => resolve(JSON.parse(request.responseText));
		request.onerror = () => reject(request.statusText);
		request.send();
	});

	getData.then(
		(data) => {
			if (typeof data !== 'object') {
				console.error('Incorrect data type recieved');
				return;
			}

			handleSuccess(data.fields);
		}
	).catch(
		(reason) => {
			console.error(`Data request failed: ${reason}`);
			handleFailure();
		}
	);

	document.getElementById('year').innerHTML = new Date().getFullYear();
});
