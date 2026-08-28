/* ============================================================
   A RODA

   Aro de liga leve montado inteiro por geometria: nenhum arquivo de
   modelo entra na página. Perfil do pneu por revolução (lathe), barril
   por cilindro, raios por extrusão de um trapézio, disco de freio com
   furos de ventilação e pinça vermelha atrás.

   O reflexo do metal vem de um ambiente de estúdio gerado em memória
   (RoomEnvironment + PMREM). Sem mapa de ambiente, metal renderiza
   quase preto — foi o que derrubou a primeira tentativa.

   A rolagem gira a roda; o ponteiro inclina de leve. Nada disso roda
   quando a pessoa pediu menos movimento: aí a roda fica parada, de três
   quartos, que é a posição em que ela se lê melhor.
   ============================================================ */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap, ScrollTrigger, prefersReduced } from './anim.js';

export default function Roda({ className }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const parado = prefersReduced();

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      /* sem WebGL a capa continua de pé: a cena é o fundo, não o conteúdo */
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0.15, 0.32, 8.1);
    camera.lookAt(0, 0, 0);

    /* ---------- ambiente de estúdio, gerado em memória ---------- */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    /* ---------- luz de box: uma fria de cima, uma quente de trás ---------- */
    const chave = new THREE.DirectionalLight(0xdfe9ff, 2.6);
    chave.position.set(4, 5, 6);
    scene.add(chave);

    const contra = new THREE.DirectionalLight(0xffd9c2, 1.35);
    contra.position.set(-5, -1.5, -4);
    scene.add(contra);

    /* refletor frio de um lado, brasa vermelha do outro: as duas cores
       da marca fazendo o trabalho da luz, em vez de tingir o metal */
    const frio = new THREE.PointLight(0xeaf2ff, 52, 22);
    frio.position.set(-3.4, 2.6, 3.2);
    scene.add(frio);

    const rubi = new THREE.PointLight(0xe0231f, 40, 20);
    rubi.position.set(3.6, -2.4, 2.4);
    scene.add(rubi);

    scene.add(new THREE.AmbientLight(0x7c8794, 0.5));

    /* ---------- materiais ---------- */
    const borracha = new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.92, metalness: 0.02 });
    const liga = new THREE.MeshStandardMaterial({
      color: 0xc9ccd2,
      roughness: 0.24,
      metalness: 1,
      envMapIntensity: 1.25,
    });
    const ligaEscovada = new THREE.MeshStandardMaterial({
      color: 0x8e949c,
      roughness: 0.46,
      metalness: 1,
      envMapIntensity: 0.9,
    });
    const ferro = new THREE.MeshStandardMaterial({ color: 0x4a4f56, roughness: 0.62, metalness: 0.85 });
    const pinca = new THREE.MeshStandardMaterial({ color: 0xe0231f, roughness: 0.34, metalness: 0.5 });

    const roda = new THREE.Group();
    scene.add(roda);

    /* ---------- pneu: perfil revolvido ---------- */
    const perfil = [
      [1.3, -0.44],
      [1.52, -0.46],
      [1.74, -0.4],
      [1.88, -0.26],
      [1.94, -0.1],
      [1.95, 0.1],
      [1.88, 0.26],
      [1.74, 0.4],
      [1.52, 0.46],
      [1.3, 0.44],
    ].map(([x, y]) => new THREE.Vector2(x, y));

    const pneu = new THREE.Mesh(new THREE.LatheGeometry(perfil, 96), borracha);
    pneu.rotation.x = Math.PI / 2;
    roda.add(pneu);

    /* sulcos rasgando a banda de rodagem */
    const sulcoMat = new THREE.MeshStandardMaterial({ color: 0x090a0c, roughness: 1 });
    for (let i = 0; i < 3; i++) {
      const sulco = new THREE.Mesh(new THREE.TorusGeometry(1.94, 0.028, 8, 120), sulcoMat);
      sulco.position.z = -0.18 + i * 0.18;
      roda.add(sulco);
    }

    /* ---------- barril e aba do aro ---------- */
    const barril = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.28, 0.9, 72, 1, true), ligaEscovada);
    barril.rotation.x = Math.PI / 2;
    roda.add(barril);

    const aba = new THREE.Mesh(new THREE.TorusGeometry(1.29, 0.075, 20, 96), liga);
    aba.position.z = 0.44;
    roda.add(aba);

    /* ---------- raios: trapézio extrudado, cinco vezes ---------- */
    const raioShape = new THREE.Shape();
    raioShape.moveTo(-0.2, 0.36);
    raioShape.lineTo(0.2, 0.36);
    raioShape.lineTo(0.34, 1.24);
    raioShape.lineTo(-0.34, 1.24);
    raioShape.closePath();

    const raioGeo = new THREE.ExtrudeGeometry(raioShape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
      curveSegments: 6,
    });
    raioGeo.translate(0, 0, 0.18);

    for (let i = 0; i < 5; i++) {
      const raio = new THREE.Mesh(raioGeo, liga);
      raio.rotation.z = (i / 5) * Math.PI * 2;
      roda.add(raio);
    }

    const anel = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.09, 18, 96), liga);
    anel.position.z = 0.3;
    roda.add(anel);

    /* ---------- cubo, tampa e parafusos ---------- */
    const cubo = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.5, 0.34, 48), liga);
    cubo.rotation.x = Math.PI / 2;
    cubo.position.z = 0.33;
    roda.add(cubo);

    const tampa = new THREE.Mesh(
      new THREE.CircleGeometry(0.4, 48),
      new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.3, metalness: 0.4 }),
    );
    tampa.position.z = 0.51;
    roda.add(tampa);

    const anelTampa = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.022, 12, 48),
      new THREE.MeshStandardMaterial({
        color: 0xe0231f,
        roughness: 0.3,
        metalness: 0.6,
        emissive: 0x4a0b09,
        emissiveIntensity: 0.5,
      }),
    );
    anelTampa.position.z = 0.515;
    roda.add(anelTampa);

    const parafusoGeo = new THREE.CylinderGeometry(0.062, 0.062, 0.1, 6);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 5;
      const parafuso = new THREE.Mesh(parafusoGeo, ferro);
      parafuso.rotation.x = Math.PI / 2;
      parafuso.position.set(Math.cos(a) * 0.63, Math.sin(a) * 0.63, 0.44);
      roda.add(parafuso);
    }

    /* ---------- freio, atrás dos raios ---------- */
    const disco = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.07, 64), ferro);
    disco.rotation.x = Math.PI / 2;
    disco.position.z = -0.05;
    roda.add(disco);

    const furoGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.12, 10);
    const furoMat = new THREE.MeshStandardMaterial({ color: 0x0b0c0e, roughness: 1 });
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const furo = new THREE.Mesh(furoGeo, furoMat);
      furo.rotation.x = Math.PI / 2;
      furo.position.set(Math.cos(a) * 0.78, Math.sin(a) * 0.78, -0.05);
      roda.add(furo);
    }

    const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.66, 0.3), pinca);
    caliper.position.set(-0.92, 0.42, -0.08);
    caliper.rotation.z = -0.42;
    roda.add(caliper);

    /* ---------- laço ---------- */
    const ponteiro = { x: 0, y: 0 };
    const alvo = { x: 0, y: 0 };
    const girar = { z: 0 };
    const relogio = new THREE.Clock();
    let vivo = true;
    let raf = 0;
    let st;

    const medir = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    medir();

    const ro = new ResizeObserver(medir);
    ro.observe(host);

    const noPonteiro = (e) => {
      const r = host.getBoundingClientRect();
      alvo.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      alvo.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };

    if (!parado) {
      window.addEventListener('pointermove', noPonteiro, { passive: true });

      /* uma volta e meia entre o topo da página e o fim da capa */
      const tween = gsap.to(girar, {
        z: -Math.PI * 3,
        ease: 'none',
        scrollTrigger: { trigger: host, start: 'top top', end: '+=200%', scrub: 0.8 },
      });
      st = tween.scrollTrigger;

      gsap.fromTo(
        roda.scale,
        { x: 0.55, y: 0.55, z: 0.55 },
        { x: 1, y: 1, z: 1, duration: 1.7, ease: 'expo.out', delay: 1.35 },
      );
      gsap.fromTo(host, { opacity: 0 }, { opacity: 1, duration: 1.3, ease: 'power2.out', delay: 1.3 });
    } else {
      roda.rotation.y = -0.32;
      roda.rotation.z = -0.35;
    }

    const laco = () => {
      if (!vivo) return;
      if (!parado) {
        ponteiro.x += (alvo.x - ponteiro.x) * 0.05;
        ponteiro.y += (alvo.y - ponteiro.y) * 0.05;
        /* giro de repouso somado ao giro da rolagem */
        roda.rotation.z = girar.z - relogio.getElapsedTime() * 0.12;
        roda.rotation.y = -0.32 + ponteiro.x * 0.24;
        roda.rotation.x = ponteiro.y * 0.16;
        camera.position.x = 0.15 + ponteiro.x * 0.32;
        camera.position.y = 0.32 - ponteiro.y * 0.26;
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(laco);
    };
    raf = requestAnimationFrame(laco);

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', noPonteiro);
      st?.kill();
      envRT.texture.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        const m = o.material;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else if (m) m.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}

export { ScrollTrigger };
