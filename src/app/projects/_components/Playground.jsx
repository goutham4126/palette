"use client"
import { SandpackPreview, SandpackProvider, useSandpack } from "@codesandbox/sandpack-react"
import { useEffect, useState } from "react"
import { TfiFullscreen } from "react-icons/tfi"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import FileExplorer from "./FileExplorer"
import MonacoEditor from "./MonacoEditor"
import SandboxConsole from "./SandboxConsole"
import { Button } from "@/components/ui/button"
import { updateManualProject, getManualProject } from "@/app/actions/manual"
import { toast } from "react-hot-toast"
import { RiChatAiFill } from "react-icons/ri"
import { FaUserAlt } from "react-icons/fa"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  addCollaboratorToProject,
  deleteCollaboratorFromProject,
  getAllCollaboratorsByProjectId,
} from "@/app/actions/collaborators"
import { AccessType } from "@prisma/client"

const defaultFiles = {
  "/index.html": `<!DOCTYPE html>
<html>
<head>
  <title>Document</title>
  <link rel="stylesheet" href="/styles.css">
  <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
  <h1>Hello World</h1>
  <script src="/index.js"></script>
</body>
</html>`,
  "/styles.css": `h1 { color: red; }`,
  "/index.js": "",
}
async function fetchProjectCode(projectId) {
  try {
    if (!projectId) {
      return defaultFiles
    }

    const project = await getManualProject(projectId)

    if (!project) {
      return defaultFiles
    }

    return {
      "/index.html": project.htmlCode || defaultFiles["/index.html"],
      "/styles.css": project.cssCode || defaultFiles["/styles.css"],
      "/index.js": project.jsCode || defaultFiles["/index.js"],
    }
  } catch (error) {
    console.error("Failed to load project:", error)
    toast.error("Failed to load project")
    return defaultFiles
  }
}
const SaveButton = ({ projectId }) => {
  const { sandpack } = useSandpack()

  const handleSave = async () => {
    try {
      if (!projectId) {
        toast.error("Project ID is missing")
        return
      }

      const files = sandpack?.files

      if (!files) {
        toast.error("No files to save")
        return
      }

      const htmlCode = files["/index.html"]?.code || ""
      const cssCode = files["/styles.css"]?.code || ""
      const jsCode = files["/index.js"]?.code || ""

      await updateManualProject(projectId, htmlCode, cssCode, jsCode)
      toast.success("Project saved successfully!")
    } catch (error) {
      console.error("Failed to save project:", error)
      toast.error("Failed to save project. Please try again.")
    }
  }

  return (
    <Button variant="default" onClick={handleSave}>
      Save
    </Button>
  )
}

