-- profiles table: extends auth.users with user metadata

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  company text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

comment on table public.profiles is 'User profiles extending auth.users with additional metadata for event organizers and attendees.';
