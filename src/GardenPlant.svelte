<script lang="ts">
  import { T } from '@threlte/core'

  interface Props {
    position: [number, number, number]
    height: number
    leafColor?: string
    fruit?: boolean
  }

  let {
    position,
    height,
    leafColor = '#4f9f45',
    fruit = false
  }: Props = $props()
</script>

<T.Group {position}>
  <T.Mesh position.y={height * 0.5}>
    <T.CylinderGeometry args={[0.045, 0.065, height, 8]} />
    <T.MeshStandardMaterial color="#5d7f36" roughness={0.9} />
  </T.Mesh>

  <T.Mesh
    position={[-0.16, height * 0.56, 0]}
    rotation={[0.15, 0.2, 0.78]}
    scale={[0.33, 0.14, 0.2]}
  >
    <T.SphereGeometry args={[1, 14, 9]} />
    <T.MeshStandardMaterial color={leafColor} roughness={0.78} />
  </T.Mesh>

  <T.Mesh
    position={[0.17, height * 0.72, 0.02]}
    rotation={[-0.12, -0.15, -0.72]}
    scale={[0.34, 0.14, 0.2]}
  >
    <T.SphereGeometry args={[1, 14, 9]} />
    <T.MeshStandardMaterial color={leafColor} roughness={0.78} />
  </T.Mesh>

  {#if fruit}
    <T.Mesh position={[-0.08, height * 0.3, 0.18]} scale={[0.13, 0.13, 0.13]}>
      <T.SphereGeometry args={[1, 14, 10]} />
      <T.MeshStandardMaterial color="#ef744d" roughness={0.72} />
    </T.Mesh>
    <T.Mesh position={[0.12, height * 0.52, 0.14]} scale={[0.11, 0.11, 0.11]}>
      <T.SphereGeometry args={[1, 14, 10]} />
      <T.MeshStandardMaterial color="#e8a42f" roughness={0.72} />
    </T.Mesh>
  {/if}
</T.Group>
