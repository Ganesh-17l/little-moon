import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import styles from './CompanionScene.module.css';

const CompanionScene = ({
  expression = 'neutral',
  animation = 'floatIdle',
  height = '320px',
  interactive = true,
  onModelClick,
}) => {
  const mountRef = useRef(null);
  const currentExprRef = useRef(expression);
  const currentAnimRef = useRef(animation);

  useEffect(() => {
    currentExprRef.current = expression;
  }, [expression]);

  useEffect(() => {
    currentAnimRef.current = animation;
  }, [animation]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId;
    const width = container.clientWidth || 320;
    const canvasHeight = container.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / canvasHeight, 0.1, 100);
    camera.position.set(0, 0.08, 4.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.94;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xF6F8FF, 0xC9D6F2, 1.15);
    scene.add(hemiLight);

    const studioKeyLight = new THREE.DirectionalLight(0xFFFFFF, 1.4);
    studioKeyLight.position.set(2.6, 3.8, 4.4);
    scene.add(studioKeyLight);

    const coolFillLight = new THREE.DirectionalLight(0x91B9F5, 1.0);
    coolFillLight.position.set(-4.2, 1.2, 2.2);
    scene.add(coolFillLight);

    const lavenderRimLight = new THREE.DirectionalLight(0xB8A9F4, 1.2);
    lavenderRimLight.position.set(3.2, 2.4, -3.8);
    scene.add(lavenderRimLight);

    // 3. Rig Hierarchy
    const rigRoot = new THREE.Group();
    rigRoot.name = 'Rig_Root';
    scene.add(rigRoot);

    const rigBody = new THREE.Group();
    rigBody.name = 'Rig_Body';
    rigRoot.add(rigBody);

    // 3.1 Pearl Body
    const bodyGeometry = new THREE.SphereGeometry(1.0, 64, 64);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      name: 'Mat_Companion_Body_Pearl',
      color: new THREE.Color('#F7F7FC'),
      roughness: 0.27,
      metalness: 0.0,
      clearcoat: 0.38,
      clearcoatRoughness: 0.22,
      reflectivity: 0.48,
      sheen: 0.28,
      sheenColor: new THREE.Color('#C7D9FA'),
      sheenRoughness: 0.42,
    });
    const companionBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    rigBody.add(companionBody);

    // 3.2 Translucent Layered Petal Wings
    function createWingTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(40, 460, 480, 40);
      grad.addColorStop(0.0, '#7DA9F0');
      grad.addColorStop(0.42, '#91B9F5');
      grad.addColorStop(0.76, '#A8B2F5');
      grad.addColorStop(0.94, '#B8A9F4');
      grad.addColorStop(1.0, '#D4CEFA');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      const radial = ctx.createRadialGradient(240, 260, 30, 256, 256, 260);
      radial.addColorStop(0.0, 'rgba(125, 169, 240, 0.28)');
      radial.addColorStop(0.7, 'rgba(184, 169, 244, 0.10)');
      radial.addColorStop(1.0, 'rgba(255, 255, 255, 0.08)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 512, 512);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    const wingTexture = createWingTexture();
    const wingMaterial = new THREE.MeshPhysicalMaterial({
      name: 'Mat_Companion_Wing_Translucent',
      map: wingTexture,
      color: new THREE.Color('#A2C2F8'),
      roughness: 0.19,
      metalness: 0.0,
      transmission: 0.58,
      thickness: 0.75,
      ior: 1.38,
      clearcoat: 0.45,
      clearcoatRoughness: 0.16,
      sheen: 0.45,
      sheenColor: new THREE.Color('#B8A9F4'),
    });

    function createPetalLobeGeometry(length, maxWidth, thickness, upwardSweep, curveBack) {
      const geo = new THREE.SphereGeometry(1, 40, 32);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const u = (v.x + 1) * 0.5;
        const widthEnvelope = 0.28 + 0.72 * Math.sin(Math.pow(u, 0.68) * Math.PI * 0.92);
        const thickEnvelope = (0.48 + 0.52 * Math.sin(u * Math.PI * 0.88)) * (1.0 - 0.12 * v.y * v.y);
        const x = u * length;
        const y = v.y * maxWidth * widthEnvelope + Math.pow(u, 1.55) * upwardSweep;
        const crease = Math.exp(-Math.pow((v.y - 0.12) * 3.2, 2)) * Math.sin(u * Math.PI) * 0.032;
        const z = v.z * thickness * thickEnvelope - Math.pow(u, 1.35) * curveBack - (v.z > 0 ? crease : 0);
        pos.setXYZ(i, x, y, z);
      }
      geo.computeVertexNormals();
      return geo;
    }

    function createWingRig(isRightSide) {
      const dir = isRightSide ? 1 : -1;
      const rigWing = new THREE.Group();

      const upperGeo = createPetalLobeGeometry(1.16, 0.46, 0.23, 0.22, 0.06);
      const upperMat4 = new THREE.Matrix4().compose(
        new THREE.Vector3(0, 0.1, 0),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0.06, -0.1 * dir, 0.48 * dir)),
        new THREE.Vector3(dir, 1, 1)
      );
      upperGeo.applyMatrix4(upperMat4);

      const midGeo = createPetalLobeGeometry(0.76, 0.34, 0.19, 0.06, 0.04);
      const midMat4 = new THREE.Matrix4().compose(
        new THREE.Vector3(-0.03 * dir, -0.16, -0.04),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0.03, -0.14 * dir, 0.04 * dir)),
        new THREE.Vector3(dir, 1, 1)
      );
      midGeo.applyMatrix4(midMat4);

      const lowGeo = createPetalLobeGeometry(0.5, 0.25, 0.16, -0.02, 0.03);
      const lowMat4 = new THREE.Matrix4().compose(
        new THREE.Vector3(-0.07 * dir, -0.37, -0.08),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0.02, -0.18 * dir, -0.32 * dir)),
        new THREE.Vector3(dir, 1, 1)
      );
      lowGeo.applyMatrix4(lowMat4);

      if (!isRightSide) {
        [upperGeo, midGeo, lowGeo].forEach((g) => {
          const index = g.index;
          for (let i = 0; i < index.count; i += 3) {
            const tmp = index.getX(i + 1);
            index.setX(i + 1, index.getX(i + 2));
            index.setX(i + 2, tmp);
          }
          g.computeVertexNormals();
        });
      }

      const mergedGeo = BufferGeometryUtils.mergeGeometries([upperGeo, midGeo, lowGeo], false);
      mergedGeo.computeVertexNormals();
      const wingMesh = new THREE.Mesh(mergedGeo, wingMaterial);
      rigWing.add(wingMesh);

      rigWing.position.set(0.88 * dir, 0.05, -0.1);
      rigWing.rotation.y = -0.18 * dir;
      return rigWing;
    }

    const rigWingLeft = createWingRig(false);
    const rigWingRight = createWingRig(true);
    rigBody.add(rigWingLeft);
    rigBody.add(rigWingRight);

    // 3.3 Surface-Conformed 3D Eyes
    const eyeBlackMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0B0B0B'),
      roughness: 0.42,
      metalness: 0.0,
    });

    const eyeLeftGroup = new THREE.Group();
    const eyeRightGroup = new THREE.Group();
    rigBody.add(eyeLeftGroup);
    rigBody.add(eyeRightGroup);

    function conformGeometryToSphere(geometry, centerX, centerY) {
      const pos = geometry.attributes.position;
      const v = new THREE.Vector3();
      const baseRadius = 0.996;

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const px = v.x + centerX;
        const py = v.y + centerY;
        const r = baseRadius + (v.z + 0.5) * 0.018;
        const distSq = px * px + py * py;
        const pz = Math.sqrt(Math.max(0.01, r * r - distSq));
        pos.setXYZ(i, px, py, pz);
      }
      geometry.computeVertexNormals();
      return geometry;
    }

    function createConformedMesh(shapes, cx, cy) {
      const geo = new THREE.ExtrudeGeometry(shapes, {
        depth: 1.0,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.008,
        bevelThickness: 0.25,
        curveSegments: 24,
      });
      geo.translate(0, 0, -0.5);
      conformGeometryToSphere(geo, cx, cy);
      return new THREE.Mesh(geo, eyeBlackMaterial);
    }

    function makeOvalShape(rx, ry) {
      const shape = new THREE.Shape();
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        const x = Math.cos(a) * rx;
        const y = Math.sin(a) * ry;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      return shape;
    }

    function makeArcShape(radius, startAngle, endAngle, thickness) {
      const shape = new THREE.Shape();
      const steps = 20;
      const rOuter = radius + thickness * 0.5;
      const rInner = radius - thickness * 0.5;
      for (let i = 0; i <= steps; i++) {
        const a = startAngle + (i / steps) * (endAngle - startAngle);
        const x = Math.cos(a) * rOuter;
        const y = Math.sin(a) * rOuter;
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      }
      for (let i = steps; i >= 0; i--) {
        const a = startAngle + (i / steps) * (endAngle - startAngle);
        shape.lineTo(Math.cos(a) * rInner, Math.sin(a) * rInner);
      }
      shape.closePath();
      return shape;
    }

    function makeHeartShape(scale = 0.11) {
      const shape = new THREE.Shape();
      for (let i = 0; i <= 36; i++) {
        const t = (i / 36) * Math.PI * 2;
        const x = scale * 0.078 * (16 * Math.pow(Math.sin(t), 3));
        const y = scale * 0.078 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        if (i === 0) shape.moveTo(x, y + 0.015);
        else shape.lineTo(x, y + 0.015);
      }
      return shape;
    }

    const eyeX = 0.195;
    const eyeY = 0.035;

    function applyEyes(exprKey) {
      eyeLeftGroup.clear();
      eyeRightGroup.clear();

      let leftShapes, rightShapes;

      switch (exprKey) {
        case 'happy':
        case 'laugh':
          leftShapes = [makeArcShape(0.088, Math.PI * 0.15, Math.PI * 0.85, 0.046)];
          rightShapes = [makeArcShape(0.088, Math.PI * 0.15, Math.PI * 0.85, 0.046)];
          break;
        case 'love':
          leftShapes = [makeHeartShape(0.12)];
          rightShapes = [makeHeartShape(0.12)];
          break;
        case 'closedBlink':
          leftShapes = [makeArcShape(0.09, Math.PI * 1.2, Math.PI * 1.8, 0.042)];
          rightShapes = [makeArcShape(0.09, Math.PI * 1.2, Math.PI * 1.8, 0.042)];
          break;
        case 'curious':
          leftShapes = [makeOvalShape(0.084, 0.148)];
          rightShapes = [makeOvalShape(0.074, 0.12)];
          break;
        case 'content':
          leftShapes = [makeArcShape(0.092, Math.PI * 0.2, Math.PI * 0.8, 0.042)];
          rightShapes = [makeArcShape(0.092, Math.PI * 0.2, Math.PI * 0.8, 0.042)];
          break;
        case 'neutral':
        default:
          leftShapes = [makeOvalShape(0.088, 0.152)];
          rightShapes = [makeOvalShape(0.088, 0.152)];
          break;
      }

      const leftMesh = createConformedMesh(leftShapes, -eyeX, eyeY);
      const rightMesh = createConformedMesh(rightShapes, eyeX, eyeY);
      eyeLeftGroup.add(leftMesh);
      eyeRightGroup.add(rightMesh);
    }

    applyEyes('neutral');

    // 4. Contact Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(64, 64, 6, 64, 64, 58);
    sGrad.addColorStop(0, 'rgba(110, 135, 195, 0.32)');
    sGrad.addColorStop(1, 'rgba(220, 228, 248, 0.0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 2.4),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(shadowCanvas),
        transparent: true,
        depthWrite: false,
      })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.35;
    scene.add(shadow);

    // 5. Drag to Orbit / Rotate Support
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotY = 0;

    const onPointerDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging || !interactive) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - prevMouseX;
      prevMouseX = clientX;
      targetRotY += deltaX * 0.015;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // 6. Animation Loop
    const clock = new THREE.Clock();
    let nextBlink = 3.0;
    let isBlinking = false;
    let lastRenderedExpr = 'neutral';

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Check for external expression change
      const targetExpr = currentExprRef.current || 'neutral';
      if (targetExpr !== lastRenderedExpr && !isBlinking) {
        lastRenderedExpr = targetExpr;
        applyEyes(targetExpr);
      }

      // Auto-blink
      if (['neutral', 'curious'].includes(targetExpr)) {
        if (!isBlinking && elapsed > nextBlink) {
          isBlinking = true;
          applyEyes('closedBlink');
        } else if (isBlinking && elapsed > nextBlink + 0.14) {
          isBlinking = false;
          applyEyes(targetExpr);
          nextBlink = elapsed + 3.2 + Math.random() * 2.5;
        }
      }

      // Motion evaluation
      const currentAnim = currentAnimRef.current || 'floatIdle';
      let floatY = Math.sin(elapsed * 2.0) * 0.06;
      let flap = Math.sin(elapsed * 2.2) * 0.08;
      let tiltZ = 0;

      if (currentAnim === 'greeting') {
        floatY = Math.sin(elapsed * 2.5) * 0.08 + Math.abs(Math.sin(elapsed * 4.0)) * 0.06;
        flap = Math.sin(elapsed * 5.5) * 0.16;
      } else if (currentAnim === 'excitedBounce') {
        const bounce = Math.abs(Math.sin(elapsed * 4.2));
        floatY = bounce * 0.16;
        flap = Math.sin(elapsed * 4.2) * 0.22;
      } else if (currentAnim === 'tiltLeft') {
        tiltZ = 0.18;
      } else if (currentAnim === 'tiltRight') {
        tiltZ = -0.18;
      }

      rigBody.position.y = THREE.MathUtils.lerp(rigBody.position.y, floatY, 0.12);
      rigRoot.rotation.y = THREE.MathUtils.lerp(rigRoot.rotation.y, targetRotY, 0.1);
      rigBody.rotation.z = THREE.MathUtils.lerp(rigBody.rotation.z, tiltZ, 0.1);

      // Wings flap smoothly
      rigWingRight.rotation.y = -0.18 - flap;
      rigWingLeft.rotation.y = 0.18 + flap;

      // Contact shadow sync
      shadow.scale.setScalar(1.0 - floatY * 0.4);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 320;
      const newH = container.clientHeight || 320;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onPointerDown);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      className={styles.canvasContainer}
      style={{ height }}
      onClick={onModelClick}
      role="region"
      aria-label="3D AI Companion Brother"
    />
  );
};

export default CompanionScene;
