import type {Pokemon} from "./types";

import {useCallback, useEffect, useState} from "react";

import {POKEMONS} from "./constants";
import PokemonCard from "./PokemonCard";

type CartItem = {
  pokemon: Pokemon;
  qty: number;
};

function App() {
  const [cart, setCart] = useState<Record<Pokemon["id"], CartItem>>(
    () => JSON.parse(localStorage.getItem("pokemon-cart") || "{}") || {},
  );

  const getCartTotalItems = useCallback(() => {
    return Object.values(cart).reduce((totalItems, cartItem) => totalItems + cartItem.qty, 0);
  }, [cart]);

  const getCartTotal = useCallback(() => {
    return Object.values(cart).reduce(
      (total, cartItem) => total + cartItem.pokemon.price * cartItem.qty,
      0,
    );
  }, [cart]);

  const handleIncrement = (pokemon: Pokemon) => {
    setCart((cart) => {
      const newCart = Object.assign({}, cart);

      newCart[pokemon.id] = {
        pokemon,
        qty: cart[pokemon.id] ? cart[pokemon.id].qty + 1 : 1,
      };

      return newCart;
    });
  };

  const handleDecrement = (pokemon: Pokemon) => {
    setCart((cart) => {
      const newCart = Object.assign({}, cart);

      newCart[pokemon.id] = {
        pokemon,
        qty: newCart[pokemon.id].qty - 1,
      };

      return newCart;
    });
  };

  useEffect(() => {
    localStorage.setItem("pokemon-cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <nav>
        <input className="nes-input" id="name_field" placeholder="Charmander" type="text" />
      </nav>
      <section>
        {POKEMONS.map((pokemon) => (
          // <PokemonCard key={pokemon.id} pokemon={pokemon} onAdd={setCart} />
          // traer el componente hacia aca, hubiera solucionado el punto 1
          <article key={pokemon.id}>
            <img className="nes-container" src={pokemon.image} />
            <div>
              <p>
                {pokemon.name} ${pokemon.price}
              </p>
              <p>{pokemon.description}</p>
            </div>
            {!cart[pokemon.id] || cart[pokemon.id].qty == 0 ? (
              <button className="nes-btn" onClick={() => handleIncrement(pokemon)}>
                Agregar
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  height: "auto",
                }}
              >
                <button
                  className="nes-btn"
                  style={{flexGrow: 1}}
                  onClick={() => handleDecrement(pokemon)}
                >
                  -
                </button>
                <div style={{flexGrow: 1, textAlign: "center"}}>{cart[pokemon.id].qty}</div>
                <button
                  className="nes-btn"
                  style={{flexGrow: 1}}
                  onClick={() => handleIncrement(pokemon)}
                >
                  +
                </button>
              </div>
            )}
          </article>
        ))}
      </section>
      <aside>
        <button className="nes-btn is-primary">
          {getCartTotalItems()} items (total ${getCartTotal()})
        </button>
      </aside>
    </>
  );
}

export default App;
