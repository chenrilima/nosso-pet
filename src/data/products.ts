export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: number;
};
export const products: Product[] = [
  {
    id: "racao",
    name: "Ração para cães",
    category: "Rações",
    description: "Opções para diferentes portes e fases da vida.",
  },
  {
    id: "petisco",
    name: "Petiscos",
    category: "Petiscos",
    description: "Recompensas saborosas para o seu melhor amigo.",
  },
  {
    id: "shampoo",
    name: "Cuidados de higiene",
    category: "Higiene",
    description: "Produtos para a rotina de limpeza e bem-estar.",
  },
  {
    id: "brinquedo",
    name: "Brinquedos",
    category: "Brinquedos",
    description: "Diversão e estímulo para cães e gatos.",
  },
  {
    id: "acessorio",
    name: "Acessórios",
    category: "Acessórios",
    description: "Itens úteis e cheios de personalidade.",
  },
];
