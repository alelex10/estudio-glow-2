import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput, type Product } from "@ecommerce/shared";
import { api } from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
  });

  const fetchProducts = () => {
    api
      .get<Product[]>("/products")
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openNew = () => {
    reset({
      name: "",
      price: 0,
      description: "",
      image: "",
      category: "",
      stock: 0,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setValue("name", product.name);
    setValue("price", product.price);
    setValue("description", product.description);
    setValue("image", product.image || "");
    setValue("category", product.category);
    setValue("stock", product.stock);
    setEditingId(product.id);
    setShowForm(true);
  };

  const onSubmit = async (data: ProductInput) => {
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, data);
      } else {
        await api.post("/products", data);
      }
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-surface-900">
          Admin: Productos
        </h1>
        <Button onClick={openNew}>
          <Plus size={18} />
          Nuevo producto
        </Button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingId ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-surface-400 hover:text-surface-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Nombre"
                {...register("name")}
                error={errors.name?.message}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Precio"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  error={errors.price?.message}
                />
                <Input
                  label="Stock"
                  type="number"
                  {...register("stock", { valueAsNumber: true })}
                  error={errors.stock?.message}
                />
              </div>
              <Input
                label="Categoría"
                {...register("category")}
                error={errors.category?.message}
              />
              <Input
                label="URL de imagen"
                {...register("image")}
                error={errors.image?.message}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">
                  Descripción
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white text-surface-900 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={saving} className="flex-1">
                  {editingId ? "Guardar cambios" : "Crear producto"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 skeleton rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-surface-600">
                  Producto
                </th>
                <th className="text-left px-4 py-3 font-semibold text-surface-600 hidden sm:table-cell">
                  Categoría
                </th>
                <th className="text-right px-4 py-3 font-semibold text-surface-600">
                  Precio
                </th>
                <th className="text-right px-4 py-3 font-semibold text-surface-600 hidden sm:table-cell">
                  Stock
                </th>
                <th className="text-right px-4 py-3 font-semibold text-surface-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-surface-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <span className="font-medium text-surface-900">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-500 hidden sm:table-cell">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.stock > 10
                          ? "bg-emerald-100 text-emerald-700"
                          : p.stock > 0
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
