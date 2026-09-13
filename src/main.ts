import './style.css'
import { headerTemplate, footerTemplate } from './layout'
import { view_home, view_catalog, view_cart, view_tracking, view_contact } from './views'

const app = document.getElementById('app')!
app.innerHTML = `
  ${headerTemplate}
  <main class="w-full pt-14 bg-surface-container-lowest min-h-screen">
    ${view_home}
    ${view_catalog}
    ${view_cart}
    ${view_tracking}
    ${view_contact}
  </main>
  ${footerTemplate}
  <div id="app-toast" class="hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] bg-primary text-surface-container-lowest px-6 py-3 font-label-md text-label-md uppercase tracking-wider border border-primary shadow-2xl max-w-[90vw] text-center"></div>
`

let currentId = 'view-home'
let animating = false
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function isPaid(){ return localStorage.getItem('attics_paid') === '1' }
let toastTimer:any
function showToast(msg:string, ms=3200){
  const el = document.getElementById('app-toast')
  if(!el) { alert(msg); return }
  el.textContent = msg
  el.classList.remove('hidden')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(()=> el.classList.add('hidden'), ms)
}
function validateCheckout(showMsg=true){
  const name = (document.getElementById('checkout-name') as HTMLInputElement|null)?.value.trim()||''
  const phone = (document.getElementById('checkout-phone') as HTMLInputElement|null)?.value.trim()||''
  const addr = (document.getElementById('checkout-address') as HTMLTextAreaElement|null)?.value.trim()||''
  const city = (document.getElementById('checkout-city') as HTMLInputElement|null)?.value.trim()||''
  const postal = (document.getElementById('checkout-postal') as HTMLInputElement|null)?.value.trim()||''
  const courier = document.querySelector<HTMLInputElement>('input[name="courier"]:checked')
  const missing:string[]=[]
  if(!name) missing.push('NAMA LENGKAP')
  if(!phone || phone.replace(/\D/g,'').length < 9) missing.push('NOMOR WHATSAPP')
  if(!addr) missing.push('ALAMAT LENGKAP')
  if(!city) missing.push('KOTA/KABUPATEN')
  if(!postal || !/^[0-9]{5}$/.test(postal)) missing.push('KODE POS (5 DIGIT)')
  if(!courier) missing.push('KURIR DOMESTIK')
  // visual hint
  ;['checkout-name','checkout-phone','checkout-address','checkout-city','checkout-postal'].forEach(id=>{
    const el=document.getElementById(id) as HTMLElement|null
    if(!el) return
    const v=(el as HTMLInputElement).value.trim()
    const bad = !v || (id==='checkout-postal' && !/^[0-9]{5}$/.test(v)) || (id==='checkout-phone' && v.replace(/\D/g,'').length<9)
    el.classList.toggle('border-red-500', bad)
    el.classList.toggle('border-transparent', !bad)
    if(bad) el.classList.add('border','border-red-500')
    else el.classList.remove('border-red-500')
  })
  const errEl=document.getElementById('courier-error')
  if(errEl) errEl.classList.toggle('hidden', !!courier)
  if(missing.length && showMsg){
    showToast('LENGKAPI DULU: ' + missing.join(' • '))
  }
  return missing.length===0
}

function setNavActive(id: string) {
  const path = id.replace('view-', '')
  document.querySelectorAll<HTMLAnchorElement>('header nav [data-path]').forEach(a => {
    const isActive = a.dataset.path === path
    // desktop nav keeps border-b active style, mobile nav uses text-primary only
    const isMobile = a.closest('#mobile-nav') !== null
    if (isActive) {
      a.classList.add('text-primary')
      a.classList.remove('text-on-surface-variant')
      if (!isMobile) a.classList.add('border-b', 'border-primary')
      a.setAttribute('aria-current', 'page')
    } else {
      a.classList.remove('text-primary', 'border-b', 'border-primary')
      a.classList.add('text-on-surface-variant')
      a.removeAttribute('aria-current')
    }
  })
}

// --- MOBILE NAV (hamburger) ---
const mobileBtn = document.getElementById('mobile-menu-btn') as HTMLButtonElement | null
const mobileNav = document.getElementById('mobile-nav') as HTMLElement | null
function setMobileOpen(open: boolean) {
  if (!mobileNav || !mobileBtn) return
  mobileNav.classList.toggle('hidden', !open)
  mobileNav.classList.toggle('flex', open)
  mobileBtn.setAttribute('aria-expanded', String(open))
  const icon = mobileBtn.querySelector('.material-symbols-outlined')
  if (icon) icon.textContent = open ? 'close' : 'menu'
  mobileBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
}
mobileBtn?.addEventListener('click', e => {
  e.stopPropagation()
  const isHidden = mobileNav?.classList.contains('hidden') ?? true
  setMobileOpen(isHidden)
})
// close mobile nav on nav click + on outside click + on resize to desktop
document.addEventListener('click', e => {
  if (!mobileNav || mobileNav.classList.contains('hidden')) return
  const t = e.target as HTMLElement
  if (t.closest('#mobile-nav') || t.closest('#mobile-menu-btn')) return
  // don't close if clicking profile dropdown
  if (t.closest('#profile-dropdown') || t.closest('#profile-menu-btn')) return
  setMobileOpen(false)
})
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) setMobileOpen(false)
})
function syncTrackingPage(){
  const empty = document.getElementById('tracking-empty')
  const content = document.getElementById('tracking-content')
  if(!empty || !content) return
  const paid = isPaid()
  empty.classList.toggle('hidden', paid)
  empty.classList.toggle('flex', !paid)
  content.classList.toggle('hidden', !paid)
  // when paid, ensure content visible as block
  if(paid) content.classList.remove('hidden')
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
    if(id==='view-tracking') syncTrackingPage()
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
    void next.offsetWidth
    next.addEventListener('animationend', () => {
      next.classList.remove('view-enter')
      animating = false
    }, { once: true })
    currentId = id
    if(id==='view-tracking') syncTrackingPage()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, { once: true })
}



