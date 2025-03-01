import { BookText, Users, Folder, FolderPlus } from 'lucide-react';
import { getAllManualProjectsByUser } from "@/app/actions/manual"
import ManualDelete from "@/components/ManualDelete";
import ManualProjects from "@/components/ManualProjects";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { checkUser } from "@/lib/auth";
import { getAllCollaborationsByUserId } from "@/app/actions/collaborators";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';

async function Projects() {
  const currentUser = await checkUser()
  const projects = await getAllManualProjectsByUser(currentUser.id);
  const { data: collab_projects } = await getAllCollaborationsByUserId(currentUser.id);

  return (
    <div className="mx-auto px-4 py-6">
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookText className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Your Manuals
            </h1>
          </div>
          <div>
            <ManualProjects length={projects.length}/>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/50">
            <FolderPlus className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No manuals found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating a new manual</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Folder className="w-6 h-6 text-primary" />
                  <ManualDelete id={project.id} />
                </CardHeader>
                <CardContent>
                  <a href={`/projects/${project.id}`} className="hover:underline">
                    <CardTitle className="text-lg font-semibold truncate">{project.title}</CardTitle>
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator className="my-12" />

      {/* Collaboration Projects Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Collaborations
            </h2>
          </div>
        </div>

        {collab_projects?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/50">
            <Folder className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No collaborations yet</h3>
            <p className="text-muted-foreground text-center">
              You haven't been added to any collaboration projects yet
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collab_projects?.map((collaboration) => (
              <Card key={collaboration.project.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <a href={`/projects/${collaboration.project.id}`} className="hover:underline">
                    <CardTitle className="text-lg font-semibold truncate">
                      {collaboration.project.title}
                    </CardTitle>
                  </a>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span className="font-medium">Owner:</span>
                      <span className="truncate">
                        {collaboration.project.creator.name || collaboration.project.creator.email}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge 
                        variant={collaboration.accessType === 'EDIT' ? 'default' : 'secondary'}
                        className={collaboration.accessType === 'EDIT' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
                      >
                        {collaboration.accessType.toLowerCase()} access
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Joined: {new Date(collaboration.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Projects