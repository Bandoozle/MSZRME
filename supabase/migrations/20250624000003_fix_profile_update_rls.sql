-- Fix profile self-update (onboarding was blocked by RLS subquery on UPDATE)

drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.profiles_block_self_role_change()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() = old.id and new.role is distinct from old.role then
    raise exception 'Cannot change your own role';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_block_self_role_change on public.profiles;
create trigger profiles_block_self_role_change
  before update on public.profiles
  for each row execute function public.profiles_block_self_role_change();

create or replace function public.complete_onboarding(
  p_display_name text,
  p_business_name text,
  p_stage text
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update public.profiles
  set
    display_name = coalesce(nullif(trim(p_display_name), ''), display_name),
    business_name = coalesce(nullif(trim(p_business_name), ''), business_name),
    stage = coalesce(nullif(trim(p_stage), ''), stage),
    first_time = false
  where id = auth.uid()
  returning * into result;

  if not found then
    raise exception 'Profile not found';
  end if;

  return result;
end;
$$;

revoke all on function public.complete_onboarding(text, text, text) from public;
grant execute on function public.complete_onboarding(text, text, text) to authenticated;
