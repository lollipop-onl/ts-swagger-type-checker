/**
 * @file スキーマ同士のチェックを行うモジュール
 */

import Schema from './Schema';
import Logger from './Logger';
import consola from 'consola';
import * as TJS from 'typescript-json-schema';

export default class Checker {
  private logger;

  constructor(
    private target: string,
    private config: any,
    private baseDir: string
  ) {
    this.logger = new Logger();
  }

  public check(): void {
    const tsSchema = this.getTSSchema();
    const { definitions } = tsSchema;

    Object.keys(definitions).forEach((key) => {
      const definition = definitions[key];
      const { properties, description } = definition;
      const { path, method, type } = this.parseMetaComment(description);

      // メタ情報のどれかが掛けていたら処理を終了
      if (!path || !method || !type) return;

      console.log('--');
      consola.info(`Checking... ${method}: ${path} - ${type}`);

      const schema = Schema.getSwaggerSchema(this.config, path, method, type);

      // Swaggerの定義が見つからなければ処理を中止
      if (!schema) return consola.warn(`Swagger definition is not found... ${path}: ${method} - ${type}`);

      this.validateSchema(properties, tsSchema, schema, this.config);

      consola.success('Finish !');
    });
  }

  /**
   * TypeScriptの型定義を取得する
   */
  private getTSSchema(target = this.target): any | void {
    const tsConfig = {
      baseUrl: this.baseDir,
      paths: {
        '@/*': [
          'src/*'
        ]
      },
    };
    const program = TJS.getProgramFromFiles([target], tsConfig);
    const schema = TJS.generateSchema(program, '*');

    if (!schema) return {};

    return schema;
  }

  /**
   * メタコメントをパースする
   */
  private parseMetaComment(comment = ''): any {
    const { path, method, type } = comment.replace(/ /g, '').split('\n').reduce((obj, item) => {
      const [key, value] = item.split(':');

      if (key && value) {
        obj[key] = value;
      }

      return obj;
    }, {} as any);

    return { path, method, type };
  }

  /**
   * $refのコンポーネントを取得する
   */
  getSchemaRef(obj, config): any {
    const [ $ref ] = Object.keys(obj);

    if ($ref !== '$ref') return obj;

    const key = obj[$ref];

    const def = key.replace(/^#\//, '').split('/').reduce((obj, name) => {
      return obj[name] || {};
    }, config);

    if (def.name && def.schema) {
      return {
        [def.name]: def.schema
      };
    }

    return def;
  }

  /**
   * スキーマを正規化する
   */
  optimizeSchema(schema, config): any {
    const _schema = Array.isArray(schema) ? schema : [schema];

    const parsedSchema = _schema.reduce((obj, self) => {
      return {
        ...obj,
        ...this.getSchemaRef(self, config)
      };
    }, {});

    const keys = Object.keys(parsedSchema);

    // レスポンスの場合
    if (keys.includes('properties')) {
      return parsedSchema['properties'];
    }

    // Queryパラメータの場合
    if (parsedSchema.in === 'query') {
      return {
        [parsedSchema['name']]: parsedSchema['schema']
      };
    }

    return parsedSchema;
  }

  /**
   * スキーマ同士を検証する
   */
  validateSchema(schema1 = {}, def1 = {}, schema2 = {}, def2 = {}): void {
    const optimizedSchema1 = this.optimizeSchema(schema1, def1);
    const optimizedSchema2 = this.optimizeSchema(schema2, def2);

    const keys1 = Object.keys(optimizedSchema1);
    const keys2 = Object.keys(optimizedSchema2);

    // 不足しているプロパティのチェック
    keys2.forEach((key) => {
      if (!keys1.includes(key)) {
        return consola.error(`Missing property "${key}"`);
      }
    });

    // 定義されていないプロパティのチェック
    keys1.forEach((key) => {
      if (!keys2.includes(key)) {
        return consola.error(`Unknown property "${key}"`);
      }
    });

    const keys = keys1.filter((key) => keys2.includes(key));

    keys.forEach((key) => {
      const s1 = optimizedSchema1[key];
      const s2 = optimizedSchema2[key];

      // * 型が一致するかをチェック
      const type1 = s1.type || 'object';
      const type2 = s2.type || 'object';

      if (type1 !== type2) {
        return consola.error(`Different Types: "${key}" (${type1} vs ${type2})`);
      }

      // * 配列の場合
      if (s1.type === 'array') {
        // * itemを型に合わせて変更
        const type1 = s1.items.type || 'object';
        const type2 = s2.items.type || 'object';

        if (type1 !== type2) {
          return consola.error(`Different Types: "${key}" (${type1} vs ${type2})`);
        }

        if (type1 === 'object') {
          this.validateSchema(s1.items, def1, s2.items, def2);
        }
      }
    });
  }
}
