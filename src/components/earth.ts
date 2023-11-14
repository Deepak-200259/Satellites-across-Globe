import { Mesh, MeshBasicMaterial, SphereGeometry, TextureLoader } from 'three';
import earthMap from '../assets/earthmap4k.jpg';
import { DIVISOR, EARTH_RADIUS_KM } from '../constants';

// Links:
// - https://web.archive.org/web/20140209081927/http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
// - https://blog.mastermaps.com/2013/09/creating-webgl-earth-with-threejs.html
// - https://threejs.org/docs/#api/en/geometries/SphereGeometry
export default class Earth extends Mesh {
  constructor() {
    const geometry = new SphereGeometry(EARTH_RADIUS_KM / DIVISOR, 64, 64);
    const material = new MeshBasicMaterial({
      map: (new TextureLoader).load(earthMap),
    });

    super(geometry, material);
  }
}