// --- HOME: filter tabs ---
document.querySelectorAll<HTMLButtonElement>('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll<HTMLButtonElement>('.filter-tab').forEach(b => {
      b.classList.remove('bg-primary', 'text-surface-container-lowest')
      b.classList.add('text-on-surface-variant')
    })
    btn.classList.add('bg-primary', 'text-surface-container-lowest')
    btn.classList.remove('text-on-surface-variant')
    const filter = btn.dataset.filter
    document.querySelectorAll<HTMLElement>('#specimens-grid .specimen-card').forEach(card => {
      const s = card.dataset.status
      card.style.display = filter === 'all' || s === filter ? 'flex' : 'none'
    })
  })
})
// --- HOME: typing hero ONE PIECE. ONE BUYER. NEVER REPRINTED. ---
const typingTextEl = document.getElementById('typing-text') as HTMLElement | null
if (typingTextEl) {
  const lines = ['ONE PIECE.', 'ONE BUYER.', 'NEVER REPRINTED.']
  const full = lines.join('\n')
  let idx = 0
  let deleting = false
  const typeSpeed = 90
  const deleteSpeed = 42
  const holdFull = 1800
  const holdEmpty = 600
  if (prefersReduced) {
    typingTextEl.innerHTML = lines.join('<br>')
  } else {
    const tick = () => {
      if (!deleting) {
        typingTextEl.innerHTML = full.slice(0, idx + 1).replace(/\n/g, '<br>')
        idx++
        if (idx === full.length) {
          setTimeout(() => { deleting = true; tick() }, holdFull)
          return
        }
        setTimeout(tick, typeSpeed + (Math.random()*30))
      } else {
        typingTextEl.innerHTML = full.slice(0, idx - 1).replace(/\n/g, '<br>')
        idx--
        if (idx === 0) {
          deleting = false
          setTimeout(tick, holdEmpty)
          return
        }
        setTimeout(tick, deleteSpeed)
      }
    }
    // example: onipiece._ cursor stays after last char via typingCursorEl
    setTimeout(tick, 400)
  }
}

// --- HOME: cursor tracker ---
const cursorTracker = document.getElementById('cursor-tracker')
if (cursorTracker) {
  window.addEventListener('mousemove', e => {
    cursorTracker.textContent = `[X: ${e.clientX} Y: ${e.clientY}]`
  })
}

// --- HOME: radar form ---
document.getElementById('radar-form')?.addEventListener('submit', e => {
  e.preventDefault()
  const input = document.getElementById('radar-email') as HTMLInputElement | null
  const btn = document.getElementById('radar-submit') as HTMLElement | null
  if (!input || !btn || !input.value) return
  const orig = btn.querySelector('span')?.textContent || 'CONNECT RADAR'
  const span = btn.querySelector('span')
  if (span) span.textContent = 'SIGNAL LOCKED ✓'
  btn.classList.add('bg-emerald-400', 'text-black')
  setTimeout(() => {
    input.value = ''
    if (span) span.textContent = orig
    btn.classList.remove('bg-emerald-400', 'text-black')
  }, 2500)
})

// --- CATALOG: filter-btn ---
document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach(b => {
      b.classList.remove('text-primary', 'border-primary', 'border-b-2')
      b.classList.add('text-outline', 'border-transparent')
    })
    btn.classList.add('text-primary', 'border-primary')
    btn.classList.remove('text-outline', 'border-transparent')
    const filter = btn.dataset.filter
    document.querySelectorAll<HTMLElement>('.catalog-filter-target').forEach(el => {
      const cat = el.dataset.category
      const status = el.dataset.status
      // support both category filter (knit/tee/vaulted) and status filter (available/claimed)
      const show = filter === 'all' || cat === filter || status === filter || (filter==='available' && status==='available') || (filter==='claimed' && status==='claimed')
      el.style.display = show ? '' : 'none'
      el.classList.toggle('hidden', !show)
    })
    const countEl = document.getElementById('active-specimens-count')
    if (countEl) {
      const gridVisible = Array.from(document.querySelectorAll<HTMLElement>('#specimens-container .catalog-filter-target')).filter(el => el.style.display !== 'none').length
      countEl.textContent = `[0${gridVisible} UNITS]`
    }
  })
})

// --- CATALOG: viewport switcher ---
document.querySelectorAll<HTMLButtonElement>('.viewport-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll<HTMLButtonElement>('.viewport-mode-btn').forEach(b => {
      b.className = 'viewport-mode-btn p-1 text-outline hover:text-primary font-label-sm text-label-sm uppercase px-2 transition-all'
    })
    btn.className = 'viewport-mode-btn p-1 bg-primary text-surface-container-lowest font-label-sm text-label-sm uppercase px-2 font-bold transition-all'
    const mode = btn.dataset.mode
    const modeText = document.getElementById('mode-status-text')
    const hero = document.getElementById('hero-spotlight-section')
    const container = document.getElementById('specimens-container')
    if (mode === 'grid') {
      if (modeText) modeText.textContent = 'ARCHIVE QUAD-GRID'
      if (hero) hero.classList.add('opacity-90')
      if (container) container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-outline-variant transition-all duration-300'
    } else {
      if (modeText) modeText.textContent = 'CURATED EDITORIAL'
      if (hero) hero.classList.remove('opacity-90')
      if (container) container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-outline-variant transition-all duration-300'
    }
  })
})

