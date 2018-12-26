import commander from 'commander';
import path from 'path';
import uniqid from 'uniqid';
import App from './App';

// * コマンドライン引数を設定する
commander
  .version('0.0.1')
  .option('-b --base-dir [dir]', '対象プロジェクトのベースURL（tsconfig.jsonのあるディレクトリ）', './')
  .option('-p --pattern [pattern]', '定義ファイルのパターン（--base-dirがベース）', '**/*.d.ts')
  .option('-c --config-file [configFile]', 'Swagger定義ファイルのパス', './swagger.yml')
  .parse(process.argv);

const { baseDir, pattern, configFile } = commander;
const tempDir = path.resolve(__dirname, `../.temp__${uniqid()}`);

const app = new App(baseDir, pattern, configFile, tempDir);

app.exec();
