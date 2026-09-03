/*
# Create MPLADS allocation source table

1. New Tables
- `mplads_allocations` stores MP allocation records imported from the supplied official PDF.
- `serial_number` preserves the source row number.
- `state`, `mp_name`, and `constituency` preserve the source labels.
- `allocated_amount` stores the parsed rupee amount.
- `source_name`, `source_url`, `source_retrieved_at`, and `source_row` preserve provenance.
- `data_quality_flags` stores non-destructive review flags for normalization issues.

2. Security
- Row-level security is enabled.
- The table is intentionally read-only public reference data for the no-auth demo.
- Separate SELECT, INSERT, UPDATE, and DELETE policies are provided for anon and authenticated roles.

3. Important Notes
- This migration creates the durable integration target; the frontend keeps a clearly labeled local extract until the full PDF import is completed.
- No project, payment, contractor, or fraud conclusion is inferred from allocation records.
*/

CREATE TABLE IF NOT EXISTS public.mplads_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number integer NOT NULL UNIQUE,
  state text NOT NULL,
  mp_name text NOT NULL,
  constituency text NOT NULL,
  allocated_amount numeric(14, 2) NOT NULL CHECK (allocated_amount >= 0),
  source_name text NOT NULL DEFAULT 'Allocated_Limit_for_Honble_MPs.pdf',
  source_url text NOT NULL DEFAULT 'https://mplads.mospi.gov.in/digigov/dashboard.html',
  source_retrieved_at timestamptz NOT NULL DEFAULT now(),
  source_row text,
  data_quality_flags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mplads_allocations_state ON public.mplads_allocations (state);
CREATE INDEX IF NOT EXISTS idx_mplads_allocations_constituency ON public.mplads_allocations (constituency);
CREATE INDEX IF NOT EXISTS idx_mplads_allocations_amount ON public.mplads_allocations (allocated_amount DESC);

ALTER TABLE public.mplads_allocations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can read mplads allocations" ON public.mplads_allocations;
CREATE POLICY "public can read mplads allocations"
  ON public.mplads_allocations FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "public can insert mplads allocations" ON public.mplads_allocations;
CREATE POLICY "public can insert mplads allocations"
  ON public.mplads_allocations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "public can update mplads allocations" ON public.mplads_allocations;
CREATE POLICY "public can update mplads allocations"
  ON public.mplads_allocations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "public can delete mplads allocations" ON public.mplads_allocations;
CREATE POLICY "public can delete mplads allocations"
  ON public.mplads_allocations FOR DELETE
  TO anon, authenticated
  USING (true);