// API route to fetch product details
// This runs on the server and can use the Shopify client safely


import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/shopify/serverClient";
import { getProductByHandle } from "@/lib/shopify/graphql/product";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const handle = searchParams.get("handle");

  if (!handle) {
    return NextResponse.json(
      { error: "Product handle is required" },
      { status: 400 }
    );
  }

  try {
    const response = await client.request(getProductByHandle, {
      variables: { handle }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}