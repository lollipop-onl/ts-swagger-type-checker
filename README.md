# ts-swagger-type-checker

```sh
$ node dist/index -h
```

## Dependencies

* typescript-json-schema
* commandar

## Usage

### Cli

Githubにあるパッケージをインストールします。

```sh
$ yarn add tamuraryoya/ts-swagger-type-checker
```

インストールすると`api-type-check`コマンドが利用可能になります。

コマンドのオプションについてはヘルプを参照してください。

```sh
$ yarn api-type-check -h

Usage: api-check [options]

Options:
  -V, --version                  output the version number
  -b --base-dir [dir]            対象プロジェクトのベースURL（tsconfig.jsonのあるディレクトリ） (default: "./")
  -p --pattern [pattern]         定義ファイルのパターン（--base-dirがベース） (default: "**/*.d.ts")
  -c --config-file [configFile]  Swagger定義ファイルのパス (default: "./swagger.yml")
  -h, --help                     output usage information 
```

### Interface

チェックしたいインターフェースの直前のコメントを以下のフォーマットにすれば、型チェックが実行されます。

```ts
/**
 * 自由にコメントが書けます。
 * path: API Path (Swaggerのパスと揃える)
 * method: get （リクエストメソッド）
 * type: request （request or response）
 */
export interface IApiRequest {
  id: number;
  name: string;
}
```

**⭐ すべての項目が必須です。いずれかが指定されていない場合はチェックされません。**
