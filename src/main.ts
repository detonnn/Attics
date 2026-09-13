import './style.css'

// ponytail: CDN tailwind covers custom colors, local @tailwindcss/vite kept for HMR only

let currentId = 'view-home'
let animating = false
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function setNavActive(id: string) {
  const path = id.replace('view-', '')
  document.querySelectorAll<HTMLAnchorElement>('header nav [data-path]').forEach(a => {
    if (a.dataset.path === path) {
      a.classList.add('text-primary', 'border-b', 'border-primary')
      a.classList.remove('text-on-surface-variant')
      a.setAttribute('aria-current', 'page')
    } else {
      a.classList.remove('text-primary', 'border-b', 'border-primary')
      a.classList.add('text-on-surface-variant')
      a.removeAttribute('aria-current')
    }
  })
}

function showView(id: string) {
  if (id === currentId || animating) return
  const current = document.getElementById(currentId)
  const next = document.getElementById(id)
  if (!current || !next) return
  setNavActive(id)

  if (prefersReduced) {
    current.classList.add('hidden'); current.classList.remove('flex')
    next.classList.remove('hidden'); next.classList.add('flex')
    currentId = id
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  animating = true
  current.classList.remove('view-enter')
  current.classList.add('view-leave')

  current.addEventListener('animationend', () => {
    current.classList.add('hidden')
    current.classList.remove('flex', 'view-leave')
    next.classList.remove('hidden')
    next.classList.add('flex', 'view-enter')
    // force reflow for stagger
    void next.offsetWidth
    next.addEventListener('animationend', () => {
      next.classList.remove('view-enter')
      animating = false
    }, { once: true })
    currentId = id
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, { once: true })
}

// nav router
document.querySelectorAll<HTMLElement>('[data-path]').forEach(a => {
  a.addEventListener('click', e => {
    const path = a.dataset.path
    if (!path) return
    e.preventDefault()
    const map: Record<string, string> = {
      home: 'view-home',
      catalog: 'view-catalog',
      product: 'view-product',
      contact: 'view-contact',
      cart: 'view-cart',
      'dm-instagram': 'view-contact',
    }
    const target = map[path]
    if (target) showView(target)
  })
})

// catalog filter
document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach(b => {
      b.classList.remove('text-primary', 'border-b', 'border-primary')
      b.classList.add('text-outline')
    })
    btn.classList.add('text-primary', 'border-b', 'border-primary')
    btn.classList.remove('text-outline')
    const filter = btn.dataset.filter
    document.querySelectorAll<HTMLElement>('.catalog-item').forEach(item => {
      const s = item.dataset.status
      item.style.display = filter === 'all' || s === filter ? 'flex' : 'none'
    })
  })
})

// product thumbnails
document.querySelectorAll<HTMLButtonElement>('.thumbnail-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.dataset.thumb
    const cap = btn.dataset.caption
    const main = document.getElementById('main-product-view') as HTMLImageElement | null
    const capEl = document.getElementById('image-caption')
    if (main && src) {
      main.style.opacity = '0'
      setTimeout(() => { main.src = src; main.style.opacity = '1' }, 150)
    }
    if (capEl && cap) capEl.textContent = cap
    document.querySelectorAll('.thumbnail-btn').forEach(b => b.classList.replace('opacity-100', 'opacity-50'))
    btn.classList.remove('opacity-50')
    btn.classList.add('opacity-100')
  })
})

// copy inquiry
document.getElementById('copy-btn')?.addEventListener('click', () => {
  navigator.clipboard.writeText('Looking to claim Drop #003 Disaster Double-Layer L/S').then(() => {
    const icon = document.getElementById('copy-icon')
    if (icon) icon.textContent = 'check'
    setTimeout(() => { if (icon) icon.textContent = 'content_copy' }, 2000)
  })
})

// faq accordion
document.querySelectorAll<HTMLButtonElement>('.faq-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = document.getElementById(btn.dataset.faq!)
    const icon = document.getElementById(btn.dataset.icon!)
    if (!content || !icon) return
    const hidden = content.classList.contains('hidden')
    content.classList.toggle('hidden', !hidden)
    icon.textContent = hidden ? '[-]' : '[+]'
  })
})

// cart timer 14:59 countdown
let duration = 14 * 60 + 59
const timerEl = document.getElementById('cart-timer')
if (timerEl) {
  setInterval(() => {
    if (duration <= 0) return
    duration--
    const m = Math.floor(duration / 60)
    const s = duration % 60
    timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, 1000)
}

// courier selector
const basePrice = 1850000
document.querySelectorAll<HTMLInputElement>('input[name="courier"]').forEach(input => {
  input.addEventListener('change', e => {
    const cost = parseInt((e.target as HTMLInputElement).value, 10)
    const shipEl = document.getElementById('shipping-cost-display')
    const totalEl = document.getElementById('total-cost-display')
    if (shipEl) shipEl.textContent = 'RP ' + cost.toLocaleString('id-ID')
    if (totalEl) totalEl.textContent = 'RP ' + (basePrice + cost).toLocaleString('id-ID')
    document.querySelectorAll('label[id^="courier-"]').forEach(l => {
      l.className = 'flex flex-col p-space-sm bg-surface-container text-primary hover:bg-surface-bright cursor-pointer transition-colors'
    })
    input.closest('label')!.className = 'flex flex-col p-space-sm bg-primary text-on-primary cursor-pointer transition-colors'
  })
})

// payment tabs
document.querySelectorAll<HTMLButtonElement>('.payment-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll<HTMLButtonElement>('.payment-tab').forEach(t => {
      t.className = 'payment-tab py-space-sm px-space-md bg-surface-container text-primary hover:bg-surface-bright font-label-md text-label-md uppercase tracking-wider text-center'
    })
    tab.className = 'payment-tab py-space-sm px-space-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider text-center font-bold'
  })
})

