import { db } from "./connection.js";
import { users, products } from "./schema.js";
import bcrypt from "bcryptjs";

async function seed() {

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(users)
    .values({
      name: "Admin",
      email: "admin@tienda.com",
      password: hashedPassword,
      role: "admin",
    })
    .onConflictDoNothing();

  // Create demo user
  const userPassword = await bcrypt.hash("user123", 10);
  await db.insert(users)
    .values({
      name: "Usuario Demo",
      email: "user@tienda.com",
      password: userPassword,
      role: "user",
    })
    .onConflictDoNothing();

  // Create products
  const productData = [
    {
      name: "Auriculares Bluetooth Pro",
      price: 89.99,
      description:
        "Auriculares inalámbricos con cancelación de ruido activa, batería de 30 horas y sonido Hi-Fi premium.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      category: "Electrónica",
      stock: 25,
    },
    {
      name: "Mochila Urban Explorer",
      price: 59.99,
      description:
        "Mochila resistente al agua con compartimento para laptop de 15.6', puertos USB y diseño ergonómico.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      category: "Accesorios",
      stock: 40,
    },
    {
      name: "Smartwatch Fitness X",
      price: 199.99,
      description:
        "Reloj inteligente con monitor cardíaco, GPS integrado, resistencia al agua 5ATM y más de 100 modos deportivos.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      category: "Electrónica",
      stock: 15,
    },
    {
      name: "Cámara Instant Print",
      price: 129.99,
      description:
        "Cámara instantánea con impresión integrada, filtros creativos y conectividad Bluetooth para editar desde tu smartphone.",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
      category: "Fotografía",
      stock: 20,
    },
    {
      name: "Botella Térmica Eco",
      price: 34.99,
      description:
        "Botella de acero inoxidable de 750ml, mantiene bebidas frías 24h o calientes 12h. Libre de BPA.",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
      category: "Hogar",
      stock: 60,
    },
    {
      name: "Teclado Mecánico RGB",
      price: 149.99,
      description:
        "Teclado mecánico con switches Cherry MX, iluminación RGB personalizable por tecla y reposamuñecas magnético.",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
      category: "Electrónica",
      stock: 30,
    },
    {
      name: "Zapatillas Running Air",
      price: 119.99,
      description:
        "Zapatillas deportivas ultraligeras con tecnología de amortiguación y suela de carbono para máximo rendimiento.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      category: "Deportes",
      stock: 35,
    },
    {
      name: "Lámpara LED Inteligente",
      price: 44.99,
      description:
        "Lámpara de escritorio LED con control táctil, 5 modos de luz, carga inalámbrica Qi y temporizador automático.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
      category: "Hogar",
      stock: 45,
    },
  ];

  for (const product of productData) {
    await db.insert(products).values(product).onConflictDoNothing();
  }

  process.exit(0);
}

seed().catch(console.error);
