import { Icon } from './Icon';

interface TopbarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function Topbar({ query, onQueryChange }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="mobile-menu" aria-hidden="true">
        <Icon name="menu" />
      </div>
      <div className="mobile-brand">
        <span className="brand__mark">
          <Icon name="box" size={17} />
        </span>
        <strong>Vending Machine</strong>
      </div>
      <div className="topbar__intro">
        <h1>Vending Machine</h1>
        <p>Grab your favorite snacks and drinks</p>
      </div>
      <label className="search-box">
        <span className="sr-only">Search products</span>
        <Icon name="search" size={18} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search products..."
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            <Icon name="x" size={15} />
          </button>
        )}
      </label>
      <div className="icon-button" aria-hidden="true">
        <Icon name="bell" size={19} />
        <span className="notification-dot" />
      </div>
      <span className="avatar" aria-hidden="true">
        VM
      </span>
    </header>
  );
}
