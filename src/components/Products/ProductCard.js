import React from "react"

const CardStyles = {
  maxWidth: '20rem',
}


const formatPrice = (amount, currency) => {
  let price = (amount / 100)
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  return numberFormat.format(price)
}

const ProductCard = class extends React.Component {
  async redirectToCheckout(event, sku, quantity = 1) {
    event.preventDefault()
    const { error } = await this.props.stripe.redirectToCheckout({
      items: [{ sku, quantity }],
      successUrl: `${window.location.origin}/page-2/`,
      cancelUrl: `${window.location.origin}/advanced`,
    })

    console.log(event, sku.id)

    if (error) {
      console.warn('Error:', error)
    }
  }

  render() {
    const product = this.props.product
    const sku = this.props.skus.edges
    const productSkus = []

    sku.forEach(({node: sku}) => {
      if (sku.product.id === product.id) {
        productSkus.push(sku)
      }
    })

    const firstProduct = productSkus[0]

    return (
      <>
      <div style={CardStyles}>

        <img src={firstProduct.image} alt={product.name} />
        <h4>{product.name}</h4>
        <p>{product.metadata.Details}</p>

        <p><strong>{formatPrice(firstProduct.price, firstProduct.currency)}</strong> (Free Shipping!)</p>

        {sku.map(({node: sku}) => {
          if (sku.product.id === product.id) {
            return (
              <button
                key={sku.id}
                onClick={event => this.redirectToCheckout(event, sku.id)}
              >
                Buy {sku.attributes.name}
              </button>
            )
          }

          return
        })}

      </div>
      </>
    )
  }
}

export default ProductCard
