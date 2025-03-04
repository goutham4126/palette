"use server";
import { checkUser } from "@/lib/auth";
import { db } from "@/lib/database";

export const addPurchaseOfProjectByUser = async (templateId) => {
  try {
    const user = await checkUser();
    const template = await db.manualproject.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      throw new Error('Template not found');
    }

    const existingPurchase = await db.purchase.findUnique({
      where: {
        buyerId_templateId: {
          buyerId: user.id,
          templateId: templateId
        }
      }
    });

    if (existingPurchase) {
      return { success: false, error: 'Project already purchased' };
    }

    const purchase = await db.purchase.create({
      data: { 
        buyerId: user.id, 
        templateId,
        purchasedAt: new Date()
      },
    });

    return { success: true, data: purchase };
  } catch (error) {
    console.error('Purchase Error:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to record purchase' 
    };
  }
};


export const checkProjectPurchasedByUser = async (templateId) => {
    try {
        const user = await checkUser();
        const existingPurchase = await db.purchase.findUnique({
          where: {
            buyerId_templateId: {
              buyerId: user.id,
              templateId: templateId
            }
          }
        });
        return !!existingPurchase;
      } catch (error) {
        return false;
      }
};


export const getAllBuyersByProject = async (templateId) => {
  try {
    const buyers = await db.purchase.findMany({
      where: { templateId: templateId },
      include: { buyer: { select: { id: true, name: true, email: true }} }
    });
    return { success: true, data: buyers };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

  
export async function getAllPurchasesInProject() {
  try {
    const projects = await db.manualproject.findMany({
      orderBy: {
        purchases: {
          _count: 'desc'
        }
      },
      select: {
        id: true,
        title: true,
        price: true,
        _count: {
          select: { purchases: true }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true
          }
        }
      },
      take: 10 // Get top 10 most purchased
    });
    return projects;
  } catch (error) {
    return { success: false, message: "Failed to get projects", data: [] };
  }
}