// --- CATALOG: hero tilt ---
const heroCard = document.getElementById('hero-interactive-card')
if (heroCard && window.matchMedia('(pointer: fine)').matches) {
  heroCard.addEventListener('mousemove', e => {
    const rect = heroCard.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rx = (-y / rect.height) * 4
    const ry = (x / rect.width) * 4
    heroCard.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
  })
  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
  })
}

// --- CATALOG: add to bag ---
let bagCount = 1
let basePrice = 1850000
const bagText = document.getElementById('header-bag-text')
const bagBtn = document.getElementById('header-bag-btn') || bagText?.closest('a')
const CATALOG: Record<string, {title:string, price:number, priceUsd:string, category:string, silhouette:string, basecolor:string, fabrication:string, print:string, tagsize:string, img:string, specNo:string, catalogNo:string, spec:string, size:string, sku:string}> = {
  "DISASTER DOUBLE SLEEVE": {title:"DISASTER // DOUBLE-LAYER L/S", price:1850000, priceUsd:"/ $120 USD", category:"CATEGORY // HEAVY CUT & SEW", silhouette:"OVERSIZED 90S BOXY RAGLAN", basecolor:"ACID CHARCOAL / ASH CONTRAST SLEEVE", fabrication:"100% COMBED HEAVY COTTON 480 GSM", print:"SCREEN HAND-PULLED WITH CRACK FINISH", tagsize:"TAGGED L (PIT: 66CM // LENGTH: 74CM)", img:"/catalog/disaster.png", specNo:"SPECIMEN #001", catalogNo:"CATALOG NO. 001 OF 004", spec:"SPEC: HEAVY COTTON 330 GSM", size:"SIZE: OVERSIZED L", sku:"DOMESTIC SKU: ATTC-JKT-24-0091"},
  "DESIRE EYE HEAVY TEE": {title:"DESIRE EYE HEAVY TEE", price:1150000, priceUsd:"/ $75 USD", category:"CATEGORY // BOXY SHORT SLEEVE", silhouette:"BOXY OVERSIZED TEE", basecolor:"OPTIC WHITE / BLACK PRINT", fabrication:"280GSM COMBED COTTON SLUB", print:"SCREEN HIGH-DENSITY + CURSIVE MANIFEST", tagsize:"TAGGED M (PIT: 60CM // LENGTH: 68CM)", img:"/catalog/desire.png", specNo:"SPECIMEN #002", catalogNo:"CATALOG NO. 002 OF 004", spec:"SPEC: 280GSM COMBED COTTON", size:"SIZE: BOXY M", sku:"DOMESTIC SKU: ATTC-JKT-24-0092"},
  "CAPITALIST CASUALTIES TEE": {title:"CAPITALIST CASUALTIES TEE", price:1250000, priceUsd:"/ $80 USD", category:"CATEGORY // GRAPHIC HEAVYWEIGHT", silhouette:"BOXY HEAVYWEIGHT TEE", basecolor:"OPTIC WHITE / DISTRESSED PRINT", fabrication:"300GSM RAW COTTON", print:"SCREEN PUNK ICONOGRAPHY + BALACLAVA", tagsize:"TAGGED XL (PIT: 68CM // LENGTH: 76CM)", img:"/catalog/capitalist.png", specNo:"SPECIMEN #003", catalogNo:"CATALOG NO. 003 OF 004", spec:"SPEC: 310GSM ENZYME WASH", size:"SIZE: BOXY XL", sku:"DOMESTIC SKU: ATTC-JKT-24-0093"},
}
function updateCartFromSpecimen(spec:string){
  const key = spec.trim().toUpperCase()
  let data = (CATALOG as any)[spec] || (CATALOG as any)[key] || (CATALOG as any)[spec.toUpperCase()]
  if(!data){
    const found = Object.entries(CATALOG).find(([k])=> key.includes(k) || k.includes(key))
    if(found) data = found[1] as any
  }
  if(!data) return
  basePrice = data.price
  const img = document.getElementById('cart-item-img') as HTMLImageElement|null
  const title = document.getElementById('cart-item-title')
  const priceEl = document.getElementById('cart-item-price')
  const specEl = document.getElementById('cart-item-spec')
  const sizeEl = document.getElementById('cart-item-size')
  const skuEl = document.getElementById('cart-item-sku')
  const subtotalEl = document.getElementById('cart-subtotal')
  const totalEl = document.getElementById('total-cost-display')
  const shipEl = document.getElementById('shipping-cost-display')
  const methodEl = document.getElementById('shipping-method-name')
  if(img){ img.src = data.img; img.alt = data.title }
  if(title) title.textContent = data.title
  if(priceEl) priceEl.textContent = 'RP ' + data.price.toLocaleString('id-ID')
  if(specEl) specEl.textContent = data.spec
  if(sizeEl) sizeEl.textContent = data.size
  if(skuEl) skuEl.textContent = data.sku
  if(subtotalEl) subtotalEl.textContent = 'RP ' + data.price.toLocaleString('id-ID')
  // reset shipping until user picks courier again
  const courierChecked = document.querySelector<HTMLInputElement>('input[name="courier"]:checked')
  if(!courierChecked){
    if(shipEl) shipEl.textContent = 'RP —'
    if(methodEl) methodEl.textContent = 'ONGKOS KIRIM (PILIH KURIR)'
    if(totalEl) totalEl.textContent = 'RP ' + data.price.toLocaleString('id-ID')
    const modalTotal = document.getElementById('modal-total-display')
    if(modalTotal) modalTotal.textContent = 'RP ' + data.price.toLocaleString('id-ID')
  } else {
    const cost = parseInt(courierChecked.value,10)||0
    if(shipEl) shipEl.textContent = 'RP ' + cost.toLocaleString('id-ID')
    if(totalEl) totalEl.textContent = 'RP ' + (data.price + cost).toLocaleString('id-ID')
  }
  // ensure cart visible (restore empty) — bagCount handled by caller
  const rec = document.getElementById('cart-item-record')
  const emptyEl = document.getElementById('cart-empty')
  if(rec?.classList.contains('hidden')){
    rec.classList.remove('hidden')
    emptyEl?.classList.add('hidden')
    const payBtnEl = document.getElementById('pay-button') as HTMLButtonElement|null
    const pushBtnEl = document.getElementById('btn-push-invoice') as HTMLButtonElement|null
    if(payBtnEl){ payBtnEl.disabled=false; payBtnEl.classList.remove('opacity-40','cursor-not-allowed')}
    if(pushBtnEl){ pushBtnEl.disabled=false; pushBtnEl.classList.remove('opacity-40','cursor-not-allowed')}
  }
}
document.querySelectorAll<HTMLButtonElement>('.add-to-bag-trigger').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault()
    const wasHidden = document.getElementById('cart-item-record')?.classList.contains('hidden') ?? false
    const spec = btn.dataset.specimen || btn.closest('[data-specimen]')?.getAttribute('data-specimen') || btn.getAttribute('data-specimen') || ''
    if(spec) updateCartFromSpecimen(spec)
    const span = btn.querySelector('.btn-text') as HTMLElement | null
    const orig = span ? span.textContent : btn.textContent
    if(wasHidden){
      bagCount = 1
    } else {
      bagCount++
    }
    const fmt = String(bagCount).padStart(2, '0')
    if (bagText) bagText.textContent = `BAG [${fmt}]`
    if (bagBtn) {
      bagBtn.classList.add('border-primary', 'bg-surface-container-high')
      setTimeout(() => bagBtn.classList.remove('bg-surface-container-high'), 400)
    }
    if (span) {
      span.textContent = 'ADDED [✓]'
      btn.classList.add('bg-primary', 'text-surface-container-lowest')
      setTimeout(() => {
        if (span && orig) span.textContent = orig
        btn.classList.remove('bg-primary', 'text-surface-container-lowest')
      }, 1200)
    }
    // also navigate to cart after short delay to show feedback
    setTimeout(() => showView('view-cart'), 600)
  })
})

