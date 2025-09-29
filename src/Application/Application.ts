import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import * as THREE from "three";
import Renderer from "./Renderer";
import Camera from "./Camera/Camera";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Mouse from "./Utils/Mouse";
import UI from "./UI";
import { AudioPlayer } from "./AudioPlayer";
import { CodeBackgrounds } from "./World/CodeBackgrounds"; // ✅ sudah ada

let instance: Application | null = null;

export default class Application {
  sizes: Sizes;
  time: Time;
  scene: THREE.Scene;
  cssScene: THREE.Scene;
  mouse: Mouse;
  camera: Camera;
  renderer: Renderer;
  resources: Resources;
  world: World;
  ui: UI;
  audioPlayer: AudioPlayer;

  // ✅ Tambahan properti untuk background
  codeBg: CodeBackgrounds | null = null;

  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;
    this.ui = new UI();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.cssScene = new THREE.Scene();
    this.mouse = new Mouse();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.resources = new Resources(sources);
    this.world = new World();

    this.audioPlayer = new AudioPlayer();
    // this.camera.setOrbitControls();

    // ✅ SISIPKAN DI SINI: setelah scene dan camera siap
    this.codeBg = new CodeBackgrounds(this.scene, this.camera.instance);
    this.codeBg.add();

    this.sizes.on("resize", () => {
      this.resize();
    });
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();

    // ✅ SISIPKAN DI SINI: panggil background loop
    if (this.codeBg) this.codeBg.update(this.time.delta);
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.renderer.instance.dispose();
  }
}
