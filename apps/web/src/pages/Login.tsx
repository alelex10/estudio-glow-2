import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@ecommerce/shared";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError("");
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Bienvenido
          </h1>
          <p className="text-surface-500">Iniciá sesión para continuar</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-lg border border-surface-100 p-8 space-y-5"
        >
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            error={errors.password?.message}
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
            Iniciar sesión
          </Button>

          <p className="text-center text-sm text-surface-500">
            ¿No tenés cuenta?{" "}
            <Link
              to="/register"
              className="text-primary-600 font-semibold hover:underline"
            >
              Registrate
            </Link>
          </p>
        </form>

        <div className="mt-4 p-4 bg-surface-50 rounded-xl text-xs text-surface-500 text-center">
          <strong>Demo:</strong> admin@tienda.com / admin123 • user@tienda.com / user123
        </div>
      </div>
    </div>
  );
}