// --- CATALOG: sort ---
document.getElementById('sort-select')?.addEventListener('change', e => {
  const val = (e.target as HTMLSelectElement).value
  const container = document.getElementById('specimens-container')
  if (!container) return
  const items = Array.from(container.querySelectorAll<HTMLElement>('.catalog-item'))
  items.sort((a,b)=>{
    if(val==='price-desc') return parseInt(b.dataset.price||'0')-parseInt(a.dataset.price||'0')
    if(val==='price-asc') return parseInt(a.dataset.price||'0')-parseInt(b.dataset.price||'0')
    if(val==='weight') return parseInt(b.dataset.weight||'0')-parseInt(a.dataset.weight||'0')
    return 0
  })
  items.forEach(it=> container.appendChild(it))
})

// --- CATALOG: promote secondary to hero ---
function promoteToHero(spec:string){
  let data = (CATALOG as any)[spec] || (CATALOG as any)[spec.trim().toUpperCase()] || (CATALOG as any)[spec.toUpperCase()]
  if(!data){
    const k = spec.trim().toUpperCase()
    const found = Object.entries(CATALOG).find(([kk])=> k.includes(kk) || kk.includes(k))
    if(found) data = found[1] as any
  }
  if(!data) return
  const img = document.getElementById('hero-specimen-img') as HTMLImageElement|null
  const title = document.getElementById('hero-title')
  const price = document.getElementById('hero-price')
  const priceUsd = document.getElementById('hero-price-usd')
  const cat = document.getElementById('hero-category')
  const sil = document.getElementById('hero-silhouette')
  const base = document.getElementById('hero-basecolor')
  const fab = document.getElementById('hero-fabrication')
  const pr = document.getElementById('hero-print')
  const tag = document.getElementById('hero-tagsize')
  const specNo = document.getElementById('hero-specimen-no')
  const catNo = document.getElementById('hero-catalog-no')
  const addBtn = document.getElementById('hero-add-btn') as HTMLButtonElement|null
  if(img){ img.src = data.img; img.alt = data.title }
  if(title) title.textContent = data.title
  if(price) price.textContent = 'IDR ' + data.price.toLocaleString('id-ID')
  if(priceUsd) priceUsd.textContent = data.priceUsd
  if(cat) cat.textContent = data.category
  if(sil) sil.textContent = data.silhouette
  if(base) base.textContent = data.basecolor
  if(fab) fab.textContent = data.fabrication
  if(pr) pr.textContent = data.print
  if(tag) tag.textContent = data.tagsize
  if(specNo) specNo.textContent = data.specNo
  if(catNo) catNo.textContent = data.catalogNo
  if(addBtn){ addBtn.dataset.specimen = spec; const span=addBtn.querySelector('.btn-text'); if(span) span.textContent='ADD TO BAG [01]' }
  // highlight hero
  document.getElementById('hero-spotlight-section')?.scrollIntoView({behavior:'smooth', block:'start'})
}
document.querySelectorAll<HTMLElement>('#specimens-container .catalog-item').forEach(card=>{
  // ignore vaulted
  if(card.dataset.status === 'claimed') return
  card.addEventListener('click', e=>{
    const target = e.target as HTMLElement
    // don't promote when clicking BAG or DM CLAIM buttons
    if(target.closest('button') || target.closest('a')) return
    const spec = card.dataset.specimen || card.querySelector<HTMLElement>('[data-specimen]')?.dataset.specimen || ''
    if(spec) promoteToHero(spec)
  })
})

