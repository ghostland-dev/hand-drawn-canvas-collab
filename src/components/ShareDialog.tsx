
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const ShareDialog = ({ isOpen, onClose, projectId }: ShareDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [allowEdit, setAllowEdit] = useState(true);
  
  // Generate share URLs
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/board/${projectId}${allowEdit ? '' : '?mode=view'}`;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'Share link has been copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Whiteboard</DialogTitle>
          <DialogDescription>
            Anyone with the link can access this whiteboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">Link</Label>
            <Input
              id="link"
              readOnly
              value={shareUrl}
              className="w-full"
            />
          </div>
          <Button type="submit" size="icon" onClick={handleCopy} className="px-3">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="edit-mode"
            checked={allowEdit}
            onCheckedChange={setAllowEdit}
          />
          <Label htmlFor="edit-mode">
            Allow editing
          </Label>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <div className="text-xs text-muted-foreground mt-2">
            The link will work for anyone who has it.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
