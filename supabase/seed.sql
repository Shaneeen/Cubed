-- Seed starter categories for Cubed
insert into categories (name, slug)
values
  ('Accessories', 'accessories'),
  ('Beauty', 'beauty'),
  ('Collectibles', 'collectibles'),
  ('Handmade', 'handmade'),
  ('Home Decor', 'home-decor')
on conflict (slug) do nothing;
