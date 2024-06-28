// Definição dos tipos
export type Attribute = {
  name: string;
  description: string;
  values?: string[]; // Definição opcional dos valores aceitáveis
};

export type AtlasTag = {
  tagName: string;
  attributes: Attribute[];
  description: string;
};

// Tags personalizadas com atributos e valores aceitáveis
export const atlasTags: AtlasTag[] = [
  {
    tagName: "atlas-text",
    description: "Tag de texto do atlas",
    attributes: [
      {
        name: "ellipsis",
        description:
          "Adicionar '...' no final do texto caso ele ultrapasse o tamanho do seu container",
      },
      {
        name: "bold",
        description: "Aplica negrito",
      },
    ],
  },
  {
    tagName: "atlas-button",
    description: "Botão do atlas",
    attributes: [
      {
        name: "theme",
        description: "Aplica tema ao botão",
        values: ["primary", "secondary"],
      },
    ],
  },
];
