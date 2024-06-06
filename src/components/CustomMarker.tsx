import React, { useEffect, useState } from 'react';
import { useMarkerContext } from '../Context/SelectedCustomMarkeContext';
import { useCustomMarkerContext } from '../Context/CustomMarkerContext';

// Define the types for the directory and file objects
interface FileObject {
    name: string;
    url: string;
}

interface DirectoryObject {
    name: string;
    files: FileObject[];
}

interface CustomMarkersProps {
    onSelectImage: (url: string) => void;
}

const CustomMarkers: React.FC<CustomMarkersProps> = ({ onSelectImage }) => {
    const [directories, setDirectories] = useState<DirectoryObject[]>([]);
    const [selectedDirectory, setSelectedDirectory] = useState<string | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
    const { setSelectedMarker: setContextSelectedMarker } = useMarkerContext();
    const { selectedImages, setSelectedImages } = useCustomMarkerContext();

    useEffect(() => {
        fetchDirectories();
    }, []);

    const fetchDirectories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/images');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched data:', data);

            // Convert the response to the DirectoryObject format
            const directories = Object.entries(data).map(([dirName, files]) => ({
                name: dirName,
                files: (files as string[]).map(file => ({
                    name: file,
                    url: `http://127.0.0.1:5000/images/${dirName ? `${dirName}/` : ''}${file}`
                }))
            }));

            console.log('Parsed directories:', directories);
            setDirectories(directories);
            if (directories.length > 0) {
                setSelectedDirectory(directories[0].name);
            }
        } catch (error) {
            console.error('Error fetching directories:', error);
        }
    };

    const handleDirectoryClick = (dirName: string) => {
        setSelectedDirectory(dirName);
    };

    const handleImageClick = (fileUrl: string, fileName: string) => {
        setSelectedMarker(fileUrl);
        setContextSelectedMarker(fileUrl);
        setSelectedImages([fileUrl]);
        onSelectImage(fileUrl);
        
        // Log the name of the clicked marker
        console.log('Clicked marker name:', fileName);
    };

    return (
        <div className='w-[19rem] h-screen overflow-x-auto p-2 shadow-md fixed top-0 -ml-44'>
            <div className="container mx-auto p-4">
                <div className="flex flex-col">
                    <div className="flex space-x-2 mb-4 overflow-x-auto scroll">
                        {directories.map((directory, index) => (
                            <button
                                key={index}
                                className={`cursor-pointer p-2 rounded-md whitespace-nowrap ${selectedDirectory === directory.name ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                                onClick={() => handleDirectoryClick(directory.name)}
                            >
                                {directory.name || 'Root'}
                            </button>
                        ))}
                    </div>
                    <div className="flex-grow bg-gray-100 rounded-md scroll">
                        {selectedDirectory && (
                            <div className="grid grid-cols-4 gap-4">
                                {directories.find(dir => dir.name === selectedDirectory)?.files.map((file, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 border rounded-md cursor-pointer ${selectedMarker === file.url ? 'border-4 border-blue-500' : 'border-gray-300'}`}
                                        onClick={() => handleImageClick(file.url, file.name)}
                                    >
                                        <img src={file.url} alt={file.name} className="w-full h-auto object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomMarkers;
