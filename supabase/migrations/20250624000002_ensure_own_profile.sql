-- Repair missing profiles (e.g. user in auth.users but no profiles row)

create or replace function public.ensure_own_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.profiles;
  auth_user auth.users;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into result from public.profiles where id = auth.uid();
  if found then
    return result;
  end if;

  select * into auth_user from auth.users where id = auth.uid();
  if not found then
    raise exception 'User not found';
  end if;

  insert into public.profiles (id, email, display_name, business_name, role, first_time)
  values (
    auth_user.id,
    coalesce(auth_user.email, ''),
    coalesce(auth_user.raw_user_meta_data->>'display_name', split_part(coalesce(auth_user.email, ''), '@', 1)),
    coalesce(auth_user.raw_user_meta_data->>'business_name', ''),
    'dealer',
    coalesce((auth_user.raw_user_meta_data->>'first_time')::boolean, true)
  )
  returning * into result;

  return result;
end;
$$;

revoke all on function public.ensure_own_profile() from public;
grant execute on function public.ensure_own_profile() to authenticated;
