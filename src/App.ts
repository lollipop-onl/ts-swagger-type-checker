/**
 * @file アプリケーションのベースモジュール
 */
import fs from 'fs';
import consola from 'consola';
import glob from 'glob';
import path from 'path';
import rmdir from 'rmdir';
import uniqid from 'uniqid';
import yaml from 'js-yaml';
import Checker from './Checker';

export default class App {
  private config: any;

  constructor(
    private baseDir: string,
    private pattern: string,
    private configFile: string,
    private tempDir: string
  ) {}

  /**
   * チェックを実行する
   */
  public async exec(): Promise<void> {
    consola.info('Type check started!');

    this.config = this.loadSwaggerConfig();

    if (!this.config) return consola.error(`${this.configFile}の定義ファイルを読み込めませんでした。`);

    await this.copyTargetFiles();

    // * チェック対象のファイルを取得
    const targetFiles = glob.sync(path.resolve(this.tempDir, '*.ts'));

    consola.info(`Targets: ${targetFiles.length} file(s)`);

    if (targetFiles.length === 0) {
      return consola.warn('チェック対象のファイルがありません。');
    }

    targetFiles.forEach((target, i) => {
      const checker = new Checker(target, this.config, this.baseDir);

      console.log(`\n👀 ${i + 1} / ${targetFiles.length}\n`);

      checker.check();
    });

    // * 完了時に一時フォルダを削除
    rmdir(this.tempDir);
  }

  /**
   * Swaggerの定義ファイルを取得する
   */
  private loadSwaggerConfig(configFile = this.configFile): void {
    try {
      return yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
    } catch (e) {
      return;
    }
  }

  /**
   * チェック対象のTypeScriptファイルを手元にコピー
   */
  async copyTargetFiles(): Promise<void> {
    const filePattern = path.resolve(path.resolve(this.baseDir, this.pattern));
    const files = glob.sync(filePattern);
    const promises = [];

    // * 一旦、仮フォルダを削除
    await (() => new Promise((resolve) => rmdir(this.tempDir, resolve)))();

    // * 仮ファイル格納のディレクトリが存在しない場合は作成
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir);
    }

    files.forEach((file) => {
      promises.push(new Promise((resolve) => {
        // コピー後のファイル名の拡張子を.tsにする
        // const copyedFileName = file.replace(/(.*)\/(.+)\.d\.ts$/, '$2.ts');
        const copyedFileName = `${uniqid()}.ts`;
        const copyedPath = path.resolve(this.tempDir, copyedFileName);

        fs.copyFile(file, copyedPath, resolve);
      }));
    });

    await Promise.all(promises);
  }
}
