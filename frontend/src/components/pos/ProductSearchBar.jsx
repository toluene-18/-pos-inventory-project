import Icon from '../ui/Icon';

function titleCase(text) {
  return text.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * ProductSearchBar — search / scan input plus category chips.
 * Pressing Enter with an exact SKU adds the product (barcode scanner flow).
 */
function ProductSearchBar({ query, onQuery, onSubmitSku, categories, category, onCategory, inputRef }) {
  function handleKeyDown(event) {
    if (event.key === 'Enter' && query.trim()) {
      event.preventDefault();
      onSubmitSku(query);
    }
  }

  return (
    <div className="pos-search">
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
