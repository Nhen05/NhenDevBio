
    (function () {
      const canvas = document.getElementById('c');
      const W = window.innerWidth, H = window.innerHeight;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(W, H);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x040d06, .02);

      const cam = new THREE.PerspectiveCamera(60, W / H, .1, 200);
      cam.position.z = 26;

      /* particles */
      const N = 500;
      const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
      const spd = new Float32Array(N), off = new Float32Array(N);
      const C = { g: new THREE.Color('#00e676'), g2: new THREE.Color('#69f0ae'), r: new THREE.Color('#ff1744'), w: new THREE.Color('#c8ffd4') };

      for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - .5) * 100;
        pos[i * 3 + 1] = (Math.random() - .5) * 70;
        pos[i * 3 + 2] = (Math.random() - .5) * 40;
        spd[i] = .3 + Math.random() * .9;
        off[i] = Math.random() * Math.PI * 2;
        const r = Math.random();
        const c = r < .12 ? C.r : r < .5 ? C.g : r < .78 ? C.g2 : C.w;
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const mat = new THREE.PointsMaterial({ size: .25, vertexColors: true, transparent: true, opacity: .9, sizeAttenuation: true });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);

      /* grid */
      const grid = new THREE.GridHelper(140, 30, 0x003311, 0x001508);
      grid.position.y = -20; grid.rotation.x = .1;
      scene.add(grid);

      /* floating rings */
      const rings = [];
      for (let i = 0; i < 4; i++) {
        const g2 = new THREE.RingGeometry(3 + i * 4, 3.15 + i * 4, 64);
        const m2 = new THREE.MeshBasicMaterial({ color: i === 0 ? 0xff1744 : 0x00e676, transparent: true, opacity: .06 - i * .01, side: THREE.DoubleSide });
        const r2 = new THREE.Mesh(g2, m2);
        r2.rotation.x = Math.PI / 2 + Math.random() * .4;
        r2.rotation.z = Math.random() * Math.PI;
        r2.position.set((Math.random() - .5) * 10, (Math.random() - .5) * 6, 0);
        scene.add(r2); rings.push(r2);
      }

      let t = 0;
      (function loop() {
        requestAnimationFrame(loop);
        t += .011;
        const p = geo.attributes.position.array;
        for (let i = 0; i < N; i++) {
          p[i * 3 + 1] += Math.sin(t * spd[i] + off[i]) * .013;
          p[i * 3] += .006 * spd[i];
          if (p[i * 3] > 50) p[i * 3] = -50;
        }
        geo.attributes.position.needsUpdate = true;
        pts.rotation.y = Math.sin(t * .06) * .04;
        grid.position.z = (t * 1.2) % 5;
        rings.forEach((r, i) => { r.rotation.z += .002 + i * .001; r.rotation.x += .001 });
        renderer.render(scene, cam);
      })();

      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
      });
    })();
 