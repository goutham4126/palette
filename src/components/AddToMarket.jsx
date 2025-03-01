"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import { addProjectForSale, updateProjectForSale, deleteProjectForSale } from "@/app/actions/market";
import toast from "react-hot-toast";

function AddToMarket({ project, isOwner }) {
  const [price, setPrice] = useState(project.price?.toString() || '');
  const [details, setDetails] = useState(project.details || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice)) {
        toast.error('Please enter a valid price');
      }
      if (details.trim() === '') {
        toast.error('Details are required');
      }

      let result;
      if (actionType === 'add') {
        result = await addProjectForSale(project.id, numericPrice,details);
      } else {
        result = await updateProjectForSale(project.id, numericPrice,details);
      }
      
      if (!result.success) toast.error(result.error);
      
      setOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteProjectForSale(project.id);
      if (result.success) toast.success("Deleted Successfully");
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  if (!isOwner) return null;

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setActionType(project.isListed ? 'edit' : 'add')}
          >
            {project.isListed ? 'Edit Price' : 'Add to Marketplace'}
          </Button>
        </DialogTrigger>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {project.isListed ? 'Update Listing' : 'List Project'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Price (USD)
              </label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="details" className="block text-sm font-medium mb-2">
                Project Details
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe your project..."
                className="w-full p-2 border rounded-md"
                rows="4"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !price}
              >
                {loading ? 'Processing...' : project.isListed ? 'Update' : 'List'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      {project.isListed && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="mt-4" variant="destructive" size="sm">
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this project from the marketplace?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Confirm Removal
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}


export default AddToMarket;