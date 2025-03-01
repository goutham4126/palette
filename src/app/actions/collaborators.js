"use server"
import { checkUser } from "@/lib/auth"
import { db } from "@/lib/database"
import { revalidatePath } from "next/cache"

export async function getAllCollaboratorsByProjectId(projectId) {
  try {
    const collaborators = await db.collaborator.findMany({
      where: { projectId },
      include: {
        project: { select: { title: true } },
      },
    })

    return {
      success: true,
      data: collaborators,
    }
  } catch (error) {
    console.error("Failed to get collaborators:", error)
    return {
      success: false,
      message: "Failed to retrieve collaborators",
      data: [],
    }
  }
}

export async function addCollaboratorToProject(projectId, email, accessType) {
  try {
    const currentUser = await checkUser()

    const project = await db.manualproject.findUnique({
      where: { id: projectId },
      include: { creator: true },
    })

    if (!project) throw new Error("Project not found")
    if (project.creatorId !== currentUser.id) {
      throw new Error("Only project creator can add collaborators")
    }

    const newCollaborator = await db.collaborator.create({
      data: {
        email: email.toLowerCase(),
        projectId,
        accessType,
      },
    })

    revalidatePath(`/playgrounds/${projectId}`)
    return {
      success: true,
      message: "Collaborator added successfully",
      data: newCollaborator,
    }
  } catch (error) {
    console.error("Failed to add collaborator:", error)

    let message = "Failed to add collaborator"
    if (error.code === "P2002") {
      message = "This user is already a collaborator"
    }

    return {
      success: false,
      message: error.message || message,
    }
  }
}

export async function deleteCollaboratorFromProject(projectId, email) {
  try {
    const currentUser = await checkUser()
    const project = await db.manualproject.findUnique({
      where: { id: projectId },
    })

    if (!project) throw new Error("Project not found")
    if (project.creatorId !== currentUser.id) {
      throw new Error("Only project creator can remove collaborators")
    }

    const result = await db.collaborator.deleteMany({
      where: {
        projectId,
        email: email.toLowerCase(),
      },
    })

    if (result.count === 0) {
      throw new Error("Collaborator not found")
    }

    revalidatePath(`/projects/${projectId}`)
    return {
      success: true,
      message: "Collaborator removed successfully",
    }
  } catch (error) {
    console.error("Failed to remove collaborator:", error)
    return {
      success: false,
      message: error.message || "Failed to remove collaborator",
    }
  }
}

export async function getAllCollaborationsByUserId(userId) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!user) throw new Error("User not found");

    const collaborations = await db.collaborator.findMany({
      where: { email: user.email },
      include: {
        project: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    return { success: true, data: collaborations };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to get collaborations", data: [] };
  }
}

