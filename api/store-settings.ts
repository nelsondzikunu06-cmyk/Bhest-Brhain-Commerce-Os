import { supabase, json } from './_lib/supabase';

export default async function handler() {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);

      return json(
        {
          error: 'Could not load store settings.'
        },
        500
      );
    }

    return json({
      settings: data || {
        free_delivery_threshold: 800,
        default_delivery_fee: 30
      }
    });
  } catch {
    return json(
      {
        error: 'Internal server error.'
      },
      500
    );
  }
}
