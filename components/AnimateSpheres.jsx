import { Stage, useTick, useApp } from "@pixi/react-pixi";
import * as PIXI from "pixi.js";
import { createNoise2D } from "simplex-noise";
import hsl from "hsl-to-hex";
import debounce from "debounce";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";
import useDeviceSize from "./useDeviceSize";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function map(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

const noise2D = createNoise2D();

class ColorPalette {
  constructor() {
    this.setColors();
    this.setCustomProperties();
  }

  setColors() {
    this.hue = ~~random(50, 360);
    this.complimentaryHue1 = this.hue + 30;
    this.complimentaryHue2 = this.hue + 60;
    this.saturation = 95;
    this.lightness = 50;
    this.baseColor = hsl(this.hue, this.saturation, this.lightness);

    this.complimentaryColor1 = hsl(
      this.complimentaryHue1,
      this.saturation,
      this.lightness
    );

    this.complimentaryColor2 = hsl(
      this.complimentaryHue2,
      this.saturation,
      this.lightness
    );

    this.colorChoices = [
      this.baseColor,
      this.complimentaryColor1,
      this.complimentaryColor2,
    ];
  }

  randomColor() {
    return this.colorChoices[~~random(0, this.colorChoices.length)].replace(
      "#",
      "0x"
    );
  }

  setCustomProperties() {
    document.documentElement.style.setProperty("--hue", this.hue);
    document.documentElement.style.setProperty(
      "--hue-complimentary1",
      this.complimentaryHue1
    );
    document.documentElement.style.setProperty(
      "--hue-complimentary2",
      this.complimentaryHue2
    );
  }
}

class Orb {
  constructor(fill = 0x000000) {
    this.bounds = this.setBounds();

    this.x = random(this.bounds["x"].min, this.bounds["x"].max);
    this.y = random(this.bounds["y"].min, this.bounds["y"].max);

    this.scale = 1;

    this.fill = fill;

    this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

    this.xOff = random(0, 1000);
    this.yOff = random(0, 1000);

    this.inc = 0.0005;

    this.graphics = new PIXI.Graphics();
    this.graphics.alpha = 0.825;

    window.addEventListener(
      "resize",
      debounce(() => {
        this.bounds = this.setBounds();
      }, 250)
    );
  }

  setBounds() {
    const maxDist =
      window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;

    const originX = window.innerWidth / 1.25;
    const originY =
      window.innerWidth < 1000
        ? window.innerHeight
        : window.innerHeight / 1.375;

    return {
      x: {
        min: originX - maxDist,
        max: originX + maxDist,
      },
      y: {
        min: originY - maxDist,
        max: originY + maxDist,
      },
    };
  }

  update() {
    const xNoise = noise2D(this.xOff, this.xOff);
    const yNoise = noise2D(this.yOff, this.yOff);
    const scaleNoise = noise2D(this.xOff, this.yOff);

    this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
    this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
    this.scale = map(scaleNoise, -1, 1, 0.5, 1);

    this.xOff += this.inc;
    this.yOff += this.inc;
  }

  render() {
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    this.graphics.scale.set(this.scale);
    this.graphics.clear();
    this.graphics.beginFill(this.fill);
    this.graphics.drawCircle(0, 0, this.radius);
    this.graphics.endFill();
  }
}

function SphereCanvas() {
  const app = useApp();
  app.stage.filters = [new KawaseBlurFilter(30, 10, true)];
  const colorPalette = new ColorPalette();
  const orbs = [];

  for (let i = 0; i < 10; i++) {
    const orb = new Orb(colorPalette.randomColor());
    app.stage.addChild(orb.graphics);
    orbs.push(orb);
  }

  useTick(() => {
    orbs.forEach((orb) => {
      orb.update();
      orb.render();
    });
  });

  document.getElementById("ColorsButton").addEventListener("click", () => {
    colorPalette.setColors();
    colorPalette.setCustomProperties();

    orbs.forEach((orb) => {
      orb.fill = colorPalette.randomColor();
    });
  });
}

const AnimateSphereBackground = () => {
  const [width, height] = useDeviceSize();

  return (
    <Stage width={width} height={height} options={{ backgroundAlpha: 0 }}>
      <SphereCanvas />
    </Stage>
  );
};

export default AnimateSphereBackground;
