import { useMemo, useState } from 'react';

const categories = [
  { icon: '🛍️', name: 'Маркет' },
  { icon: '🔧', name: 'Қызметтер' },
  { icon: '🚕', name: 'Такси' },
  { icon: '🏠', name: 'Жылжымайтын мүлік' },
  { icon: '💼', name: 'Жұмыс' },
  { icon: '📦', name: 'Жеткізу' },
  { icon: '🎓', name: 'Оқу' },
  { icon: '⋯', name: 'Барлығы' },
];

const initialListings = [
  { id: 1, title: 'iPhone 13 · 128 GB', category: 'Электроника', price: '185 000 ₸', location: 'Қостанай', emoji: '📱', tone: 'lavender', seller: 'Aruzhan', time: '12 мин бұрын' },
  { id: 2, title: 'Үйге арналған шебер', category: 'Қызметтер', price: '5 000 ₸ бастап', location: 'Астана', emoji: '🛠️', tone: 'mint', seller: 'Ерлан шебер', time: '35 мин бұрын' },
  { id: 3, title: 'Жайлы 1 бөлмелі пәтер', category: 'Жылжымайтын мүлік', price: '95 000 ₸ / ай', location: 'Алматы', emoji: '🏡', tone: 'peach', seller: 'Dana', time: '1 сағ бұрын' },
  { id: 4, title: 'Қала ішінде такси', category: 'Көлік', price: '1 000 ₸ бастап', location: 'Қостанай', emoji: '🚘', tone: 'blue', seller: 'Qazaq Taxi', time: '1 сағ бұрын' },
];

