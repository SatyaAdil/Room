import Application from "../Application";
import Resources from "../Utils/Resources";
import { DirectiveText } from "./DirectiveText";
import Environment from "./Environment";
import MonitorScreen from "./MonitorScreen";
import Room from "./Room";
import * as THREE from "three";

export default class World {
  application: Application;
  scene: THREE.Scene;
  resources: Resources;
  room: Room;
  monitorScreen: MonitorScreen;
  environment: Environment;
  text: DirectiveText;
  light: THREE.PointLight;
  ambient: THREE.AmbientLight;

  constructor() {
    this.application = new Application();
    this.scene = this.application.scene;
    this.resources = this.application.resources;

    // Lampu utama (mati dulu)
    this.light = new THREE.PointLight(0xffffff, 0, 15);
    this.light.position.set(2, 5, 5);
    this.scene.add(this.light);

    // Ambient light kecil biar gak full hitam
    this.ambient = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(this.ambient);

    this.resources.on("ready", () => {
      this.text = new DirectiveText();
      this.room = new Room();
      this.monitorScreen = new MonitorScreen();
      this.environment = new Environment();

      this.add();
    });
  }

  add() {
    this.monitorScreen.add();
    this.text.add();
    this.room.add();
    this.environment.add();
  }

  update() {}

  // Efek lampu nyala pelan-pelan
  turnOnLight() {
    let intensity = 0;
    const interval = setInterval(() => {
      intensity += 0.05;
      this.light.intensity = intensity;
      if (intensity >= 1) clearInterval(interval);
    }, 50);
  }
}
