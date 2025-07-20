import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Camera, Send, X } from 'lucide-react';


const MessageInput = () => {
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        fileInputRef.current.value = null;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            // Clear form
            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };
    return (
        <>
            <div className='flex items-center gap-3 p-3 border-t border-base-300'>
                {imagePreview && (
                    <div className="mb-3 flex items-center gap-2">
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                            />
                            <button
                                onClick={removeImage}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                                type="button"
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full ">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
                    >
                        <Camera className="size-4" />
                    </button>
                    <button
                        type="submit"
                        className="ml-2 p-2 bg-green-500 text-white rounded-lg"
                        disabled={!text.trim() && !imagePreview}
                    >
                        <Send className="size-4" />
                    </button>
                </form>
            </div>
        </>
    )
}

export default MessageInput