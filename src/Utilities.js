export function getCrateChanceSumFromListing(listing) {
	return listing.reduce((acc, { crateChance }) => acc + crateChance, 0);
}

const factorial = (n) =>
	n < 0
		? (() => {
				throw new TypeError("Negative numbers are not allowed!");
		  })()
		: n <= 1
		? 1
		: n * factorial(n - 1);

const combinations = (trials, numberOfEvents) =>
	factorial(trials) / (factorial(trials - numberOfEvents) * factorial(numberOfEvents));

const probabilityOfIndependentEvents = (probabilityOfSuccess, trials, nEventOccur) => {
	if (trials === nEventOccur) {
		return probabilityOfSuccess;
	}

	return (
		combinations(trials, nEventOccur) *
		probabilityOfSuccess ** nEventOccur *
		(1 - probabilityOfSuccess) ** (trials - nEventOccur)
	);
};

export function calculateOdds(listing = [], keys = 1, target = 1) {
	const totalCrateChance = getCrateChanceSumFromListing(listing);

	return listing.map((item) => {
		const chancePerKey = item.crateChance / totalCrateChance;
		const chancePerKeyPercent = chancePerKey * 100;

		const failureRatePerKey = 1 - chancePerKey;
		const failureRatePerKeyPercent = failureRatePerKey * 100;

		console.log({ p: chancePerKey, keys });
		const multipliedFailure = Number.isNaN(chancePerKeyPercent)
			? "-"
			: probabilityOfIndependentEvents(chancePerKey, keys, target) * 100 >= 99.99
			? 99.99
			: probabilityOfIndependentEvents(chancePerKey, keys, target) * 100;

		// const probabilityNoSuccess = probabilityOfIndependentEvents(failureRatePerKey, keys, keys);
		const probabilityAtLeastOne = 1 - failureRatePerKey ** keys;

		return {
			...item,
			actualChance: Number.isNaN(chancePerKeyPercent) ? "-" : chancePerKeyPercent,
			failureRate: Number.isNaN(chancePerKeyPercent) ? "-" : failureRatePerKeyPercent,
			multipliedFailure: probabilityAtLeastOne * 100,
		};
	});
}

export function parseListingToB64(listing) {
	const b64Listing = listing.map(({ crateChance: c, name: n, key: k }) => ({
		c,
		n,
		k,
	}));
	const jsonListing = JSON.stringify(b64Listing);
	const jsonB64 = Buffer.from(jsonListing).toString("base64");
	return jsonB64;
}

export function parseB64ToListing(b64) {
	const jsonB64 = new Buffer(b64, "base64").toString("utf8");
	const jsonListing = JSON.parse(jsonB64);
	return jsonListing.map(({ c: crateChance, n: name, k: key }) => ({
		crateChance,
		name,
		key,
	}));
}
