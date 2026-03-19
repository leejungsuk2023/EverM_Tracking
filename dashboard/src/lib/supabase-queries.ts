import { supabase } from './supabase';
import { Patient, Followup, Interpreter, PipelineStage, SurgeryType, FOLLOWUP_RULES } from '@/types/patient';

// --- Patients ---

export async function getPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Patient[];
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('patient_id', id)
    .single();
  if (error) throw error;
  return data as Patient | null;
}

export async function updatePatient(id: string, updates: Partial<Patient>): Promise<void> {
  const { error } = await supabase
    .from('patients')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('patient_id', id);
  if (error) throw error;
}

export async function updatePatientStage(
  id: string,
  fromStage: PipelineStage,
  toStage: PipelineStage
): Promise<void> {
  const { error: updateError } = await supabase
    .from('patients')
    .update({ pipeline_stage: toStage, updated_at: new Date().toISOString() })
    .eq('patient_id', id);
  if (updateError) throw updateError;

  const { error: logError } = await supabase.from('pipeline_logs').insert({
    patient_id: id,
    from_stage: fromStage,
    to_stage: toStage,
  });
  if (logError) throw logError;
}

// --- Followups ---

export async function getFollowups(patientId: string): Promise<Followup[]> {
  const { data, error } = await supabase
    .from('followups')
    .select('*')
    .eq('patient_id', patientId)
    .order('followup_number', { ascending: true });
  if (error) throw error;
  return data as Followup[];
}

export async function getAllFollowups(): Promise<(Followup & { patient: Patient })[]> {
  const { data, error } = await supabase
    .from('followups')
    .select('*, patient:patients(*)')
    .order('scheduled_date', { ascending: true });
  if (error) throw error;
  return data as (Followup & { patient: Patient })[];
}

export async function toggleFollowupComplete(
  followupId: string,
  completed: boolean,
  notes?: string
): Promise<void> {
  const updates: Partial<Followup> & { completed_at: string | null } = {
    completed,
    completed_at: completed ? new Date().toISOString() : null,
  };
  if (notes !== undefined) updates.notes = notes;

  const { error } = await supabase
    .from('followups')
    .update(updates)
    .eq('followup_id', followupId);
  if (error) throw error;
}

export async function generateFollowups(
  patientId: string,
  surgeryType: SurgeryType,
  surgeryDate: string
): Promise<void> {
  const rules = FOLLOWUP_RULES[surgeryType];
  const rows = rules.map((r, index) => ({
    patient_id: patientId,
    followup_number: index + 1,
    scheduled_date: addDays(surgeryDate, r.days),
    completed: false,
  }));

  const { error } = await supabase.from('followups').insert(rows);
  if (error) throw error;
}

export async function regenerateFollowups(
  patientId: string,
  surgeryType: SurgeryType,
  newSurgeryDate: string
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('followups')
    .delete()
    .eq('patient_id', patientId);
  if (deleteError) throw deleteError;

  await generateFollowups(patientId, surgeryType, newSurgeryDate);
}

// --- Documents ---

export async function updateDocumentStatus(
  patientId: string,
  docField: string,
  value: boolean
): Promise<void> {
  const { error } = await supabase
    .from('patients')
    .update({ [docField]: value, updated_at: new Date().toISOString() })
    .eq('patient_id', patientId);
  if (error) throw error;
}

// --- Interpreters ---

export async function getInterpreters(): Promise<Interpreter[]> {
  const { data, error } = await supabase
    .from('interpreters')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data as Interpreter[];
}

// --- Helpers ---

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
