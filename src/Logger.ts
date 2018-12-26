/**
 * @file ロガー
 */

export default class Logger {
  constructor(
    private _log = {}
  ) {}

  /**
   * ログを残す
   */
  public log(
    obj: any,
    path: string,
    method: string,
    type: string,
    code: 'type' | 'missing' | 'unknown'
  ): void {
    if (!this._log[path]) this._log[path] = {};
    if (!this._log[path][method]) this._log[path][method] = {};
    if (!this._log[path][method][type]) this._log[path][method][type] = {};
    if (!this._log[path][method][type][code]) this._log[path][method][type][code] = [];

    this._log[path][method][type][code].push(obj);
  }
}
