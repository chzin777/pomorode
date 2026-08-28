/* ============================================================
   A RODA

   Roda aro 15 com pneu, em glTF. A versão anterior montava a peça por
   geometria — cilindros, um trapézio extrudado cinco vezes — e lia
   como roda, mas nunca como ESTA roda. Um modelo de verdade traz o
   desenho do raio, o rebaixo do aro e a parede do pneu, que é
   exatamente o que uma loja de roda vende.

   As texturas do arquivo não são tocadas: nenhum material é
   reconfigurado aqui. Se algum modelo trouxer pedestal de exposição
   junto, ele sai pelo nome — a cena tem chão próprio, e um segundo
   apareceria como tábua flutuando no fosso.

   NADA é assumido sobre orientação ou escala. Uma roda é um disco:
   entre as três medidas da caixa que a envolve, a menor é sempre o
   eixo do cubo. A gente alinha esse eixo com o Z da cena e normaliza o
   raio, então trocar o .glb por outro modelo continua funcionando.

   O reflexo do metal vem de um ambiente de estúdio gerado em memória
   (RoomEnvironment + PMREM). Sem mapa de ambiente, metal renderiza
   quase preto.

   A rolagem gira a roda; o ponteiro inclina de leve. Nada disso roda
   quando a pessoa pediu menos movimento: aí ela fica parada, de três
   quartos, que é a posição em que se lê melhor.
   ============================================================ */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap, ScrollTrigger, prefersReduced } from './anim.js';

/** raio que a roda ocupa na cena, em unidades de mundo */
const RAIO = 1.95;

/* Qual das duas faces do disco olha para a câmera.

   O alinhamento acha o EIXO do cubo, nunca o LADO: a caixa que envolve
   a roda é a mesma com a peça virada de frente ou de costas. Então o
   lado é escolha, e mora aqui — trocar para 1 mostra a outra face, que
   é o conserto de um dia trocarem o .glb por um modelado ao contrário. */
const FACE = -1;

/** o que vem junto no arquivo e não faz parte da roda */
const SOBRA = ['stand', 'plane', 'floor', 'ground', 'pedestal'];

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
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0.15, 0.32, 8.1);
    camera.lookAt(0, 0, 0);

    /* ---------- ambiente de estúdio, gerado em memória ---------- */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    /* ---------- luz de box ---------- */
    const chave = new THREE.DirectionalLight(0xdfe9ff, 2.4);
    chave.position.set(4, 5, 6);
    scene.add(chave);

    const contra = new THREE.DirectionalLight(0xffd9c2, 1.3);
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

    scene.add(new THREE.AmbientLight(0x7c8794, 0.55));

    /* A roda pendurada num grupo próprio: o giro e a inclinação mexem
       neste, e o conteúdo pode ser trocado sem tocar na animação. */
    const roda = new THREE.Group();
    scene.add(roda);

    /* ---------- estado do laço ---------- */
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
    } else {
      roda.rotation.y = -0.32;
      roda.rotation.z = -0.35;
    }

    /* ---------- o modelo ---------- */
    const loader = new GLTFLoader();
    loader.load(
      '/roda.glb',
      (gltf) => {
        /* o componente pode ter saído da tela enquanto o arquivo vinha */
        if (!vivo) return;

        const cena = gltf.scene;

        /* fora o pedestal de exposição */
        const paraTirar = [];
        cena.traverse((o) => {
          const nome = (o.name || '').toLowerCase();
          const mat = (o.material?.name || '').toLowerCase();
          if (SOBRA.some((s) => nome.includes(s) || mat.includes(s))) paraTirar.push(o);
        });
        paraTirar.forEach((o) => o.removeFromParent());

        /* Os materiais ficam exatamente como vieram no arquivo. O
           ambiente de estúdio da cena já alcança o metal por
           scene.environment; mexer em envMapIntensity ou em qualquer
           mapa aqui mudaria a textura do modelo, e ela é para ficar
           intacta. */

        /* --- alinhamento: a menor medida da caixa é o eixo do cubo --- */
        const interno = new THREE.Group();
        interno.add(cena);
        roda.add(interno);

        const medida = new THREE.Box3().setFromObject(cena).getSize(new THREE.Vector3());
        if (medida.x <= medida.y && medida.x <= medida.z) cena.rotation.y = (FACE * Math.PI) / 2;
        else if (medida.y <= medida.z) cena.rotation.x = (-FACE * Math.PI) / 2;
        else if (FACE < 0) cena.rotation.y = Math.PI;

        /* --- centro e escala, medidos DEPOIS de girar --- */
        cena.updateMatrixWorld(true);
        const caixa = new THREE.Box3().setFromObject(cena);
        const centro = caixa.getCenter(new THREE.Vector3());
        const tamanho = caixa.getSize(new THREE.Vector3());

        /* position entra depois da rotação no espaço do pai, então
           deslocar aqui recentra sem desfazer o alinhamento */
        cena.position.sub(centro);
        const escala = RAIO / (Math.max(tamanho.x, tamanho.y) / 2);
        interno.scale.setScalar(escala);

        if (!parado) {
          gsap.fromTo(
            interno.scale,
            { x: 0, y: 0, z: 0 },
            { x: escala, y: escala, z: escala, duration: 1.7, ease: 'expo.out', delay: 0.15 },
          );
          gsap.fromTo(host, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' });
        }
      },
      undefined,
      () => {
        /* arquivo faltando ou corrompido: a cena fica vazia e a capa
           segue de pé. Nada de placeholder — buraco silencioso lê melhor
           do que um cubo cinza pedindo desculpa. */
      },
    );

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
        const mats = Array.isArray(m) ? m : m ? [m] : [];
        mats.forEach((x) => {
          /* as texturas do glTF só saem da memória uma a uma */
          Object.values(x).forEach((v) => v?.isTexture && v.dispose());
          x.dispose();
        });
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}

export { ScrollTrigger };
