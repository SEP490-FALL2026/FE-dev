import {
  CanvasTexture,
  CircleGeometry,
  Color,
  CylinderGeometry,
  EllipseCurve,
  ExtrudeGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Shape,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  BufferGeometry
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/** Theme-driven palette; `primary` follows --theme-primary so the scene matches light (indigo) and dark (blue). */
export interface ScenePalette {
  primary: Color
  primaryLight: Color
  surface: Color
  surfaceShade: Color
  teal: Color
  gold: Color
  line: Color
}

export interface SceneMaterials {
  primary: MeshStandardMaterial
  primaryLight: MeshStandardMaterial
  surface: MeshStandardMaterial
  surfaceShade: MeshStandardMaterial
  teal: MeshStandardMaterial
  gold: MeshStandardMaterial
  glass: MeshPhysicalMaterial
  orbit: LineBasicMaterial
  ring: MeshBasicMaterial
}

export function createMaterials(palette: ScenePalette): SceneMaterials {
  const standard = (color: Color, roughness = 0.42, metalness = 0.05) =>
    new MeshStandardMaterial({ color: color.clone(), roughness, metalness })
  return {
    primary: standard(palette.primary, 0.32, 0.12),
    primaryLight: standard(palette.primaryLight, 0.4),
    surface: standard(palette.surface, 0.5),
    surfaceShade: standard(palette.surfaceShade, 0.55),
    teal: standard(palette.teal, 0.35),
    gold: standard(palette.gold, 0.28, 0.35),
    glass: new MeshPhysicalMaterial({
      color: palette.primaryLight.clone().lerp(new Color('#ffffff'), 0.55),
      transmission: 1,
      thickness: 0.6,
      roughness: 0.06,
      ior: 1.25,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.92
    }),
    orbit: new LineBasicMaterial({ color: palette.line.clone(), transparent: true, opacity: 0.45 }),
    ring: new MeshBasicMaterial({ color: palette.line.clone(), transparent: true, opacity: 0.35 })
  }
}

export function applyPalette(materials: SceneMaterials, palette: ScenePalette) {
  materials.primary.color.copy(palette.primary)
  materials.primaryLight.color.copy(palette.primaryLight)
  materials.surface.color.copy(palette.surface)
  materials.surfaceShade.color.copy(palette.surfaceShade)
  materials.teal.color.copy(palette.teal)
  materials.gold.color.copy(palette.gold)
  materials.glass.color.copy(palette.primaryLight).lerp(new Color('#ffffff'), 0.55)
  materials.orbit.color.copy(palette.line)
  materials.ring.color.copy(palette.line)
}

const rounded = (width: number, height: number, depth: number, radius = 0.06) =>
  new RoundedBoxGeometry(width, height, depth, 3, radius)

/** Soft radial contact shadow drawn once into a canvas texture (cheaper than real-time shadow maps). */
export function createContactShadow(radius: number, strength = 0.28) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, `rgba(30, 28, 70, ${strength})`)
    gradient.addColorStop(1, 'rgba(30, 28, 70, 0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
  }
  const shadow = new Mesh(
    new CircleGeometry(radius, 48),
    new MeshBasicMaterial({ map: new CanvasTexture(canvas), transparent: true, depthWrite: false })
  )
  shadow.rotation.x = -Math.PI / 2
  return shadow
}

/** White pedestal with a glossy brand-coloured inset, like the reference stage. */
export function createPedestal(materials: SceneMaterials) {
  const group = new Group()
  const base = new Mesh(new CylinderGeometry(1.85, 1.95, 0.22, 64), materials.surfaceShade)
  base.position.y = 0.11
  const body = new Mesh(new CylinderGeometry(1.6, 1.7, 0.34, 64), materials.surface)
  body.position.y = 0.39
  const inset = new Mesh(new CylinderGeometry(1.36, 1.36, 0.06, 64), materials.primary)
  inset.position.y = 0.58
  const shadow = createContactShadow(2.6, 0.3)
  shadow.position.y = 0.001
  group.add(shadow, base, body, inset)
  return group
}

/** The SaaS-Sentry mark (open ring + diamond) extruded in 3D, sitting inside the glass sphere. */
export function createBrandMark(materials: SceneMaterials) {
  const group = new Group()
  const ring = new Mesh(new TorusGeometry(0.56, 0.13, 24, 96, Math.PI * 1.5), materials.primary)
  ring.rotation.z = Math.PI / 2
  const diamond = new Mesh(rounded(0.42, 0.42, 0.26, 0.05), materials.primary)
  diamond.rotation.z = Math.PI / 4
  group.add(ring, diamond)
  return group
}

