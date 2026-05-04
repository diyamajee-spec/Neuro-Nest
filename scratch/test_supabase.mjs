import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cuyxoammxoxhxeivbeup.supabase.co';
const supabaseKey = 'sb_publishable_IRNfFfHV5XoQmX2SPkRdTw_IXTaU0DQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  try {
    const { data, error } = await supabase.from('nodes').select('*').limit(1);
    if (error) {
      console.error('Supabase Error:', error);
    } else {
      console.log('Supabase Data:', data);
    }
  } catch (error) {
    console.error('Supabase Catch Error:', error);
  }
}

testSupabase();
