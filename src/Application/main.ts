import Application from "./Application";
new Application();

const app = new Application();

app.resources.on("ready", () => {
  // loading selesai → nyalain lampu
  setTimeout(() => {
    app.world.turnOnLight();
  }, 1000);
});