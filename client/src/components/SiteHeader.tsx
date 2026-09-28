import { Icon } from './Icon';

interface SiteHeaderProps {
  onManage: () => void;
}

export function SiteHeader({ onManage }: SiteHeaderProps) {
  return (
    <aside className="site-header">
      <a className="brand" href="#main-content" aria-label="Vending Machine home">
        <span className="brand__mark" aria-hidden="true">
          <Icon name="box" size={20} />
        </span>
        <span>Vending Machine</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a className="main-nav__item is-active" href="#products-title">
          <Icon name="cart" /> <span>Shop</span>
        </a>
        <button
          className="main-nav__item"
          type="button"
          onClick={onManage}
          aria-label="Manage inventory"
        >
          <Icon name="bag" /> <span>Manage products</span>
        </button>
        <span className="main-nav__item is-muted">
          <Icon name="history" /> <span>Transactions</span>
        </span>
        <span className="main-nav__item is-muted">
          <Icon name="settings" /> <span>Settings</span>
        </span>
      </nav>
      <div className="sidebar-promo" aria-hidden="true">
        <div className="mini-machine">
          <span />
          <span />
          <span />
          <span />
          <b />
        </div>
        <div>
          <strong>
            Good drinks.
            <br />
            Better breaks.
          </strong>
          <p>
            Snacks, drinks & more
            <br />
            right at your fingertips.
          </p>
        </div>
      </div>
    </aside>
  );
}
