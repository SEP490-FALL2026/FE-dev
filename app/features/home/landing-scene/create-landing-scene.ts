import {
  ACESFilmicToneMapping,
  Clock,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  PerspectiveCamera,
  PMREMGenerator,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  type Material,
  type Object3D
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

import {
  applyPalette,
  createBrandMark,
  createChartCard,
  createGlassSphere,
  createInvoiceStack,
  createLicenseKey,
  createMaterials,
  createOrbit,
  createPedestal,
  createSeatCard,
  createShield,
  createSparkles,
  type ScenePalette
} from './scene-objects'

export interface LandingScene {
  dispose: () => void
  refreshTheme: () => void
}

/** Reads theme tokens so the scene follows the light (indigo) and dark (blue) palettes. */
function readPalette(): { palette: ScenePalette; dark: boolean } {
  const styles = getComputedStyle(document.documentElement)
  const token = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback
  const dark = document.documentElement.dataset.theme === 'dark'
  const primary = new Color(token('--theme-primary', '#5546b0'))
  return {
    dark,
    palette: {
      primary,
      primaryLight: primary.clone().lerp(new Color('#ffffff'), dark ? 0.35 : 0.55),
      surface: new Color(dark ? '#e9eefb' : '#ffffff'),
      surfaceShade: new Color(dark ? '#9fb0d0' : '#e3e6f2'),
      teal: new Color('#2bb39a'),
      gold: new Color('#e3a23b'),
      line: primary.clone().lerp(new Color(dark ? '#ffffff' : '#232741'), 0.25)
    }
  }
}

/**
 * Hero illustration for the landing page: a glass sphere holding the SaaS-Sentry mark on a pedestal, orbits with
 * travelling dots and floating objects for the product domains: license key, purchase invoice with coins (budget and
 * spending approval), seat card (provisioning), usage chart (optimisation) and a policy shield (Shadow IT). Drag to
 * rotate within the front arc (no zoom/pan), an idle sway resumes after a pause, hovered cards lift slightly. Rendering pauses when the
 * canvas is off screen or the tab is hidden. Throws when WebGL is unavailable so the caller can fall back.
 */
export function createLandingScene(container: HTMLElement, reducedMotion: boolean): LandingScene {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.domElement.style.touchAction = 'pan-y'
  container.appendChild(renderer.domElement)

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = environment

  const camera = new PerspectiveCamera(34, 1, 0.1, 100)
  camera.position.set(0, 2.4, 11.2)

  let { palette, dark } = readPalette()
  const materials = createMaterials(palette)
  const hemisphere = new HemisphereLight('#ffffff', palette.primaryLight, dark ? 0.7 : 1.1)
  const sun = new DirectionalLight('#ffffff', dark ? 1.2 : 1.6)
  sun.position.set(4, 7, 6)
  scene.add(hemisphere, sun)

  const stage = new Group()
  stage.position.y = -1.7
  scene.add(stage)

  stage.add(createPedestal(materials))
  const sphere = createGlassSphere(materials)
  sphere.position.y = 1.95
  const mark = createBrandMark(materials)
  mark.position.y = 1.95
  stage.add(mark, sphere)

  const orbitCenter = new Group()
  orbitCenter.position.y = 1.95
  stage.add(orbitCenter)
  const orbits = [
    createOrbit(materials, materials.teal, 3.1, 1.25, [1.25, 0.2, 0.35], 0.07, 0),
    createOrbit(materials, materials.gold, 2.7, 1.7, [1.05, -0.5, -0.25], -0.05, 0.4),
    createOrbit(materials, materials.primary, 3.4, 2.1, [0.4, 0.9, 0.15], 0.04, 0.7)
  ]
  for (const orbit of orbits) orbitCenter.add(orbit.tilt)

  const cards: { object: Group; base: [number, number, number]; phase: number; lift: number }[] = [
    { object: createLicenseKey(materials), base: [-2.6, 3.4, 0.4], phase: 0, lift: 0 },
    { object: createInvoiceStack(materials), base: [2.6, 3.2, 0.1], phase: 1.4, lift: 0 },
    { object: createSeatCard(materials), base: [-3.25, 1.75, 1.1], phase: 2.6, lift: 0 },
    { object: createChartCard(materials), base: [2.45, 0.95, 1.2], phase: 3.7, lift: 0 },
    { object: createShield(materials), base: [0.2, 4.45, -0.4], phase: 4.6, lift: 0 }
  ]
  cards[0].object.rotation.set(0.1, 0.35, 0.22)
  cards[1].object.rotation.set(0.05, -0.42, 0.06)
  cards[2].object.rotation.set(0, 0.45, 0.05)
  cards[3].object.rotation.set(0, -0.38, -0.04)
  for (const card of cards) {
    card.object.position.set(...card.base)
    stage.add(card.object)
  }
  const sparkles = createSparkles(materials)
  stage.add(sparkles)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0.35, 0)
  controls.enableZoom = false
  controls.enablePan = false
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.rotateSpeed = 0.65
  controls.minPolarAngle = 1.05
  controls.maxPolarAngle = 1.62
  // Drag stays within the front arc so the cards never show their blank backs; idle motion is a gentle sway.
  controls.minAzimuthAngle = -0.85
  controls.maxAzimuthAngle = 0.85
  let swaying = !reducedMotion
  controls.update()

  let resumeTimer: ReturnType<typeof setTimeout> | undefined
  const onStart = () => {
    swaying = false
    renderer.domElement.style.cursor = 'grabbing'
    clearTimeout(resumeTimer)
  }
  const onEnd = () => {
    renderer.domElement.style.cursor = 'grab'
    if (!reducedMotion) resumeTimer = setTimeout(() => (swaying = true), 2500)
  }
  controls.addEventListener('start', onStart)
  controls.addEventListener('end', onEnd)
  renderer.domElement.style.cursor = 'grab'

  // Hover: the card under the pointer lifts towards the viewer.
  const raycaster = new Raycaster()
  const pointer = new Vector2(10, 10)
  const onPointerMove = (event: PointerEvent) => {
    const bounds = renderer.domElement.getBoundingClientRect()
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    )
  }
  const onPointerLeave = () => pointer.set(10, 10)
  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('pointerleave', onPointerLeave)

  const resize = () => {
    const width = container.clientWidth
    const height = container.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    camera.aspect = width / height
    // Narrow containers pull the camera back so the floating cards stay in frame.
    camera.position.setLength(width / height < 0.9 || width < 520 ? 15.6 : 13.2)
    camera.updateProjectionMatrix()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)
  resize()

  let visible = true
  const intersection = new IntersectionObserver(([entry]) => (visible = entry?.isIntersecting ?? true))
  intersection.observe(container)

  const clock = new Clock()
  let frame = 0
  const render = () => {
    frame = requestAnimationFrame(render)
    if (!visible || document.hidden) return
    const elapsed = clock.getElapsedTime()
    const motion = reducedMotion ? 0 : 1

    raycaster.setFromCamera(pointer, camera)
    const hits = raycaster.intersectObjects(
      cards.map((card) => card.object),
      true
    )
    const hovered = cards.find((card) => hits[0] && isDescendant(hits[0].object, card.object))
    for (const card of cards) {
      card.lift += ((card === hovered ? 1 : 0) - card.lift) * 0.12
      const bob = Math.sin(elapsed * 1.1 + card.phase) * 0.12 * motion
      card.object.position.set(card.base[0], card.base[1] + bob + card.lift * 0.18, card.base[2] + card.lift * 0.45)
      card.object.scale.setScalar(1 + card.lift * 0.06)
    }
    mark.rotation.y = Math.sin(elapsed * 0.6) * 0.5 * motion
    mark.position.y = 1.95 + Math.sin(elapsed * 1.3) * 0.05 * motion
    for (const orbit of orbits) {
      const progress = (((orbit.offset + elapsed * orbit.speed * motion) % 1) + 1) % 1
      const point = orbit.curve.getPoint(progress)
      orbit.dot.position.set(point.x, point.y, 0)
    }
    sparkles.rotation.y = elapsed * 0.05 * motion
    const sway = swaying ? Math.sin(elapsed * 0.35) * 0.32 : stage.rotation.y
    stage.rotation.y += (sway - stage.rotation.y) * 0.05
    controls.update()
    renderer.render(scene, camera)
  }
  render()

  const refreshTheme = () => {
    ;({ palette, dark } = readPalette())
    applyPalette(materials, palette)
    hemisphere.groundColor.copy(palette.primaryLight)
    hemisphere.intensity = dark ? 0.7 : 1.1
    sun.intensity = dark ? 1.2 : 1.6
  }

  return {
    refreshTheme,
    dispose: () => {
      cancelAnimationFrame(frame)
      clearTimeout(resumeTimer)
      resizeObserver.disconnect()
      intersection.disconnect()
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
      controls.dispose()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose()
          const material = object.material as Material | Material[]
          for (const item of Array.isArray(material) ? material : [material]) {
            ;(item as Material & { map?: { dispose: () => void } | null }).map?.dispose()
          }
        }
      })
      for (const material of Object.values(materials)) material.dispose()
      environment.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }
}

function isDescendant(object: Object3D, ancestor: Object3D) {
  for (let current: Object3D | null = object; current; current = current.parent) {
    if (current === ancestor) return true
  }
  return false
}