// --- CATALOG: fit telemetry ---
document.querySelectorAll<HTMLElement>('.protocol-row').forEach(row=>{
  row.addEventListener('mouseenter',()=>{
    const fit=row.dataset.fit
    const size=row.dataset.size
    const txt=document.getElementById('fit-telemetry-text')
    if(txt && fit) txt.innerHTML = `<span class="text-primary font-bold">[SIZE ${size}]:</span> ${fit}`
  })
  row.addEventListener('mouseleave',()=>{
    const txt=document.getElementById('fit-telemetry-text')
    if(txt) txt.textContent='Hover any row to view recommendation analysis.'
  })
})

// --- CATALOG: footer cursor telemetry ---
const footerCoord = document.getElementById('footer-cursor-coords')
if(footerCoord){
  window.addEventListener('mousemove', e=>{
    const pad=(n:number)=>String(n).padStart(4,'0')
    footerCoord.textContent = `CURSOR TELEMETRY: [X: ${pad(e.clientX)} // Y: ${pad(e.clientY)}]`
  }, {passive:true} as any)
}

// --- CONTACT: faq + form handled via inline handlers in view (already), add faq toggle ---
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

// --- CART: timer 14:59 ---
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

// --- CART: mouse coords ---
const mouseCoords = document.getElementById('mouse-coords')
if (mouseCoords) {
  window.addEventListener('mousemove', e => {
    mouseCoords.textContent = `[X: ${String(e.clientX).padStart(4,'0')} // Y: ${String(e.clientY).padStart(4,'0')}]`
  })
}

// --- CART: courier selector ---
function selectCourier(input: HTMLInputElement){
  const cost = parseInt(input.value, 10)
  const label = input.dataset.label || 'JNE YES'
  const shipEl = document.getElementById('shipping-cost-display')
  const totalEl = document.getElementById('total-cost-display')
  const methodEl = document.getElementById('shipping-method-name')
  const modalTotal = document.getElementById('modal-total-display')
  const modalResi = document.getElementById('modal-resi-display')
  if (shipEl) shipEl.textContent = 'RP ' + cost.toLocaleString('id-ID')
  if (totalEl) totalEl.textContent = 'RP ' + (basePrice + cost).toLocaleString('id-ID')
  if (methodEl) methodEl.textContent = `ONGKOS KIRIM (${label})`
  if (modalTotal) modalTotal.textContent = 'RP ' + (basePrice + cost).toLocaleString('id-ID')
  if (modalResi) modalResi.textContent = `${label}: ATT-IDN-8829104-JKT`
  document.querySelectorAll<HTMLElement>('.courier-card').forEach(c => {
    c.className = 'courier-card flex flex-col p-space-sm bg-surface-container text-primary hover:bg-surface-bright cursor-pointer border border-outline-variant/40 select-none btn-spring'
  })
  input.closest('label')!.className = 'courier-card flex flex-col p-space-sm bg-primary text-on-primary cursor-pointer border border-primary shadow-lg ring-1 ring-white/20 select-none btn-spring'
}
document.getElementById('courier-grid')?.addEventListener('click', e=>{
  const card = (e.target as HTMLElement).closest<HTMLElement>('.courier-card')
  if(!card) return
  const inp = card.querySelector<HTMLInputElement>('input[type="radio"]')
  if(inp){ inp.checked=true; selectCourier(inp) }
})
document.getElementById('courier-grid')?.addEventListener('change', e=>{
  const inp = e.target as HTMLInputElement
  if(inp.name==='courier') selectCourier(inp)
})

// --- CART: payment tabs ---
document.querySelectorAll<HTMLButtonElement>('.payment-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll<HTMLButtonElement>('.payment-tab').forEach(t => {
      t.className = 'payment-tab py-space-sm px-space-md bg-surface-container text-primary hover:bg-surface-bright font-label-md text-label-md uppercase tracking-wider text-center border border-transparent btn-spring'
    })
    tab.className = 'payment-tab py-space-sm px-space-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider text-center font-bold border border-primary btn-spring'
    const type = tab.dataset.tab
    const badge = document.getElementById('gateway-badge')
    const inst = document.getElementById('tab-instruction-text')
    const sub = document.getElementById('qris-subtext')
    if(type==='dana'){
      if(badge) badge.textContent='GATEWAY: DANA & GOPAY INSTANT'
      if(inst) inst.innerHTML='Scan QRIS melalui aplikasi <strong class="text-primary">DANA</strong> atau <strong class="text-primary">GoPay</strong> untuk menyelesaikan transaksi 1-of-1.'
      if(sub) sub.textContent='[ SCAN VIA DANA / GOPAY ]'
    } else if(type==='gopay'){
      if(badge) badge.textContent='GATEWAY: GOPAY QRIS / AUTO-DEBIT'
      if(inst) inst.innerHTML='Buka aplikasi <strong class="text-primary">GoPay / Gojek</strong>, scan kode QRIS terakreditasi di samping, saldo akan terpotong secara instan dan resi langsung diterbitkan.'
      if(sub) sub.textContent='[ SCAN VIA GOPAY ]'
    } else if(type==='va'){
      if(badge) badge.textContent='GATEWAY: VIRTUAL ACCOUNT PRIORITAS'
      if(inst) inst.innerHTML='Transfer via Virtual Account BCA / Mandiri: <strong class="text-primary font-mono">8829-1049-2810-4491</strong>. Sistem otomatis mencocokkan mutasi tanpa upload bukti transfer manual.'
      if(sub) sub.textContent='[ BCA / MANDIRI VA LIVE ]'
    }
  })
})