const navItems = [
  { id: 'home', icon: '⌂', label: 'Басты бет' },
  { id: 'market', icon: '▦', label: 'Маркет' },
  { id: 'services', icon: '✳', label: 'Қызметтер' },
  { id: 'chats', icon: '▤', label: 'Чаттар' },
  { id: 'profile', icon: '◎', label: 'Профиль' },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Барлығы');
  const [favorites, setFavorites] = useState([]);
  const [listings, setListings] = useState(initialListings);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Электроника');

  const visibleListings = useMemo(() => listings.filter((item) => {
    const matchesSearch = (item.title + ' ' + item.category + ' ' + item.location).toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'Барлығы' || item.category === activeCategory || (activeCategory === 'Маркет' && item.category !== 'Қызметтер');
    const matchesTab = activeTab !== 'services' || item.category === 'Қызметтер';
    const matchesMarket = activeTab !== 'market' || item.category !== 'Қызметтер';
    const matchesFavorites = activeTab !== 'favorites' || favorites.includes(item.id);
    return matchesSearch && matchesCategory && matchesTab && matchesMarket && matchesFavorites;
  }), [listings, search, activeCategory, activeTab, favorites]);

  function notify(message) {
    setToast(message);
    window.clearTimeout(window.__qazaqToast);
    window.__qazaqToast = window.setTimeout(() => setToast(''), 2400);
  }

  function toggleFavorite(id) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function createListing(event) {
    event.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) {
      notify('Атауы мен бағасын толтырыңыз');
      return;
    }
    const item = {
      id: Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      price: newPrice.trim().includes('₸') ? newPrice.trim() : newPrice.trim() + ' ₸',
      location: 'Қазақстан',
      emoji: newCategory === 'Қызметтер' ? '🧰' : newCategory === 'Көлік' ? '🚗' : '✨',
      tone: 'lavender',
      seller: 'Сіз',
      time: 'Жаңа жарияланым',
    };
    setListings((current) => [item, ...current]);
    setNewTitle('');
    setNewPrice('');
    setShowCreate(false);
    setActiveTab('market');
    setActiveCategory('Барлығы');
    notify('Жарияланым қосылды!');
  }

  function goToTab(id) {
    setActiveTab(id);
    setSearch('');
    setActiveCategory('Барлығы');
    if (id === 'chats') notify('Чаттар бөлімі әзірлену үстінде');
    if (id === 'profile') notify('Профиль бөлімі әзірлену үстінде');
  }

  const pageTitle = activeTab === 'market' ? 'Маркет' : activeTab === 'services' ? 'Қызметтер' : activeTab === 'favorites' ? 'Таңдаулылар' : 'Сізге арналған';

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => goToTab('home')} aria-label="QazaqHub басты бет">
          <span className="brand-mark">q<span>.</span></span>
          <span className="brand-name">Qazaq<span>Hub</span></span>
        </button>
        <button className="location-pill" onClick={() => notify('Қала таңдау жақында қосылады')}><span className="location-dot" /> Қазақстан <span className="chevron">⌄</span></button>
        <button className="avatar-button" onClick={() => goToTab('profile')} aria-label="Профиль">G</button>
      </header>

      <main>
        {activeTab === 'home' && (
          <section className="welcome">
            <div className="welcome-copy">
              <div className="eyebrow"><span className="sparkle">✦</span> БӘРІ БІР ҚОСЫМШАДА</div>
              <h1>Керегіңнің<br />бәрі <span>осында.</span></h1>
              <p>Сатып ал. Қызмет тап. Байланыс орнат.</p>
            </div>
            <div className="hero-orb" aria-hidden="true"><span>Q</span><i>✦</i><b>✧</b></div>
            <div className="hero-glow" />
          </section>
        )}

        <section className="search-wrap">
          <span className="search-icon">⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Не іздеп жүрсіз?" aria-label="Іздеу" />
          {search && <button className="clear-search" onClick={() => setSearch('')} aria-label="Іздеуді тазалау">×</button>}
          <button className="filter-button" onClick={() => notify('Сүзгілер жақында қосылады')} aria-label="Сүзгілер">☷</button>
        </section>

        {activeTab === 'home' && (
          <>
            <div className="section-heading"><div><span className="section-kicker">БӨЛІМДЕР</span><h2>Не қажет?</h2></div><button className="text-button" onClick={() => notify('Барлық бөлімдер жақында')}>Барлығы <span>→</span></button></div>
            <section className="category-grid">
              {categories.map((category) => <button className="category-card" key={category.name} onClick={() => {
                if (category.name === 'Барлығы') { setActiveCategory('Барлығы'); setActiveTab('market'); }
                else if (category.name === 'Маркет') { setActiveCategory('Маркет'); setActiveTab('market'); }
                else if (category.name === 'Қызметтер') { setActiveCategory('Қызметтер'); setActiveTab('services'); }
                else { setActiveCategory(category.name); setActiveTab('market'); notify(category.name + ' бөлімі таңдалды'); }
              }}><span className="category-icon">{category.icon}</span><span>{category.name}</span></button>)}
            </section>
            <button className="promo-banner" onClick={() => setShowCreate(true)}>
              <span className="promo-icon">＋</span><span className="promo-copy"><strong>Өз тауарыңды жарияла</strong><small>Бірнеше қадамда сатып алушы тап</small></span><span className="promo-arrow">↗</span>
            </button>
          </>
        )}

        <div className="section-heading listing-heading"><div><span className="section-kicker">{activeTab === 'home' ? 'ЖАҢА ҰСЫНЫСТАР' : 'QAZAQHUB'}</span><h2>{pageTitle}</h2></div><button className="sort-button" onClick={() => notify('Сұрыптау параметрлері жақында')}>↕ Сұрыптау</button></div>

        {activeTab === 'favorites' && favorites.length === 0 ? (
          <div className="empty-state"><span>♡</span><h3>Әзірге таңдаулы жоқ</h3><p>Ұнаған хабарландырудағы жүрекшені басып сақтаңыз.</p><button className="primary-button" onClick={() => goToTab('market')}>Маркетке өту</button></div>
        ) : visibleListings.length ? (
          <section className="listing-grid">
            {visibleListings.map((item) => <article className="listing-card" key={item.id}>
              <button className={'listing-visual ' + item.tone} onClick={() => notify(item.title)} aria-label={item.title}>
                <span className="listing-emoji">{item.emoji}</span><span className="listing-category">{item.category}</span>
              </button>
              <button className={'favorite-button ' + (favorites.includes(item.id) ? 'is-favorite' : '')} onClick={() => toggleFavorite(item.id)} aria-label="Таңдаулыға қосу">{favorites.includes(item.id) ? '♥' : '♡'}</button>
              <div className="listing-info">
                <div className="listing-price">{item.price}</div>
                <h3>{item.title}</h3>
                <div className="listing-meta"><span>⌖ {item.location}</span><span>{item.time}</span></div>
                <button className="contact-button" onClick={() => notify('Сатушымен чат келесі кезеңде қосылады')}>Толығырақ <span>→</span></button>
              </div>
            </article>)}
          </section>
        ) : (
          <div className="empty-state"><span>⌕</span><h3>Ештеңе табылмады</h3><p>Іздеу сөзін немесе санатты өзгертіп көріңіз.</p><button className="primary-button" onClick={() => { setSearch(''); setActiveCategory('Барлығы'); setActiveTab('home'); }}>Басты бетке қайту</button></div>
        )}
        <div className="bottom-space" />
      </main>

      <button className="floating-add" onClick={() => setShowCreate(true)} aria-label="Жарияланым қосу">＋</button>
      <nav className="bottom-nav" aria-label="Негізгі навигация">
        {navItems.map((item) => <button key={item.id} className={'nav-item ' + (activeTab === item.id ? 'active' : '')} onClick={() => goToTab(item.id)}><span className="nav-icon">{item.icon}</span><span>{item.label}</span>{item.id === 'chats' && <i className="nav-dot" />}</button>)}
      </nav>

      {showCreate && <div className="modal-backdrop" onClick={() => setShowCreate(false)}><section className="create-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-handle" /><div className="modal-heading"><div><span className="section-kicker">QAZAQHUB МАРКЕТ</span><h2>Жарияланым қосу</h2></div><button className="modal-close" onClick={() => setShowCreate(false)}>×</button></div>
        <form onSubmit={createListing}>
          <label>Атауы<input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Мысалы, iPhone 14" maxLength={80} /></label>
          <label>Санаты<select value={newCategory} onChange={(event) => setNewCategory(event.target.value)}><option>Электроника</option><option>Қызметтер</option><option>Көлік</option><option>Жылжымайтын мүлік</option><option>Киім</option></select></label>
          <label>Бағасы<input value={newPrice} onChange={(event) => setNewPrice(event.target.value)} placeholder="Мысалы, 50000 ₸" maxLength={40} /></label>
          <button className="primary-button submit-button" type="submit">Жариялау <span>→</span></button>
        </form>
        <p className="modal-note">Бұл бастапқы нұсқада хабарландыру осы құрылғыдағы ашық сессияда көрсетіледі. Firebase сақтау келесі кезеңде қосылады.</p>
      </section></div>}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

export default App;