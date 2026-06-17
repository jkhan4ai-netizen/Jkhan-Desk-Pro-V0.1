"use client"

import { useState, useEffect } from "react"
import { DndContext, DragEndEvent, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { KanbanColumn } from "./kanban-column"
import { updateProjectStatus } from "@/lib/actions/projects"
import { toast } from "sonner"

const COLUMNS = [
  { id: 'NEW', title: 'Новые' },
  { id: 'IN_PROGRESS', title: 'В работе' },
  { id: 'READY', title: 'Готово к сдаче' },
  { id: 'PAID', title: 'Оплачено' },
  { id: 'ARCHIVED', title: 'Архив / Отменено' },
]

export function KanbanBoard({ initialProjects }: { initialProjects: any[] }) {
  // Local optimistic state for instant UI updates
  const [projects, setProjects] = useState(initialProjects)

  // Update local state if props change (e.g., from server revalidation)
  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires a 5px movement before drag starts (helps prevent accidental drags when clicking)
      },
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const projectId = active.id as string;
    const newStatus = over.id as string;

    const project = projects.find(p => p.id === projectId);
    if (!project || project.status === newStatus) return;

    // Optimistic UI update
    setProjects(current => 
      current.map(p => 
        p.id === projectId ? { ...p, status: newStatus } : p
      )
    );

    // Persist to database
    try {
      const { error } = await updateProjectStatus(projectId, newStatus);
      if (error) {
        toast.error("Не удалось обновить статус: " + error);
        // Revert on error
        setProjects(initialProjects);
      } else {
        toast.success(`Статус проекта обновлен`);
      }
    } catch (err) {
      toast.error("Произошла ошибка при сохранении");
      setProjects(initialProjects);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] min-h-[500px]">
        {COLUMNS.map(col => {
          // Special logic for combined ARCHIVED/CANCELLED column if needed
          const colProjects = projects.filter(p => {
            if (col.id === 'ARCHIVED') return p.status === 'ARCHIVED' || p.status === 'CANCELLED';
            return p.status === col.id;
          });

          return (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              projects={colProjects}
            />
          )
        })}
      </div>
    </DndContext>
  )
}