// --- CART: pay button + modal ---
const payBtn = document.getElementById('pay-button') as HTMLButtonElement | null
const payLabel = document.getElementById('pay-btn-label')
const payIcon = document.getElementById('pay-btn-icon')
const pushBtn = document.getElementById('btn-push-invoice')
const modal = document.getElementById('payment-success-modal')
const countdownEl = document.getElementById('redirect-countdown')
let timerInterval: any
function triggerModal(){
  if(!modal) return
  modal.classList.remove('hidden')
  let left=3
  if(countdownEl) countdownEl.textContent=String(left)
  clearInterval(timerInterval)
  timerInterval=setInterval(()=>{
    left--
    if(countdownEl) countdownEl.textContent=String(left)
    if(left<=0){ clearInterval(timerInterval); modal.classList.add('hidden'); forceShowView('view-tracking') }
  },1000)
}
payBtn?.addEventListener('click', ()=>{
  if(!validateCheckout()) return
  if(payLabel) payLabel.textContent='MEMVERIFIKASI SALDO DANA/GOPAY...'
  if(payIcon){ payIcon.textContent='progress_activity'; payIcon.classList.add('animate-spin') }
  setTimeout(()=>{
    localStorage.setItem('attics_paid', '1')
    localStorage.setItem('attics_tracking_step', '2')
    if(payLabel) payLabel.textContent='PEMBAYARAN TERVERIFIKASI [LUNAS]'
    if(payIcon){ payIcon.textContent='check_circle'; payIcon.classList.remove('animate-spin') }
    triggerModal()
    setTimeout(()=>{
      if(payLabel) payLabel.textContent='BAYAR DENGAN DANA / GOPAY'
      if(payIcon) payIcon.textContent='arrow_forward'
    },3000)
  },650)
})
pushBtn?.addEventListener('click', ()=>{
  if(!validateCheckout()) return
  const orig=pushBtn.innerHTML
  pushBtn.innerHTML='<span class="material-symbols-outlined text-[14px] animate-spin">progress_activity</span> MENGIRIM...'
  setTimeout(()=>{
    localStorage.setItem('attics_paid', '1')
    localStorage.setItem('attics_tracking_step', '2')
    pushBtn.innerHTML='INVOICE TERKIRIM ✓'
    triggerModal()
    setTimeout(()=> pushBtn.innerHTML=orig,3000)
  },650)
})
document.getElementById('close-modal-btn')?.addEventListener('click',()=>{
  clearInterval(timerInterval)
  modal?.classList.add('hidden')
})

// --- CART: remove piece ---

function setCartEmpty(empty:boolean){
  const rec = document.getElementById('cart-item-record')
  const emptyEl = document.getElementById('cart-empty')
  if(!rec || !emptyEl) return
  rec.classList.toggle('hidden', empty)
  emptyEl.classList.toggle('hidden', !empty)
  if(payBtn){
    payBtn.disabled = empty
    payBtn.classList.toggle('opacity-40', empty)
    payBtn.classList.toggle('cursor-not-allowed', empty)
  }
  if(pushBtn) {
    (pushBtn as HTMLButtonElement).disabled = empty
    pushBtn.classList.toggle('opacity-40', empty)
    pushBtn.classList.toggle('cursor-not-allowed', empty)
  }
  // update bag
  if(empty){
    bagCount = 0
    if(bagText) bagText.textContent = 'BAG [00]'
  } else {
    if(bagCount===0) bagCount = 1
    if(bagText) bagText.textContent = `BAG [${String(bagCount).padStart(2,'0')}]`
  }
}
document.getElementById('remove-piece-btn')?.addEventListener('click', ()=>{
  setCartEmpty(true)
  showToast('PIECE DIHAPUS — BAG KOSONG')
})

// --- TRACKING: live status simulation ---
const trackingSteps = [
  { label: '1. PACKING [OK]', big: 'BARU SAJA DI PACKING — READY TO SHIP', pct: 20, bar: '18%', eta: '15:00 WIB', dist: '2.4 KM', coords: '-6.2088, 106.8456 - 2.4 KM TERSISA' },
  { label: '2. HUB TRANSIT — ON THE WAY', big: 'SEDANG DI PACKING — HUB TRANSIT', pct: 42, bar: '42%', eta: '15:00 WIB', dist: '2.4 KM', coords: '-6.2102, 106.8481 - 1.9 KM TERSISA' },
  { label: '3. IN TRANSIT — MENUJU SENOPATI', big: 'SEDANG DIANTAR — IN TRANSIT', pct: 64, bar: '64%', eta: '14:45 WIB', dist: '1.2 KM', coords: '-6.2148, 106.8523 - 1.2 KM TERSISA' },
  { label: '4. OUT FOR DELIVERY', big: 'KURIR OTW — OUT FOR DELIVERY', pct: 85, bar: '85%', eta: '14:20 WIB', dist: '0.4 KM', coords: '-6.2181, 106.8550 - 0.4 KM TERSISA' },
  { label: '5. DELIVERED ✓', big: 'PAKET TIBA — DELIVERED', pct: 100, bar: '100%', eta: 'TIBA ✓', dist: '0 KM', coords: '-6.2210, 106.8572 - TIBA DI TUJUAN' },
]
let trackingIdx = parseInt(localStorage.getItem('attics_tracking_step') || '1', 10)
if (isNaN(trackingIdx) || trackingIdx<1 || trackingIdx>4) trackingIdx = 1
function renderTracking(step: number){
  const s = trackingSteps[step]
  const badge = document.getElementById('tracking-status-text')
  const big = document.getElementById('tracking-big-status')
  const overall = document.getElementById('tracking-overall-progress') as HTMLElement | null
  const progBar = document.getElementById('tracking-progress-bar') as HTMLElement | null
  const hubProg = document.getElementById('hub-progress') as HTMLElement | null
  const eta = document.getElementById('tracking-eta')
  const dist = document.getElementById('tracking-distance')
  const coords = document.getElementById('tracking-coords')
  const routeActive = document.getElementById('tracking-route-active')
  const mover = document.getElementById('tracking-mover')
  if (badge) badge.textContent = s.label
  if (big) big.textContent = s.big
  if (overall) overall.style.width = s.pct + '%'
  if (progBar) progBar.style.height = s.pct + '%'
  if (hubProg) hubProg.style.width = s.bar
  if (eta) eta.textContent = s.eta
  if (dist) dist.textContent = s.dist
  if (coords) coords.textContent = s.coords
  // timeline steps visual
  document.querySelectorAll<HTMLElement>('.tracking-step').forEach((el,i)=>{
    const idx=i+1
    if(idx < step+1){ el.classList.remove('opacity-60'); el.querySelector('.rounded-full')?.classList.add('bg-primary','border-primary'); el.querySelector('.rounded-full')?.classList.remove('bg-surface-container','border-outline-variant') }
    else if(idx === step+1){ el.classList.remove('opacity-60'); }
    else { el.classList.add('opacity-60') }
  })
  // mover position along DIRECT line ATELIER->HUB->SENOPATI
  if(mover){
    const positions = [{x:40,y:180},{x:120,y:150},{x:200,y:110},{x:280,y:85},{x:360,y:60}]
    const p = positions[step] || positions[1]
    mover.setAttribute('transform', `translate(${p.x}, ${p.y})`)
  }
  if(routeActive){
    const paths = ['M 40 180 L 70 170','M 40 180 L 120 150','M 40 180 L 200 110','M 40 180 L 200 110 L 280 85','M 40 180 L 200 110 L 360 60']
    routeActive.setAttribute('d', paths[step])
  }
}
renderTracking(trackingIdx)
document.getElementById('tracking-simulate-btn')?.addEventListener('click', ()=>{
  trackingIdx = (trackingIdx + 1) % trackingSteps.length
  localStorage.setItem('attics_tracking_step', String(trackingIdx))
  renderTracking(trackingIdx)
  // haptic feedback
  const btn = document.getElementById('tracking-simulate-btn') as HTMLButtonElement | null
  if(btn){ btn.textContent = 'STATUS DIPERBARUI ✓'; setTimeout(()=> btn.textContent='SIMULASI: MAJUKAN STATUS →', 1200) }
})


