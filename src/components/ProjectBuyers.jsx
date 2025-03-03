import { getAllBuyersByProject } from "@/app/actions/purchase"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Mail, User, CreditCard } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {ScrollArea} from "@/components/ui/scroll-area"

async function ProjectBuyers({ projectId, price }) {
  const { data: buyers } = await getAllBuyersByProject(projectId)

  return (
    <ScrollArea className="w-full">
    <div className="grid gap-4 w-full">
      {buyers.map((buyer, index) => {
        const purchaseDate = new Date(buyer.purchasedAt)
        const timeAgo = formatDistanceToNow(purchaseDate, { addSuffix: true })

        return (
          <Card key={index} className="w-full mt-4 ">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{buyer.buyer.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{timeAgo}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{buyer.buyer.email}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">₹{price}</span>
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  Purchased on {purchaseDate.toLocaleDateString()} at {purchaseDate.toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
    </ScrollArea>
  )
}

export default ProjectBuyers

