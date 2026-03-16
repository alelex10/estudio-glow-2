import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@ecommerce/shared";
import { useCart } from "../hooks/useCart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-surface-100">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-surface-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-surface-400">
              Sin imagen
            </div>
          )}
        </div>
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-primary-700 backdrop-blur-sm shadow-sm">
          {product.category}
        </span>
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">
            ¡Últimas unidades!
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
            Agotado
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-surface-500 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold gradient-text">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            title="Agregar al carrito"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
