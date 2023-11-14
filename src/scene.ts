import { Group } from "three";
import Earth from "./components/earth";
import Satellite from "./components/satellite";
import Startfield from "./components/starfield";

export default class SeedScene extends Group {
	private earth = new Earth();
	private starfield = new Startfield();
	private satellites = new Satellite();

	constructor() {
		super();
		this.add(this.earth, this.starfield, this.satellites);
	}

	update() {
		this.satellites.update();
	}
}