export function createGlassSphere(materials: SceneMaterials) {
  const group = new Group()
  const sphere = new Mesh(new SphereGeometry(1.22, 64, 48), materials.glass)
  const equator = new Mesh(new TorusGeometry(1.26, 0.008, 8, 128), materials.ring)
  equator.rotation.x = Math.PI / 2.15
  group.add(sphere, equator)
  return group
}

export interface Orbit {
  line: Line
  curve: EllipseCurve
  tilt: Group
  dot: Mesh
  speed: number
  offset: number
}

/** Elliptical orbit line around the sphere, tilted, with one small dot travelling along it. */
export function createOrbit(
  materials: SceneMaterials,
  dotMaterial: MeshStandardMaterial,
  radiusX: number,
  radiusY: number,
  rotation: [number, number, number],
  speed: number,
  offset: number
): Orbit {
  const curve = new EllipseCurve(0, 0, radiusX, radiusY, 0, Math.PI * 2, false, 0)
  const points = curve.getPoints(160).map((point) => new Vector3(point.x, point.y, 0))
  const line = new Line(new BufferGeometry().setFromPoints(points), materials.orbit)
  const dot = new Mesh(new SphereGeometry(0.075, 20, 16), dotMaterial)
  const tilt = new Group()
  tilt.rotation.set(...rotation)
  tilt.add(line, dot)
  return { line, curve, tilt, dot, speed, offset }
}

function createCheck(material: MeshStandardMaterial, size = 0.2) {
  const group = new Group()
  const short = new Mesh(rounded(size * 0.5, size * 0.16, size * 0.16, size * 0.05), material)
  short.position.set(-size * 0.22, -size * 0.05, 0)
  short.rotation.z = -Math.PI / 4
  const long = new Mesh(rounded(size, size * 0.16, size * 0.16, size * 0.05), material)
  long.position.set(size * 0.16, size * 0.12, 0)
  long.rotation.z = Math.PI / 3.6
  group.add(short, long)
  return group
}

/** Software license key: the core object SaaS-Sentry manages (licenses, plans, subscriptions). */
export function createLicenseKey(materials: SceneMaterials) {
  const group = new Group()
  const bow = new Mesh(new TorusGeometry(0.3, 0.11, 20, 48), materials.gold)
  bow.position.x = -0.5
  const bowCore = new Mesh(new CylinderGeometry(0.13, 0.13, 0.1, 32), materials.surface)
  bowCore.rotation.x = Math.PI / 2
  bowCore.position.x = -0.5
  const shaft = new Mesh(rounded(0.95, 0.15, 0.14, 0.05), materials.gold)
  shaft.position.x = 0.2
  group.add(bow, bowCore, shaft)
  for (const [x, height] of [
    [0.42, 0.24],
    [0.58, 0.16]
  ] as const) {
    const tooth = new Mesh(rounded(0.1, height, 0.14, 0.03), materials.gold)
    tooth.position.set(x, -0.075 - height / 2 + 0.03, 0)
    group.add(tooth)
  }
  // License tag hanging from the bow, with "seat" lines, so it reads as a licence rather than a door key.
  const tag = new Group()
  tag.position.set(-0.62, -0.52, -0.05)
  tag.rotation.z = 0.18
  tag.add(new Mesh(rounded(0.62, 0.42, 0.06, 0.06), materials.primary))
  for (const [y, width] of [
    [0.06, 0.36],
    [-0.06, 0.26]
  ] as const) {
    const line = new Mesh(rounded(width, 0.045, 0.02, 0.015), materials.primaryLight)
    line.position.set(-0.2 + width / 2, y, 0.04)
    tag.add(line)
  }
  group.add(tag)
  return group
}

/** Purchase invoice with a stack of coins: invoices, annual budgets and spending approval. */
export function createInvoiceStack(materials: SceneMaterials) {
  const group = new Group()
  const paper = new Mesh(rounded(0.95, 1.2, 0.06, 0.05), materials.surface)
  group.add(paper)
  const header = new Mesh(rounded(0.95, 0.2, 0.065, 0.05), materials.primary)
  header.position.set(0, 0.5, 0.004)
  group.add(header)
  for (const [y, width] of [
    [0.22, 0.62],
    [0.06, 0.5],
    [-0.1, 0.58],
    [-0.3, 0.32]
  ] as const) {
    const line = new Mesh(rounded(width, 0.05, 0.02, 0.015), materials.primaryLight)
    line.position.set(-0.36 + width / 2, y, 0.04)
    group.add(line)
  }
  const total = new Mesh(rounded(0.26, 0.08, 0.02, 0.02), materials.teal)
  total.position.set(0.24, -0.3, 0.04)
  group.add(total)
  const coins = new Group()
  for (let index = 0; index < 4; index++) {
    const coin = new Mesh(new CylinderGeometry(0.22, 0.22, 0.07, 40), materials.gold)
    coin.position.y = index * 0.075
    coin.rotation.y = index * 0.4
    coins.add(coin)
  }
  coins.position.set(0.5, -0.62, 0.32)
  group.add(coins)
  return group
}

