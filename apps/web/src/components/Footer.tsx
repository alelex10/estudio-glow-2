import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3 gradient-text">
              Estudio Glow
            </h3>
            <p className="text-sm leading-relaxed">
              Tu tienda online con los mejores productos al mejor precio. Calidad y estilo garantizados.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-primary-400 transition-colors">
                  Productos
                </a>
              </li>
              <li>
                <a href="/cart" className="hover:text-primary-400 transition-colors">
                  Carrito
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>info@estudioglow.com</li>
              <li>+54 11 1234-5678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-surface-800 mt-8 pt-6 text-center text-sm">
          <p className="flex items-center justify-center gap-1">
            Hecho con <Heart size={14} className="text-accent-500 fill-accent-500" /> Estudio Glow
            {" "}&copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
