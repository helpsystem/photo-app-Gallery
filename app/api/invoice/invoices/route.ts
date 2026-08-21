import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/invoice/invoices - Get all invoices for current user
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(invoices || []);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST /api/invoice/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_address,
      subtotal,
      discount_type,
      discount_value,
      discount_amount,
      tax_rate,
      tax_amount,
      total,
      status,
      notes,
      items
    } = body;

    // Get next invoice number
    const { data: invoiceNumber } = await supabase
      .rpc('get_next_invoice_number', { p_user_id: user.id });

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        customer_name,
        customer_email,
        customer_address,
        subtotal,
        discount_type,
        discount_value,
        discount_amount,
        tax_rate,
        tax_amount,
        total,
        status: status || 'draft',
        notes,
        user_id: user.id
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Create invoice items
    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any) => ({
        invoice_id: invoice.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_category: item.product_category,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;
    }

    // Fetch the complete invoice with items
    const { data: completeInvoice } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (*)
      `)
      .eq('id', invoice.id)
      .single();

    return NextResponse.json(completeInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

// PUT /api/invoice/invoices - Update an invoice
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      customer_name,
      customer_email,
      customer_address,
      subtotal,
      discount_type,
      discount_value,
      discount_amount,
      tax_rate,
      tax_amount,
      total,
      status,
      notes,
      items
    } = body;

    // Update invoice
    const { error: invoiceError } = await supabase
      .from('invoices')
      .update({
        customer_name,
        customer_email,
        customer_address,
        subtotal,
        discount_type,
        discount_value,
        discount_amount,
        tax_rate,
        tax_amount,
        total,
        status,
        notes
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (invoiceError) throw invoiceError;

    // Delete existing items
    await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);

    // Create new items
    if (items && items.length > 0) {
      const itemsToInsert = items.map((item: any) => ({
        invoice_id: id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_category: item.product_category,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;
    }

    // Fetch the updated invoice with items
    const { data: updatedInvoice } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items (*)
      `)
      .eq('id', id)
      .single();

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// DELETE /api/invoice/invoices?id=xxx
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
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
