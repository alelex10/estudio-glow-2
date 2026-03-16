import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus, Package } from "lucide-react";
import type { Product } from "@ecommerce/shared";
import { api } from "../services/api";
import { useCart } from "../hooks/useCart";
import Button from "../components/Button";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .get<Product>(`/products/${id}`)
      .then(setProduct)
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAdd = () => {
    if (product) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square skeleton rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 skeleton rounded w-3/4" />
            <div className="h-6 skeleton rounded w-1/4" />
            <div className="h-4 skeleton rounded w-full" />
            <div className="h-4 skeleton rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-surface-500 hover:text-surface-700 transition mb-6"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden bg-surface-100 shadow-lg">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center text-surface-400">
              <Package size={64} />
            </div>
          )}
          <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/90 text-primary-700 backdrop-blur-sm shadow">
            {product.category}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-2">
              {product.name}
            </h1>
            <p className="text-4xl font-extrabold gradient-text">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-surface-600 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="flex items-center gap-2 text-sm">
            <span
              className={`px-3 py-1 rounded-full font-medium ${
                product.stock > 10
                  ? "bg-emerald-100 text-emerald-700"
                  : product.stock > 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} en stock`
                : "Sin stock"}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="space-y-4">
              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-surface-600">
                  Cantidad:
                </span>
                <div className="flex items-center bg-surface-100 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-surface-200 rounded-l-xl transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-semibold min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="p-2 hover:bg-surface-200 rounded-r-xl transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <Button size="lg" onClick={handleAdd} className="w-full">
                <ShoppingCart size={20} />
                {added ? "¡Agregado!" : "Agregar al carrito"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
