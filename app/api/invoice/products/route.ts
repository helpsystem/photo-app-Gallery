import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/products - Get all products for current user
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        pricing_tiers (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform to match frontend structure
    const transformedProducts = products?.map(product => ({
      ...product,
      pricingTiers: product.pricing_tiers || []
    }));

    return NextResponse.json(transformedProducts || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, details, pricingTiers } = body;

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name,
        category,
        details,
        user_id: user.id
      })
      .select()
      .single();

    if (productError) throw productError;

    // Create pricing tiers
    if (pricingTiers && pricingTiers.length > 0) {
      const tiersToInsert = pricingTiers.map((tier: any) => ({
        product_id: product.id,
        tier_name: tier.tierName,
        min_quantity: tier.minQuantity,
        price: tier.price
      }));

      const { error: tiersError } = await supabase
        .from('pricing_tiers')
        .insert(tiersToInsert);

      if (tiersError) throw tiersError;
    }

    // Fetch the complete product with tiers
    const { data: completeProduct } = await supabase
      .from('products')
      .select(`
        *,
        pricing_tiers (*)
      `)
      .eq('id', product.id)
      .single();

    return NextResponse.json({
      ...completeProduct,
      pricingTiers: completeProduct?.pricing_tiers || []
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT /api/products - Update a product
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, category, details, pricingTiers } = body;

    // Update product
    const { error: productError } = await supabase
      .from('products')
      .update({
        name,
        category,
        details
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (productError) throw productError;

    // Delete existing pricing tiers
    await supabase
      .from('pricing_tiers')
      .delete()
      .eq('product_id', id);

    // Create new pricing tiers
    if (pricingTiers && pricingTiers.length > 0) {
      const tiersToInsert = pricingTiers.map((tier: any) => ({
        product_id: id,
        tier_name: tier.tierName,
        min_quantity: tier.minQuantity,
        price: tier.price
      }));

      const { error: tiersError } = await supabase
        .from('pricing_tiers')
        .insert(tiersToInsert);

      if (tiersError) throw tiersError;
    }

    // Fetch the updated product with tiers
    const { data: updatedProduct } = await supabase
      .from('products')
      .select(`
        *,
        pricing_tiers (*)
      `)
      .eq('id', id)
      .single();

    return NextResponse.json({
      ...updatedProduct,
      pricingTiers: updatedProduct?.pricing_tiers || []
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