const CollaboratorModal = ({ projectId, onClose }) => {
  const [collaborators, setCollaborators] = useState([])
  const [email, setEmail] = useState("")
  const [accessType, setAccessType] = useState(AccessType.VIEW)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadCollaborators = async () => {
      try {
        if (!projectId) {
          return
        }

        const result = await getAllCollaboratorsByProjectId(projectId)
        const data = result?.data || []
        setCollaborators(data)
      } catch (error) {
        console.error("Failed to load collaborators:", error)
        toast.error("Failed to load collaborators")
      }
    }

    loadCollaborators()
  }, [projectId])

  const handleAddCollaborator = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!projectId) {
        toast.error("Project ID is missing")
        setIsLoading(false)
        return
      }

      const normalizedEmail = email.toLowerCase().trim()
      if (!validateEmail(normalizedEmail)) {
        toast.error("Please enter a valid email address")
        setIsLoading(false)
        return
      }

      const result = await addCollaboratorToProject(projectId, normalizedEmail, accessType)

      const success = result?.success
      const message = result?.message

      if (success) {
        toast.success("Collaborator added!")
        setEmail("")
        setAccessType(AccessType.VIEW)

        const collaboratorsResult = await getAllCollaboratorsByProjectId(projectId)
        const data = collaboratorsResult?.data || []
        setCollaborators(data)
      } else {
        toast.error(message || "Failed to add collaborator")
      }
    } catch (error) {
      console.error("Failed to add collaborator:", error)
      toast.error("Failed to add collaborator")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (collaboratorEmail) => {
    try {
      if (!projectId) {
        toast.error("Project ID is missing")
        return
      }

      const result = await deleteCollaboratorFromProject(projectId, collaboratorEmail)

      const success = result?.success
      const message = result?.message

      if (success) {
        toast.success("Collaborator removed")
        setCollaborators((prev) => prev.filter((c) => c.email !== collaboratorEmail))
      } else {
        toast.error(message || "Failed to remove collaborator")
      }
    } catch (error) {
      console.error("Failed to remove collaborator:", error)
      toast.error("Failed to remove collaborator")
    }
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Collaborators</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddCollaborator} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Collaborator Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Access Level</Label>
            <Select value={accessType} onValueChange={(value) => setAccessType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select access type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AccessType.VIEW}>View</SelectItem>
                <SelectItem value={AccessType.EDIT}>Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Collaborator"}
          </Button>
        </form>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Current Collaborators</h3>
          <div className="space-y-2">
            {collaborators.length > 0 ? (
              collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{collaborator.email}</p>
                    <p className="text-sm text-gray-500">{collaborator.accessType.toLowerCase()} access</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(collaborator.email)}
                    aria-label={`Remove ${collaborator.email}`}
                  >
                    Remove
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No collaborators added yet</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const Playground = ({ template = "static", projectId }) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [files, setFiles] = useState(defaultFiles)
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false)

  useEffect(() => {
    async function loadProject() {
      if (projectId) {
        const savedFiles = await fetchProjectCode(projectId)
        setFiles(savedFiles)
      }
    }
    loadProject()
  }, [projectId])

  return (
    <div className="relative h-[95vh]">
      {isCollaboratorModalOpen && (
        <CollaboratorModal projectId={projectId} onClose={() => setIsCollaboratorModalOpen(false)} />
      )}

      <SandpackProvider files={files} template={template} theme="light">
        {isFullScreen && (
          <div className="fixed inset-0 z-50 bg-white">
            <button
              className="absolute right-1 top-1 z-50 rounded bg-gray-800 p-2 text-white"
              onClick={() => setIsFullScreen(false)}
            >
              Exit Fullscreen
            </button>
            <SandpackPreview showNavigator showOpenInCodeSandbox={false} className="h-[95vh] overflow-y-scroll" />
          </div>
        )}

        <ResizablePanelGroup direction="horizontal" className="h-[95vh] overflow-y-scroll rounded-lg border">
          <ResizablePanel defaultSize={14}>
            <FileExplorer />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={43}>
            <MonacoEditor />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={43}>
            <ResizablePanelGroup direction="vertical" className="h-[95vh] overflow-y-scroll">
              <ResizablePanel defaultSize={95}>
                <div className="relative h-[95vh] overflow-y-scroll">
                  <div className="flex justify-between items-center p-1.5 border-b bg-white text-black">
                    <h1 className="text-xl font-bold">Preview</h1>
                    <div className="flex items-center gap-6">
                      <FaUserAlt
                        className="h-5 w-5 cursor-pointer"
                        onClick={() => setIsCollaboratorModalOpen(true)}
                        aria-label="Manage collaborators"
                      />
                      <a href="/ai">
                        <RiChatAiFill className="h-6 w-6 cursor-pointer" />
                      </a>
                      <Button className="bg-black text-white">
                        <a href="/components">Components</a>
                      </Button>
                      <SaveButton projectId={projectId} />
                      <TfiFullscreen className="cursor-pointer h-5 w-5" onClick={() => setIsFullScreen(true)} />
                    </div>
                  </div>
                  <SandpackPreview
                    showOpenNewtab
                    showOpenInCodeSandbox={false}
                    className="h-[95vh] overflow-y-scroll"
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={5}>
                <SandboxConsole />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SandpackProvider>
    </div>
  )
}

export default Playground

