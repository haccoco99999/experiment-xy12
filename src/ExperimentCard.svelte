<script lang="ts">
  import type { CatalogItem } from './catalog'
  import { getGroupTitle, t } from './i18n'

  interface Props {
    item: CatalogItem
  }

  let { item }: Props = $props()
  const available = $derived(item.available !== false)
</script>

<li class="lm-card-item">
  <article class:lm-animal={item.group === 'animal'} class="lm-card">
    <div class="lm-card-topline">
      <span class="lm-card-number">{t('card.number', { number: item.n })}</span>
      <span class="lm-card-kind">{getGroupTitle(item.group)}</span>
    </div>
    <span class="lm-card-emoji" aria-hidden="true">{item.emoji}</span>
    <h3>{item.title}</h3>
    <p>{item.sub}</p>

    {#if available}
      <a
        class="lm-card-action"
        href={`#${item.id}`}
        aria-label={t('card.startLabel', { number: item.n, title: item.title })}
      >
        <span>{t('card.start')}</span>
        <span aria-hidden="true">→</span>
      </a>
    {:else}
      <button class="lm-card-action lm-card-action-disabled" type="button" disabled>
        {t('card.coming')}
      </button>
    {/if}
  </article>
</li>
