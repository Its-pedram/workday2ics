export function generateBlob(fileContent: string, fileName: string, fileType: string) {
    if (typeof document === 'undefined') {
        return;
    }
    
    const blob = new Blob([fileContent], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}