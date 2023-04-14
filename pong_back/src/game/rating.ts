// Constant used in rating change calculation
// 32 is standard
const k_factor: number = 32;

// Computes the expected probabilty to win a game
// for both players given their ratings
function expectedPlayerProbabilty(
	player1_rating: number,
	player2_rating: number):
	[number, number]
{
	const rating1_diff: number = player2_rating - player1_rating;
	const rating2_diff: number = player1_rating - player2_rating;

	const player1_probabilty = 1 / (1 + Math.pow(10, rating1_diff / 400));
	const player2_probabilty = 1 / (1 + Math.pow(10, rating2_diff / 400));

	return [player1_probabilty, player2_probabilty];
}

// Compute the updated rating, given the rating, score
// and expected probabilty of a player
function getRatingChange(
	player_rating: number,
	player_score: number,
	player_probability: number):
	[number, number]
{
	const rating_change = Math.floor(k_factor * (player_score - player_probability));
	const next_rating = player_rating + rating_change;
	return [next_rating, rating_change];
}

export function getNextRatings(
	player1_rating: number,
	player2_rating: number,
	player1_win: number):
	[number, number, number, number]
{
	const [player1_probabilty, player2_probabilty] = expectedPlayerProbabilty(player1_rating, player2_rating);
	const player2_win = 1 - player1_win;

	const [next_player1_rating, player1_rating_change] = getRatingChange(player1_rating, player1_win, player1_probabilty);
	const [next_player2_rating, player2_rating_change] = getRatingChange(player2_rating, player2_win, player2_probabilty);

	return [
		next_player1_rating,
		player1_rating_change,
		next_player2_rating,
		player2_rating_change
	];
}
