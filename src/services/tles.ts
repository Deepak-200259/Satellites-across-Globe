import { EciVec3, Kilometer, propagate, SatRec } from "satellite.js";

export function getSatPosition(satRec: SatRec, now = new Date()) {
	const position = propagate(satRec, now).position as EciVec3<Kilometer>;
	if (
		!position ||
		isNaN(position.x) ||
		isNaN(position.y) ||
		isNaN(position.z)
	) {
		return [0, 0, 0];
	} else {
		return [position.x, position.y, position.z];
	}
}

export async function fetchTles() {
	const gp = await (
		await fetch(
			"https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle",
		)
	).text();
	const lines = gp.trim().split("\r\n");
	const $return = [];

	for (let i = 0; i < lines.length; i += 3) {
		const name = lines[i].trim();
		const tleLine1 = lines[i + 1].trim();
		const tleLine2 = lines[i + 2].trim();
		const tle = {
			name,
			tleLine1,
			tleLine2,
		};
		$return.push(tle);
	}

	return $return;
}
