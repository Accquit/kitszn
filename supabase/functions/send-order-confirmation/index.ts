
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simplified types for the edge function to avoid import issues
type JerseyCustomization = {
  color?: string;
  playerName?: string;
  playerNumber?: string;
};

type OrderItem = {
  id: number;
  order_id: string;
  product_id: number | null;
  quantity: number;
  price: number;
  customization: Partial<JerseyCustomization> | null;
  products: {
    name: string | null;
    image_url: string | null;
  } | null;
};

type Order = {
  id: string;
  user_id: string | null;
  total: number;
  status: string;
  created_at: string;
  shipping_address: unknown;
  customer_name: string | null;
  customer_email: string | null;
  order_items: OrderItem[];
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();
    console.log(`Received request to send confirmation for order ID: ${orderId}`);

    if (!orderId) {
      throw new Error("orderId is required");
    }
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
    });

    console.log("Fetching order details...");
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url
          )
        )
      `)
      .eq("id", orderId)
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error("Order not found");
    console.log("Order details fetched successfully.");

    const typedOrder = order as Order;

    const customerEmail = typedOrder.customer_email;
    if (!customerEmail) {
      console.error("Customer email not found for order:", typedOrder.id);
      throw new Error("Customer email not found for this order.");
    }
    
    const orderNumber = `JT-${typedOrder.id.split("-")[0].toUpperCase()}`;

    const itemsHtml = typedOrder.order_items.map(item => {
      let customizationDetails = '';
      if (item.customization) {
        const custom = item.customization as Partial<JerseyCustomization>;
        const playerName = custom.playerName ? `Name: ${custom.playerName}` : '';
        const playerNumber = custom.playerNumber ? `Number: ${custom.playerNumber}` : '';
        if (playerName || playerNumber) {
          customizationDetails = `<br/><small>Custom: ${[playerName, playerNumber].filter(Boolean).join(', ')}</small>`;
        }
      }

      return `
        <tr>
          <td style="padding: 5px 0;">${item.products?.name} (Qty: ${item.quantity}) ${customizationDetails}</td>
          <td style="text-align: right; padding: 5px 0;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const shippingAddress = typedOrder.shipping_address as any;

    const emailHtml = `
      <html style="font-family: sans-serif;">
        <body style="margin: 20px;">
          <h1>Your Order #${orderNumber} is confirmed!</h1>
          <p>Hi ${typedOrder.customer_name},</p>
          <p>Thank you for your order. We've received it and are getting it ready for shipment.</p>
          
          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Summary</h2>
          <table width="100%" style="border-collapse: collapse;">
            ${itemsHtml}
            <tr><td colspan="2" style="padding-top: 10px;"><hr style="border: none; border-top: 1px solid #eee;"/></td></tr>
            <tr style="font-weight: bold;">
              <td style="padding: 5px 0;"><strong>Total</strong></td>
              <td style="text-align: right; padding: 5px 0;"><strong>₹${typedOrder.total.toFixed(2)}</strong></td>
            </tr>
          </table>

          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 30px;">Shipping to:</h2>
          <p style="line-height: 1.5;">
            ${typedOrder.customer_name}<br/>
            ${shippingAddress?.address}<br/>
            ${shippingAddress?.city}, ${shippingAddress?.state} ${shippingAddress?.zipCode}<br/>
            ${shippingAddress?.country}
          </p>

          <p>We'll notify you again once your order has shipped.</p>
          <p>Thanks,<br/>The Jersey Town Team</p>
        </body>
      </html>
    `;
    
    console.log(`Sending email to ${customerEmail}...`);
    const emailResponse = await resend.emails.send({
      from: "Jersey Town <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Your Jersey Town Order #${orderNumber} is Confirmed`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
