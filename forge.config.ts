/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-await-in-loop */
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from 'path';
import fs from 'fs-extra';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    executableName: 'retrostation',
    name: 'retrostation',
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/frontend/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

config.hooks = {
  async prePackage() {
    const outDir = path.resolve('./', 'out');
    if (fs.existsSync(outDir)) {
      await fs.remove(outDir);
      console.log(`clean outdir folder ${outDir}`);
    }
  },

  async postPackage() {
    // console.log('rename retrostation-linux-x64 to out/bin');
    // await fs.move(path.resolve('./out/retrostation-linux-x64/'), path.resolve('./out/bin/'));

    console.log('rename retrostation-win32-x64 to out/bin');
    await fs.move(path.resolve('./out/retrostation-win32-x64/'), path.resolve('./out/bin/'));

    console.log(`copy static to bin`);
    await fs.copy(path.resolve('./static'), path.resolve('./out/bin/', 'static'));

    console.log('copy retrostation.bat to bin');
    await fs.copy(path.resolve('./static/initialSetup/retrostation.bat'), path.resolve('./out/retrostation.bat'));

    // console.log('copy retrostation.bat to bin');
    // await fs.copy(path.resolve('./static/initialSetup/retrostation.sh'), path.resolve('./out/retrostation.sh'));

    const binPath = path.resolve('./out/bin');
    const localesPath = path.join(binPath, 'locales');

    if (fs.existsSync(localesPath)) {
      const keep = ['pt-BR.pak'];
      const allLocales = await fs.readdir(localesPath);

      // eslint-disable-next-line no-restricted-syntax
      for (const file of allLocales) {
        if (!keep.includes(file)) {
          await fs.remove(path.join(localesPath, file));
          console.log(`Locale deleted: ${file}`);
        }
      }
    }

    // move to base
    console.log('MOVE BUILD TO BASE');
    await fs.copy(path.resolve('./out'), path.resolve('../'));
  },
};

export default config;
