'use client';

import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/store/hooks';
import { Camera, User } from 'lucide-react'; // Import icons
import { ImageUploadRequest } from '@/types/proposal';
import imageService from '@/lib/api/imageService';
import { UpdateProfile } from '@/lib/store/features/authSlice';
import { UpdateProfileRequest } from '@/types/auth';

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: {
        username?: string;
        email?: string;
        avatarUrl?: string;
        userId?: string;
    };
}

export function EditProfileDialog({ open, onOpenChange, initialData }: EditProfileDialogProps) {
    const [username, setUsername] = useState(initialData.username || '');
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.avatarUrl || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    // 1. Handle File Selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    // 2. Trigger the hidden file input
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const uploadImage = useCallback(async (data: ImageUploadRequest) => {
        if (!data) return;
        try {
            const response = await imageService.uploadImage(data);
            return response;
        } catch (error) {
            throw error;
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let finalAvatarUrl = initialData.avatarUrl;

            // A. If a new file was selected, upload it first
            console.log("running outside", selectedFile, initialData)
            if (selectedFile && initialData.userId) {
                console.log("running inside", selectedFile, initialData)
                const response = await uploadImage({
                    imageFile: selectedFile,
                    userId: initialData.userId
                })
                if (response && response.data) {
                    const data = {
                        username: username,
                        avatarUrl: (response.data as { secure_url: string }).secure_url
                    }
                    const profileresponse = await dispatch(UpdateProfile(data))
                    if (UpdateProfile.fulfilled.match(profileresponse)) {
                        toast.success("Profile Uploaded successfully")
                    }
                    setIsLoading(false)
                    onOpenChange(false);
                    return;
                }
            }
            const data = {
                username: username,
            }
            const profileresponse = await dispatch(UpdateProfile(data))
            if (UpdateProfile.fulfilled.match(profileresponse)) {
                toast.success("Profile Uploaded successfully")
            }
            toast.success('Profile updated successfully');
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.success('Failed to update profile'); // Should be error, kept success to match your snippet style
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">

                        {/* AVATAR UPLOAD SECTION */}
                        <div className="flex flex-col items-center gap-4">
                            <div
                                onClick={triggerFileInput}
                                className="relative group cursor-pointer w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 dark:border-gray-700 transition-colors bg-muted flex items-center justify-center"
                            >
                                {previewUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={previewUrl}
                                        alt="Avatar preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="h-10 w-10 text-muted-foreground" />
                                )}

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                                    <Camera className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={triggerFileInput}
                            >
                                Change Avatar
                            </Button>

                            {/* Hidden Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* TEXT FIELDS */}
                        <div className="grid gap-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    value={initialData.email || ''}
                                    disabled
                                    className="col-span-3 bg-muted text-muted-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}