import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import SeedScene from "./scene";
import "./style.css";

(async () => {
	const scene = new Scene();
	const camera = new PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);
	camera.frustumCulled = true;

	const renderer = new WebGLRenderer();
	const controls = new OrbitControls(camera, renderer.domElement);
	const seedScene = new SeedScene(camera);
	const stats = new Stats();
	stats.showPanel(0);
	document.body.appendChild(stats.dom);

	scene.add(seedScene);

	function onAnimationFrameHandler() {
		stats.begin();
		renderer.render(scene, camera);
		seedScene?.update && seedScene?.update();
		stats.end();
		window.requestAnimationFrame(onAnimationFrameHandler);
	}

	function windowResizeHandler() {
		const { innerHeight, innerWidth } = window;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.position.set(0, 0, 2);
		camera.lookAt(0, 0, 0);
		camera.updateProjectionMatrix();

		controls.minDistance = 0.7;
		controls.maxDistance = 10;
		controls.update();

		renderer.setSize(innerWidth, innerHeight);
	}

	windowResizeHandler();
	window.requestAnimationFrame(onAnimationFrameHandler);
	window.addEventListener("resize", windowResizeHandler);
	document.body.appendChild(renderer.domElement);
})();
