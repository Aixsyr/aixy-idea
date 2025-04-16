import {
  TextDocuments,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  Connection,
  InitializeParams,
  InitializeResult,
  ProposedFeatures,
  createConnection,
  TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

const doc = [
  {
    kind: "Function",
    body: ["testA"],
    detail: "(method) tyc_test2.testA( key: string, value: any)",
    documentation: `测试testA自动补全
@param key — 要设置的字段名.
@param value — 要设置的值.`,
  },
];

export function autoCompletion(
  connection: Connection,
  documents: TextDocuments<TextDocument>
) {
  connection.onCompletion(
    (
      _textDocumentPosition: TextDocumentPositionParams
    ): CompletionItem[] | null => {
      const document = documents.get(_textDocumentPosition.textDocument.uri);
      if (!document) {
        return null;
      }
      const text = document.getText({
        start: document.positionAt(0),
        end: _textDocumentPosition.position,
      });

      const offsetAt = document.offsetAt(_textDocumentPosition.position);

      let res: CompletionItem[] = [
        {
          label: "tyc_test2",
          kind: CompletionItemKind.Variable,
          detail: "tyc_test2",
          documentation: "我的测试方法库",
        },
      ];

      if (/tyc_test2\.[a-zA-Z]*$/.test(text)) {
        res = res.concat(
          doc.map((item) => ({
            label: item.body[0],
            kind: CompletionItemKind[
              item.kind as keyof typeof CompletionItemKind
            ],
            detail: item.detail,
            documentation: item.documentation,
          })) as CompletionItem[]
        );
      }
      return res;
    }
  );

  connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
    return {
      ...item,
    };
  });
}

// 创建语言服务器连接
const connection = createConnection(ProposedFeatures.all);

// 创建文档管理器
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// 监听文档的打开、关闭和修改事件
documents.listen(connection);

// 初始化连接
connection.onInitialize((params: InitializeParams): InitializeResult => {
  return {
    capabilities: {
      // 设置文档同步方式为增量同步
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // 启用补全提供者，并允许解析补全项的详细信息
      completionProvider: {
        resolveProvider: true,
      },
    },
  };
});

// 注册自动补全功能
autoCompletion(connection, documents);

// 启动连接，开始监听客户端请求
connection.listen();
