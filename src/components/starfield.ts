import {
	BackSide,
	Mesh,
	MeshBasicMaterial,
	SphereGeometry,
	TextureLoader,
} from "three";
import starfield from "../assets/galaxy_starfield.png";

export default class Startfield extends Mesh {
	constructor() {
		const geometry = new SphereGeometry(90, 64, 64);
		const material = new MeshBasicMaterial({
			map: new TextureLoader().load(starfield),
			side: BackSide,
		});

		super(geometry, material);
	}
}