document.getElementById('pay-button')?.addEventListener('click', function (this: HTMLButtonElement) {
  const orig = this.innerHTML
  this.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> <span>MEMPROSES TRANSAKSI...</span>'
  setTimeout(() => {
    this.innerHTML = '<span>MENUNGGU PEMBAYARAN QRIS</span> <span class="material-symbols-outlined text-[18px]">qr_code_scanner</span>'
    setTimeout(() => { this.innerHTML = orig }, 3000)
  }, 800)
})

// shutter hero — vanilla port, trigger on first approach (IntersectionObserver once)
const SHUTTER_LINES = ["ONE PIECE.", "ONE BUYER.", "NEVER REPRINTED."]
let shutterRendered = false
function renderShutter() {
  if (shutterRendered) return
  shutterRendered = true
  const container = document.getElementById('shutter-lines')
  if (!container) return
  container.innerHTML = ''
  let globalIdx = 0
  SHUTTER_LINES.forEach(line => {
    const row = document.createElement('div')
    row.className = 'shutter-line'
    line.split('').forEach(char => {
      const i = globalIdx++
      const ch = document.createElement('div')
      ch.className = 'shutter-char'
      const display = char === ' ' ? '\u00A0' : char
      const delayMain = (i * 0.04 + 0.3).toFixed(2)
      const d1 = (i * 0.04).toFixed(2)
      const d2 = (i * 0.04 + 0.1).toFixed(2)
      const d3 = (i * 0.04 + 0.2).toFixed(2)
      ch.innerHTML = `
        <span class="shutter-main" style="animation-delay:${delayMain}s">${display}</span>
        <span class="shutter-slice top" style="animation-delay:${d1}s">${display}</span>
        <span class="shutter-slice mid" style="animation-delay:${d2}s">${display}</span>
        <span class="shutter-slice bot" style="animation-delay:${d3}s">${display}</span>
      `
      row.appendChild(ch)
    })
    container.appendChild(row)
  })
}

// observe shutter + all sections/cards — animate once when approaching
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target as HTMLElement
      if (el.id === 'shutter-hero') renderShutter()
      el.classList.add('is-visible')
      revealObserver.unobserve(el)
    }
  })
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

function initReveal() {
  document.querySelectorAll<HTMLElement>('[data-view] section, [data-view] article, [data-view] .catalog-item, #shutter-hero').forEach(el => {
    el.classList.add('reveal')
    revealObserver.observe(el)
  })
}
initReveal()
const _showView = showView
function showViewWrapped(id: string) {
  _showView(id)
  setTimeout(() => {
    document.querySelectorAll<HTMLElement>(`#${id} section, #${id} article, #${id} .catalog-item`).forEach(el => {
      if (!el.classList.contains('is-visible')) {
        el.classList.add('reveal')
        revealObserver.observe(el)
      }
    })
  }, 260)
}
// patch nav to use wrapped version
document.querySelectorAll<HTMLElement>('[data-path]').forEach(a => {
  // already bound, re-bind to wrapped — remove old by cloning
  const clone = a.cloneNode(true) as HTMLElement
  a.replaceWith(clone)
})
document.querySelectorAll<HTMLElement>('[data-path]').forEach(a => {
  a.addEventListener('click', e => {
    const path = a.dataset.path
    if (!path) return
    e.preventDefault()
    const map: Record<string, string> = { home: 'view-home', catalog: 'view-catalog', product: 'view-product', contact: 'view-contact', cart: 'view-cart', 'dm-instagram': 'view-contact' }
    const target = map[path]
    if (target) showViewWrapped(target)
  })
})

// global image fallback — unsplash stock if lh3 expired
document.addEventListener('error', (e) => {
  const t = e.target as HTMLImageElement
  if (t.tagName === 'IMG' && !t.dataset.fallback) {
    t.dataset.fallback = '1'
    // keep avatar as avatar, others as tee
    const isAvatar = t.alt === 'Profile'
    t.src = isAvatar
      ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80&auto=format'
      : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format'
  }
}, true)

// default view — animate in on load
const initial = document.getElementById(currentId)
if (initial) {
  initial.classList.remove('hidden')
  initial.classList.add('flex', 'view-enter')
  initial.addEventListener('animationend', () => initial.classList.remove('view-enter'), { once: true })
  setNavActive(currentId)
}
