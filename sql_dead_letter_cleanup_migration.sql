-- Enable the pg_cron extension if not already enabled
create extension if not exists pg_cron;

-- Create the cleanup function
create or replace function cleanup_zombie_scrapes()
returns void
language plpgsql
security definer
as $$
begin
  update public.domains
  set status = 'failed'
  where status = 'active'
  and updated_at < now() - interval '15 minutes';
end;
$$;

-- Schedule it to run every 10 minutes
select cron.schedule(
  'cleanup-zombie-scrapes-job',
  '*/10 * * * *', -- Every 10 minutes
  'select cleanup_zombie_scrapes();'
);
