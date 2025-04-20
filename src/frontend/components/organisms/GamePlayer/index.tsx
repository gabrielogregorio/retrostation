import { Modal } from '@/components/molecules/Modal';
import { ButtonWithSound } from '@/components/organisms/ButtonSound';
import { GameRun } from '@/components/organisms/GamePlayer/GameRun';
import { PATH_API_GAME_ASSETS_FOLDER } from '@/config/index';
import { Icon } from '@/icons/index';
import { GamesType, RunnersByFolderType } from '@/types/all';
import { resolveRelativePaths } from '@/utils/resolveRelativePaths';

export const GamePlayer = ({
  game = undefined,
  onClose,
  isOpen,
  runnersByFolderAvailableInThisPlatform = [],
}: {
  runnersByFolderAvailableInThisPlatform?: RunnersByFolderType[];
  isOpen: boolean;
  game?: GamesType;
  onClose: () => void;
}) => (
  <Modal.Root isOpen={isOpen} onClose={onClose}>
    <Modal.DialogPanel className="h-[80vh] overflow-y-scroll vertical-scrollbar w-[600px] px-8 py-5">
      <div className="flex items-center justify-end">
        <ButtonWithSound onClick={onClose} aria-label="Fechar Modal">
          <Icon.XMark className="size-7 text-textNormal" />
        </ButtonWithSound>
      </div>

      <Modal.Content>
        <div className="w-full">
          {game?.image ? (
            <img
              key={game?.image}
              src={resolveRelativePaths(`${PATH_API_GAME_ASSETS_FOLDER}${game.image}`)}
              width={160}
              height={90}
              draggable={false}
              alt=""
              className="w-full h-[250px] object-cover rounded-md select-none"
            />
          ) : (
            <div className="text-textNormal text-sm select-none">Sem imagens</div>
          )}
        </div>

        <Modal.DialogTitle className="text-xl font-bold flex items-center mt-2">{game?.name}</Modal.DialogTitle>

        <Modal.Description className="mt-2 select-none">{game?.description}</Modal.Description>

        <div className="flex gap-2 mt-4">
          <p className=" text-textNormal rounded-lg flex gap-2 select-none">
            <Icon.ComputerDesktop />

            {game?.folder}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {game?.files.map((file, index) => (
            <GameRun
              // eslint-disable-next-line react/no-array-index-key
              key={`${file.gameRelativePathOrFolder}-${index}`}
              file={file}
              runnersByFolderAvailableInThisPlatform={runnersByFolderAvailableInThisPlatform}
            />
          ))}
        </div>
        <div className="min-h-[10px]" />
      </Modal.Content>
    </Modal.DialogPanel>
  </Modal.Root>
);
