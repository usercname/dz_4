import './ProductSort.scss';

function ProductSort({ sortBy, onSortChange }) {
  return (
    <div className="product-sort">
      <label className="sort-label">Sort by:</label>
      <select 
        className="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="low">Price: Low to High</option>
        <option value="high">Price: High to Low</option>
      </select>
    </div>
  );
}

export default ProductSort;