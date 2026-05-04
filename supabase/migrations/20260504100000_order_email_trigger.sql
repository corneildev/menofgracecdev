-- Trigger to send order confirmation email via webhook
CREATE OR REPLACE FUNCTION public.on_order_created_send_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_webhook_url text;
  v_api_key text;
BEGIN
  -- We assume these are set in the vault or as GUC variables.
  -- For now, we'll try to get them from a config table or hardcode for dev if needed.
  -- But usually, it's better to use a dedicated function to get secrets.
  
  -- In this environment, we'll assume the URL is https://menofgrace.store/lovable/email/order/webhook
  -- and we'll use the service_role or a dedicated secret.
  
  v_webhook_url := 'https://menofgrace.store/lovable/email/order/webhook';
  
  -- Get API key from vault if possible, or just skip if not set
  -- For the sake of this task, we'll just attempt the call.
  -- The user will need to configure the actual URL and Key in production.
  
  PERFORM extensions.http_post(
    url := v_webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-api-key', current_setting('app.lovable_api_key', true)
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'orders',
      'record', row_to_json(NEW)
    )
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_created_email ON public.orders;
CREATE TRIGGER trg_order_created_email
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.on_order_created_send_email();
