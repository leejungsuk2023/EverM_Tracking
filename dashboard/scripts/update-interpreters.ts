// Run: npx tsx scripts/update-interpreters.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vgfexahkotdzdhscqkxa.supabase.co',
  'sb_publishable_ZiGI0xMvnNUmXaDN7rW3Hg_sxaRkB6i'
);

async function updateInterpreters() {
  console.log('=== Updating interpreters ===\n');

  // Step 1: Null out all interpreter_id references in patients (release FK)
  console.log('Step 1: Releasing FK - setting all patients.interpreter_id to null...');
  const { error: nullErr } = await supabase
    .from('patients')
    .update({ interpreter_id: null })
    .neq('patient_id', '00000000-0000-0000-0000-000000000000');
  if (nullErr) throw new Error(`Failed to null interpreter_id: ${nullErr.message}`);
  console.log('  ✓ All patients.interpreter_id set to null\n');

  // Step 2: Delete all interpreters
  console.log('Step 2: Deleting all existing interpreters...');
  const { error: delErr } = await supabase
    .from('interpreters')
    .delete()
    .neq('interpreter_id', '00000000-0000-0000-0000-000000000000');
  if (delErr) throw new Error(`Failed to delete interpreters: ${delErr.message}`);
  console.log('  ✓ All interpreters deleted\n');

  // Step 3: Insert 3 new interpreters
  console.log('Step 3: Inserting 3 new interpreters...');
  const { data: interpreters, error: insertErr } = await supabase
    .from('interpreters')
    .insert([
      { name: '이정석', languages: ['Korean'] },
      { name: '쁘랑', languages: ['Thai', 'Korean'] },
      { name: '승혜', languages: ['Thai', 'Korean'] },
    ])
    .select();
  if (insertErr) throw new Error(`Failed to insert interpreters: ${insertErr.message}`);

  console.log('  ✓ Inserted interpreters:');
  for (const i of interpreters!) {
    console.log(`    - ${i.name} (${i.languages.join(', ')}) → ${i.interpreter_id}`);
  }

  console.log('\n=== Done ===');
}

updateInterpreters().catch(err => {
  console.error('\nFailed:', err.message ?? err);
  process.exit(1);
});
