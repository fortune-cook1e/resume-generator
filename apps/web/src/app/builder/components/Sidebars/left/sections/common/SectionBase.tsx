import RenderSectionModal from '@/app/builder/components/Sidebars/left/sections/common/RenderSectionModal';
import {
  SectionProvider,
  useSectionContext,
} from '@/app/builder/components/Sidebars/left/sections/common/SectionContext';
import { getSectionIcon } from '@/app/builder/components/Sidebars/left/sections/common/SectionIcon';
import SectionOptions from '@/app/builder/components/Sidebars/left/sections/common/SectionOptions';
import { useResumeStore } from '@/store/resume';
import { SectionItem, SectionKey, SectionWithItem } from 'shared';
import get from 'lodash-es/get';
import { useEffect, useId } from 'react';
import { Button, CoolMode } from 'ui';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import SectionListItem from '@/app/builder/components/Sidebars/left/sections/common/SectionListItem';
import { Plus } from '@phosphor-icons/react';

interface Props<T> {
  id: SectionKey;
  title: (item: T) => string;
  description: (item: T) => string;
}

const SectionBase = <T extends SectionItem>({
  id,
  title,
  description,
}: Props<T>) => {
  const dndContextId = useId();
  const { setOpen, setCreateMode, setUpdateMode, setId, setPayload } =
    useSectionContext();
  const section = useResumeStore((state) =>
    get(state.resume.data.sections, id),
  ) as SectionWithItem<T>;
  const setValue = useResumeStore((state) => state.setValue);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onAddClick = () => {
    setCreateMode();
    setOpen.on();
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = section.items.findIndex((item) => item.id === active.id);
      const newIndex = section.items.findIndex((item) => item.id === over.id);
      const sortedList = arrayMove(section.items as T[], oldIndex, newIndex);
      setValue(`sections.${id}.items`, sortedList);
    }
  };

  const onEdit = (item: T) => {
    setUpdateMode();
    setOpen.on();
    setPayload(item);
  };

  const onVisible = (index: number) => {
    const visible = get(section, `items.${index}.visible`, true);
    setValue(`sections.${id}.items[${index}].visible`, !visible);
  };

  const onDelete = (itemId: string) => {
    const newItems = section.items.filter((item) => item.id !== itemId);
    setValue(`sections.${id}.items`, newItems);
  };

  useEffect(() => {
    setId(id);
  }, [id, setId]);

  if (!section) return null;

  return (
    <div id={id} className="animate-fade-right animate-once">
      <div className="mb-5 flex items-center justify-between">
        {getSectionIcon(id)}
        <h2 className="truncate text-3xl font-bold">{section?.name ?? id}</h2>
        <SectionOptions id={id} onAddClick={onAddClick} />
      </div>

      <RenderSectionModal />

      {!section.items.length && (
        <div className="flex justify-end">
          <CoolMode>
            <Button leftIcon={<Plus />} onClick={onAddClick}>
              Create an item
            </Button>
          </CoolMode>
        </div>
      )}

      <DndContext
        id={dndContextId}
        sensors={sensors}
        onDragEnd={onDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={section.items}
          strategy={verticalListSortingStrategy}
        >
          <div className="animate-fade-right animate-once">
            {section.items.map((item, index) => (
              <SectionListItem
                key={item.id}
                id={item.id}
                title={title(item as T)}
                visible={item.visible}
                description={description(item as T)}
                onEdit={() => onEdit(item as T)}
                onVisible={() => onVisible(index)}
                onDelete={() => onDelete(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SectionBaseWithProvider = <T extends SectionItem>(
  props: Props<T>,
): JSX.Element => (
  <SectionProvider>
    <SectionBase {...props} />
  </SectionProvider>
);

export default SectionBaseWithProvider;
