import EventEmitter from "./EventEmitter";
import Application from "../Application";

export default class Mouse extends EventEmitter {
  x: number;
  y: number;
  inComputer: boolean;
  application: Application;

  constructor() {
    super();

    this.x = 0;
    this.y = 0;
    this.inComputer = false;

    // ✅ pakai DOM listener, lalu trigger ke EventEmitter
    window.addEventListener("mousemove", (event: MouseEvent) => {
      this.x = event.clientX;
      this.y = event.clientY;
      this.trigger("move", { x: this.x, y: this.y });
    });
  }
}
