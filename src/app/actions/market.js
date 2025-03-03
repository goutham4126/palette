"use server"
import { checkUser } from "@/lib/auth"
import { db } from "@/lib/database"
import { revalidatePath } from "next/cache"


export async function addProjectForSale(projectId, price, details) {
  try {
    const user = await checkUser();
    
    if (typeof price !== "number" || price <= 0) {
      throw new Error("Invalid price value");
    }
    if (!details || typeof details !== "string" || details.trim() === "") {
      throw new Error("Details are required");
    }

    const project = await db.manualproject.update({
      where: {
        id: projectId,  
        creatorId: user.id
      },
      data: {
        isListed: true,
        price: price,
        details: details
      }
    });

    revalidatePath("/market");
    return { success: true, project };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDetailsforProject(id) {
  try {
    const project = await db.manualproject.findUnique({
      where: { id: id },
  });
    return project;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateProjectForSale(projectId, price, details) {
  try {
    const user = await checkUser();
    
    if (typeof price !== "number" || price <= 0) {
      throw new Error("Invalid price value");
    }
    if (!details || typeof details !== "string" || details.trim() === "") {
      throw new Error("Details are required");
    }

    const project = await db.manualproject.update({
      where: {
        id: projectId,
        creatorId: user.id
      },
      data: {
        price: price,
        details: details
      }
    });

    revalidatePath("/market");
    revalidatePath(`/projects/${projectId}`);
    return { success: true, project };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteProjectForSale(projectId) {
  try {
    const user = await checkUser();

    const project = await db.manualproject.update({
      where: {
        id: projectId,
        creatorId: user.id
      },
      data: {
        isListed: false,
        price: null
      }
    });

    revalidatePath("/market");
    revalidatePath(`/projects/${projectId}`);
    return { success: true, project };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getAllProjectsForSale() {
  try {
    const projects = await db.manualproject.findMany({
      where: {
        isListed: true
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return projects.map(project => ({
      id: project.id,
      title: project.title,
      price: project.price,
      details: project.details,
      creator: project.creator,
      createdAt: project.createdAt
    }));
  } catch (error) {
    throw new Error("Failed to fetch marketplace projects");
  }
}