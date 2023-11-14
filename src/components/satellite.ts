import { twoline2satrec } from "satellite.js";
import {
	Camera,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Raycaster,
	SphereGeometry,
	Vector2,
} from "three";
import { DIVISOR } from "../constants";
import { hideFetching } from "../dom";
import { fetchTles, getSatPosition } from "../services/tles";

export default class Satellite extends Mesh {
	private tles: { name: string; tleLine1: string; tleLine2: string }[] = [];
	private positions: number[][] = [];
	private meshes: Mesh[] = [];
	private raycaster = new Raycaster();
	private tooltip: HTMLElement | null = document.getElementById("tooltip");
	private sharedMaterial = new MeshBasicMaterial({ color: 0xffffff });
	private sharedGeometry = new SphereGeometry(0.004);
	private lastUpdateTime = 0;
	private updateInterval = 1000;
	private camera: Camera | null = null;

	constructor(sceneCamera: PerspectiveCamera) {
		super();
		this.camera = sceneCamera;
		this.fetchTles();
		this.setEvents();
		this.rotation.x = Math.PI / 2;
	}

	setEvents() {
		document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
		document.addEventListener("mouseout", this.onMouseOut.bind(this), false);
	}

	onMouseMove(event: MouseEvent) {
		const mouse = new Vector2();
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		if (this.camera) this.raycaster.setFromCamera(mouse, this.camera);

		const intersects = this.raycaster.intersectObjects(this.meshes);

		if (intersects.length > 0) {
			if (intersects[0].object instanceof Mesh) {
				const index = this.meshes.indexOf(intersects[0].object);
				if (this.tooltip) {
					this.tooltip.style.display = "block";
					this.tooltip.style.left = `${event.clientX}px`;
					this.tooltip.style.top = `${event.clientY}px`;
					this.tooltip.innerHTML = this.tles[index].name;
				}
			} else {
				if (this.tooltip) this.tooltip.style.display = "none";
			}
		}
	}

	onMouseOut() {
		if (this.tooltip) this.tooltip.style.display = "none";
	}

	private fetchTles() {
		fetchTles().then((d) => {
			this.tles = d;
			this.tles.forEach((_, i) => {
				this.meshes[i] = new Mesh(this.sharedGeometry, this.sharedMaterial);
				this.add(this.meshes[i]);
				hideFetching();
			});
		});
	}

	private propagatePositions(tles: typeof this.tles) {
		if (tles.length === 0) return;

		for (let i = 0; i < tles.length; i++) {
			const satRec = twoline2satrec(tles[i].tleLine1, tles[i].tleLine2);
			const [x, y, z] = getSatPosition(satRec, new Date());
			this.positions[i] = [x / DIVISOR, y / DIVISOR, z / DIVISOR];
		}
	}

	update() {
		const currentTime = Date.now();
		if (currentTime - this.lastUpdateTime >= this.updateInterval) {
			this.propagatePositions(this.tles);
			this.lastUpdateTime = currentTime;
		}
		if (!this.positions.length) return;

		this.positions.forEach(([x, y, z], i) => {
			this.meshes[i].position.x = x;
			this.meshes[i].position.y = y;
			this.meshes[i].position.z = z;
		});
	}
}
