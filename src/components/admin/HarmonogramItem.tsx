import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Settings, Trash2 } from 'lucide-react';
import { PartyScheduleItem } from '../../types/party';
import { getModuleDefinition } from '../../modules/registry';
import { Badge } from '../ui/Badge';

export interface HarmonogramItemProps {
  item: PartyScheduleItem;
  index: number;
  isCurrent: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const HarmonogramItem: React.FC<HarmonogramItemProps> = ({
  item,
  index,
  isCurrent,
  canDelete,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.6 : 1,
  };

  const def = getModuleDefinition(item.type);
  const IconComponent = def.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`relative p-4 rounded-2xl border transition-all cursor-pointer select-none group ${
        isDragging
          ? 'bg-purple-900/50 border-purple-400 shadow-2xl ring-2 ring-purple-400/60 scale-[1.02]'
          : isCurrent
          ? 'bg-purple-950/70 border-purple-400/80 shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/40'
          : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Drag handle, Module Icon & Info */}
        <div className="flex items-start gap-2.5 min-w-0">
          {/* Drag Handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            onClick={e => e.stopPropagation()}
            className="p-1.5 mt-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 active:bg-purple-500/20 active:text-purple-300 cursor-grab active:cursor-grabbing shrink-0 touch-none transition-colors"
            title="Przeciągnij, aby zmienić kolejność"
            aria-label="Przeciągnij, aby zmienić kolejność"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Module Icon */}
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isCurrent
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-400">
                #{index + 1}
              </span>
              {item.time && (
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {item.time}
                </span>
              )}
              <Badge variant={isCurrent ? 'purple' : 'slate'} size="sm">
                {def.name.split(' ')[0]}
              </Badge>
            </div>

            <h4
              className={`text-base font-bold truncate ${
                isCurrent ? 'text-white' : 'text-slate-200'
              }`}
            >
              {item.title}
            </h4>

            {item.notes && (
              <p className="text-xs text-slate-400 line-clamp-1">{item.notes}</p>
            )}
          </div>
        </div>

        {/* Right: Actions (Edit Meta, Delete) */}
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-white/5 cursor-pointer transition-colors"
            title="Edytuj szczegóły i godzinę"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={!canDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
            title="Usuń"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
