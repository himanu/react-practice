import "./App.css";
import { useState, useEffect, useRef } from "react";


export default function App() {
  const [products, setProducts] = useState({ products: [] });
  const targetElement = useRef({ pageNumber: 1 });

  const observer = new IntersectionObserver((entries) => {
    let entry = entries[0];
    if (entry.isIntersecting) {
      observer.unobserve(targetElement.current.observer);

      let currentPageNumber = targetElement.current.pageNumber;
      let totalPages = Math.ceil(products.total / 30);
      if (currentPageNumber < totalPages) {
        targetElement.current.pageNumber += 1;
        fetchProducts(targetElement.current.pageNumber);
      }
    }
  }, {
    threshold: 0.5, // Call the callback when the element is at least 50% visible
  });

  /** used just for registering a new observer */
  const registerIntersectionObserver = (element) => {
    if (!element)
      return;
    targetElement.current.observer = element;
    observer.observe(element);
  }

  const fetchProducts = async (pageNumber) => {
    fetch(`https://dummyjson.com/products?limit=30&skip=${30 * (pageNumber - 1)}&select=title,price`)
      .then(res => res.json())
      .then(res => setProducts((prev) => ({ ...prev, products: [...prev.products, ...res.products], total: res.total })))
  }

  useEffect(() => {
    fetchProducts(1)
  }, []);


  console.log("products ", products.total);
  return (
    <div className="App">
      <div style={{ height: "200px", overflow: "scroll", marginTop: "100px", width: "500px", margin: "100px auto 0", border: "1px solid" }}
      >
        {products?.products?.map((prod, index) => (
          <div {...(index === (targetElement.current.pageNumber * 15 - 1)) && observer && { ref: registerIntersectionObserver }}> {prod.title} </div>
        ))}
      </div>
    </div>
  );
}
