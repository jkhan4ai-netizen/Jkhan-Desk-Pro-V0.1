"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Clock, Briefcase, Loader2 } from "lucide-react"
import { updateTodoStatus } from "@/lib/actions/todos"
import { useRouter } from "next/navigation"

interface TodoItemProps {
  task: any;
}

export function TodoItem({ task }: TodoItemProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    let nextStatus = 'NOT_STARTED';
    if (task.status === 'NOT_STARTED') {
      nextStatus = 'IN_PROGRESS';
    } else if (task.status === 'IN_PROGRESS') {
      nextStatus = 'DONE';
    } else {
      nextStatus = 'NOT_STARTED';
    }
    
    await updateTodoStatus(task.id, nextStatus);
    setIsLoading(false);
    router.refresh();
  }

  return (
    <div className="p-3 mb-3 bg-background/50 border border-border/50 rounded-[1.5rem] hover:border-accent/50 transition-smooth group cursor-pointer shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <button 
            onClick={handleToggle}
            disabled={isLoading}
            className="mt-0.5 text-muted-foreground hover:text-primary transition-smooth"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
            ) : task.status === 'DONE' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : task.status === 'IN_PROGRESS' ? (
              <Clock className="h-4 w-4 text-accent animate-pulse" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </button>
          <div onClick={handleToggle}>
            <p className={`text-sm font-medium ${task.status === 'DONE' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </p>
            {task.projects && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Briefcase className="h-3 w-3" /> {task.projects.title}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
