import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useSearchParams } from 'react-router-dom'
import Product from '../components/Product.jsx'
import { db, isFirebaseConfigured } from '../firebase.js'
import { fallbackProducts } from '../data/products.js'

function normalizeProduct(document) {
  const data = document.data()

  return {
    id: document.id,
    title: data.title,
    category: data.category || 'General',
    image: data.image,
    price: Number(data.price),
    rating: Number(data.rating),
  }
}

function Home() {
  const [products, setProducts] = useState(fallbackProducts)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortMode, setSortMode] = useState('featured')
  const [searchParams] = useSearchParams()
  const searchTerm = (searchParams.get('q') || '').trim().toLowerCase()

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      if (!isFirebaseConfigured || !db) {
        return
      }

      try {
        const productsQuery = query(collection(db, 'products'), orderBy('title'))
        const snapshot = await getDocs(productsQuery)
        const firestoreProducts = snapshot.docs.map(normalizeProduct).filter((product) => product.title)

        if (isMounted && firestoreProducts.length > 0) {
          setProducts(firestoreProducts)
        }
      } catch (error) {
        console.warn('Using local products because Firestore products could not be loaded.', error)
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category || 'General')))],
    [products],
  )

  const visibleProducts = useMemo(() => {
    const filteredProducts = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm)
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    return [...filteredProducts].sort((firstProduct, secondProduct) => {
      if (sortMode === 'price-low') {
        return firstProduct.price - secondProduct.price
      }

      if (sortMode === 'price-high') {
        return secondProduct.price - firstProduct.price
      }

      if (sortMode === 'rating') {
        return secondProduct.rating - firstProduct.rating
      }

      return 0
    })
  }, [products, searchTerm, selectedCategory, sortMode])

  return (
    <main className="home">
      <section className="home__hero" aria-label="Amazon deals">
        <img
          className="home__heroImage"
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1800&q=80"
          alt="Online shopping packages and electronics"
        />
      </section>

      <section className="home__controls" aria-label="Product filters and sorting">
        <div className="home__filterGroup">
          {categories.map((category) => (
            <button
              className={`home__filterButton${selectedCategory === category ? ' home__filterButton--active' : ''}`}
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <label className="home__sortLabel" htmlFor="product-sort">
          Sort
          <select id="product-sort" value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </label>
      </section>

      <section className="home__products" aria-live="polite">
        {visibleProducts.length === 0 && (
          <p className="home__status">No products match your search.</p>
        )}
        {visibleProducts.map((product) => (
          <Product
            key={product.id}
            id={product.id}
            title={product.title}
            category={product.category}
            image={product.image}
            price={product.price}
            rating={product.rating}
          />
        ))}
      </section>
    </main>
  )
}

export default Home
