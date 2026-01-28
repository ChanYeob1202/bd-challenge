import { client } from "@/lib/shopify/serverClient";
import { getAllProducts } from "@/lib/shopify/graphql/products";
import { ProductGrid } from "./components/ProductGrid";

export default async function Home() {
  const resp = await client.request(getAllProducts, {
    variables: {
      first: 20
    }
  });
  console.log(resp)  
  const products = resp.data?.products?.edges.map(edge => edge.node) || [];

  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold   mb-8 text-center  text-gray-900">Products</h1>
        
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-gray-600">No products found</p>
        )}
      </div>
    </main>
  );
}


