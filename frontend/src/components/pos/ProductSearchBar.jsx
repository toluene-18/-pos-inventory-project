import Icon from '../ui/Icon';

function titleCase(text) {
  return text.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * ProductSearchBar — search / scan input plus category chips and dedicated Scan Barcode trigger.
 */
function ProductSearchBar({
  query,
  onQuery,
  onSubmitSku,
  categories,
  category,
  onCategory,
  inputRef,
}) {
  function handleKeyDown(event) {
    if (event.key === 'Enter' && query.trim()) {
      event.preventDefault();
      onSubmitSku(query);
    }
  }

  function handleScanClick() {
    if (inputRef?.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }

  return (
    <div className="pos-search">
      <div className="pos-search-row">
        <label className="pos-search-input">
          <Icon name="barcode" size={17} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => onQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search product name or scan SKU, then press Enter…"
            aria-label="Search products or scan SKU"
            autoComplete="off"
          />
          <kbd>/</kbd>
        </label>

        <button
          type="button"
          className="pos-scan-btn"
          onClick={handleScanClick}
          title="Point barcode scanner or click to enter SKU"
        >
          <Icon name="barcode" size={16} />
          <span>Scan barcode</span>
        </button>
      </div>

      <div className="pos-chips" role="tablist" aria-label="Categories">
        {['all', ...categories].map(c => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            className={`pos-chip${category === c ? ' active' : ''}`}
            onClick={() => onCategory(c)}
          >
            {c === 'all' ? 'All items' : titleCase(c)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductSearchBar;
