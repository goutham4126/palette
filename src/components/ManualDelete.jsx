"use client"; 
import { useTransition } from "react";
import { toast } from "react-hot-toast";
import { deleteManualProject } from "@/app/actions/manual";
import { FiDelete } from "react-icons/fi";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteProjectButton({ id }) {
  const [isPending, startTransition] = useTransition(); 
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-red-600 text-2xl">
        <FiDelete/>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete your project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                try {
                  await deleteManualProject(id);
                  toast.success("Project deleted successfully");
                  router.refresh();
                } catch (error) {
                  toast.error("Failed to delete project. Please try again.");
                }
              })
            }
            disabled={isPending}
            className="bg-red-600"
          >
            {isPending ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
