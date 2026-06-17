import { getTodos } from "@/lib/actions/todos"
import { FocusClient } from "./focus-client"

export default async function FocusPage() {
  const { todos, error } = await getTodos();

  return (
    <div className="w-full flex-1 relative flex items-center justify-center p-4 rounded-3xl overflow-hidden min-h-[600px]">
      {/* Abstract Background Gradient matching the prompt */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 via-[#d1d5fc] to-cyan-100 opacity-80" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/30 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[900px]">
        {error ? (
          <div className="p-4 bg-white/60 backdrop-blur-md rounded-[32px] text-red-500">
            Error: {error}
          </div>
        ) : (
          <FocusClient initialTodos={todos || []} />
        )}
      </div>
    </div>
  )
}
