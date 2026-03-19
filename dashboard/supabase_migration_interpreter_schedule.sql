-- Interpreter daily schedule table
CREATE TABLE IF NOT EXISTS interpreter_schedule (
    schedule_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    interpreter_id  UUID REFERENCES interpreters(interpreter_id),
    scheduled_date  DATE NOT NULL,
    time_slot       VARCHAR(50),
    description     VARCHAR(200) NOT NULL,
    description_ko  VARCHAR(200),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interp_sched_date ON interpreter_schedule(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_interp_sched_patient ON interpreter_schedule(patient_id);

ALTER TABLE interpreter_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_interp_sched" ON interpreter_schedule FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_interp_sched" ON interpreter_schedule FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_interp_sched" ON interpreter_schedule FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_interp_sched" ON interpreter_schedule FOR DELETE TO anon USING (true);
