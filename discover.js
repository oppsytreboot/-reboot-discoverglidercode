/**
 * Galaxy Glider Source Code
 * Requires: Three.js
 */

const createGalaxyGlider = () => {
    const gliderGroup = new THREE.Group();

    // 1. CUSTOM GALAXY SHADER
    // This creates the animated purple nebula and twinkling stars
    const galaxyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            colorA: { value: new THREE.Color(0x2e004f) }, // Deep Purple
            colorB: { value: new THREE.Color(0x8a2be2) }, // Blue-Violet
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 colorA;
            uniform vec3 colorB;
            varying vec2 vUv;

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            void main() {
                // Moving Nebula
                float flow = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
                vec3 nebula = mix(colorA, colorB, flow);

                // Twinkling Stars
                float starDensity = 40.0;
                float stars = pow(hash(vUv * starDensity), 100.0) * 5.0;
                stars *= sin(time * 2.0 + hash(vUv) * 10.0) * 0.5 + 0.5;

                gl_FragColor = vec4(nebula + stars, 0.95);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });

    // 2. THE CANOPY (Galaxy Top)
    const canopyGeo = new THREE.SphereGeometry(3, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const canopy = new THREE.Mesh(canopyGeo, galaxyMaterial);
    canopy.scale.set(1.1, 0.5, 1.2);
    canopy.rotation.x = Math.PI;
    canopy.position.y = 1.5;
    gliderGroup.add(canopy);

    // 3. MECHANICAL CHASSIS
    const metalMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        metalness: 1.0, 
        roughness: 0.2 
    });
    
    const glowMat = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff, // Cyan glow
    });

    // Central Hub
    const hub = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 1.5), metalMat);
    gliderGroup.add(hub);

    // Lateral Arms and Supports
    [1, -1].forEach(side => {
        const armGroup = new THREE.Group();

        // Main Arm
        const arm = new THREE.Mesh(new THREE.BoxGeometry(4, 0.15, 0.5), metalMat);
        arm.position.x = 2 * side;
        armGroup.add(arm);

        // Neon Light Strip
        const neon = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.05, 0.55), glowMat);
        neon.position.x = 2 * side;
        armGroup.add(neon);

        // Canopy Wires
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.5), metalMat);
        wire.position.set(3.5 * side, 1.2, 0);
        wire.rotation.z = -0.3 * side;
        armGroup.add(wire);

        gliderGroup.add(armGroup);
    });

    return gliderGroup;
};

// --- ANIMATION USAGE ---
/*
const glider = createGalaxyGlider();
scene.add(glider);

function animate() {
    const t = performance.now() * 0.001;
    
    // Update shader time for galaxy movement
    glider.children[0].material.uniforms.time.value = t;
    
    // Smooth hover animation
    glider.position.y = Math.sin(t) * 0.1;
    glider.rotation.z = Math.sin(t * 0.5) * 0.02;
}
*/