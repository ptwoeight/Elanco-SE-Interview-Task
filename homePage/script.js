function copyLink(codeId) {
    const codeElement = document.getElementById(codeId);
    const codeText = codeElement.textContent;

    navigator.clipboard.writeText(codeText).then(() => {
        codeElement.textContent = "Copied!";
        codeElement.style.color = '#4caf50';  
        
        setTimeout(() => {
            codeElement.textContent = codeText;
            codeElement.style.color = '#FFFFFF';  
        }, 3000);

    }).catch(err => {
        console.error("Failed to copy code: ", err);
    });
}
