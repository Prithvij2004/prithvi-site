(function () {
  const canvases = document.querySelectorAll(".rose-canvas");

  canvases.forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    const rose = {
      turns: 1,
      speed: 0.42,
      point(t) {
        const r = Math.cos(6 * t);
        return {
          x: r * Math.cos(t),
          y: r * Math.sin(t),
          z: 0.3 * Math.sin(12 * t)
        };
      }
    };

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let autoYaw = Number(canvas.dataset.autoYaw || 0);
    let manualYaw = Number(canvas.dataset.manualYaw || 0);
    let manualPitch = Number(canvas.dataset.manualPitch || -0.35);
    let previousTime = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    function syncState() {
      canvas.dataset.pattern = "rose";
      canvas.dataset.turns = String(rose.turns);
      canvas.dataset.speed = String(rose.speed);
      canvas.dataset.pointCount = "1500";
      canvas.dataset.perspective = "3.4";
      canvas.dataset.autoRotating = String(!isDragging);
      canvas.dataset.autoYaw = autoYaw.toFixed(6);
      canvas.dataset.manualYaw = manualYaw.toFixed(6);
      canvas.dataset.manualPitch = manualPitch.toFixed(6);
      canvas.dataset.rotationYaw = (autoYaw + manualYaw).toFixed(6);
      canvas.dataset.rotationPitch = manualPitch.toFixed(6);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function rotate3DPoint(point, pitch, yaw) {
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const yAfterPitch = point.y * cosPitch - point.z * sinPitch;
      const zAfterPitch = point.y * sinPitch + point.z * cosPitch;

      return {
        x: point.x * cosYaw + zAfterPitch * sinYaw,
        y: yAfterPitch,
        z: -point.x * sinYaw + zAfterPitch * cosYaw
      };
    }

    function project3DPoint(point, centerX, centerY, radius) {
      const cameraDistance = 3.4;
      const perspective = cameraDistance / (cameraDistance + point.z);

      return {
        x: centerX + point.x * radius * perspective,
        y: centerY + point.y * radius * perspective
      };
    }

    function draw(time) {
      const secondsPassed = previousTime === 0 ? 0 : (time - previousTime) / 1000;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.36;

      previousTime = time;

      if (!isDragging) {
        autoYaw += secondsPassed * rose.speed;
      }

      syncState();

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 1.15;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();

      for (let i = 0; i <= 1500; i += 1) {
        const t = (i / 1500) * Math.PI * 2 * rose.turns;
        const unitPoint = rose.point(t);
        const rotated = rotate3DPoint(unitPoint, manualPitch, autoYaw + manualYaw);
        const projected = project3DPoint(rotated, centerX, centerY, radius);

        if (i === 0) {
          ctx.moveTo(projected.x, projected.y);
        } else {
          ctx.lineTo(projected.x, projected.y);
        }
      }

      ctx.stroke();
      requestAnimationFrame(draw);
    }

    canvas.addEventListener("pointerdown", (event) => {
      isDragging = true;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!isDragging) {
        return;
      }

      manualYaw += (event.clientX - lastPointerX) * 0.01;
      manualPitch += (event.clientY - lastPointerY) * 0.01;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      syncState();
    });

    canvas.addEventListener("pointerup", (event) => {
      isDragging = false;
      canvas.releasePointerCapture(event.pointerId);
      syncState();
    });

    canvas.addEventListener("pointercancel", () => {
      isDragging = false;
      syncState();
    });

    window.addEventListener("resize", resize);
    resize();
    syncState();
    requestAnimationFrame(draw);

    window.getSidebarRoseState = function () {
      return {
        pattern: "rose",
        turns: rose.turns,
        speed: rose.speed,
        pointCount: 1500,
        perspective: 3.4,
        isDragging,
        autoYaw,
        manualYaw,
        manualPitch,
        rotationYaw: autoYaw + manualYaw,
        rotationPitch: manualPitch
      };
    };
  });
})();
