import { Link, useNavigate } from "react-router-dom";
import { useCartActions } from "../../store/cart.store";
import { useUserStore } from "../../store/user.store";
import type { Product } from "../../utils/interface";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart } = useCartActions();
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!token) {
      navigate("/account");
      return;
    }

    const result = await addToCart({
      product_id: product.id!,
      quantity: 1,
    });

    if (result.error) {
      toast.error(`Error: ${result.error}`);
    } else {
      toast.success(result.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.images?.[0] ?? "https://via.placeholder.com/300"}
          alt={product.name}
          loading="lazy"
          className="h-48 w-full object-cover rounded-lg mb-4"
        />
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p>#{product.quantity}</p>
        </div>
      </Link>

      <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-[#E25822]">
          ₦{product.price}
        </span>

        <button
          onClick={handleAddToCart}
          className="bg-[#E25822] text-white px-4 py-2 rounded-lg hover:bg-[#B84016]"
        >
          Add
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default ProductCard;
