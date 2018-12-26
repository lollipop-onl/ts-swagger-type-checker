/**
 * @file Json Schemaを扱うためのモジュール
 */

export default class Schema {
  /**
   * Swagger定義ファイルからスキーマを取得
   */
  public static getSwaggerSchema(config: any, path: string, method: string, type: string): any | void {
    // * ヌルポに気をつけながら値を参照
    if (!config) return;

    const pathConfig = config.paths[path];

    if (!pathConfig) return;

    const methodConfig = pathConfig[method];

    if (!methodConfig) return;

    const { parameters, requestBody = {}, responses = {} } = methodConfig;

    // * レスポンスのスキーマを取得
    if (type === 'response') {
      const res = responses['200'] || {};
      const content = res.content || {};
      const data = content['application/json'] || {};

      return data.schema;
    }

    // * Getリクエストのクエリを取得
    if (method === 'get') {
      return parameters;
    }

    // * Get以外のBodyを取得
    const content = requestBody.content || {};
    const body = content['application/json'] || {};

    return body.schema;
  }
}
