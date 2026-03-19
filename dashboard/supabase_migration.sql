-- EverM Patient Dashboard Tables
-- NOTE: Do NOT modify existing chats/tasks tables (secretary bot)

-- Interpreters table
CREATE TABLE IF NOT EXISTS interpreters (
    interpreter_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    languages       TEXT[]
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    patient_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    k_name              VARCHAR(100) NOT NULL,
    full_name           VARCHAR(200) NOT NULL,
    nationality         VARCHAR(50) DEFAULT 'TH',
    surgery_type        VARCHAR(20) NOT NULL CHECK (surgery_type IN ('2JAW_SSRO', '2JAW_IVRO', 'VLINE', 'CONTOURING', 'ASO')),
    surgery_date        DATE,
    pipeline_stage      VARCHAR(30) NOT NULL DEFAULT 'CONSULTATION' CHECK (pipeline_stage IN ('CONSULTATION', 'BOOKING', 'DOCUMENT_COLLECTION', 'PREOP_PREP', 'ARRIVAL_HEALTH_CHECK', 'SURGERY', 'HOSPITALIZATION', 'DISCHARGE', 'FOLLOWUP_1', 'FOLLOWUP_2', 'FOLLOWUP_3', 'COMPLETE')),
    doc_passport        BOOLEAN DEFAULT FALSE,
    doc_flight_in       BOOLEAN DEFAULT FALSE,
    doc_flight_out      BOOLEAN DEFAULT FALSE,
    doc_hotel           BOOLEAN DEFAULT FALSE,
    doc_keta            BOOLEAN DEFAULT FALSE,
    deposit_paid        BOOLEAN DEFAULT FALSE,
    deposit_amount      NUMERIC(12, 2) DEFAULT 0,
    total_surgery_cost  NUMERIC(12, 2) DEFAULT 0,
    payment_status      VARCHAR(10) DEFAULT 'NONE' CHECK (payment_status IN ('NONE', 'PARTIAL', 'FULL')),
    exchange_method     VARCHAR(20) CHECK (exchange_method IN ('SELF', 'TEAM_ARRANGED', 'CARD_PLUS_10PCT')),
    arrival_date        DATE,
    discharge_date      DATE,
    interpreter_id      UUID REFERENCES interpreters(interpreter_id),
    notes               TEXT DEFAULT '',
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Followups table (PRD v2.0 핵심)
CREATE TABLE IF NOT EXISTS followups (
    followup_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID REFERENCES patients(patient_id) ON DELETE CASCADE,
    followup_number SMALLINT NOT NULL,
    scheduled_date  DATE NOT NULL,
    completed       BOOLEAN DEFAULT FALSE,
    completed_at    TIMESTAMPTZ,
    notes           TEXT DEFAULT '',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_followups_scheduled ON followups(scheduled_date, completed);
CREATE INDEX IF NOT EXISTS idx_followups_patient ON followups(patient_id);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    alert_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID REFERENCES patients(patient_id),
    alert_type      VARCHAR(100) NOT NULL,
    triggered_at    TIMESTAMPTZ DEFAULT NOW(),
    resolved        BOOLEAN DEFAULT FALSE,
    resolved_at     TIMESTAMPTZ
);

-- Pipeline change logs
CREATE TABLE IF NOT EXISTS pipeline_logs (
    log_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID REFERENCES patients(patient_id),
    from_stage      VARCHAR(30),
    to_stage        VARCHAR(30) NOT NULL,
    changed_at      TIMESTAMPTZ DEFAULT NOW(),
    note            TEXT
);

-- RLS policies (anon access for dashboard)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_patients" ON patients FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_patients" ON patients FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_patients" ON patients FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_patients" ON patients FOR DELETE TO anon USING (true);

ALTER TABLE followups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_followups" ON followups FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_followups" ON followups FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_followups" ON followups FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_followups" ON followups FOR DELETE TO anon USING (true);

ALTER TABLE interpreters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_interpreters" ON interpreters FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_interpreters" ON interpreters FOR INSERT TO anon WITH CHECK (true);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_alerts" ON alerts FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_alerts" ON alerts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_alerts" ON alerts FOR UPDATE TO anon USING (true) WITH CHECK (true);

ALTER TABLE pipeline_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_read_pipeline_logs" ON pipeline_logs FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_pipeline_logs" ON pipeline_logs FOR INSERT TO anon WITH CHECK (true);
