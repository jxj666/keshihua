import define1 from "./a2e58f97fd5e8d7c@620.js";

export default function define (runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["orders.csv", new URL("./files/b4fb326a8faf1b2b52df1d9fedb9ebb44720f353f58eb986e9d4e1d32bc81036783de603981a2c6c7965643bdd86a66138e5ecf56b707f24d981a5453e05f787", import.meta.url)], ["Righteous-Regular.ttf", new URL("./files/5713f7291a550481c8b3dfcdd87af180d0c32ec62ae90018c9c3d103994b655923c86d832cbb58f33b85325ad4b0e259a5995a9f2f35361a6a5b853735c1775d", import.meta.url)], ["auto2020.csv", new URL("./files/648bd1132f4640121de7fed434d1351c55dba1c24742cef01f2295bc0104a2d3eaa62225faedced173042d71d9c38e7e9a0a68d0d587fbdd5f662e11e827b4ba", import.meta.url)], ["2020oscar.csv", new URL("./files/2cec6460f25aba9f8fda8d417e384d62b749f7a6cc4dd85eb7c60b2a45c6483e85b5a7d9124d9b2c0edcb614ee81c54246e580c72d8af78d54cf5fbc09f3d7ff", import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));

  main.variable(observer("viewof dataset")).define("viewof dataset", ["Radio"], function (Radio) {
    return (
      Radio(
        ["2020 Oscar Nominations", "2020 Full Coverage Auto Insurance Cost", "Sample Dataset"],
        { label: "Dataset", value: "2020 Full Coverage Auto Insurance Cost" })
    )
  });
  main.variable(observer("dataset")).define("dataset", ["Generators", "viewof dataset"], (G, _) => G.input(_));
  main.variable(observer("viewof replay")).define("viewof replay", ["html"], function (html) {
    return (
      html`<input type=button value=Replay>`
    )
  });
  main.variable(observer("replay")).define("replay", ["Generators", "viewof replay"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["replay", "renderer", "d3cloud", "cloudDims", "cloudData", "wordAngle", "wordSize", "drawCloud", "THREE", "fontUrl", "mutable rendering", "trackMouse", "tooltip", "invalidation", "dispose"], function* (replay, renderer, d3cloud, cloudDims, cloudData, wordAngle, wordSize, drawCloud, THREE, fontUrl, $0, trackMouse, tooltip, invalidation, dispose) {
    replay;
    const div = document.createElement("div");
    div.appendChild(renderer.domElement);

    yield div;

    let font;
    const cloud = d3cloud()
      .size([cloudDims.width, cloudDims.height])
      .words(cloudData)
      .padding(0)
      .rotate(wordAngle)
      .font("impact")
      .fontSize(d => wordSize(d.value))
      .on("end", words => drawCloud(words, font));

    // D3-cloud measures words in canvas. It gives you a deviation when you try to plot those words in 3D space. If you want to change the font, you must also change the deviation in the addText function. Use try-and-error approach to find out what the appropriate value is for the font you are using (usually between 1.4 ~ 1.6).
    new THREE.TTFLoader().load(
      fontUrl,
      f => {
        font = new THREE.FontLoader().parse(f);
        cloud.start();
        $0.value = "";
      }
    );

    div.addEventListener("mousemove", trackMouse, false);
    tooltip.attach(div);
    invalidation.then(() => {
      dispose();
      cloud.stop();
      div.removeEventListener("mousemove", trackMouse);

      const mem = renderer.info.memory;
      if (mem.geometries > 0 || mem.textures > 0) console.log(mem);
    });

    return div;
  }
  );

  main.variable(observer("camera")).define("camera", ["THREE", "size", "max"], function (THREE, size, max) {
    const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.2, 1500);
    camera.updateProjectionMatrix();
    camera.position.set(0, max * 1.5, 0);
    return camera;
  }
  );
  main.variable(observer("scene")).define("scene", ["THREE"], function (THREE) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    return scene;
  }
  );

  main.variable(observer("hemisphereLight")).define("hemisphereLight", ["THREE", "scene", "render", "invalidation"], function (THREE, scene, render, invalidation) {
    const light = new THREE.HemisphereLight(0xfbfbfb, 0x0, 0.35);
    light.position.set(0, 1000, 0);
    scene.add(light);
    render();
    invalidation.then(() => scene.remove(light));
    return light;
  }
  );
  main.variable(observer("pointLight")).define("pointLight", ["THREE", "scene", "render", "invalidation"], function (THREE, scene, render, invalidation) {
    const light = new THREE.PointLight(0xfbfaf5, 2.25, 1500);
    light.decay = 2;
    light.position.set(0, 750, 0);
    scene.add(light);
    render();
    invalidation.then(() => scene.remove(light));
    return light;
  }
  );

  main.variable(observer("controls")).define("controls", ["THREE", "camera", "renderer", "max", "tooltip", "scene", "invalidation"], function (THREE, camera, renderer, max, tooltip, scene, invalidation) {
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = false;
    //controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2.5;
    controls.minDistance = 150;
    controls.maxDistance = max * 1.25;
    controls.addEventListener("change", () => {
      tooltip.clear();
      renderer.clear();
      renderer.render(scene, camera);
    });
    controls.update();
    invalidation.then(() => controls.dispose());
    return controls;
  }
  );

  main.variable(observer("renderer")).define("renderer", ["THREE", "size", "invalidation"], function (THREE, size, invalidation) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    invalidation.then(() => renderer.dispose());
    return renderer;
  }
  );
  main.variable(observer("render")).define("render", ["renderer", "scene", "camera"], function (renderer, scene, camera) {
    return (
      () => {
        renderer.clear();
        renderer.render(scene, camera);
      }
    )
  });

  main.variable(observer("raycaster")).define("raycaster", ["THREE"], function (THREE) {
    return (
      new THREE.Raycaster()
    )
  });
  main.variable(observer("mouse")).define("mouse", ["THREE"], function (THREE) {
    return (
      {
        screen: new THREE.Vector2(),
        scene: new THREE.Vector2(),
        animating: false,
        focus: null
      }
    )
  });
  main.variable(observer("trackMouse")).define("trackMouse", ["HTMLCanvasElement", "mouse", "size", "intersect"], function (HTMLCanvasElement, mouse, size, intersect) {
    return (
      e => {
        e.preventDefault();
        if (e.target instanceof HTMLCanvasElement) {
          const x = e.offsetX + e.target.offsetLeft;
          const y = e.offsetY + e.target.offsetTop;
          mouse.screen.x = x;
          mouse.screen.y = y;
          mouse.scene.x = (e.offsetX / size.width) * 2 - 1;
          mouse.scene.y = -(e.offsetY / size.height) * 2 + 1;
          if (!mouse.animating) intersect();
        }
      }
    )
  });
  main.variable(observer("intersect")).define("intersect", ["camera", "raycaster", "mouse", "scene", "cancelHighlight", "tooltip", "render"], function (camera, raycaster, mouse, scene, cancelHighlight, tooltip, render) {
    return (
      () => {
        camera.updateMatrixWorld();
        raycaster.setFromCamera(mouse.scene, camera);

        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
          let target;
          for (let current of intersects) {
            if (current.object.info) {
              target = current.object;
              break;
            }
          }

          if (target) {
            if (mouse.focus !== target) {
              cancelHighlight();
              mouse.focus = target;
              tooltip.update(mouse.focus);
              render();
            }
          }
          else cancelHighlight();
        }
        else cancelHighlight();
      }
    )
  });
  main.variable(observer("cancelHighlight")).define("cancelHighlight", ["mouse", "tooltip", "render"], function (mouse, tooltip, render) {
    return (
      () => {
        const f = mouse.focus;
        if (f) {
          mouse.focus = null;
          tooltip.clear();
          render();
        }
      }
    )
  });

  main.variable(observer("tooltip")).define("tooltip", ["initDivTooltip", "invalidation"], function (initDivTooltip, invalidation) {
    const tooltip = initDivTooltip();
    invalidation.then(() => tooltip.dispose());
    return tooltip;
  }
  );
  main.variable(observer("initDivTooltip")).define("initDivTooltip", ["format", "mouse"], function (format, mouse) {
    return (
      () => {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.display = "none";
        div.style.font = "10pt Tahoma";
        div.style.backgroundColor = "white";
        div.style.opacity = 0.85;
        div.style.borderRadius = "3px";
        div.style.boxShadow = "1px 1px 1px #666666";
        div.style.border = "solid 1px #666666";
        div.style.padding = "3px";
        div.style.pointerEvents = "none";

        const tooltip = {
          attach: function (container) {
            if (container) container.appendChild(div);
          },
          update: function (target) {
            div.innerText = target.info.name + "\n" + format(target.info.value);
            div.style.display = "block";
            div.style.left = `${mouse.screen.x + 5}px`;
            div.style.top = `${mouse.screen.y + 5}px`;
          },
          clear: function () {
            div.innerText = "";
            div.style.display = "none";
          },
          dispose: function () {
            if (div.parentElement) div.parentElement.removeChild(div);
          }
        }

        return tooltip;
      }
    )
  });

  main.variable(observer("drawCloud")).define("drawCloud", ["mouse", "controls", "camera", "cloudDims", "max", "drawFloor", "drawWords", "moveLight", "moveCamera", "render"], function (mouse, controls, camera, cloudDims, max, drawFloor, drawWords, moveLight, moveCamera, render) {
    return (
      (words, font) => {
        mouse.animating = true;
        // Disable the OrbitControls to avoid interfering with the animation
        controls.enabled = false;

        let requestId;
        const time = 1.5,
          tweens = [];

        //const gif = new GIF({ workers: 4, quality: 5, debug: true });

        animate();
        camera.position.set(-cloudDims.width * 0.4, max * 0.7, cloudDims.height);
        camera.rotation.set(-0.6, -0.35, -0.2);

        drawFloor(time, tweens);
        const firstWord = drawWords(words, font, time, tweens);
        moveLight(firstWord);
        moveCamera(time, tweens);

        Promise.all(tweens).then(() => {
          cancelAnimationFrame(requestId);
          //gif.on("finished", blob => mutable animGif = blob);
          //gif.render();
          mouse.animating = false;
          controls.enabled = true;
        });

        function animate () {
          requestId = requestAnimationFrame(animate);
          render();
          //gif.addFrame(renderer.domElement, {copy: true, delay: 0.01});
        }
      }
    )
  });
  main.variable(observer("drawFloor")).define("drawFloor", ["cloudDims", "brickDims", "addCuboid", "gsap"], function (cloudDims, brickDims, addCuboid, gsap) {
    return (
      (time, tweens) => {
        const pw = cloudDims.width * 1.4,
          ph = cloudDims.height * 1.4;

        for (let i = -pw; i < pw; i += brickDims.width) {
          for (let j = -ph; j < ph; j += brickDims.depth) {
            const cuboid = addCuboid(
              brickDims.width, brickDims.height, brickDims.depth,
              i, -500, j);

            tweens.push(gsap.to(
              cuboid.position,
              { duration: Math.random() * time, y: -brickDims.height / 2 - Math.random() * 10 }));
          }
        }
      }
    )
  });
  main.variable(observer("drawWords")).define("drawWords", ["addText", "wordHeight", "gsap"], function (addText, wordHeight, gsap) {
    return (
      (words, font, time, tweens) => {
        const rx = Math.PI * 1.5,
          rad = Math.PI / 180;

        let first;
        words
          .sort((a, b) => b.value - a.value)
          .forEach(word => {

            const text = addText(
              word.text, word.size, 5 + wordHeight(word.value),
              word.x, 500, word.y,
              rx, 0, -word.rotate * rad, font);

            text.info = { name: word.text, value: word.value };
            tweens.push(gsap.to(
              text.position,
              { duration: Math.random() * time, y: 0 }));

            // text-anchor = middle in SVG
            if (!text.geometry.boundingBox) text.geometry.computeBoundingBox();
            const tw = text.geometry.boundingBox.max.x;
            if (!first) first = text;
            if (word.rotate === 0)
              text.position.x -= tw / 2;
            else
              text.position.z -= tw / 2;
          });

        return first;
      }
    )
  });
  main.variable(observer("moveLight")).define("moveLight", ["pointLight"], function (pointLight) {
    return (
      focus => {
        if (focus.rotation.z !== 0) {
          pointLight.position.x = focus.position.x + focus.geometry.boundingBox.max.z / 2;
          pointLight.position.z = focus.position.z + focus.geometry.boundingBox.max.x / 2;
        }
        else {
          pointLight.position.x = focus.position.x + focus.geometry.boundingBox.max.x / 2;
          pointLight.position.z = focus.position.z - focus.geometry.boundingBox.max.z / 2;
        }
      }
    )
  });
  main.variable(observer("moveCamera")).define("moveCamera", ["cloudDims", "max", "gsap", "camera"], function (cloudDims, max, gsap, camera) {
    return (
      (time, tweens) => {
        const y = cloudDims.width === cloudDims.height ? max * 1.2 : max;
        tweens.push(gsap.to(camera.position, { duration: time * 1.5, x: 0, y: y, z: 0 }));
        tweens.push(gsap.to(camera.rotation, { duration: time * 1.5, x: -1.57, y: 0, z: 0 }));
      }
    )
  });

  main.variable(observer("addCuboid")).define("addCuboid", ["THREE", "pool", "scene"], function (THREE, pool, scene) {
    return (
      (w, h, d, x, y, z) => {
        const cuboid = new THREE.Mesh(pool.floorGeometry, pool.floorMaterial);
        cuboid.position.set(x + w / 2, y, z + d / 2);
        cuboid.scale.set(w, h, d);
        scene.add(cuboid);
        return cuboid;
      }
    )
  });
  main.variable(observer("addText")).define("addText", ["THREE", "pool", "scene"], function (THREE, pool, scene) {
    return (
      (text, size, h, x, y, z, rx, ry, rz, font) => {
        const deviation = 1.75;
        const geometry = new THREE.TextBufferGeometry(
          text,
          { font: font, size, height: h, curveSegments: 4, bevelThickness: 2, bevelSize: 2, bevelEnabled: true });
        geometry.computeBoundingSphere();
        geometry.computeVertexNormals();

        const mesh = new THREE.Mesh(geometry, pool.textMaterial);
        mesh.position.set(x * deviation, y, z * deviation);
        mesh.rotation.set(rx, ry, rz);
        scene.add(mesh);
        return mesh;
      }
    )
  });
  main.variable(observer("floorColor")).define("floorColor", function () {
    return (
      0x98c1d9
    )
  });
  main.variable(observer("textColor")).define("textColor", function () {
    return (
      0xffffff
    )
  });
  main.variable(observer("pool")).define("pool", ["THREE", "floorColor", "textColor"], function (THREE, floorColor, textColor) {
    return (
      {
        floorGeometry: new THREE.BoxBufferGeometry(1, 1, 1),
        floorMaterial: new THREE.MeshPhongMaterial({ color: floorColor, flatShading: true }),
        textMaterial: new THREE.MeshPhongMaterial({ color: textColor, flatShading: true })
      }
    )
  });
  main.variable(observer("dispose")).define("dispose", ["scene", "THREE"], function (scene, THREE) {
    return (
      () => {
        cleanup(scene);

        function cleanup (obj) {
          for (let i = obj.children.length - 1; i >= 0; i--) {
            const child = obj.children[i];
            if (!(child instanceof THREE.Light)) {
              obj.remove(child);
              if (child.geometry) child.geometry.dispose();
              if (child.material) child.material.dispose();
              if (child.children && child.children.length > 0) cleanup(child);
            }
          }
        }
      }
    )
  });

  main.variable(observer("cloudData")).define("cloudData", ["dataset", "sales", "insurance", "oscar"], function (dataset, sales, insurance, oscar) {
    if (dataset === "Sample Dataset") return sales;
    else if (dataset === "2020 Full Coverage Auto Insurance Cost") return insurance;
    else return oscar;
  }
  );

  main.variable(observer("insurance")).define("insurance", ["d3", "FileAttachment"], async function (d3, FileAttachment) {
    return (
      d3
        .csvParse(await FileAttachment("auto2020.csv").text(), d3.autoType)
        .map(d => ({ text: d.State, value: d.Full }))
    )
  });

  main.variable(observer("oscar")).define("oscar", ["d3", "FileAttachment"], async function (d3, FileAttachment) {
    const src = d3.csvParse(await FileAttachment("2020oscar.csv").text(), d3.autoType);
    return Array.from(d3.rollup(src, v => v.length, d => d.Film)).map(d => ({ text: d[0], value: d[1] }));
  }
  );
  main.variable(observer("sales")).define("sales", ["d3", "FileAttachment"], async function (d3, FileAttachment) {
    return (
      d3
        .csvParse(await FileAttachment("orders.csv").text(), d3.autoType)
        .map(d => ({ text: d.Subcategory, value: d.Quantity }))
    )
  });
  main.variable(observer("wordAngle")).define("wordAngle", function () {
    return (
      () => ~~(Math.random() * 2) * 90
    )
  });
  main.variable(observer("ext")).define("ext", ["d3", "cloudData"], function (d3, cloudData) {
    return (
      d3.extent(cloudData.map(d => d.value))
    )
  });
  main.variable(observer("wordSize")).define("wordSize", ["d3", "ext"], function (d3, ext) {
    return (
      d3.scaleLinear().domain(ext).range([24, 48])
    )
  });
  main.variable(observer("wordHeight")).define("wordHeight", ["d3", "ext"], function (d3, ext) {
    return (
      d3.scaleLinear().domain(ext).range([5, 30])
    )
  });
  main.variable(observer("format")).define("format", ["d3"], function (d3) {
    return (
      d3.format(",d")
    )
  });
  main.variable(observer("max")).define("max", ["cloudDims"], function (cloudDims) {
    return (
      Math.max(cloudDims.width, cloudDims.height)
    )
  });
  main.variable(observer("cloudDims")).define("cloudDims", function () {
    return (
      { width: 600, height: 500 }
    )
  });
  main.variable(observer("brickDims")).define("brickDims", function () {
    return (
      { width: 100, height: 100, depth: 100 }
    )
  });

  main.variable(observer("fontUrl")).define("fontUrl", ["FileAttachment"], async function (FileAttachment) {
    return (
      await FileAttachment("Righteous-Regular.ttf").url()
    )
  });
  main.variable(observer("size")).define("size", ["width", "screen"], function (width, screen) {
    return (
      { width: width, height: screen.height * 0.7 }
    )
  });
  main.define("initial rendering", function () {
    return (
      "Rendering... 😀"
    )
  });
  main.variable(observer("mutable rendering")).define("mutable rendering", ["Mutable", "initial rendering"], (M, _) => new M(_));
  main.variable(observer("rendering")).define("rendering", ["mutable rendering"], _ => _.generator);
  const child1 = runtime.module(define1);
  main.import("Radio", child1);
  main.variable(observer("opentype")).define("opentype", ["require"], async function (require) {
    window.opentype = await require("opentype.js");
    return window.opentype;
  }
  );
  main.variable(observer("gsap")).define("gsap", ["require"], async function (require) {
    const gs = await require('gsap@3.6.0/dist/gsap.js');
    return gs.gsap;
  }
  );
  main.variable(observer("THREE")).define("THREE", ["require"], async function (require) {
    const THREE = window.THREE = await require("three@0.124.0/build/three.min.js");
    await require("three@0.124.0/examples/js/controls/OrbitControls.js").catch(() => { });
    await require("three@0.124.0/examples/js/loaders/TTFLoader.js").catch(() => { });
    return THREE;
  }
  );
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return (
      require("d3@6")
    )
  });
  main.variable(observer("d3cloud")).define("d3cloud", ["require"], function (require) {
    return (
      require("d3-cloud")
    )
  });

  return main;
}
