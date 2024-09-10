import supabase from '@/lib/supabase';

// Listen to changes in the "homeworks" table
const subscription = supabase
  .from('devoir')
  .on('INSERT', (payload) => {
    console.log('A new homework has been inserted:', payload.new);
    // Handle the new homework data
  })
  .subscribe();