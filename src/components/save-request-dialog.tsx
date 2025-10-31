"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SaveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestName: string;
  onRequestNameChange: (name: string) => void;
  onSave: () => void;
}

export function SaveRequestDialog({
  open,
  onOpenChange,
  requestName,
  onRequestNameChange,
  onSave,
}: SaveRequestDialogProps) {
  const handleSave = () => {
    onSave();
    onOpenChange(false);
    onRequestNameChange('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Request</DialogTitle>
          <DialogDescription>
            Give your request a name to save it for later use
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label>Request Name</Label>
          <Input
            placeholder="My API Request"
            value={requestName}
            onChange={(e) => onRequestNameChange(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={!requestName.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
