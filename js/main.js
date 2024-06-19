/*     // Importación de las dependencias necesarias de three.js
    import * as THREE from './build/three.module.js'; // Cambia la ruta según la ubicación de tu three.module.js

    import Stats from './jsm/libs/stats.module.js';
    import { OrbitControls } from './jsm/controls/OrbitControls.js';
    import { FBXLoader } from './jsm/loaders/FBXLoader.js';

    // Declaración de variables globales
    let camera, scene, renderer, stats, object, loader, mixer;
    const clock = new THREE.Clock();

    // Parámetros para la interfaz gráfica
    const params = {
        asset: 'Unarmed Walk Forward'
    };

    // Lista de activos disponibles
    const assets = [
        'Punching',                 // golpe
        'Mma Kick',                 // patada
        'Taunt',                    // provocacion   
        'Defeated',                 // derrotado
        'Unarmed Walk Forward',     // caminar      
        'Standing Run Forward',     // correr
        'Unarmed Jump'              // saltar
    ];

    // Inicialización de la escena
    init();

    function init() {
        // Creación del contenedor y configuración de la cámara
        const container = document.createElement('div');
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(100, 200, 300);

        // Configuración de la escena incluyendo la niebla
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xa0a0a0);
        const initialFogDistance = 1000;  // Valor inicial de la niebla
        scene.fog = new THREE.Fog(0xa0a0a0, initialFogDistance * 0.5, initialFogDistance); // Ajustar la niebla inicial

        // Configuración de la iluminación
        const hemiLight = new THREE.HemisphereLight('red', 'white', 5);
        hemiLight.position.set(0, 200, 0);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight('red', 5);
        dirLight.position.set(0, 200, 100);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 180;
        dirLight.shadow.camera.bottom = -100;
        dirLight.shadow.camera.left = -120;
        dirLight.shadow.camera.right = 120;
        scene.add(dirLight);

        // Añadir suelo
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x000000, depthWrite: false }));
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        scene.add(mesh);

        // Añadir rejilla
        const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add(grid);

        // Configuración del cargador FBX
        loader = new FBXLoader();
        loadAsset(params.asset);

        // Configuración del renderizador
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animate);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // Configuración de los controles de órbita
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 100, 0);
        controls.update();

        // Añadir evento para ajustar el tamaño de la ventana
        window.addEventListener('resize', onWindowResize);

        // Añadir evento para las teclas numéricas del 1 al 7
        document.addEventListener('keydown', onKeyDown);

        // Añadir evento para las teclas de flecha
        document.addEventListener('keydown', onArrowKeyDown);

        // Configuración de las estadísticas
        stats = new Stats();
        container.appendChild(stats.dom);

        // Añadir la barra deslizante para controlar la niebla
        const fogControl = document.createElement('input');
        fogControl.type = 'range';
        fogControl.min = '300';
        fogControl.max = '1500';
        fogControl.value = initialFogDistance.toString();
        fogControl.className = 'slider';
        fogControl.id = 'fogRange';
        container.appendChild(fogControl);

        // Añadir evento para cambiar la niebla según el valor de la barra
        fogControl.addEventListener('input', function() {
            const fogDistance = parseInt(this.value);
            scene.fog.far = fogDistance;
            scene.fog.near = fogDistance * 0.5; // Opcional: ajustar la niebla cercana si es necesario
            renderer.render(scene, camera);
        });
    }

    // Función para cargar un activo FBX
    function loadAsset(asset) {
        loader.load('models/fbx/' + asset + '.fbx', function (group) {
            if (object) {
                // Liberar recursos del objeto anterior
                object.traverse(function (child) {
                    if (child.material) child.material.dispose();
                    if (child.material && child.material.map) child.material.map.dispose();
                    if (child.geometry) child.geometry.dispose();
                });
                scene.remove(object);
            }

            object = group;

            // Configuración de la animación
            if (object.animations && object.animations.length) {
                mixer = new THREE.AnimationMixer(object);
                const action = mixer.clipAction(object.animations[0]);
                action.play();
            } else {
                mixer = null;
            }

            // Color del personaje
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material = new THREE.MeshPhongMaterial({ color: 0x4169E1 });
                }
            });

            scene.add(object);
            console.log("Modelo cargado: ", object); // Log para verificar la carga
        });
    }

    // Función para ajustar el tamaño de la ventana
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Función de animación
    function animate() {
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
        stats.update();
    }

    // Event listener para las teclas numéricas del 1 al 7
    function onKeyDown(event) {
        switch (event.keyCode) {
            case 49: // Tecla 1
                loadAsset('Punching');
                break;
            case 50: // Tecla 2
                loadAsset('Mma Kick');
                break;
            case 51: // Tecla 3
                loadAsset('Taunt');
                break;
            case 52: // Tecla 4
                loadAsset('Defeated');
                break;
            case 53: // Tecla 5
                loadAsset('Unarmed Walk Forward');
                break;
            case 54: // Tecla 6
                loadAsset('Standing Run Forward');
                break;
            case 55: // Tecla 7
                loadAsset('Unarmed Jump');
                break;
        }
    }

    // Event listener para las teclas de flecha
    function onArrowKeyDown(event) {
        switch (event.keyCode) {
            case 37: // Flecha izquierda
                camera.position.x -= 10;
                break;
            case 38: // Flecha arriba
                camera.position.z -= 10;
                break;
            case 39: // Flecha derecha
                camera.position.x += 10;
                break;
            case 40: // Flecha abajo
                camera.position.z += 10;
                break;
        }
        camera.updateProjectionMatrix();

        camera.updateProjectionMatrix(); // Actualizar la matriz de proyección de la cámara
        renderer.render(scene, camera); // Renderizar la escena con la nueva posición de la cámara
    } */