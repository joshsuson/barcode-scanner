import { useCartContext } from "@/useCartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart } = useCartContext();
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="font-bold my-10 text-4xl">Your Cart</h1>
      <ul>
        {cart.map((product) => (
          <li key={product.title} className="md:flex w-full md:justify-between">
            <div className="text-center md:flex md:gap-2">
              <img
                className="mx-auto md:mx-0"
                src={product.cover}
                alt={product.title}
              />
              <h2 className="py-4 md:py-0 font-bold text-lg">
                {product.title}
              </h2>
            </div>
            <div>
              <p>Quantity</p>
              <p>{product.quantity}</p>
            </div>
          </li>
        ))}
      </ul>
      <Link className="block my-10" href="/">
        Back to scanner
      </Link>
    </div>
  );
}
