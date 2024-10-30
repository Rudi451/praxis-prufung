console.log('in script');

const btn = document.querySelector('#btn');
const loader = document.querySelector('#loader');
const content = document.querySelector('#content');
const checkbox = document.querySelector('#checkbox');

const HOST = 'http://localhost:8801';

btn.addEventListener('click', (event) => {
	const fileName = document.querySelector('#images').value;
	console.log('was ist value:', fileName);
	// loader.style.backgroundColor = 'red';
	content.innerHTML = '';
	loader.style.display = 'inline-block';
	checkbox.checked = false;
	axios
		.get(`${HOST}/data`, {params: {file: fileName}})
		.then((res) => {
			console.log('was ist res:', res);
			loader.style.display = 'none';
			//build flex gallery
			for (let i = 0; i < res.data.length; i++) {
				content.innerHTML += `<div class="card">
        <div class="card-image">
        <img src="./images/${res.data[i].URL}" alt="${res.data[i].URL}">
        </div>
        <div class="card-title">${res.data[i].Titel}</div>
				</div>`;
				checkbox.addEventListener('change', (event) => {
					console.log('changed: ', checkbox.checked);
					if (checkbox.checked) {
						content.innerHTML = '';
						for (let i = 0; i < res.data.length; i++) {
							if (res.data[i].eigenes === true) {
								content.innerHTML += `<div class="card">
                <div class="card-image">
                <img src="./images/${res.data[i].URL}" alt="${res.data[i].URL}">
                </div>
                <div class="card-title">${res.data[i].Titel}</div>
                </div>`;
							}
						}
					} else {
						content.innerHTML = '';
						for (let i = 0; i < res.data.length; i++) {
							content.innerHTML += `<div class="card">
                <div class="card-image">
                <img src="./images/${res.data[i].URL}" alt="${res.data[i].URL}">
                </div>
                <div class="card-title">${res.data[i].Titel}</div>
                </div>`;
						}
					}
				});
				// loader.innerHTML = 'hello';
			}
		})
		.catch((err) => {
			console.log(err);
			// loader.innerHTML = err;
		});
});
