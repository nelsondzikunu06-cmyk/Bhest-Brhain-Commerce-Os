import { supabase, json } from './_lib/supabase';

export default async function handler() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', {
        ascending: false
      });

    if (error) {
      console.error(error);

      return json(
        {
          error: 'Could not load products.'
        },
        500
      );
    }

    return json({
      products: data || []
    });
  } catch (error) {
    console.error(error);

    return json(
      {
        error: 'Internal server error.'
      },
      500
    );
  }
}
