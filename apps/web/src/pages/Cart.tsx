import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../hooks/useCart";
import Button from "../components/Button";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-surface-300 mb-4" />
        <h2 className="text-2xl font-bold text-surface-700 mb-2">
          Tu carrito está vacío
        </h2>
        <p className="text-surface-500 mb-6">
          ¡Explorá nuestros productos y encontrá algo que te guste!
        </p>
        <Link to="/">
          <Button>Ver productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-surface-900 mb-8">
        Mi Carrito
        <span className="text-lg font-normal text-surface-500 ml-2">
          ({itemCount} {itemCount === 1 ? "producto" : "productos"})
        </span>
      </h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-surface-100 hover:shadow-md transition"
          >
            {/* Image */}
            <Link
              to={`/product/${item.product.id}`}
              className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-surface-100"
            >
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-surface-400 text-xs">
                  Sin img
                </div>
              )}
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${item.product.id}`}
                className="font-semibold text-surface-900 hover:text-primary-600 transition line-clamp-1"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-surface-500">{item.product.category}</p>
              <p className="font-bold gradient-text">
                ${item.product.price.toFixed(2)}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center bg-surface-50 rounded-xl">
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
                className="p-1.5 hover:bg-surface-200 rounded-l-xl transition"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 text-sm font-semibold min-w-[32px] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
                className="p-1.5 hover:bg-surface-200 rounded-r-xl transition"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-[80px]">
              <p className="font-bold text-surface-900">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.product.id)}
              className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg text-surface-600">Subtotal:</span>
          <span className="text-2xl font-bold gradient-text">
            ${total.toFixed(2)}
          </span>
        </div>
        <Link to="/checkout">
          <Button size="lg" className="w-full">
            Ir al checkout
            <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
