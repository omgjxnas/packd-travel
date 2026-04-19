const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "sand",
  "heroLayout": "text-bottom",
  "showSizes": true
} /*EDITMODE-END*/;

const img1 = 'uploads/cube-pink-1-front.jpeg';
const img2 = 'uploads/cube-pink-2-flatlay.jpeg';
const img3 = 'uploads/cube-pink-3-stack.jpeg';
const img4 = 'uploads/cube-brown-1-slim.jpeg';
const img5 = 'uploads/cube-brown-2-packed.jpeg';
const img6 = 'uploads/cube-brown-3-suitcase.jpeg';
const imgHero = 'uploads/hero-brown-lifestyle.jpeg';

function useOverlayFocus(isOpen, focusRef) {
  const lastFocusedRef = React.useRef(null);
  const wasOpenRef = React.useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      requestAnimationFrame(() => focusRef.current?.focus?.());
    }

    if (!isOpen && wasOpenRef.current) {
      lastFocusedRef.current?.focus?.();
      lastFocusedRef.current = null;
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, focusRef]);
}

function CarouselImg({ imgs }) {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  const prev = (e) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % imgs.length);
  };

  return (
    <div
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {imgs.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none'
          }}
        />
      ))}
      {imgs.length > 1 && hovered && (
        <>
          <button
            onClick={prev}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              zIndex: 4,
              mixBlendMode: 'difference'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={next}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              zIndex: 4,
              mixBlendMode: 'difference'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

const products = [
  { id: 1, name: 'Kompresia Cube S', price: '489 Kč', tag: 'NOVINKA', sizes: ['XS', 'S', 'M'], imgs: [img1, img2, img3] },
  { id: 2, name: 'Mesh Cube M', price: '589 Kč', tag: 'NOVINKA', sizes: ['S', 'M', 'L'], imgs: [img2, img3, img1] },
  { id: 3, name: 'Slim Cube L', price: '689 Kč', tag: 'NOVINKA', sizes: ['M', 'L', 'XL'], imgs: [img4, img5] },
  { id: 4, name: 'Cestovní set 3-pack', price: '1 290 Kč', tag: 'BESTSELLER', sizes: ['S', 'M', 'L'], imgs: [img6, img5, img4] }
];

const topProducts = [
  { id: 5, name: 'Kompresní Cube růžový', price: '589 Kč', rank: '01', imgs: [img3, img2], sizes: ['S', 'M', 'L'] },
  { id: 6, name: 'Cestovní set', price: '890 Kč', rank: '02', imgs: [img2, img1], sizes: ['S', 'M', 'L'] },
  { id: 7, name: 'Slim Cube béžový', price: '689 Kč', rank: '03', imgs: [img4, img5], sizes: ['XS', 'S', 'M', 'L'] },
  { id: 8, name: 'XL Cestovní set', price: '1 490 Kč', rank: '04', imgs: [img6, img5], sizes: ['M', 'L', 'XL'] }
];

function SearchOverlay({ open, onClose, onSelectProduct, products, topProducts }) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef(null);

  useOverlayFocus(open, inputRef);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  const allProducts = [...products, ...topProducts];
  const q = query.toLowerCase().trim();
  const results = q ? allProducts.filter((p) => p.name.toLowerCase().includes(q)) : [];
  const cats = ['Novinky', 'Kompresia', 'Mesh', 'Slim', 'Sety', 'XL Cubes', 'Doplňky'];
  const trending = ['Packing cube set', 'Kompresia cube', 'Travel sada', 'Slim cube béžový', 'Mesh cube'];

  return (
    <div className={`search-overlay ${open ? 'open' : ''}`}>
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-panel">
        <div className="search-header">
          <div className="search-input-wrap">
            <svg className="search-icon-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
              ref={inputRef}
              className="search-input"
              placeholder="Hledat produkty…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button className={`search-clear ${query ? 'visible' : ''}`} onClick={() => setQuery('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <button className="search-close" onClick={onClose}>Zavřít</button>
        </div>
        <div className="search-body">
          {!q ? (
            <>
              <div className="search-section-label">Kategorie</div>
              <div className="search-cats">
                {cats.map((c) => (
                  <button key={c} className="search-cat" onClick={() => setQuery(c)}>{c}</button>
                ))}
              </div>
              <div className="search-section-label">Oblíbené hledání</div>
              <div className="search-suggestions">
                {trending.map((t) => (
                  <div key={t} className="search-suggestion" onClick={() => setQuery(t)}>
                    <svg className="search-suggestion-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </>
          ) : results.length > 0 ? (
            <>
              <div className="search-section-label">{results.length} výsledků pro „{q}“</div>
              <div className="search-results-grid">
                {results.map((p) => (
                  <div key={p.id} className="search-result-card" onClick={() => { onSelectProduct(p); onClose(); }}>
                    <div className="search-result-img"><img src={p.imgs[0]} alt={p.name} /></div>
                    <div className="search-result-info">
                      <div className="search-result-name">{p.name}</div>
                      <div className="search-result-price">{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="search-no-results">Nic jsme nenašli pro „{q}“</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ product, onClose, onAddToCart }) {
  const allImgs = product ? product.imgs : [];
  const [imgIdx, setImgIdx] = useState(0);
  const [selSize, setSelSize] = useState(null);
  const [openAcc, setOpenAcc] = useState('details');
  const closeButtonRef = React.useRef(null);

  useOverlayFocus(Boolean(product), closeButtonRef);

  useEffect(() => {
    setImgIdx(0);
    setSelSize(null);
  }, [product?.id]);

  if (!product) return null;

  const prev = () => setImgIdx((i) => (i - 1 + allImgs.length) % allImgs.length);
  const next = () => setImgIdx((i) => (i + 1) % allImgs.length);

  const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  const unavail = ['XL'];

  const accordions = [
    { id: 'details', label: 'Detail produktu', content: `Prémiový packing cube vyrobený z lehkého ripstop nylonu. Dvojitý kompresní zip umožňuje maximální využití prostoru. Integrovaná síťovaná kapsa pro snadný přehled obsahu. Model ${product.name}.` },
    { id: 'shipping', label: 'Doprava & vrácení', content: 'Standardní doprava 2–4 pracovní dny. Expresní doprava 1–2 pracovní dny. Vrácení zboží do 30 dní bez udání důvodu. Doprava zdarma nad 1 200 Kč.' },
    { id: 'sizeguide', label: 'Průvodce velikostmi', content: 'S: 30×20×8 cm · M: 38×26×10 cm · L: 46×32×12 cm · XL: 54×38×14 cm. Doporučujeme vybrat o velikost větší pro kompresi oblečení.' }
  ];

  return (
    <div className={`pd-overlay ${product ? 'open' : ''}`} onClick={onClose}>
      <div className="pd-nav" onClick={(e) => e.stopPropagation()}>
        <div className="pd-breadcrumb">Kolekce &rsaquo; <span>{product.name}</span></div>
        <button ref={closeButtonRef} className="pd-close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Zavřít
        </button>
      </div>
      <div className="pd-body" onClick={(e) => e.stopPropagation()}>
        <div className="pd-images">
          <div className="pd-main-img">
            {allImgs.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={product.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  opacity: i === imgIdx ? 1 : 0,
                  transition: 'opacity .4s'
                }}
              />
            ))}
            {allImgs.length > 1 && (
              <>
                <button className="pd-arrow left" onClick={prev}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button className="pd-arrow right" onClick={next}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className="pd-thumbs">
            {allImgs.map((src, i) => (
              <div key={src} className={`pd-thumb ${i === imgIdx ? 'active' : ''}`} onClick={() => setImgIdx(i)}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
        <div className="pd-info">
          <div className="pd-info-top">
            <div className="pd-name">{product.name}</div>
            <div className="pd-price">{product.price}</div>
            <div className="pd-section-label">Barva</div>
            <div className="pd-colors">
              {allImgs.slice(0, 3).map((src, i) => (
                <div key={i} className={`pd-color-swatch ${imgIdx === i ? 'active' : ''}`} onClick={() => setImgIdx(i)}>
                  <img src={src} alt="" />
                </div>
              ))}
            </div>
            <div className="pd-section-label">Velikost</div>
            <div className="pd-sizes">
              {sizes.map((s) => (
                <button
                  key={s}
                  className={`pd-size-btn ${selSize === s ? 'active' : ''} ${unavail.includes(s) ? 'unavail' : ''}`}
                  onClick={() => !unavail.includes(s) && setSelSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <button className="pd-add-btn" onClick={() => { onAddToCart(product.id); onClose(); }}>
              <span>Přidat do košíku{selSize ? ` — ${selSize}` : ''}</span>
              <span className="pd-add-price">{product.price}</span>
            </button>
          </div>
          <div className="pd-perks">
            <div className="pd-perk">Doprava po celém světě</div>
            <div className="pd-perk">Vrácení do 30 dní bez otázek</div>
            <div className="pd-perk">Vyrobeno z recyklovaných materiálů</div>
          </div>
          <div className="pd-details">
            <div className="pd-accordion">
              {accordions.map((a) => (
                <div className="pd-accordion-item" key={a.id}>
                  <button className="pd-accordion-btn" onClick={() => setOpenAcc(openAcc === a.id ? null : a.id)}>
                    {a.label}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{ transform: openAcc === a.id ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .25s' }}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <div className="pd-accordion-content" style={{ maxHeight: openAcc === a.id ? '200px' : '0' }}>
                    {a.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Kompresia Cube S', variant: 'Růžová / S', price: 489, qty: 1, img: img1 },
    { id: 2, name: 'Zip Pouch XS', variant: 'Béžová / XS', price: 241, qty: 1, img: img4 }
  ]);
  const [cartCount, setCartCount] = useState(2);
  const [nlName, setNlName] = useState('');
  const [nlEmail, setNlEmail] = useState('');
  const [nlDone, setNlDone] = useState(false);
  const [nlCanUndo, setNlCanUndo] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [tabVisible, setTabVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [popupEmail, setPopupEmail] = useState('');
  const [popupDone, setPopupDone] = useState(false);
  const menuCloseRef = React.useRef(null);
  const cartCloseRef = React.useRef(null);
  const undoTimerRef = React.useRef(null);
  const isPopupVisible = !nlDone && popupOpen && !menuOpen && !cartOpen && !selectedProduct && !searchOpen;

  useEffect(() => {
    if (nlDone) return undefined;
    const timer = setTimeout(() => setPopupOpen(true), 3500);
    return () => clearTimeout(timer);
  }, [nlDone]);

  useOverlayFocus(menuOpen, menuCloseRef);
  useOverlayFocus(cartOpen, cartCloseRef);

  useEffect(() => {
    const shouldLockScroll = searchOpen || Boolean(selectedProduct) || menuOpen || cartOpen;
    document.body.classList.toggle('overlay-open', shouldLockScroll);
    return () => document.body.classList.remove('overlay-open');
  }, [searchOpen, selectedProduct, menuOpen, cartOpen]);

  useEffect(() => {
    const hasOverlayOpen = searchOpen || Boolean(selectedProduct) || menuOpen || cartOpen || popupOpen;
    if (!hasOverlayOpen) return;

    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;

      if (searchOpen) {
        setSearchOpen(false);
        return;
      }
      if (selectedProduct) {
        setSelectedProduct(null);
        return;
      }
      if (cartOpen) {
        setCartOpen(false);
        return;
      }
      if (menuOpen) {
        setMenuOpen(false);
        return;
      }
      if (popupOpen) {
        setPopupOpen(false);
        setTimeout(() => setTabVisible(true), 400);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, selectedProduct, cartOpen, menuOpen, popupOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );

    const nodes = document.querySelectorAll('[data-reveal]');
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(undoTimerRef.current), []);

  const closePopup = () => {
    setPopupOpen(false);
    setTimeout(() => setTabVisible(true), 400);
  };

  const openPopup = () => {
    if (nlDone) return;
    setTabVisible(false);
    setPopupOpen(true);
  };

  const handlePopup = (e) => {
    e.preventDefault();
    if (popupEmail) setPopupDone(true);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText('PACKD10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const addToCart = (id) => {
    const p = [...products, ...topProducts].find((x) => x.id === id);
    if (!p) return;
    setCartItems((prev) => {
      const ex = prev.find((i) => i.id === id);
      if (ex) return prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, variant: 'Standardní', price: parseInt(p.price), qty: 1, img: p.imgs[0] }];
    });
    setCartCount((c) => c + 1);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1200);
    setTimeout(() => setCartOpen(true), 300);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    setCartCount((c) => Math.max(0, c - 1));
  };

  const changeQty = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.id !== id) return i;
          const nq = i.qty + delta;
          if (nq <= 0) {
            setCartCount((c) => Math.max(0, c - 1));
            return null;
          }
          setCartCount((c) => c + delta);
          return { ...i, qty: nq };
        })
        .filter(Boolean)
    );
  };

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const handleNL = (e) => {
    e.preventDefault();
    if (!nlEmail) return;
    setNlDone(true);
    setNlCanUndo(false);
    setPopupOpen(false);
    setTabVisible(false);
    setPopupDone(false);
    clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setNlCanUndo(true), 1100);
  };

  const unsubscribeNewsletter = () => {
    setNlDone(false);
    setNlCanUndo(false);
    clearTimeout(undoTimerRef.current);
  };

  return (
    <>
      <div className={`mobile-menu-backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="nav-logo nav-logo-compact">PACKD®</div>
          <button ref={menuCloseRef} className="mobile-menu-close" onClick={() => setMenuOpen(false)}>×</button>
        </div>
        <ul className="mobile-menu-links">
          {['Kolekce', 'Sety', 'Novinky', 'O nás', 'Kontakt'].map((l) => (
            <li key={l}><a href="#" onClick={() => setMenuOpen(false)}>{l}</a></li>
          ))}
        </ul>
        <div className="mobile-menu-sub">
          {['Novinky', 'Sety', 'Kompresia', 'Mesh', 'XL Cubes', 'Slim', 'Doplňky'].map((l) => (
            <a href="#" key={l} onClick={() => setMenuOpen(false)}>{l}</a>
          ))}
        </div>
        <div className="mobile-menu-bottom">
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
          <a href="#newsletter">Newsletter</a>
        </div>
      </div>

      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...Array(2)].map((_, i) => {
            const items = ['Doprava zdarma nad 1 200 Kč', 'Nová kolekce — Léto 2026', '30 dní na vrácení bez otázek', 'Vyrobeno z recyklovaných materiálů'];
            return (
              <React.Fragment key={i}>
                {items.map((text, j) => (
                  <React.Fragment key={j}>
                    <span className="ticker-sep" />
                    <span>{text}</span>
                  </React.Fragment>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <nav>
        <div className="nav-logo nav-logo-tight">PACKD®</div>
        <ul className="nav-links">
          <li><a href="#" className="active">Kolekce</a></li>
          <li><a href="#">Sety</a></li>
          <li><a href="#">O nás</a></li>
        </ul>
        <div className="nav-actions">
          <button className="nav-icon" title="Hledat" onClick={() => setSearchOpen(true)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </button>
          <button className="nav-icon" title="Účet">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
          <button className="nav-icon cart-badge" title="Košík" onClick={() => setCartOpen(true)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <button className={`burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className="subnav">
        {['Novinky', 'Sety', 'Kompresia', 'Mesh', 'XL Cubes', 'Slim', 'Doplňky'].map((l, i) => (
          <a key={l} href="#" className={i === 0 ? 'active' : ''}>{l}</a>
        ))}
      </div>

      <div className="hero">
        <div className="hero-media" style={{ backgroundImage: `url(${imgHero})` }} />
        <div className="hero-overlay" />
        <div className="hero-season hero-fade-in">SS26 — Léto</div>
        <div className="hero-caption hero-fade-in">
          <span className="hero-eyebrow">004 — Nová kolekce</span>
          <h1 className="hero-title">
            Sbal<br />
            <em>chytře,</em><br />
            cestuj<br />
            lehce.
          </h1>
          <a href="#new-arrivals" className="hero-cta">
            Zobrazit novinky
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>

      <div className="features-strip">
        <div className="feature-item reveal" data-reveal style={{ '--reveal-delay': '0ms' }}>
          <span className="feature-num">01</span>
          <span className="feature-label feature-label-tight">Ultralehké materiály</span>
          <span className="feature-desc">Ripstop nylon s hmotností od 28 g na kus.</span>
        </div>
        <div className="feature-item reveal" data-reveal style={{ '--reveal-delay': '80ms' }}>
          <span className="feature-num">02</span>
          <span className="feature-label feature-label-tight">Kompresní systém</span>
          <span className="feature-desc">Dvojitý zip pro maximální kompresi obsahu.</span>
        </div>
        <div className="feature-item reveal" data-reveal style={{ '--reveal-delay': '160ms' }}>
          <span className="feature-num">03</span>
          <span className="feature-label feature-label-tight">Recyklováno 100%</span>
          <span className="feature-desc">Vyrobeno z rPET — recyklovaných PET lahví.</span>
        </div>
      </div>

      {(() => {
        const feats = [
          { num: '01', label: 'Ultralehké materiály', desc: 'Ripstop nylon s hmotností od 28 g na kus.' },
          { num: '02', label: 'Kompresní systém', desc: 'Dvojitý zip pro maximální kompresi obsahu.' },
          { num: '03', label: 'Recyklováno 100%', desc: 'Vyrobeno z rPET — recyklovaných PET lahví.' }
        ];

        const [fi, setFi] = React.useState(0);
        React.useEffect(() => {
          const t = setInterval(() => setFi((i) => (i + 1) % feats.length), 1500);
          return () => clearInterval(t);
        }, []);
        return (
          <div className="features-carousel">
            <div className="features-carousel-track" style={{ transform: `translateX(-${fi * 100}%)` }}>
              {feats.map((f) => (
                <div className="features-carousel-slide" key={f.num}>
                  <span className="feature-num">{f.num}</span>
                  <span className="feature-label feature-label-tight feature-label-carousel">{f.label}</span>
                  <span className="feature-desc feature-desc-carousel">{f.desc}</span>
                </div>
              ))}
            </div>
            <div className="features-carousel-dots">
              {feats.map((_, i) => <div key={i} className={`features-carousel-dot ${i === fi ? 'active' : ''}`} />)}
            </div>
          </div>
        );
      })()}

      <section id="new-arrivals">
        <div className="section-header reveal" data-reveal>
          <span className="section-title">Novinky</span>
          <a href="#" className="section-link">Zobrazit vše</a>
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card reveal" data-reveal style={{ '--reveal-delay': `${p.id * 45}ms` }} key={p.id} onClick={() => setSelectedProduct(p)}>
              <div className="product-img">
                <CarouselImg imgs={p.imgs} />
                <span className="product-tag">{p.tag}</span>
                <button className="product-hover-add" onClick={(e) => { e.stopPropagation(); addToCart(p.id); }}>
                  {addedId === p.id ? '✓ Přidáno' : 'Přidat do košíku'}
                </button>
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-price">{p.price}</div>
                <div className="product-sizes">
                  {p.sizes.map((s) => <span className="size-dot" key={s}>{s}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="top-products" className="section-topless">
        <div className="section-header reveal" data-reveal>
          <span className="section-title">Nejprodávanější</span>
          <a href="#" className="section-link">Celý výběr</a>
        </div>
        <div className="top-grid">
          {topProducts.map((p) => (
            <div className="top-card reveal" data-reveal style={{ '--reveal-delay': `${(p.id - 4) * 60}ms` }} key={p.id} onClick={() => setSelectedProduct(p)}>
              <div className="top-img">
                <CarouselImg imgs={p.imgs} />
                <span className="top-card-rank">{p.rank}</span>
                <button className="product-hover-add" onClick={(e) => { e.stopPropagation(); addToCart(p.id); }}>
                  {addedId === p.id ? '✓ Přidáno' : 'Přidat do košíku'}
                </button>
              </div>
              <div className="top-card-info">
                <span className="top-card-name">{p.name}</span>
                <span className="top-card-price">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div id="newsletter" className="newsletter reveal" data-reveal>
        <div className="reveal" data-reveal style={{ '--reveal-delay': '40ms' }}>
          <h2 className="nl-title">Zůstaň<br />v <em>obraze.</em></h2>
          <p className="nl-sub">Nové kolekce, exkluzivní nabídky a tipy na chytré cestování. Žádný spam — slibujeme.</p>
        </div>
        <div className="reveal" data-reveal style={{ '--reveal-delay': '120ms' }}>
          <form className={`nl-form ${nlDone ? 'is-subscribed' : ''}`} onSubmit={handleNL}>
              <input
                className="nl-input"
                type="text"
                placeholder="Jméno"
                value={nlName}
                onChange={(e) => setNlName(e.target.value)}
                autoComplete="name"
                disabled={nlDone}
              />
              <input
                className="nl-input"
                type="email"
                placeholder="E-mailová adresa"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={nlDone}
              />
              <div className="nl-actions">
                <button className={`nl-btn ${nlDone ? 'is-done' : ''}`} type="submit" disabled={nlDone}>
                  <span className="nl-btn-label">
                    {nlDone ? (
                      <>
                        <span className="nl-btn-check">✓</span>
                        Odebráno
                      </>
                    ) : 'Odebírat novinky'}
                  </span>
                </button>
                <button
                  className={`nl-btn-secondary ${nlCanUndo ? 'visible' : ''}`}
                  type="button"
                  onClick={unsubscribeNewsletter}
                >
                  Zrušit odběr
                </button>
              </div>
              <span className="nl-note">
                {nlDone ? `Přihlášeno${nlEmail ? `: ${nlEmail}` : ''}. Sleva 10 % už se ti znovu nebude zobrazovat.` : 'Odhlášení je vždy možné. Chráníme tvá data.'}
              </span>
            </form>
        </div>
      </div>

      <footer className="reveal" data-reveal>
        <div className="footer-top">
          <div className="footer-brand reveal" data-reveal style={{ '--reveal-delay': '0ms' }}>
            <div className="footer-logo">PACKD®</div>
            <p className="footer-tagline">Packing cubes navržené pro chytré cestovatele. Lehké, odolné, udržitelné.</p>
            <div className="footer-social">
              <a href="#">Instagram</a>
              <a href="#">TikTok</a>
              <a href="#">Pinterest</a>
            </div>
          </div>
          <div className="footer-col reveal" data-reveal style={{ '--reveal-delay': '70ms' }}>
            <h4>Produkty</h4>
            <ul>
              <li><a href="#">Novinky</a></li>
              <li><a href="#">Sety</a></li>
              <li><a href="#">Kompresia</a></li>
              <li><a href="#">Mesh Cubes</a></li>
              <li><a href="#">XL Cubes</a></li>
            </ul>
          </div>
          <div className="footer-col reveal" data-reveal style={{ '--reveal-delay': '140ms' }}>
            <h4>Pomoc</h4>
            <ul>
              <li><a href="#">Doprava & vrácení</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Kontakt</a></li>
              <li><a href="#">Velikostní průvodce</a></li>
            </ul>
          </div>
          <div className="footer-col reveal" data-reveal style={{ '--reveal-delay': '210ms' }}>
            <h4>Společnost</h4>
            <ul>
              <li><a href="#">O nás</a></li>
              <li><a href="#">Udržitelnost</a></li>
              <li><a href="#">Affiliate</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PACKD. Všechna práva vyhrazena.</span>
          <span>Ochrana osobních údajů · Obchodní podmínky</span>
        </div>
      </footer>

      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <span className="cart-title">KOŠÍK</span>
          <button ref={cartCloseRef} className="cart-close" onClick={() => setCartOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {(() => {
          const FREE_THRESHOLD = 1200;
          const remaining = Math.max(0, FREE_THRESHOLD - cartTotal);
          const pct = Math.min(100, cartTotal / FREE_THRESHOLD * 100);
          return (
            <div className="cart-shipping-bar">
              <p className="cart-shipping-text">
                {remaining > 0 ? (
                  <>Zbývá <strong>{remaining.toLocaleString('cs-CZ')} Kč</strong> do <strong>dopravy zdarma!</strong></>
                ) : (
                  <>✓ Máš <strong>dopravu zdarma</strong>!</>
                )}
              </p>
              <div className="cart-shipping-track">
                <div className="cart-shipping-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })()}

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".3">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="cart-empty-title">Košík je prázdný</span>
            <span className="cart-empty-sub">Přidej něco krásného.</span>
          </div>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img">
                  <img src={item.img} alt={item.name} />
                </div>
                <div className="cart-item-body">
                  <div className="cart-item-row">
                    <span className="cart-item-name">{item.name}</span>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>ODSTRANIT</button>
                  </div>
                  <span className="cart-item-variant">{item.variant}</span>
                  <span className="cart-item-price">{item.price.toLocaleString('cs-CZ')} Kč</span>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, +1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-footer">
          <div className="cart-total-row">
            <span className="cart-total-label">CELKEM</span>
            <span className="cart-total-price">{cartTotal.toLocaleString('cs-CZ')} Kč</span>
          </div>
          <button className="cart-checkout-btn">POKLADNA</button>
          <span className="cart-tax-note">Daně zahrnuty. Doprava se vypočítá při pokladně.</span>
        </div>
      </div>

      <div className={`nl-popup ${isPopupVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="nl-popup-close" onClick={closePopup}>×</button>
        {!popupDone ? (
          <div className="nl-popup-inner">
            <div className="nl-popup-eyebrow">Exkluzivní nabídka</div>
            <div className="nl-popup-title">Získej<br /><em>−10 %</em><br />slevu</div>
            <p className="nl-popup-sub">Zadej svůj e-mail a okamžitě dostaneš slevový kód na první objednávku.</p>
            <form onSubmit={handlePopup}>
              <input
                className="nl-popup-input"
                type="email"
                placeholder="tvuj@email.cz"
                value={popupEmail}
                onChange={(e) => setPopupEmail(e.target.value)}
                required
              />

              <button className="nl-popup-btn" type="submit">Chci slevu 10 %</button>
            </form>
            <p className="nl-popup-note">Bez spamu. Odhlásit se můžeš kdykoliv.</p>
          </div>
        ) : (
          <div className="nl-popup-success">
            <div className="nl-popup-eyebrow">Tvůj kód je připraven 🎉</div>
            <div className="nl-popup-title">Díky!</div>
            <p className="nl-popup-sub nl-popup-subtle">Zkopíruj kód a použij ho při pokladně.</p>
            <div className={`nl-popup-code ${copied ? 'copied' : ''}`} onClick={copyCode}>
              <span className="code-label">PACKD10</span>
              <span className="code-check">✓ Zkopírováno</span>
            </div>
            <p className="nl-popup-note nl-popup-note-fade" style={{ opacity: copied ? 0 : 1 }}>Klikni pro zkopírování</p>
            <button className="nl-popup-btn nl-popup-btn-spaced" onClick={closePopup}>Jít nakupovat</button>
          </div>
        )}
      </div>

      <button className={`nl-popup-tab ${!nlDone && tabVisible && !menuOpen && !cartOpen && !selectedProduct && !searchOpen ? 'visible' : ''}`} onClick={openPopup}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <polyline points="2,4 12,13 22,4" />
        </svg>
        −10 % sleva
      </button>
      <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={setSelectedProduct}
        products={products}
        topProducts={topProducts}
      />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
