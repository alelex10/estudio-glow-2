import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderSchema, type CreateOrderInput } from "@ecommerce/shared";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";

// Extend schema with just address and phone (items come from cart)
const checkoutSchema = z.object({
  shippingAddress: createOrderSchema.shape.shippingAddress,
  phone: createOrderSchema.shape.phone,
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  if (items.length === 0 && !success) {
    navigate("/cart");
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    setError("");
    try {
      const orderData: CreateOrderInput = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        shippingAddress: data.shippingAddress,
        phone: data.phone,
      };

      await api.post("/orders", orderData);
      clearCart();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 mb-2">
          ¡Pedido confirmado!
        </h2>
        <p className="text-surface-500 mb-6">
          Recibirás un email con los detalles de tu pedido
        </p>
        <Button onClick={() => navigate("/orders")}>Ver mis pedidos</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-surface-900 mb-8">Checkout</h1>

      {/* Order summary */}
      <div className="bg-surface-50 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-surface-900 mb-4">
          Resumen del pedido
        </h2>
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between text-sm py-2 border-b border-surface-200 last:border-0"
          >
            <span className="text-surface-600">
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="flex justify-between mt-4 pt-3 border-t border-surface-300">
          <span className="font-bold text-surface-900">Total</span>
          <span className="font-bold text-xl gradient-text">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Shipping form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <h2 className="font-semibold text-surface-900">Datos de envío</h2>

        <Input
          label="Dirección de envío"
          placeholder="Calle, número, piso, depto, ciudad..."
          {...register("shippingAddress")}
          error={errors.shippingAddress?.message}
        />

        <Input
          label="Teléfono"
          placeholder="+54 11 1234-5678"
          {...register("phone")}
          error={errors.phone?.message}
        />

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Confirmar pedido (${total.toFixed(2)})
        </Button>
      </form>
    </div>
  );
}
