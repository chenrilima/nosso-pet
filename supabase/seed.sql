insert into public.business_settings (id, name, short_name, phone, phone_raw, whatsapp, whatsapp_raw, instagram_handle, instagram_url, address_line, district, city, state, postal_code, maps_url, maps_embed_url, hours)
values ('10000000-0000-4000-8000-000000000001', 'Nosso Pet Banho e Tosa', 'Nosso Pet', '(11) 4558-3210', '1145583210', '(11) 96644-2719', '5511966442719', '@nossopet_taboao', 'https://instagram.com/nossopet_taboao', 'Estr. São Francisco, 1111', 'Parque Taboão', 'Taboão da Serra', 'SP', '06765-000', 'https://www.google.com/maps/search/?api=1&query=Estr.+São+Francisco,+1111,+Taboão+da+Serra,+SP', 'https://www.google.com/maps?q=Estr.%20S%C3%A3o%20Francisco%2C%201111%2C%20Tabo%C3%A3o%20da%20Serra%2C%20SP&output=embed', null)
on conflict (id) do update set
  name = excluded.name, short_name = excluded.short_name, phone = excluded.phone, phone_raw = excluded.phone_raw,
  whatsapp = excluded.whatsapp, whatsapp_raw = excluded.whatsapp_raw, instagram_handle = excluded.instagram_handle,
  instagram_url = excluded.instagram_url, address_line = excluded.address_line, district = excluded.district,
  city = excluded.city, state = excluded.state, postal_code = excluded.postal_code, maps_url = excluded.maps_url,
  maps_embed_url = excluded.maps_embed_url, hours = excluded.hours;

insert into public.categories (id, name, slug, sort_order) values
('20000000-0000-4000-8000-000000000001', 'Rações', 'racoes', 0),
('20000000-0000-4000-8000-000000000002', 'Petiscos', 'petiscos', 1),
('20000000-0000-4000-8000-000000000003', 'Higiene', 'higiene', 2),
('20000000-0000-4000-8000-000000000004', 'Brinquedos', 'brinquedos', 3),
('20000000-0000-4000-8000-000000000005', 'Acessórios', 'acessorios', 4)
on conflict (id) do update set name = excluded.name, slug = excluded.slug, sort_order = excluded.sort_order;

insert into public.products (id, category_id, name, slug, description, sort_order) values
('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'Ração para cães', 'racao', 'Opções para diferentes portes e fases da vida.', 0),
('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'Petiscos', 'petisco', 'Recompensas saborosas para o seu melhor amigo.', 1),
('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', 'Cuidados de higiene', 'shampoo', 'Produtos para a rotina de limpeza e bem-estar.', 2),
('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000004', 'Brinquedos', 'brinquedo', 'Diversão e estímulo para cães e gatos.', 3),
('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000005', 'Acessórios', 'acessorio', 'Itens úteis e cheios de personalidade.', 4)
on conflict (id) do update set category_id = excluded.category_id, name = excluded.name, slug = excluded.slug,
  description = excluded.description, sort_order = excluded.sort_order;

insert into public.services (id, name, slug, description, icon_key, is_bookable, sort_order) values
('40000000-0000-4000-8000-000000000001', 'Banho', 'banho', 'Higiene completa com cuidado e carinho.', 'bath', true, 0),
('40000000-0000-4000-8000-000000000002', 'Tosa', 'tosa', 'Acabamento confortável e adequado ao seu pet.', 'scissors', true, 1),
('40000000-0000-4000-8000-000000000003', 'Banho + Tosa', 'banho-tosa', 'O cuidado completo em um só atendimento.', 'sparkles', true, 2),
('40000000-0000-4000-8000-000000000004', 'Tosa higiênica', 'tosa-higienica', 'Mais conforto e higiene para o dia a dia.', 'shield_check', true, 3),
('40000000-0000-4000-8000-000000000005', 'Hidratação', 'hidratacao', 'Cuidado especial para pele e pelagem.', 'droplets', true, 4),
('40000000-0000-4000-8000-000000000006', 'Corte de unhas', 'corte-de-unhas', 'Feito com atenção e segurança.', 'paw_print', true, 5),
('40000000-0000-4000-8000-000000000007', 'TaxiPet', 'taxipet', 'Buscamos e levamos seu pet com mais comodidade.', 'car', false, 6),
('40000000-0000-4000-8000-000000000008', 'Consultório veterinário', 'consultorio-veterinario', 'Atendimento veterinário mediante consulta de disponibilidade.', 'stethoscope', true, 7)
on conflict (id) do update set name = excluded.name, slug = excluded.slug, description = excluded.description,
  icon_key = excluded.icon_key, is_bookable = excluded.is_bookable, sort_order = excluded.sort_order;

insert into public.faqs (id, question, answer, sort_order) values
('50000000-0000-4000-8000-000000000001', 'Preciso agendar banho e tosa?', 'Recomendamos solicitar o atendimento pelo site ou WhatsApp para nossa equipe confirmar o melhor horário.', 0),
('50000000-0000-4000-8000-000000000002', 'Quanto tempo demora?', 'O tempo varia conforme o serviço e as características do pet. Nossa equipe informa uma estimativa ao confirmar.', 1),
('50000000-0000-4000-8000-000000000003', 'O valor depende do tamanho do pet?', 'Os valores podem variar conforme porte, pelagem e serviço. Consulte nossa equipe para uma avaliação correta.', 2),
('50000000-0000-4000-8000-000000000004', 'Vocês possuem TaxiPet?', 'Sim. Consulte disponibilidade informando seu bairro, pet, serviço e data desejada.', 3),
('50000000-0000-4000-8000-000000000005', 'Vocês atendem gatos?', 'Confirme com nossa equipe o serviço desejado e a disponibilidade para o seu gato.', 4),
('50000000-0000-4000-8000-000000000006', 'Como funciona o atendimento veterinário?', 'O atendimento é realizado mediante consulta de disponibilidade. Fale conosco para mais informações.', 5),
('50000000-0000-4000-8000-000000000007', 'Quais formas de pagamento são aceitas?', 'Entre em contato com nossa equipe pelo WhatsApp para confirmar as formas disponíveis.', 6)
on conflict (id) do update set question = excluded.question, answer = excluded.answer, sort_order = excluded.sort_order;
