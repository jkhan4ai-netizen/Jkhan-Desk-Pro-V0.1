import { getClients } from "@/lib/actions/clients"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Users, Mail, Phone } from "lucide-react"
import { EditClientDialog } from "@/components/crm/edit-client-dialog"
import { getLang, getDictionary } from "@/i18n/dict"

export default async function CrmPage() {
  const lang = await getLang();
  const dict = getDictionary(lang);
  const { clients, error } = await getClients();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold tracking-tight text-3xl">{dict.crm.title}</h1>
          <p className="text-muted-foreground mt-1">{dict.crm.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gray-900 text-white rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> {dict.crm.newClient}
          </Button>
        </div>
      </div>

      <Card className="border-gray-100/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">{dict.crm.database}</CardTitle>
          <CardDescription className="text-sm font-medium text-gray-500">{dict.crm.dbDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="p-4 text-center text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              Ошибка при загрузке данных: {error}
            </div>
          ) : clients && clients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-50/80 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-4">{dict.crm.name}</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-4">{dict.crm.company}</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-4">{dict.crm.contacts}</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-4">{dict.crm.status}</TableHead>
                  <TableHead className="w-[50px] pb-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client: any) => (
                  <TableRow key={client.id} className="border-b border-gray-50/80 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer">
                    <TableCell className="font-medium text-gray-700 py-4">{client.name}</TableCell>
                    <TableCell className="text-gray-500 py-4">{client.company || '—'}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        {client.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {client.phone}</span>}
                        {client.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {client.email}</span>}
                        {!client.phone && !client.email && '—'}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className={
                        client.status === 'NEW' ? 'border-blue-200 text-blue-500 bg-blue-50' :
                        client.status === 'REGULAR' ? 'border-accent text-accent' :
                        client.status === 'VIP' ? 'border-purple-500 text-purple-500 bg-purple-50' :
                        'border-gray-200 text-gray-500 bg-gray-50'
                      }>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <EditClientDialog client={client} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4 text-muted-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">{dict.crm.noClients}</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {dict.crm.noClientsDesc}
              </p>
              <Button className="bg-gray-900 text-white rounded-full">
                <Plus className="mr-2 h-4 w-4" /> {dict.crm.newClient}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