// --- reveal on approach ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target as HTMLElement
      el.classList.add('is-visible')
      revealObserver.unobserve(el)
    }
  })
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
function initReveal() {
  document.querySelectorAll<HTMLElement>('[data-view] section, [data-view] article, [data-view] .catalog-item, [data-view] .specimen-card').forEach(el => {
    // home hero already animates via animate-fade-in-up — don't hide it behind reveal
    if (el.closest('#view-home') && el.querySelector('.animate-fade-in-up')) return
    if (el.classList.contains('animate-fade-in-up')) return
    el.classList.add('reveal')
    revealObserver.observe(el)
  })
}
initReveal()
const _showView = showView
function showViewWrapped(id: string) {
  setMobileOpen(false)
  _showView(id)
  setTimeout(() => {
    document.querySelectorAll<HTMLElement>(`#${id} section, #${id} article, #${id} .catalog-item, #${id} .specimen-card`).forEach(el => {
      if (!el.classList.contains('is-visible')) {
        el.classList.add('reveal')
        revealObserver.observe(el)
      }
    })
  }, 260)
}
function forceShowView(id: string){
  setMobileOpen(false)
  const cur = document.getElementById(currentId)
  const nxt = document.getElementById(id)
  if(!cur || !nxt || cur===nxt) return
  cur.classList.add('hidden'); cur.classList.remove('flex','view-enter','view-leave')
  nxt.classList.remove('hidden'); nxt.classList.add('flex')
  currentId=id
  setNavActive(id)
  if(id==='view-tracking') syncTrackingPage()
  window.scrollTo({top:0,behavior:'smooth'})
  animating=false
}
;(window as any).showViewWrapped = showViewWrapped
;(window as any).forceShowView = forceShowView
document.querySelectorAll<HTMLElement>('[data-path]').forEach(a => {
  const clone = a.cloneNode(true) as HTMLElement
  a.replaceWith(clone)
})
document.querySelectorAll<HTMLElement>('[data-path]').forEach(a => {
  a.addEventListener('click', e => {
    const path = a.dataset.path
    if (!path) return
    e.preventDefault()
    const map: Record<string, string> = { home: 'view-home', catalog: 'view-catalog', contact: 'view-contact', cart: 'view-cart', tracking: 'view-tracking', 'dm-instagram': 'view-contact' }
    const target = map[path]
    if (target) showViewWrapped(target)
  })
})
// fallback delegasi — paksa direct tanpa cek animating
document.addEventListener('click', e => {
  const t = (e.target as HTMLElement).closest<HTMLElement>('[data-path="tracking"]')
  if (t) {
    e.preventDefault()
    e.stopPropagation()
    // paksa tanpa animating guard
    forceShowView('view-tracking')
  }
})

