import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Clock, Plus } from 'lucide-react';
import { PartyScheduleItem } from '../../types/party';
import { Button } from '../ui/Button';
import { HarmonogramCard, HarmonogramItem } from './HarmonogramItem';

export interface HarmonogramEditorProps {
  items: PartyScheduleItem[];
  activeItemId: string | undefined;
  onSelectItem: (id: string) => void;
  onReorderItems: (orderedIds: string[]) => void;
  onOpenAddModal: () => void;
  onEditItemMeta: (id: string) => void;
  onDeleteItem: (item: PartyScheduleItem) => void;
}

export const HarmonogramEditor: React.FC<HarmonogramEditorProps> = ({
  items,
  activeItemId,
  onSelectItem,
  onReorderItems,
  onOpenAddModal,
  onEditItemMeta,
  onDeleteItem,
}) => {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(items, oldIndex, newIndex);
        onReorderItems(reordered.map(item => item.id));
      }
    }
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
  };

  const activeDragItem = activeDragId ? items.find(i => i.id === activeDragId) : null;
  const activeDragIndex = activeDragId ? items.findIndex(i => i.id === activeDragId) : -1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Harmonogram ({items.length})
        </h3>

        <Button
          variant="glow"
          size="sm"
          onClick={onOpenAddModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Dodaj punkt
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2.5 max-h-[750px] overflow-y-auto overflow-x-hidden pr-1">
            {items.map((item, index) => (
              <HarmonogramItem
                key={item.id}
                item={item}
                index={index}
                isCurrent={item.id === activeItemId}
                canDelete={items.length > 1}
                onSelect={() => onSelectItem(item.id)}
                onEdit={() => onEditItemMeta(item.id)}
                onDelete={() => onDeleteItem(item)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
          {activeDragItem ? (
            <HarmonogramCard
              item={activeDragItem}
              index={activeDragIndex}
              isCurrent={activeDragItem.id === activeItemId}
              isOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
