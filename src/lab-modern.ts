import { mount, unmount } from 'svelte'
import type { LabModernApi, MountHomeOptions } from './catalog'
import ModernHome from './ModernHome.svelte'
import shellStyles from './modern-home.css?inline'
import { getDocumentTitle, getExperimentTitle, getLocale } from './i18n'

declare global {
  interface Window {
    LabModern?: LabModernApi
  }
}

let mountedComponent: Record<string, unknown> | null = null
let mountedTarget: HTMLElement | null = null
let styleElement: HTMLStyleElement | null = null

function installStyles() {
  if (styleElement?.isConnected) return

  styleElement = document.createElement('style')
  styleElement.id = 'lab-modern-shell-styles'
  styleElement.textContent = shellStyles
  document.head.appendChild(styleElement)
}

function removeStyles() {
  styleElement?.remove()
  styleElement = null
}

function unmountHome() {
  if (mountedComponent) {
    void unmount(mountedComponent)
    mountedComponent = null
  }

  if (mountedTarget) {
    mountedTarget.classList.remove('lm-modern-host')
    mountedTarget.removeAttribute('data-modern-shell')
    mountedTarget.replaceChildren()
    mountedTarget = null
  }

  removeStyles()
}

function mountHome(target: HTMLElement, options: MountHomeOptions) {
  if (!target || !(target instanceof HTMLElement)) {
    throw new TypeError('LabModern.mountHome cần một phần tử HTML làm điểm gắn.')
  }

  unmountHome()
  installStyles()
  target.classList.add('lm-modern-host')
  target.setAttribute('data-modern-shell', 'true')

  try {
    mountedComponent = mount(ModernHome, {
      target,
      props: {
        catalog: options?.catalog ?? []
      }
    })
    mountedTarget = target
  } catch (error) {
    target.classList.remove('lm-modern-host')
    target.removeAttribute('data-modern-shell')
    target.replaceChildren()
    removeStyles()
    throw error
  }

  return true
}

const api: LabModernApi = Object.freeze({
  mountHome,
  unmountHome,
  isMounted: () => Boolean(mountedComponent && mountedTarget),
  getLocale,
  getDocumentTitle,
  getExperimentTitle
})

window.LabModern = api
