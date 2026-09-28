import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE!;
  const supabase = createClient(url, key);
  const { error } = await supabase.from('exhibitions').delete().eq('id', 14);
  console.log(error ? 'Erreur: ' + error.message : 'Expo 14 supprimée ✓');
}
main();
