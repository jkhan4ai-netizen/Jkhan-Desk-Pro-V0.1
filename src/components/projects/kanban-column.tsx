"use client"

import { useDroppable } from "@dnd-kit/core"
import { KanbanCard } from "./kanban-card"
import { Badge } from "@/components/ui/badge"

interface KanbanColumnProps {
  id: string;
  title: string;
  projects: any[];
}

export function KanbanColumn({ id, title, projects }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  })

  // Color mapping based on status
  const getColorClasses = (status: string) => {
    switch(status) {
      case 'NEW': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'IN_PROGRESS': return 'text-accent bg-accent/10 border-accent/20';
      case 'READY': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'PAID': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'ARCHIVED': return 'text-muted-foreground bg-muted border-border';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  }

  return (
    <div className="flex flex-col flex-1 min-w-[280px] max-w-[320px] bg-surface-container rounded-lg border border-border overflow-hidden">
      {/* Column Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface-container-low sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">{title}</h3>
          <Badge variant="secondary" className={`text-xs ${getColorClasses(id)}`}>
            {projects.length}
          </Badge>
        </div>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 transition-colors min-h-[150px] overflow-y-auto custom-scrollbar ${
          isOver ? "bg-[var(--primary)]/5" : ""
        }`}
      >
        {projects.map((p) => (
          <KanbanCard key={p.id} project={p} />
        ))}
        {projects.length === 0 && (
          <div className="h-full flex items-center justify-center min-h-[100px] border-2 border-dashed border-border rounded-lg bg-surface-container-lowest/50">
            <span className="text-xs text-[var(--on-surface-variant)] text-center px-4">
              Перетащите проекты сюда
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
