import type { CatalogCategory, CatalogOptionGroup, Category } from "@/types/domain";

type GroupConfig = Omit<CatalogOptionGroup, "options"> & {
  options: readonly string[];
};
type CategoryConfig = { description: string; groups: readonly GroupConfig[] };

const group = (id: string, name: string, options: readonly string[], sortOrder: number): GroupConfig => ({
  id,
  name,
  isRequired: true,
  sortOrder,
  options,
});

export const catalogConfig: Readonly<Record<string, CategoryConfig>> = {
  racoes: {
    description: "Encontre opções adequadas ao perfil e à rotina do seu pet.",
    groups: [
      group("animal", "Pet", ["Cães", "Gatos"], 0),
      group("marca", "Marca", ["Premier", "Golden", "GranPlus", "Fórmula Natural", "Royal Canin", "Não sei"], 1),
      group("fase", "Fase", ["Filhote", "Adulto", "Sênior", "Castrado", "Não sei"], 2),
      group("tamanho", "Tamanho desejado", ["Pequeno", "Médio", "Grande", "Não sei"], 3),
    ],
  },
  petiscos: {
    description: "Recompensas e agrados para diferentes pets e preferências.",
    groups: [
      group("animal", "Pet", ["Cães", "Gatos"], 0),
      group("tipo", "Tipo", ["Biscoito", "Natural", "Dental", "Sachê", "Não sei"], 1),
      group("porte", "Porte", ["Pequeno", "Médio", "Grande", "Não se aplica"], 2),
    ],
  },
  higiene: {
    description: "Cuidados para limpeza, conforto e bem-estar no dia a dia.",
    groups: [
      group("animal", "Pet", ["Cães", "Gatos"], 0),
      group("tipo", "Tipo", ["Shampoo", "Condicionador", "Tapete higiênico", "Areia", "Outro"], 1),
      group("preferencia", "Preferência", ["Uso diário", "Pele sensível", "Controle de odores", "Não sei"], 2),
    ],
  },
  brinquedos: {
    description: "Diversão e estímulo escolhidos conforme o perfil do pet.",
    groups: [
      group("animal", "Pet", ["Cães", "Gatos"], 0),
      group("tipo", "Tipo", ["Bola", "Mordedor", "Pelúcia", "Interativo"], 1),
      group("porte", "Porte", ["Pequeno", "Médio", "Grande"], 2),
    ],
  },
  acessorios: {
    description: "Itens úteis para passeio, alimentação e rotina.",
    groups: [
      group("animal", "Pet", ["Cães", "Gatos"], 0),
      group("tipo", "Tipo", ["Coleira", "Guia", "Peitoral", "Comedouro", "Cama", "Outro"], 1),
      group("porte", "Porte", ["Pequeno", "Médio", "Grande", "Não sei"], 2),
    ],
  },
};

const normalizeSlug = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function buildCatalog(categories: Category[]): CatalogCategory[] {
  return [...categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => {
      const config = catalogConfig[category.slug] ?? {
        description: "Conte para nossa equipe o que você procura.",
        groups: [group("preferencia", "Preferência", ["Quero ajuda para escolher"], 0)],
      };
      return {
        ...category,
        description: config.description,
        optionGroups: config.groups.map(({ options, ...optionGroup }) => ({
          ...optionGroup,
          options: options.map((name, sortOrder) => ({ id: normalizeSlug(name), name, isActive: true, sortOrder })),
        })),
      };
    });
}
