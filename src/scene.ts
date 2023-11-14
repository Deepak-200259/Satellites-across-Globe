import { Group, PerspectiveCamera } from "three";
import Earth from "./components/earth";
import Satellite from "./components/satellite";
import Startfield from "./components/starfield";

export default class SeedScene extends Group {
	private earth = new Earth();
	private starfield = new Startfield();
	private satellites: Satellite | null = null;

	constructor(sceneCamera: PerspectiveCamera) {
		super();
		let camera = sceneCamera;
		this.satellites = new Satellite(camera);
		this.add(this.earth, this.starfield, this.satellites, camera);
		console.log(this);
	}

	update() {
		if (this.satellites) this.satellites.update();
	}
}
