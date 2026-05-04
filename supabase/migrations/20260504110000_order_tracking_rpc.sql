CREATE OR REPLACE FUNCTION public.track_order(
  p_order_number text,
  p_identifier text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  -- We search by order number AND (email OR phone)
  SELECT 
    id, 
    order_number, 
    status, 
    created_at, 
    customer_full_name,
    total_fcfa
  INTO v_order
  FROM public.orders
  WHERE order_number = p_order_number 
    AND (
      customer_email = p_identifier 
      OR guest_email = p_identifier 
      OR customer_phone = p_identifier
      -- Flexible phone match (optional, but good for UX if they enter +225...)
      OR replace(customer_phone, ' ', '') = replace(p_identifier, ' ', '')
    )
  LIMIT 1;

  IF v_order.id IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'status', v_order.status,
    'created_at', v_order.created_at,
    'customer_name', v_order.customer_full_name,
    'total_fcfa', v_order.total_fcfa
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO anon, authenticated;
