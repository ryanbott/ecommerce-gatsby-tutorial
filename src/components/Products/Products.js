import React, { Component } from 'react'
import { graphql, StaticQuery } from 'gatsby'
import ProductCard from './ProductCard'

const conatinerStyles = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  padding: '1rem 0 1rem 0',
}

class Products extends Component {
  state = {
    stripe: null,
  }

  // Initialise Stripe.js with your publishable key.
  // You can find your key in the Dashboard:
  // https://dashboard.stripe.com/account/apikeys
  componentDidMount() {
    const stripe = window.Stripe(process.env.GATSBY_STRIPE_PUBLIC_KEY)
    this.setState({ stripe })
  }

  render() {
    return (
      <StaticQuery
        query={graphql`
          query AllProducts {
            skus: allStripeSku {
              edges {
                node {
                  id
                  image
                  price
                  currency
                  attributes {
                    name
                  }
                  product {
                    name
                    id
                  }
                }
              }
            }
            products: allStripeProduct(sort: {fields: id}) {
              edges {
                node {
                  name
                  id
                  metadata {
                    Subtitle
                    Details
                  }
                }
              }
            }
          }
        `}
        render={({ products, skus }) => (
          <div style={conatinerStyles}>
            {products.edges.map(({ node: product }) => {

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  skus={skus}
                  stripe={this.state.stripe}
                />
              )

            })}
          </div>
        )}
      />
    )
  }
}

export default Products
