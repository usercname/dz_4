import { useState, useEffect, useRef } from 'react';
import { getBrandsByCategory } from '../data/productMap';
import WeatherWidget from './WeatherWidget/WeatherWidget'; // ✅ Импорт
import './Sidebar.scss';

const INITIAL_SECONDS = 59 * 60 + 59;

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function Sidebar({ category, filters, onFilterChange, onApply }) {
  const brands = getBrandsByCategory(category);

  // Состояние только для Special Deal и Таймера
  const [showDeal, setShowDeal] = useState(true);
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);

  // Логика таймера
  useEffect(() => {
    if (isRunning && !isFinished && showDeal) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isFinished, showDeal]);

  const handleToggle = () => { if (!isFinished) setIsRunning(prev => !prev); };
  const handleRestart = () => {
    if (isFinished) {
      setSeconds(INITIAL_SECONDS);
      setIsFinished(false);
      setIsRunning(true);
    } else {
      setSeconds(INITIAL_SECONDS);
    }
  };

  return (
    <aside className="sidebar">
      {/* Фильтры */}
      <div className="filter-section">
        <label className="filter-label">Brand</label>
        <select className="filter-select" value={filters.brand} onChange={(e) => onFilterChange?.('brand', e.target.value)}>
          <option value="">All brands</option>
          {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
        </select>
      </div>
      
      <div className="filter-section">
        <label className="filter-label">Price Range</label>
        <div className="price-range">
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" className="price-input"
            value={filters.minPrice}
            onChange={(e) => { let val = e.target.value.replace(/[^0-9]/g, ''); onFilterChange?.('minPrice', val); }}
          />
          <span className="price-separator">—</span>
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="5000" className="price-input"
            value={filters.maxPrice}
            onChange={(e) => { let val = e.target.value.replace(/[^0-9]/g, ''); onFilterChange?.('maxPrice', val); }}
          />
        </div>
      </div>
      
      <button className="btn-apply" onClick={onApply}>Apply Filters</button>

      <WeatherWidget />

      {/* Special Deal с таймером */}
      {showDeal && (
        <div className="special-deal">
          <button className="special-deal__close" onClick={() => setShowDeal(false)}>×</button>
          <div className="special-deal__header">
            <span className="special-deal__icon">🔥</span>
            <h4 className="special-deal__title">Special Deal!</h4>
          </div>
          <p className="special-deal__text">Register now to unlock exclusive offers and discounts</p>
          <div className="special-deal__timer">{isFinished ? 'таймер истёк' : formatTime(seconds)}</div>
          <div className="special-deal__controls">
            <button className="deal-btn deal-btn--toggle" onClick={handleToggle} disabled={isFinished}>
              {isRunning ? 'stop' : 'replay'}
            </button>
            <button className={`deal-btn deal-btn--restart ${isFinished ? 'deal-btn--restart--active' : ''}`} onClick={handleRestart}>
              restart
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;