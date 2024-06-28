import * as vscode from "vscode";
import { getLanguageService } from "vscode-html-languageservice";
import { atlasTags } from "./atlasTags";

const tags = atlasTags;

// Função para registrar o provedor de autocompletar
function registerCompletionProvider(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: "html", scheme: "file" },
      {
        provideCompletionItems(document, position) {
          const completionItems: vscode.CompletionItem[] = [];

          addCustomTags(completionItems, document, position);
          addCustomAttributes(completionItems, document, position);

          return completionItems;
        },
      },
      "<",
      " ",
      '"' // Caracteres que acionam o autocomplete
    )
  );
}

// Função para adicionar tags personalizadas
function addCustomTags(
  completionItems: vscode.CompletionItem[],
  document: vscode.TextDocument,
  position: vscode.Position
) {
  tags.forEach(({ tagName, description }) => {
    const item = new vscode.CompletionItem(
      tagName,
      vscode.CompletionItemKind.Keyword
    );

    const linePrefix = document
      .lineAt(position)
      .text.substr(0, position.character);

    // Verifica se a linha já começa com '<' para evitar duplicação
    if (linePrefix.trim().startsWith("<")) {
      item.insertText = new vscode.SnippetString(
        `${tagName}>\n\t$0\n</${tagName}`
      );
    } else {
      item.insertText = new vscode.SnippetString(
        `<${tagName}>\n\t$0\n</${tagName}>`
      );
    }

    item.documentation = new vscode.MarkdownString(
      `Tag customizada: <${tagName}>\n\n${description}`
    );
    completionItems.push(item);
  });
}

// Função para adicionar atributos personalizados
function addCustomAttributes(
  completionItems: vscode.CompletionItem[],
  document: vscode.TextDocument,
  position: vscode.Position
) {
  tags.forEach(({ tagName, attributes }) => {
    const linePrefix = document
      .lineAt(position)
      .text.substr(0, position.character);
    if (
      linePrefix.includes(`<${tagName}`) ||
      linePrefix.includes(`<${tagName} `)
    ) {
      attributes.forEach(({ name, description, values }) => {
        const item = new vscode.CompletionItem(
          name,
          vscode.CompletionItemKind.Field
        );
        if (values && values.length > 0) {
          // Se houver valores aceitáveis, adicionar como sugestões
          item.insertText = new vscode.SnippetString(
            `${name}="${values[0]}"$0`
          ); // Insere o primeiro valor como padrão
          item.documentation = new vscode.MarkdownString(
            `Atributo da tag <${tagName}>: ${description}\n\nValores aceitáveis: ${values.join(
              ", "
            )}`
          );
        } else {
          // Caso não haja valores aceitáveis definidos
          item.insertText = new vscode.SnippetString(`${name}`);
          item.documentation = new vscode.MarkdownString(
            `Atributo da tag <${tagName}>: ${description}`
          );
        }
        item.command = {
          command: "editor.action.triggerSuggest",
          title: "Re-trigger completions...",
        }; // Força o VSCode a exibir as sugestões de completar automaticamente
        completionItems.push(item);
      });
    }
  });
}

// Função de ativação da extensão
export function activate(context: vscode.ExtensionContext) {
  const htmlLanguageService = getLanguageService();
  registerCompletionProvider(context);
}

// Função de desativação da extensão
export function deactivate() {}
