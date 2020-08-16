var token = 'e472b4b5-f572-4ceb-87c2-8bd313e69ac5';

function postGameStats(name, game, callback) {
	if (name) {
		$.post(
			'https://isureit.com/api/bd/',
			{
				token: token,
				value: JSON.stringify({
					name: name,
					score: game.score,
					won: game.status === 'player-won',
					lives: game.lives,
					time: game.totalTime,
					sTime: game.sTime,
					eTime: game.eTime,
					board: game.boardName,
				}),
			},
			function () {
				callback();
			}
		);
	} else {
		callback();
	}
}

function setGameStats(holder, limit) {
	$.getJSON('https://isureit.com/api/bd/', { token: token })
		.done(function (response) {
			response.data.sort(function (a, b) {
				return b.score - a.score;
			});
			var $thead = $('<thead></thead>');
			var $tbody = $('<tbody></tbody>');
			$thead.append(
				`<tr><th>Rank</th><th>Name</th><th>Score</th><th>Time (s)</th><th>Date</th><th>Map</th></tr>`
			);
			response.data.slice(0, limit || 10).forEach(function (row, index) {
				var time = Math.floor(row.time / 1000) || '-';
				var boardName = row.board || '-';
				var date = new Date(row.sTime);
				var dateFormatted = date.getMonth()
					? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
					: '-';

				$tbody.append(
					`<tr><td>${index + 1}</td><td>${row.name}</td><td>${row.score}
                    </td><td>${time}</td><td>${dateFormatted}</td><td>${boardName}</td></tr>`
				);
			});
			$(holder)
				.html('')
				.append($('<table></table>').append($thead).append($tbody));
		})
		.fail(function () {
			$(holder).html('Unable to access the server now!');
		});
}
