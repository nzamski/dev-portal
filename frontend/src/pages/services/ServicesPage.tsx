import { Board } from './Board';
import { ServiceDirectory } from './ServiceDirectory';
import { SearchSpotlight } from './SearchSpotlight';
import { ManageServices } from './ManageServices';
import type { Service, BoardItem } from './types';

interface Props {
  services: Service[];
  setServices: (services: Service[]) => void;
  addService: (data: Omit<Service, 'id'>) => Promise<Service>;
  boardItems: BoardItem[];
  setBoardItems: (items: BoardItem[]) => void;
  editMode: boolean;
  search: string;
  onCloseSearch: () => void;
}

export function ServicesPage({
  services,
  setServices,
  addService,
  boardItems,
  setBoardItems,
  editMode,
  search,
  onCloseSearch,
}: Props) {
  const showSpotlight = search.trim().length > 0;

  return (
    <>
      {showSpotlight && (
        <SearchSpotlight query={search} services={services} onClose={onCloseSearch} />
      )}

      <div className="max-w-5xl mx-auto px-8 pt-7 pb-7">
        {editMode && (
          <p className="text-ink-20 text-[11px] mb-3">
            Drag to reorder · click × to remove
          </p>
        )}
        <Board
          editMode={editMode}
          services={services}
          boardItems={boardItems}
          setBoardItems={setBoardItems}
        />
      </div>

      {editMode ? (
        <ManageServices services={services} setServices={setServices} addService={addService} />
      ) : (
        <div className="max-w-5xl mx-auto px-8">
          <ServiceDirectory services={services} />
        </div>
      )}
    </>
  );
}
