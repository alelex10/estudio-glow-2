import { Link } from "react-router-dom";
import { ShoppingCart, User, LogOut, Package, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110">
              G
            </div>
            <span className="text-xl font-bold gradient-text">
              Estudio Glow
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-surface-700 hover:text-primary-600 font-medium transition-colors"
            >
              Productos
            </Link>

            {isAdmin && (
              <Link
                to="/admin/products"
                className="text-surface-700 hover:text-primary-600 font-medium transition-colors flex items-center gap-1"
              >
                <Package size={16} />
                Admin
              </Link>
            )}

            <Link
              to="/cart"
              className="relative text-surface-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/orders"
                  className="text-sm text-surface-600 hover:text-primary-600 transition-colors"
                >
                  Mis pedidos
                </Link>
                <span className="text-sm text-surface-500">
                  Hola, <strong>{user.name}</strong>
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-surface-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:from-primary-600 hover:to-accent-600 transition-all shadow-md hover:shadow-lg"
              >
                <User size={16} />
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-surface-700"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-surface-200 pt-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block text-surface-700 hover:text-primary-600 font-medium"
            >
              Productos
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="block text-surface-700 hover:text-primary-600 font-medium"
            >
              Carrito ({itemCount})
            </Link>
            {isAdmin && (
              <Link
                to="/admin/products"
                onClick={() => setMenuOpen(false)}
                className="block text-surface-700 hover:text-primary-600 font-medium"
              >
                Admin
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="block text-surface-700 hover:text-primary-600 font-medium"
                >
                  Mis pedidos
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-red-500 font-medium"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-primary-600 font-medium"
              >
                Entrar
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
