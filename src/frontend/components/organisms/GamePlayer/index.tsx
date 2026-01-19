/* eslint-disable jsx-a11y/control-has-associated-label */
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

      <Modal.Content>
        {game?.image ? (
          <div className="w-full">
            <ButtonWithSound className='flex gap-2 px-2 py-1 items-center justify-center border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 text-size3 font-semibold border-transparent' onClick={() => window.electron.openWithFileSelected(`../assets/games/${game.image}`)}>
              <img
                key={game?.image}
                src={resolveRelativePaths(`${PATH_API_GAME_ASSETS_FOLDER}${game.image}`)}
                width={472}
                height={500}
                draggable={false}
                alt=""
                className="h-[472px] w-[500px] object-cover rounded-md select-none"
              />
            </ButtonWithSound>
          </div>
        ) : <div className="w-full">
          <ButtonWithSound className='flex gap-2 px-2 py-1 items-center justify-center border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 text-size3 font-semibold border-transparent' onClick={() => window.electron.openFolder(`../assets/games/${game.folder}`)}>
            Sem Imagem
          </ButtonWithSound>

        </div>}

        <Modal.DialogTitle className="text-size4 font-bold flex items-center mt-2">{game?.name}</Modal.DialogTitle>

        <Modal.Description className="mt-2 select-none">{game?.description}</Modal.Description>

        <div className="flex gap-2 mt-4">
          <p className=" rounded-lg flex gap-2 select-none">

            <ButtonWithSound className='flex gap-2 items-center justify-center border-b-2 cursor-pointer hover:bg-backgroundButtonHover transition-all duration-75 text-size3 font-semibold border-transparent' onClick={() => window.electron.openFolder(`../content/games/${game?.folder}`)}>
              <Icon.ComputerDesktop />
              {game?.folder}
            </ButtonWithSound>
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {game?.files.map((file) => (
            <GameRun
              key={file.id}
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
