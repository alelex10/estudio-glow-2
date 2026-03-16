import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import type { Order } from "@ecommerce/shared";
import { api } from "../services/api";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Order[]>("/orders")
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 skeleton rounded-2xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Package size={64} className="mx-auto text-surface-300 mb-4" />
        <h2 className="text-2xl font-bold text-surface-700 mb-2">
          No tenés pedidos
        </h2>
        <p className="text-surface-500">
          Cuando hagas tu primera compra, aparecerá acá
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-surface-900 mb-8">Mis Pedidos</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-surface-500">
                  Pedido #{order.id}
                </span>
                <span className="text-sm text-surface-400 ml-2">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusColors[order.status]
                }`}
              >
                {statusLabels[order.status]}
              </span>
            </div>

            {order.items && (
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product?.name || ""}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      )}
                      <span className="text-surface-700">
                        {item.product?.name || `Producto #${item.productId}`}{" "}
                        <span className="text-surface-400">× {item.quantity}</span>
                      </span>
                    </div>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-surface-100">
              <span className="text-sm text-surface-500">
                📍 {order.shippingAddress}
              </span>
              <span className="font-bold gradient-text text-lg">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
