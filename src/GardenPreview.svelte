<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { RoundedBoxGeometry } from '@threlte/extras'
  import { onMount } from 'svelte'
  import GardenPlant from './GardenPlant.svelte'
  import { t } from './i18n'

  let webglAvailable = $state(false)

  onMount(() => {
    try {
      const probe = document.createElement('canvas')
      const context = probe.getContext('webgl2') || probe.getContext('webgl')
      webglAvailable = Boolean(context)
      context?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      webglAvailable = false
    }
  })
</script>

<figure class="lm-garden" aria-label={t('garden.label')}>
  <div class="lm-garden-stage" aria-hidden="true">
    {#if webglAvailable}
      <Canvas
        renderMode="on-demand"
        dpr={[1, 1.5]}
        shadows={false}
      >
        <T.PerspectiveCamera
          makeDefault
          position={[7.2, 4.8, 8.2]}
          fov={34}
          near={0.1}
          far={80}
          oncreate={(camera) => camera.lookAt(0, 0.1, 0)}
        />
        <T.AmbientLight intensity={1.35} />
        <T.HemisphereLight args={['#e8f8ff', '#6e7e43', 1.7]} />
        <T.DirectionalLight
          args={['#fff4d4', 2.2]}
          position={[4, 7, 5]}
        />

        <T.Group position.y={-0.25} rotation.y={-0.12}>
          <T.Mesh position={[0, -0.85, 0]} rotation.x={-Math.PI / 2}>
            <T.CircleGeometry args={[5.8, 56]} />
            <T.MeshStandardMaterial color="#a6cf78" roughness={1} />
          </T.Mesh>

          <T.Mesh position={[0, -0.42, 0]}>
            <RoundedBoxGeometry args={[7, 0.72, 4.2]} radius={0.24} smoothness={4} />
            <T.MeshStandardMaterial color="#a96b3f" roughness={0.92} />
          </T.Mesh>

          <T.Mesh position={[0, -0.02, 0]}>
            <RoundedBoxGeometry args={[6.62, 0.2, 3.82]} radius={0.12} smoothness={3} />
            <T.MeshStandardMaterial color="#6f4d32" roughness={1} />
          </T.Mesh>

          <GardenPlant position={[-2.25, 0.08, -0.95]} height={1.45} leafColor="#438e42" />
          <GardenPlant position={[-0.75, 0.08, -0.95]} height={1.72} leafColor="#58a847" fruit />
          <GardenPlant position={[0.75, 0.08, -0.85]} height={1.35} leafColor="#337f3e" />
          <GardenPlant position={[2.25, 0.08, -0.8]} height={1.58} leafColor="#68ad4d" fruit />
          <GardenPlant position={[-1.5, 0.08, 0.75]} height={1.12} leafColor="#75ae3f" />
          <GardenPlant position={[0, 0.08, 0.78]} height={1.28} leafColor="#4d9847" fruit />
          <GardenPlant position={[1.65, 0.08, 0.78]} height={1.08} leafColor="#4d8f3e" />

          <T.Group position={[2.8, 2.05, 0.95]} rotation={[0.12, -0.4, 0.18]}>
            <T.Mesh position={[0, 0, 0]} scale={[0.28, 0.18, 0.04]}>
              <T.SphereGeometry args={[1, 14, 9]} />
              <T.MeshStandardMaterial color="#f2ab3a" roughness={0.65} />
            </T.Mesh>
            <T.Mesh position={[-0.3, 0, 0]} scale={[0.25, 0.34, 0.04]}>
              <T.SphereGeometry args={[1, 14, 9]} />
              <T.MeshStandardMaterial color="#f9d36c" roughness={0.7} />
            </T.Mesh>
            <T.Mesh position={[0.3, 0, 0]} scale={[0.25, 0.34, 0.04]}>
              <T.SphereGeometry args={[1, 14, 9]} />
              <T.MeshStandardMaterial color="#f9d36c" roughness={0.7} />
            </T.Mesh>
          </T.Group>
        </T.Group>
      </Canvas>
    {:else}
      <div class="lm-garden-fallback">
        <span>🌱</span>
        <span>🌿</span>
        <span>🍅</span>
      </div>
    {/if}
  </div>
  <figcaption>{t('garden.caption')}</figcaption>
</figure>
