import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAllProjectsForSale } from "@/app/actions/market"
import { checkUser } from '@/lib/auth'
import { BookText } from 'lucide-react'
import { getAllManualProjectsByUser } from "@/app/actions/manual"
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import AddToMarket from '@/components/AddToMarket'
import { checkProjectPurchasedByUser } from "@/app/actions/purchase";
import {Badge} from "@/components/ui/badge"

async function page() {
  const projects = await getAllProjectsForSale()
  const user = await checkUser()
  const manualprojects = await getAllManualProjectsByUser(user.id);

  const projectsWithPurchaseStatus = await Promise.all(
    projects.map(async (project) => ({
      ...project,
      isPurchased: await checkProjectPurchasedByUser(project.id)
    }))
  );
  
  return (
    <div className="p-8">
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookText className="w-6 h-6 text-primary"/>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Your Manuals
            </h1>
          </div>
        </div>

        {manualprojects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/50">
            <h3 className="text-xl font-semibold mb-2">No manuals found</h3>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {manualprojects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-shadow pt-4">
                <CardContent>
                  <a href={`/projects/${project.id}`} className="hover:underline">
                    <CardTitle className="text-lg font-semibold truncate">{project.title}</CardTitle>
                  </a>
                </CardContent>
                <CardFooter className="flex flex-col justify-between items-start">
                  <div className="text-sm text-muted-foreground">
                    {project.isListed ? (
                      <>
                        <div className="flex items-center gap-1 mb-2">
                          <span>Listed at</span>
                          <span className="font-medium">₹{project.price?.toFixed(2)}</span>
                        </div>
                        <div className="mb-2">
                          Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                      </>
                    ) : (
                      'Not listed'
                    )}
                  </div>
                  <div>
                    <AddToMarket project={project} isOwner={user?.id === project.creatorId} />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator className="my-12" />
      
      <section>
        <h1 className="text-4xl font-bold mb-8">Marketplace</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsWithPurchaseStatus.map((project) => (
            <div 
              key={project.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
               <Badge className="mb-4" variant={project.isPurchased ? 'default' : 'secondary'}>
                {project.isPurchased ? 'Purchased' : 'Available'}
              </Badge>
              <div className="relative h-48 mb-4">
                <div className="bg-gray-100 w-full h-full rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Project Preview</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">{project.title}</h2>
              <div className="flex items-center gap-2 mb-4">
                {project.creator.name && (
                  <Image
                    src={project.creator.imageUrl}
                    alt={project.creator.name || 'Creator'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-600">
                  {project.creator.name || 'Anonymous Creator'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-2xl font-bold">
                  <span>₹</span>
                  <span>{project.price?.toFixed(2)}</span>
                </div>
                
                <div className="space-x-2">
                  <Link
                    href={`/details/${project.id}`}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            No projects found in the marketplace
          </div>
        )}
      </section>
    </div>
  )
}

export default page