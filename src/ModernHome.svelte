<script lang="ts">
  import { summarizeCatalogTitles, type CatalogItem, type ExperimentGroup } from './catalog'
  import ExperimentCard from './ExperimentCard.svelte'
  import GardenPreview from './GardenPreview.svelte'
  import { getDocumentTitle, localizeCatalog, t } from './i18n'

  interface Props {
    catalog: readonly CatalogItem[]
  }

  let { catalog }: Props = $props()
  let catalogTarget = $state<HTMLElement>()
  const localizedCatalog = $derived(localizeCatalog(catalog))
  const stats = $derived(summarizeCatalogTitles(localizedCatalog))

  const groups = $derived<ReadonlyArray<{
    id: ExperimentGroup
    emoji: string
    title: string
    intro: string
  }>>([
    {
      id: 'plant',
      emoji: '🌱',
      title: t('group.plant.title'),
      intro: t('group.plant.intro')
    },
    {
      id: 'animal',
      emoji: '🐾',
      title: t('group.animal.title'),
      intro: t('group.animal.intro')
    }
  ])

  $effect(() => {
    document.title = getDocumentTitle()
  })

  function focusCatalog(event: MouseEvent) {
    event.preventDefault()
    catalogTarget?.focus()
    catalogTarget?.scrollIntoView({ block: 'start' })
  }

</script>

<div class="lm-shell" lang="vi">
  <a class="lm-skip" href="#experiment-catalog" onclick={focusCatalog}>
    {t('home.skip')}
  </a>

  <div class="lm-content">
    <header class="lm-hero" aria-labelledby="modern-home-title">
      <div class="lm-hero-copy">
        <p class="lm-eyebrow">
          <span aria-hidden="true">✦</span>
          {t('home.eyebrow', { count: stats.total })}
        </p>
        <h1 id="modern-home-title">{getDocumentTitle().toLocaleUpperCase('vi')}</h1>
        <p class="lm-lead">{t('home.lead')}</p>
        <p class="lm-intro">{t('home.intro')}</p>
        <a class="lm-primary-action" href="#experiment-catalog" onclick={focusCatalog}>
          {t('home.choose')}
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <GardenPreview />
    </header>

    <section class="lm-title-stats" aria-labelledby="lm-title-stats-heading">
      <div class="lm-title-stats-heading">
        <h2 id="lm-title-stats-heading">{t('stats.heading')}</h2>
        <span aria-hidden="true">{stats.available} / {stats.total}</span>
      </div>
      <dl class="lm-title-stats-grid">
        <div><dt>{t('stats.total', { count: stats.total })}</dt><dd>{stats.total}</dd></div>
        <div><dt>{t('stats.available', { count: stats.available })}</dt><dd>{stats.available}</dd></div>
        <div><dt>{t('stats.plant', { count: stats.plant })}</dt><dd>{stats.plant}</dd></div>
        <div><dt>{t('stats.animal', { count: stats.animal })}</dt><dd>{stats.animal}</dd></div>
      </dl>
      <details class="lm-title-details">
        <summary>{t('stats.details')}</summary>
        <p>{t('stats.average', { count: stats.averageLength })}</p>
        {#if stats.longest}
          <p>{t('stats.longest', { number: stats.longest.number, count: stats.longest.length })}</p>
        {/if}
      </details>
    </section>

    <section
      id="experiment-catalog"
      class="lm-catalog"
      aria-label={t('home.catalog')}
      tabindex="-1"
      bind:this={catalogTarget}
    >
      {#each groups as group}
        <section class="lm-group" aria-labelledby={`lm-group-${group.id}`}>
          <div class="lm-group-heading">
            <div class="lm-group-icon" aria-hidden="true">{group.emoji}</div>
            <div>
              <h2 id={`lm-group-${group.id}`}>{group.title}</h2>
              <p>{group.intro}</p>
            </div>
          </div>

          <ol class="lm-card-grid">
            {#each localizedCatalog.filter((item) => item.group === group.id) as item (item.id)}
              <ExperimentCard {item} />
            {/each}
          </ol>
        </section>
      {/each}
    </section>

    <footer class="lm-footer">
      <p>{t('footer.drag')}</p>
      <p>{t('footer.score')}</p>
    </footer>
  </div>
</div>
