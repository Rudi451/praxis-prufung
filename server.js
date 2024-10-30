import express from 'express';
import {parse} from 'csv-parse';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 8801;

app.use(express.static('www'));

app.get('/data', (req, res) => {
	const fileName = req.query.file;
	const pathToFile = path.join(process.cwd(), fileName);
	let arrayOfObjects = [];
	setTimeout(() => {
		fs.readFile(pathToFile, 'utf-8', (err, csvData) => {
			console.log('in file reader');
			if (err) {
				console.log('Fehler beim lesen der Datei:', err);
				return res.send('Fehler beim lesen der Datei:', err);
			}
			/** parse verwenden */
			// parse(csvData, (err, rows) => {
			// 	console.log('was sind rows', rows);
			// 	rows.forEach((row, index) => {
			// 		if (index === 0) return;
			// 		console.log('was ist row : ', index, row);
			// 		const newArr = row[0].split(';');
			// 		console.log('was ist newArr', newArr);
			// 		arrayOfObjects.push({
			// 			URL: newArr[0],
			// 			Titel: newArr[1],
			// 			eigenes: newArr[2], // newArr[2] === 'true' // retourniert boolean, was besserer Variant ist
			// 		});
			// 	});

			// 	console.log('was ist aaray of obj', JSON.stringify(arrayOfObjects));
			// 	res.send(JSON.stringify(arrayOfObjects));
			// });
			/**
			 * PapaParse verwenden, um CSV zu JSON zu parsen
			 */
			// Variante 1
			// const result = Papa.parse(csvData, {
			// 	header: true, // Erster Zeile als Header (Schlüssel) verwenden
			// 	skipEmptyLines: true, // Leere Zeilen überspringen
			// });
			// Variante 2
			let result;
			Papa.parse(csvData, {
				complete: function (results) {
					delete results.data[0];

					result = results.data
						.filter((row) => row.length > 1 && row[0] !== '')
						.map((row) => {
							return {
								URL: row[0],
								Titel: row[1],
								eigenes: row[2] === 'true',
							};
						});

					console.log('was ist results', results);
				},
			});

			// Konvertiere den resultierenden Daten in einen JSON-String
			const jsonString = JSON.stringify(result, null, 2); // JSON-String schön formatiert

			// JSON-String ausgeben
			console.log(jsonString);
			res.send(jsonString);
		});
	}, 2000);
});

app.listen(port, () => {
	console.log(`Sever listening on port ${port}`);
});
