import * as THREE from "three";

export class CodeBackgrounds {
  scene: THREE.Scene;
  camera: THREE.Camera;
  terminalCanvas: HTMLCanvasElement;
  terminalCtx: CanvasRenderingContext2D;
  terminalTexture: THREE.CanvasTexture;
  terminalMesh: THREE.Mesh;

  debugGroup: THREE.Group;

  lastTerminalUpdate = 0;
  debugCooldown = 0;
  beepAudio: HTMLAudioElement;
  
  terminalLines: string[] = [];
  maxLines = 25;
  cursorBlink = 0;

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;

    // TERMINAL CANVAS
    this.terminalCanvas = document.createElement("canvas");
    this.terminalCanvas.width = 2048;
    this.terminalCanvas.height = 1024;
    this.terminalCtx = this.terminalCanvas.getContext("2d")!;
    this.terminalTexture = new THREE.CanvasTexture(this.terminalCanvas);
    this.terminalTexture.minFilter = THREE.LinearFilter;
    this.terminalTexture.magFilter = THREE.LinearFilter;
    this.terminalTexture.needsUpdate = true;

    this.terminalMesh = null as any;
    this.debugGroup = new THREE.Group();

    // Beep Sound
    this.beepAudio = new Audio("/audio/beep.mp3");
    this.beepAudio.volume = 0.15;
    
    // Initialize with some terminal lines
    this.terminalLines = [
      "$ system boot sequence initialized...",
      "$ loading kernel modules...",
      "$ mounting file systems...",
    ];
  }

  add() {
    const planeGeo = new THREE.PlaneGeometry(60, 30);
    const mat = new THREE.MeshBasicMaterial({
      map: this.terminalTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });

    this.terminalMesh = new THREE.Mesh(planeGeo, mat);
    this.terminalMesh.position.set(0, 0, -40);
    this.camera.add(this.terminalMesh);

    this.scene.add(this.debugGroup);
  }

  update(delta: number) {
    this.lastTerminalUpdate += delta;
    this.cursorBlink += delta;
    
    if (this.lastTerminalUpdate > 0.1) {
      this._drawTerminal();
      this.terminalTexture.needsUpdate = true;
      this.lastTerminalUpdate = 0;
    }

    // ADD NEW TERMINAL LINE
    this.debugCooldown -= delta;
    if (this.debugCooldown <= 0) {
      this._addTerminalLine();
      this.beepAudio.currentTime = 0;
      this.beepAudio.play().catch(() => {});
      this.debugCooldown = 1.5 + Math.random() * 2.5;
    }

    // Billboard debug sprites
    this.debugGroup.children.forEach((child) => {
      child.quaternion.copy(this.camera.quaternion);
    });
  }

  _drawTerminal() {
    const ctx = this.terminalCtx;
    const w = this.terminalCanvas.width;
    const h = this.terminalCanvas.height;
    
    // Clear with fully transparent background
    ctx.clearRect(0, 0, w, h);
    
    // Optional: very subtle dark background (comment out for fully transparent)
    // ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    // ctx.fillRect(0, 0, w, h);

    // Terminal text styling
    ctx.font = "28px 'Courier New', monospace";
    const lineHeight = 38;
    const startY = 40;
    
    // Draw each terminal line
    this.terminalLines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      
      // Determine color based on line content
      let color = "#00ff00"; // Default green
      
      if (line.includes("ERROR") || line.includes("GAGAL")) {
        color = "#ff4444";
      } else if (line.includes("WARNING") || line.includes("PERINGATAN")) {
        color = "#ffaa00";
      } else if (line.includes("INFO") || line.includes("loading")) {
        color = "#00aaff";
      } else if (line.includes("SUCCESS") || line.includes("SUKSES")) {
        color = "#00ff88";
      } else if (line.startsWith("$")) {
        color = "#00ff00";
      }
      
      ctx.fillStyle = color;
      ctx.fillText(line, 40, y);
    });
    
    // Blinking cursor on last line
    if (this.cursorBlink % 1 < 0.5) {
      const lastLineY = startY + (this.terminalLines.length) * lineHeight;
      ctx.fillStyle = "#00ff00";
      ctx.fillRect(40, lastLineY - 24, 16, 28);
    }
  }

  _addTerminalLine() {
    const commands = [
      "$ npm install dependencies...",
      "$ compiling TypeScript sources...",
      "$ webpack bundling modules...",
      "$ starting dev server on port 3000...",
      "INFO: Hot reload aktif",
      "DEBUG: Component mounted successfully",
      "$ git pull origin main",
      "SUCCESS: Build completed in 2.4s",
      "$ yarn start",
      "INFO: Watching for file changes...",
      "DEBUG: State updated → render()",
      "$ docker-compose up -d",
      "INFO: Container started: app_1",
      "WARNING: Deprecated API usage detected",
      "$ test suite running...",
      "SUCCESS: All tests passed ✓",
      "$ deploying to production...",
      "INFO: Asset optimization 98%",
      "DEBUG: WebGL context initialized",
      "$ node server.js",
      "INFO: Express listening on 8080",
      "DEBUG: Database connection pool ready",
      "$ monitoring active connections...",
      "INFO: Memory usage: 234MB / 8GB",
      "DEBUG: Garbage collection cycle complete",
    ];
    
    const newLine = commands[Math.floor(Math.random() * commands.length)];
    this.terminalLines.push(newLine);
    
    // Keep only recent lines
    if (this.terminalLines.length > this.maxLines) {
      this.terminalLines.shift();
    }
    
    // Spawn floating debug sprite
    this._spawnDebugSprite(newLine);
  }

  _spawnDebugSprite(text: string) {
    // Extract just the key part of the message for sprite
    let shortText = text;
    if (text.length > 30) {
      shortText = text.substring(0, 27) + "...";
    }
    
    const tex = this._createTextTexture(shortText, "#00ff88");
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ 
        map: tex, 
        transparent: true, 
        opacity: 0.7 
      })
    );
    
    sprite.position.set(
      (Math.random() - 0.5) * 3, 
      1.5 + Math.random() * 1.5, 
      -0.8 + Math.random() * 0.5
    );
    sprite.scale.set(1.2, 0.5, 1);
    this.debugGroup.add(sprite);

    // Fade out and remove
    setTimeout(() => {
      if (sprite.material instanceof THREE.SpriteMaterial) {
        const fadeOut = setInterval(() => {
          if (sprite.material instanceof THREE.SpriteMaterial) {
            sprite.material.opacity -= 0.05;
            if (sprite.material.opacity <= 0) {
              clearInterval(fadeOut);
              this.debugGroup.remove(sprite);
            }
          }
        }, 50);
      }
    }, 1000);
  }

  _createTextTexture(text: string, color: string) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = "22px 'Courier New', monospace";
    const w = ctx.measureText(text).width + 30;
    canvas.width = w;
    canvas.height = 40;
    
    // Fully transparent background
    ctx.clearRect(0, 0, w, 40);
    
    ctx.font = "22px 'Courier New', monospace";
    ctx.fillStyle = color;
    ctx.fillText(text, 15, 28);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }
}