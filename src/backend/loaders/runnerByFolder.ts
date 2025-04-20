import { FILE_PATH_RUNNER_BY_FOLDER, PATH_CONTENT_RUNNERS_FOLDER } from '@/config/index';
import { readFileUtil } from '@/loaders/readFile';
import { RunnersByFolderType } from '@/types/all';

export const readRunnersByFoldersData = () =>
  readFileUtil<RunnersByFolderType[]>(FILE_PATH_RUNNER_BY_FOLDER, [
    {
      folder: 'SWF_FLASH',
      map: {
        mode: 'file',
        extensionFile: '.swf',
        ignoreFiles: [],
      },
      runners: [
        {
          platform: 'win32',
          name: 'Ruffle',
          message: '',
          command: `${PATH_CONTENT_RUNNERS_FOLDER}/ruffle-nightly-2024_12_05-windows-x86_64/ruffle.exe "$gamePath"`,
        },
      ],
    },
    {
      folder: 'EXE_MSDOS',
      map: {
        mode: 'folder',
      },
      runners: [
        {
          platform: 'win32',
          name: 'DOSBox-X',
          message: 'Na CLI, tente rodar o .exe ou .bat. É só digitar o nome do jogo com a extensão e pressionar Enter.',
          command: `${PATH_CONTENT_RUNNERS_FOLDER}/mingw-dosbox/dosbox-x.exe -conf ${PATH_CONTENT_RUNNERS_FOLDER}/mingw-dosbox/dosbox-x.conf -c "mount D \\"$gameFolder\\"" -c "D:" -c "dir" `,
        },
      ],
    },
  ]);
