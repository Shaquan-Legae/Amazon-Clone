import Product from './Product.jsx'
import { fallbackProducts } from '../data/products.js'
import { useStateValue } from '../StateProvider.js'

function RecommendedProducts() {
  const [{ basket }] = useStateValue()
  const basketIds = new Set(basket.map((item) => item.id))
  const basketCategories = new Set(
    basket
      .map((item) => item.category || fallbackProducts.find((product) => product.id === item.id)?.category)
      .filter(Boolean),
  )

  const recommendations = fallbackProducts
    .filter((product) => basketCategories.has(product.category) && !basketIds.has(product.id))
    .slice(0, 4)

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className="recommendations" aria-label="You May Also Like">
      <h2>You May Also Like</h2>
      <div className="recommendations__grid">
        {recommendations.map((product) => (
          <Product
            key={product.id}
            id={product.id}
            title={product.title}
            image={product.image}
            price={product.price}
            rating={product.rating}
            category={product.category}
          />
        ))}
      </div>
    </section>
  )
}

export default RecommendedProducts
