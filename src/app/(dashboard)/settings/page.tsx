import { getSettings } from "@/lib/actions/settings"
import { SettingsForm } from "@/components/settings/settings-form"

export default async function SettingsPage() {
  const { settings, error } = await getSettings();

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10">
      <div className="mb-2">
        <h1 className="font-sans font-bold tracking-tight text-3xl">Настройки системы</h1>
        <p className="text-muted-foreground mt-1">Управляйте внешним видом, локализацией и параметрами трекинга.</p>
      </div>

      {error ? (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
          Не удалось загрузить настройки: {error}
        </div>
      ) : (
        <SettingsForm initialData={settings} />
      )}
    </div>
  )
}
