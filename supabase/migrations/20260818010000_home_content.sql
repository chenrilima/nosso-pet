alter table public.business_settings
  add column hero_title text not null default 'Seu pet cuidado como parte da',
  add column hero_highlight text not null default 'família.',
  add column hero_description text not null default 'Banho, tosa, cuidados, produtos e muito carinho para o seu melhor amigo.',
  add column hero_primary_cta text not null default 'Agendar atendimento',
  add column hero_secondary_cta text not null default 'Conhecer serviços',
  add column about_title text not null default 'Cuidado, carinho e confiança em cada atendimento.',
  add column about_description text not null default 'Uma rotina de cuidados mais tranquila para tutores e animais.',
  add column about_feature_one_title text not null default 'Atendimento acolhedor',
  add column about_feature_two_title text not null default 'Informação com clareza',
  add column footer_description text not null default 'Cuidado, carinho e praticidade para pets.',
  add column footer_contact_title text not null default 'Fale com a gente',
  add column footer_location_title text not null default 'Onde estamos',
  add column taxipet_title text not null default 'Seu pet vai e volta com conforto.',
  add column taxipet_region text,
  add column taxipet_note text,
  add column taxipet_cta text not null default 'Consultar TaxiPet',
  add constraint business_settings_hero_title_length check (char_length(hero_title) between 1 and 120),
  add constraint business_settings_hero_highlight_length check (char_length(hero_highlight) between 1 and 60),
  add constraint business_settings_hero_description_length check (char_length(hero_description) between 1 and 400),
  add constraint business_settings_hero_ctas_length check (char_length(hero_primary_cta) between 1 and 60 and char_length(hero_secondary_cta) between 1 and 60),
  add constraint business_settings_about_content_length check (char_length(about_title) between 1 and 160 and char_length(about_description) between 1 and 1000),
  add constraint business_settings_about_features_length check (char_length(about_feature_one_title) between 1 and 100 and char_length(about_feature_two_title) between 1 and 100),
  add constraint business_settings_footer_content_length check (char_length(footer_description) between 1 and 400 and char_length(footer_contact_title) between 1 and 80 and char_length(footer_location_title) between 1 and 80),
  add constraint business_settings_taxipet_content_length check (char_length(taxipet_title) between 1 and 160 and char_length(taxipet_cta) between 1 and 60),
  add constraint business_settings_taxipet_optional_length check ((taxipet_region is null or char_length(taxipet_region) between 1 and 160) and (taxipet_note is null or char_length(taxipet_note) between 1 and 400));

update public.business_settings
set
  hero_description = format('Banho, tosa, cuidados, produtos e muito carinho para o seu melhor amigo em %s.', city),
  about_description = format('A %s está perto das famílias de %s, oferecendo uma rotina de cuidados mais tranquila para tutores e animais.', short_name, city),
  footer_description = format('Cuidado, carinho e praticidade para pets em %s.', city),
  taxipet_region = format('%s e região', city),
  taxipet_note = 'O valor e a região de atendimento são confirmados pela equipe.';