// --- PROFILE SETTINGS (top-right avatar) ---
const profileBtn = document.getElementById('profile-menu-btn') as HTMLButtonElement | null
const profileDropdown = document.getElementById('profile-dropdown') as HTMLElement | null
const profileAvatar = document.getElementById('profile-avatar') as HTMLImageElement | null
const profilePreview = document.getElementById('profile-preview') as HTMLImageElement | null
const profileNameInput = document.getElementById('profile-name-input') as HTMLInputElement | null
const profileHandleInput = document.getElementById('profile-handle-input') as HTMLInputElement | null
const profileBioInput = document.getElementById('profile-bio-input') as HTMLInputElement | null
const profileUrlInput = document.getElementById('profile-url-input') as HTMLInputElement | null
const profileFileInput = document.getElementById('profile-file-input') as HTMLInputElement | null
const profilePreviewName = document.getElementById('profile-preview-name') as HTMLElement | null
const profilePreviewHandle = document.getElementById('profile-preview-handle') as HTMLElement | null
const profileBadge = document.getElementById('profile-name-badge') as HTMLElement | null
const profileSaveBtn = document.getElementById('profile-save-btn') as HTMLButtonElement | null
const profileResetBtn = document.getElementById('profile-reset-btn') as HTMLButtonElement | null
const profileCloseBtn = document.getElementById('profile-close-btn') as HTMLButtonElement | null
const profileSavedMsg = document.getElementById('profile-saved-msg') as HTMLElement | null
type ProfileData = { name: string; handle: string; bio: string; avatar: string }
const DEFAULT_AVATAR = profileAvatar?.src || ''
function loadProfile(): ProfileData {
  try { return JSON.parse(localStorage.getItem('attics_profile') || 'null') || { name: '', handle: '', bio: '', avatar: DEFAULT_AVATAR } } catch { return { name: '', handle: '', bio: '', avatar: DEFAULT_AVATAR } }
}
function applyProfile(p: ProfileData) {
  const avatarSrc = p.avatar || DEFAULT_AVATAR
  if (profileAvatar) profileAvatar.src = avatarSrc
  if (profilePreview) profilePreview.src = avatarSrc
  if (profilePreviewName) profilePreviewName.textContent = p.name || 'ARCHIVE COLLECTOR'
  if (profilePreviewHandle) profilePreviewHandle.textContent = p.handle || '@attics.collector'
  if (profileNameInput) profileNameInput.value = p.name
  if (profileHandleInput) profileHandleInput.value = p.handle
  if (profileBioInput) profileBioInput.value = p.bio
  if (profileUrlInput) profileUrlInput.value = p.avatar && !p.avatar.startsWith('data:') ? p.avatar : ''
  if (profileBadge) {
    if (p.name) { profileBadge.textContent = p.name.split(' ')[0].toUpperCase(); profileBadge.classList.remove('hidden') }
    else profileBadge.classList.add('hidden')
  }
}
let currentProfile = loadProfile()
applyProfile(currentProfile)
function setDropdown(open: boolean) {
  if (!profileDropdown || !profileBtn) return
  profileDropdown.classList.toggle('hidden', !open)
  profileBtn.setAttribute('aria-expanded', String(open))
}
profileBtn?.addEventListener('click', e => { e.stopPropagation(); setDropdown(profileDropdown?.classList.contains('hidden') ?? true) })
profileCloseBtn?.addEventListener('click', () => setDropdown(false))
document.addEventListener('click', e => {
  if (!profileDropdown?.classList.contains('hidden') && !(e.target as HTMLElement).closest('#profile-dropdown') && !(e.target as HTMLElement).closest('#profile-menu-btn')) setDropdown(false)
})
document.addEventListener('keydown', e => { if (e.key === 'Escape') setDropdown(false) })
profileNameInput?.addEventListener('input', () => { if (profilePreviewName) profilePreviewName.textContent = profileNameInput.value || 'ARCHIVE COLLECTOR' })
profileHandleInput?.addEventListener('input', () => { if (profilePreviewHandle) profilePreviewHandle.textContent = profileHandleInput.value || '@attics.collector' })
profileUrlInput?.addEventListener('input', () => {
  const v = profileUrlInput.value.trim()
  if (v && profilePreview) profilePreview.src = v
  else if (profilePreview) profilePreview.src = currentProfile.avatar || DEFAULT_AVATAR
})
profileFileInput?.addEventListener('change', () => {
  const f = profileFileInput.files?.[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result as string
    if (profilePreview) profilePreview.src = dataUrl
    if (profileUrlInput) profileUrlInput.value = ''
    // store temp in preview dataset for save
    if (profilePreview) profilePreview.dataset.tempAvatar = dataUrl
  }
  reader.readAsDataURL(f)
})
profileSaveBtn?.addEventListener('click', () => {
  const avatarFromFile = profilePreview?.dataset.tempAvatar
  const avatar = avatarFromFile || profileUrlInput?.value.trim() || profilePreview?.src || currentProfile.avatar || DEFAULT_AVATAR
  const data: ProfileData = {
    name: profileNameInput?.value.trim() || '',
    handle: profileHandleInput?.value.trim() || '',
    bio: profileBioInput?.value.trim() || '',
    avatar,
  }
  // simple validation
  if (avatar && avatar.startsWith('http') && !avatar.match(/^https?:\/\/.+\..+/)) return
  localStorage.setItem('attics_profile', JSON.stringify(data))
  currentProfile = data
  applyProfile(data)
  if (profilePreview) delete profilePreview.dataset.tempAvatar
  if (profileSavedMsg) {
    profileSavedMsg.classList.remove('hidden')
    setTimeout(() => profileSavedMsg.classList.add('hidden'), 1800)
  }
  setTimeout(() => setDropdown(false), 600)
})
profileResetBtn?.addEventListener('click', () => {
  localStorage.removeItem('attics_profile')
  currentProfile = { name: '', handle: '', bio: '', avatar: DEFAULT_AVATAR }
  applyProfile(currentProfile)
  if (profilePreview) delete profilePreview.dataset.tempAvatar
  if (profileFileInput) profileFileInput.value = ''
})

// global image fallback
document.addEventListener('error', (e) => {
  const t = e.target as HTMLImageElement
  if (t.tagName === 'IMG' && !t.dataset.fallback) {
    t.dataset.fallback = '1'
    const isAvatar = t.alt === 'Profile' || t.alt === 'Preview'
    t.src = isAvatar
      ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80&auto=format'
      : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format'
  }
}, true)

syncTrackingPage()
const initial = document.getElementById(currentId)
if (initial) {
  initial.classList.remove('hidden')
  initial.classList.add('flex', 'view-enter')
  initial.addEventListener('animationend', () => initial.classList.remove('view-enter'), { once: true })
  setNavActive(currentId)
}