/** Seat card: a seat granted to a person (provisioning, revocation, ghost seats). */
export function createSeatCard(materials: SceneMaterials) {
  const group = new Group()
  group.add(new Mesh(rounded(1.22, 0.8, 0.08, 0.08), materials.primary))
  const avatar = new Mesh(new SphereGeometry(0.13, 24, 16), materials.surface)
  avatar.position.set(-0.32, 0.12, 0.08)
  const shoulders = new Mesh(rounded(0.34, 0.16, 0.06, 0.07), materials.surface)
  shoulders.position.set(-0.32, -0.12, 0.06)
  group.add(avatar, shoulders)
  // Three seat slots: two taken, one free, the way seats of a subscription are counted.
  ;[materials.teal, materials.teal, materials.primaryLight].forEach((material, index) => {
    const slot = new Mesh(rounded(0.16, 0.16, 0.06, 0.04), material)
    slot.position.set(0.08 + index * 0.21, 0.12, 0.06)
    group.add(slot)
  })
  const line = new Mesh(rounded(0.58, 0.05, 0.03, 0.02), materials.primaryLight)
  line.position.set(0.29, -0.14, 0.05)
  group.add(line)
  return group
}

/** Shield with a check: policies and Shadow IT review. Extruded from a 2D outline with a soft bevel. */
export function createShield(materials: SceneMaterials) {
  const outline = new Shape()
  outline.moveTo(0, 0.42)
  outline.bezierCurveTo(0.16, 0.34, 0.3, 0.32, 0.36, 0.32)
  outline.bezierCurveTo(0.37, 0.02, 0.3, -0.24, 0, -0.44)
  outline.bezierCurveTo(-0.3, -0.24, -0.37, 0.02, -0.36, 0.32)
  outline.bezierCurveTo(-0.3, 0.32, -0.16, 0.34, 0, 0.42)
  const body = new Mesh(
    new ExtrudeGeometry(outline, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 4,
      curveSegments: 24
    }),
    materials.primary
  )
  body.position.z = -0.05
  const check = createCheck(materials.surface, 0.28)
  check.position.set(0, 0, 0.12)
  const group = new Group()
  group.add(body, check)
  return group
}

/** Usage chart card with a gold "verified" badge: usage and cost optimisation. */
export function createChartCard(materials: SceneMaterials) {
  const group = new Group()
  group.add(new Mesh(rounded(1.2, 1.02, 0.1, 0.08), materials.surface))
  const title = new Mesh(rounded(0.46, 0.06, 0.03, 0.02), materials.primary)
  title.position.set(-0.28, 0.36, 0.06)
  group.add(title)
  const bars = [
    { height: 0.26, material: materials.primaryLight },
    { height: 0.42, material: materials.primary },
    { height: 0.6, material: materials.teal }
  ]
  bars.forEach(({ height, material }, index) => {
    const bar = new Mesh(rounded(0.2, height, 0.12, 0.04), material)
    bar.position.set(-0.3 + index * 0.3, -0.38 + height / 2, 0.08)
    group.add(bar)
  })
  const badge = new Group()
  const coin = new Mesh(new CylinderGeometry(0.2, 0.2, 0.08, 40), materials.gold)
  coin.rotation.x = Math.PI / 2
  const check = createCheck(materials.surface, 0.18)
  check.position.z = 0.06
  badge.add(coin, check)
  badge.position.set(0.5, 0.48, 0.1)
  group.add(badge)
  return group
}

export function createSparkles(materials: SceneMaterials) {
  const group = new Group()
  const spots: [number, number, number, MeshStandardMaterial, number][] = [
    [-1.4, 3.6, -0.6, materials.primaryLight, 0.07],
    [2.6, 2.3, -0.4, materials.gold, 0.08],
    [-2.9, 1.0, 0.4, materials.primary, 0.06],
    [3.2, 0.6, 0.6, materials.teal, 0.05],
    [0.6, 4.1, -1.0, materials.teal, 0.05]
  ]
  for (const [x, y, z, material, size] of spots) {
    const sparkle = new Mesh(new SphereGeometry(size, 16, 12), material)
    sparkle.position.set(x, y, z)
    group.add(sparkle)
  }
  return group
}
