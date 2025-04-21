import { useMemo } from 'react';
import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { useGetStateRunner } from '@/global/hooks/useStateRunner';
import { Icon } from '@/icons/index';
import { GamesType, RunnersByFolderType } from '@/types/all';
import { formatDuration } from '@/utils/date/formatHour';
import { PATH_CONTENT_GAMES_FOLDER } from '@/config/index';
import { useUserData } from '@/global/contexts/ContextUserDataProvider';

type Props = {
  runnersByFolderAvailableInThisPlatform: RunnersByFolderType[];
  file: GamesType['files'][0];
};

export const GameRun = ({ file, runnersByFolderAvailableInThisPlatform }: Props) => {
  const { runnerStatus } = useGetStateRunner();
  const { userData, updateUserData } = useUserData();

  const runnersByFolderToThisGame = runnersByFolderAvailableInThisPlatform.filter((runnerByFolder) =>
    file.gameRelativePathOrFolder.includes(`/${runnerByFolder.folder}/`),
  );

  const handleRunCommand = (command: string) => {
    window.electron.runCliCommand({ command, path: file.gameRelativePathOrFolder });
  };

  const handleAddGamePlayed = () => {
    if (userData.playHistory.find((playItem) => playItem.path === file.gameRelativePathOrFolder)) {
      return;
    }

    updateUserData({
      ...userData,
      playHistory: [...userData.playHistory, { path: file.gameRelativePathOrFolder, elapsedSeconds: 0 }],
    });
  };

  const handleStartGame = (command: string) => {
    handleRunCommand(command);
    handleAddGamePlayed();
  };

  const historyWithThisFile = useMemo(
    () => userData.playHistory.find((playItem) => file.gameRelativePathOrFolder === playItem.path),
    [userData],
  );

  return (
    <div className="border-l-4 border-white/20 mt-2 pl-2">
      <div>
        <div className="flex justify-start items-center gap-2 mt-2">
          <ButtonWithSound
            className="flex gap-2 items-center"
            onClick={() => {
              updateUserData({
                ...userData,
                favoriteGamePaths: userData.favoriteGamePaths.includes(file.gameRelativePathOrFolder)
                  ? userData.favoriteGamePaths.filter((favorite) => favorite !== file.gameRelativePathOrFolder)
                  : [...userData.favoriteGamePaths, file.gameRelativePathOrFolder],
              });
            }}>
            {userData.favoriteGamePaths.includes(file.gameRelativePathOrFolder) ? (
              <Icon.Star className="fill-yellow-400 stroke-white/20" />
            ) : (
              <Icon.Star className="stroke-white" />
            )}
          </ButtonWithSound>

          <div>
            <h4 className="break-all">{file.gameRelativePathOrFolder}</h4>
          </div>
        </div>
      </div>

      {historyWithThisFile ? (
        <div className="flex justify-start items-center gap-2 mt-2">
          <div>
            <Icon.Clock />
          </div>

          <div>
            <h4 className="uppercase select-none">Tempo jogado</h4>
            <p className="text-textDarkDs select-none">
              {' '}
              {formatDuration(
                userData.playHistory.find((playItem) => playItem.path === file.gameRelativePathOrFolder)
                  ?.elapsedSeconds || 0,
              )}
            </p>
          </div>
        </div>
      ) : undefined}

      <div className="mt-2 flex flex-col gap-3">
        {runnersByFolderToThisGame.map((runnersByThisGame) => (
          <div key={runnersByThisGame.id}>
            {runnersByThisGame.runners.map((runner) => (
              <div key={runner.id}>
                {runner.message ? (
                  <div className="flex justify-start items-center gap-2">
                    <div>
                      <Icon.ExclamationTriangle />
                    </div>

                    <div>
                      <h4 className="select-none">{runner.message}</h4>
                    </div>
                  </div>
                ) : undefined}

                <ButtonWithSound
                  key={runner.name}
                  disabled={runnerStatus.isRunning}
                  onClick={() => {
                    if (file.type === 'file') {
                      handleStartGame(
                        runner.command.replace('$gamePath', `${PATH_CONTENT_GAMES_FOLDER}${file.gameRelativePath}`),
                      );
                    } else {
                      handleStartGame(
                        runner.command.replace('$gameFolder', `${PATH_CONTENT_GAMES_FOLDER}${file.gameRelativeFolder}`),
                      );
                    }
                  }}
                  className="select-none w-full flex gap-2 items-center justify-center bg-backgroundButton text-textNormal px-6 py-4 rounded-lg hover:bg-backgroundButtonHover transition-colors duration-75 mt-2">
                  {runnerStatus.isRunning ? 'Runner Executando...' : `Jogar com ${runner.name}`} <Icon.Play />
                </ButtonWithSound>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
