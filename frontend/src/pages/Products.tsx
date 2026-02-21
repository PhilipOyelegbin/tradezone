import { useEffect, useState } from "react";
import { useProductActions, useProductStore } from "../store/product.store";
import ProductCard from "../components/product/ProductCard";

const Products: React.FC = () => {
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.loading);
  const error = useProductStore((state) => state.error);
  const totalPages = useProductStore((state) => state.totalPages);
  const { getProducts } = useProductActions();
  const [price, setPrice] = useState(300000);
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ["All", ...new Set(products?.map((p) => p.category.name))];

  const filteredProducts = products?.filter((p) => {
    const matchesPrice = p.price <= price;
    const matchesCategory = category === "All" || p.category.name === category;
    return matchesPrice && matchesCategory;
  });

  useEffect(() => {
    getProducts(currentPage);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [price, category]);

  return (
    <section className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:justify-between gap-5 mb-8">
        <input
          id="price"
          type="number"
          min="0"
          max="50000000"
          className="flex-1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          className="md:w-64"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories?.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : error ? (
        <p className="text-center">🚨 {error}</p>
      ) : (
        <>
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts &&
              filteredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 border rounded ${
                      currentPage === page ? "bg-black text-white" : ""
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Products;
