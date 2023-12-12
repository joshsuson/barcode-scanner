import { useContext, createContext, useState } from "react";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export default function CartContextProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const data = {
    cart,
    addToCart,
  };
  return <CartContext.Provider value={data}>{children}</CartContext.Provider>;
}
