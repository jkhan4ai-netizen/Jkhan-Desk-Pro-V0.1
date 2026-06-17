import { getProjects } from "@/lib/actions/projects"
import { Filter, Search, Plus, LayoutGrid, Clock, List, ChevronLeft } from "lucide-react"
import { AccordionList } from "@/components/projects/accordion-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"

export default async function ProjectsPage() {
  const { projects, error } = await getProjects();

  return (
    <div className="flex flex-col h-full bg-white animate-fade-in -mt-6">
      {/* Custom Breadcrumb-like Header just for this view to match reference */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pt-6">
        <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-gray-900" />
        <span>My Pages /</span>
        <span className="text-gray-900 font-medium">Craftboard Project</span>
        
        <div className="ml-auto flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <Plus className="w-4 h-4" /> New Tab
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center text-2xl font-bold">
            C
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Craftboard Project</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 z-20">AL</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-[10px] font-bold text-green-600 -ml-2 z-10">DT</div>
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 -ml-2 z-0"></div>
          </div>
          <CreateProjectDialog />
        </div>
      </div>

      {/* Custom Tabs and Content */}
      <Tabs defaultValue="list" className="w-full flex-1 flex flex-col">
        <div className="border-b border-gray-100 mb-2">
          <TabsList className="bg-transparent h-auto p-0 flex gap-6">
            <TabsTrigger 
              value="kanban" 
              className="pb-3 pt-0 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-gray-900 text-gray-500 font-medium"
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Kanban
            </TabsTrigger>
            <TabsTrigger 
              value="timeline" 
              className="pb-3 pt-0 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-gray-900 text-gray-500 font-medium"
            >
              <Clock className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="pb-3 pt-0 px-0 rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-gray-900 text-gray-500 font-medium"
            >
              <List className="w-4 h-4 mr-2" />
              List
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="kanban" className="m-0 focus-visible:outline-none flex-1 py-4">
          <div className="text-gray-500 text-center mt-12">Kanban Board (Not implemented in this view)</div>
        </TabsContent>

        <TabsContent value="timeline" className="m-0 focus-visible:outline-none flex-1 py-4">
          <div className="text-gray-500 text-center mt-12">Timeline View (Not implemented in this view)</div>
        </TabsContent>

        <TabsContent value="list" className="m-0 focus-visible:outline-none flex-1">
          <AccordionList initialTodos={projects || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
