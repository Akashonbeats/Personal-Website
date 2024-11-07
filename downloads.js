document.getElementById('downloadDocs').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior

    // List of files to download
    const files = [
        { url: 'Institute Certifications.pdf', name: 'Akash Sampath - Institute Certifications.pdf' },
        { url: 'ULearn Certificates.pdf', name: 'Akash Sampath - Comcast Certifications.pdf' }
    ];

    // Function to trigger download
    function downloadFile(file) {
        const a = document.createElement('a');
        a.href = file.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Trigger downloads for each file
    files.forEach(file => downloadFile(file));
});