import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Cropper from "react-easy-crop";

interface ProfilePictureUploadProps {
    onSave: (croppedImage: string) => void;
}

export const ProfilePicture: React.FC<ProfilePictureUploadProps> = ({ onSave }) => {
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [croppedArea, setCroppedArea] = useState<any>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const onCropComplete = useCallback((croppedArea: any) => {
        setCroppedArea(croppedArea);
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setIsCropModalOpen(true);
        }
    };

    const handleCropSave = async () => {
        if (!selectedImage || !croppedArea) return;

        const canvas = document.createElement("canvas");
        const image = new Image();
        image.src = URL.createObjectURL(selectedImage);

        image.onload = () => {
            const ctx = canvas.getContext("2d");
            const { width, height } = croppedArea;
            canvas.width = width;
            canvas.height = height;

            ctx?.drawImage(
                image,
                croppedArea.x,
                croppedArea.y,
                croppedArea.width,
                croppedArea.height,
                0,
                0,
                width,
                height
            );

            const croppedImage = canvas.toDataURL("image/jpeg");
            onSave(croppedImage);
            setIsCropModalOpen(false);
        };
    };

    return (
        <div className="flex items-center justify-center">
            <label>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
                {/* Foto de perfil */}
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
                    {!selectedImage && <span className="text-gray-500">+</span>}
                    {selectedImage && (
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    )}
                </div>
            </label>

            {/* Modal de recorte */}
            {isCropModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold text-center mb-4">Crop Your Picture</h2>
                        <div className="relative w-full h-64">
                            <Cropper
                                image={selectedImage ? URL.createObjectURL(selectedImage) : ""}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                            <Button variant="secondary" onClick={() => {setIsCropModalOpen(false)
                                setSelectedImage(null)}}>
                                Cancel
                            </Button>
                            <Button onClick={handleCropSave}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
