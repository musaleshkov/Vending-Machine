interface SiteHeaderProps {
  onManage: () => void;
}

export function SiteHeader({ onManage }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#main-content" aria-label="Vending Machine home">
        <span className="brand__mark" aria-hidden="true">
          ▣
        </span>
        <span>Vending Machine</span>
      </a>
      <button className="header-action" type="button" onClick={onManage} aria-label="Manage inventory">
        <span aria-hidden="true">⚙</span> Manage products
      </button>
    </header>
  );
}
