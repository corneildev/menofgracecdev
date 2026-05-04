import * as React from 'react'
import { render } from '@react-email/components'
import { WebhookError, verifyWebhookRequest } from '@lovable.dev/webhooks-js'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { OrderConfirmationEmail } from '@/lib/email-templates/order-confirmation'

const SITE_NAME = "Men of Grace"
const FROM_DOMAIN = "notify.menofgrace.store"
const SENDER_DOMAIN = "notify.menofgrace.store"

export const Route = createFileRoute("/lovable/email/order/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!apiKey || !supabaseUrl || !supabaseServiceKey) {
          console.error('Server configuration error')
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        // Verify webhook (if we use Database Webhooks, the payload structure might differ, 
        // but for now we follow the auth pattern)
        let payload: any
        try {
          // Note: In a real Database Webhook from Supabase, the payload is simple JSON.
          // We might need a different verification or a simple API Key check.
          const authHeader = request.headers.get('x-api-key')
          if (authHeader !== apiKey) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
          }
          payload = await request.json()
        } catch (error) {
          return Response.json({ error: 'Invalid payload' }, { status: 400 })
        }

        // Database webhook payload from Supabase:
        // { type: 'INSERT', table: 'orders', record: { ... }, ... }
        const order = payload.record
        if (!order || !order.id || !order.customer_email) {
          return Response.json({ error: 'Incomplete order data' }, { status: 400 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Fetch order items
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('product_name, quantity, unit_price_fcfa, size, product_image')
          .eq('order_id', order.id)

        if (itemsError) {
          console.error('Failed to fetch order items', itemsError)
          return Response.json({ error: 'Failed to fetch order items' }, { status: 500 })
        }

        // Render template
        const element = React.createElement(OrderConfirmationEmail, {
          orderNumber: order.order_number,
          customerName: order.customer_full_name || 'Client',
          items: items || [],
          totalFcfa: order.total_fcfa,
          shippingAddress: order.shipping_address || '',
          shippingCity: order.shipping_city || '',
        })

        const html = await render(element)
        const text = await render(element, { plainText: true })

        const messageId = crypto.randomUUID()

        // Log pending
        await supabase.from('email_send_log').insert({
          message_id: messageId,
          template_name: 'order_confirmation',
          recipient_email: order.customer_email,
          status: 'pending',
        })

        // Enqueue
        const { error: enqueueError } = await supabase.rpc('enqueue_email', {
          queue_name: 'transactional_emails',
          payload: {
            message_id: messageId,
            to: order.customer_email,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject: `Confirmation de votre commande ${order.order_number}`,
            html,
            text,
            purpose: 'transactional',
            label: 'order_confirmation',
            queued_at: new Date().toISOString(),
          },
        })

        if (enqueueError) {
          console.error('Failed to enqueue order email', enqueueError)
          return Response.json({ error: 'Failed to enqueue' }, { status: 500 })
        }

        return Response.json({ success: true, queued: true })
      },
    },
  },
})
