"use server"
import { checkUser } from "@/lib/auth"
import { db } from "@/lib/database"

export async function createManualProject(data) {
  const user = await checkUser()

  const projectData = {
    title: data.title,
    creatorId: user.id,
  }

  const project = await db.manualproject.create({
    data: projectData,
  })

  return project
}


export async function getAllManualProjects(){
  const projects = await db.manualproject.findMany()
  return projects
}

export async function getAllManualProjectsByUser(id)
{
   return await db.manualproject.findMany(
    {
      where:{
        creatorId:id,
      }
    }
   )
}

export async function deleteManualProject(id) {
  await db.manualproject.delete({
    where: {
      id: id
    }
  })
}


export async function getManualProject(id) {
  const user = await checkUser();

  const project = await db.manualproject.findUnique({
    where: { id },
  });

  if (!project || project.creatorId !== user.id) {
    throw new Error("Unauthorized or project not found");
  }

  return project;
}

export async function updateManualProject(id, htmlCode, cssCode, jsCode) {
  const user = await checkUser();

  const project = await db.manualproject.findUnique({
    where: { id },
  });

  if (!project || project.creatorId !== user.id) {
    throw new Error("Unauthorized or project not found");
  }

  return db.manualproject.update({
    where: { id },
    data: { htmlCode, cssCode, jsCode },
  });
}
