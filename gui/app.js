// Global variables
let isProcessing = false;
let currentRequest = null;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set default paths based on platform
    const defaultPath = navigator.platform.includes('Mac') 
        ? '/Users/' + (navigator.userAgent.match(/Username\/(\w+)/) ? navigator.userAgent.match(/Username\/(\w+)/)[1] : 'your-username') + '/Pictures'
        : navigator.platform.includes('Win') 
            ? 'C:\\Users\\your-username\\Pictures'
            : '/home/your-username/Pictures';
    
    document.getElementById('sourcePath').value = defaultPath;
    
    // Add event listeners
    document.getElementById('sourcePath').addEventListener('input', validatePaths);
    document.getElementById('outputPath').addEventListener('input', validatePaths);
    
    // Initialize validation
    validatePaths();
}

// Function to trigger directory browsing
function browseForDirectory(inputId) {
    if (inputId === 'sourcePath') {
        document.getElementById('sourceDirectoryInput').click();
    } else if (inputId === 'outputPath') {
        document.getElementById('outputDirectoryInput').click();
    }
}

// Function to handle directory selection
function handleDirectorySelection(inputId, fileInput) {
    const files = fileInput.files;
    if (files.length > 0) {
        // Get the directory path from the first file
        const firstFile = files[0];
        let directoryPath = firstFile.webkitRelativePath;
        
        // Extract just the directory part (remove filename)
        const pathParts = directoryPath.split('/');
        pathParts.pop(); // Remove the filename
        directoryPath = pathParts.join('/');
        
        // Due to browser security restrictions, we can't get the full absolute path
        // So we'll show a helpful message and suggest the likely full path
        if (directoryPath) {
            // Get just the folder name for a cleaner display
            const folderName = directoryPath.split('/').pop() || directoryPath;
            
            // Set the relative path but make it clear to the user
            document.getElementById(inputId).value = `./${folderName}`;
            
            // Provide helpful feedback
            addLogEntry(`📁 Selected directory: "${folderName}"`, 'success');
            addLogEntry(`🔒 Browser security shows relative path. If processing fails, edit to full path:`, 'info');
            addLogEntry(`   Example: /Users/nick/${folderName}`, 'info');
        } else {
            // Fallback if we can't determine the path
            document.getElementById(inputId).value = './selected-directory';
            addLogEntry('Directory selected. You may need to edit to the full absolute path', 'info');
        }
        
        validatePaths();
    }
}

function suggestCurrentDir(inputId) {
    const input = document.getElementById(inputId);
    const currentPath = './';
    input.value = currentPath;
    validatePaths();
    addLogEntry('Set to current directory. You may need to adjust the path.', 'info');
}

function suggestOutputDir() {
    const sourcePath = document.getElementById('sourcePath').value;
    const outputInput = document.getElementById('outputPath');
    
    if (sourcePath) {
        // Suggest a renamed-images folder in the same parent directory
        const parentDir = sourcePath.substring(0, sourcePath.lastIndexOf('/')) || sourcePath;
        outputInput.value = parentDir + '/ai-renamed-images';
    } else {
        outputInput.value = './ai-renamed-images';
    }
    validatePaths();
    addLogEntry('Auto-generated output directory path', 'info');
}

function validatePaths() {
    const sourcePath = document.getElementById('sourcePath').value.trim();
    const outputPath = document.getElementById('outputPath').value.trim();
    const processBtn = document.getElementById('processBtn');
    
    const isValid = sourcePath.length > 0 && outputPath.length > 0 && sourcePath !== outputPath;
    
    processBtn.disabled = !isValid || isProcessing;
    
    // Visual feedback
    const sourceInput = document.getElementById('sourcePath');
    const outputInput = document.getElementById('outputPath');
    
    if (sourcePath.length > 0) {
        sourceInput.style.borderColor = '#10b981';
    } else {
        sourceInput.style.borderColor = '#e5e7eb';
    }
    
    if (outputPath.length > 0 && outputPath !== sourcePath) {
        outputInput.style.borderColor = '#10b981';
    } else if (outputPath === sourcePath && outputPath.length > 0) {
        outputInput.style.borderColor = '#ef4444';
    } else {
        outputInput.style.borderColor = '#e5e7eb';
    }
}

async function startProcessing() {
    const sourcePath = document.getElementById('sourcePath').value.trim();
    const outputPath = document.getElementById('outputPath').value.trim();
    
    if (!sourcePath || !outputPath) {
        alert('Please enter both source and output paths.');
        return;
    }
    
    if (sourcePath === outputPath) {
        alert('Source and output paths must be different.');
        return;
    }
    
    // Start processing
    isProcessing = true;
    updateUI('processing');
    
    try {
        updateStatus('🚀 Starting image processing...', true);
        addLogEntry('Starting image renaming process...', 'info');
        addLogEntry(`Source: ${sourcePath}`, 'info');
        addLogEntry(`Output: ${outputPath}`, 'info');
        
        // Make API call
        const response = await fetch('/api/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sourcePath: sourcePath,
                outputPath: outputPath
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        const results = await response.json();
        
        if (results.error) {
            throw new Error(results.error);
        }
        
        // Display results
        displayResults(results);
        updateStatus('✅ Processing completed successfully!', false);
        addLogEntry('Processing completed successfully!', 'success');
        
    } catch (error) {
        console.error('Processing error:', error);
        updateStatus(`❌ Error: ${error.message}`, false);
        addLogEntry(`Error: ${error.message}`, 'error');
        
        // Show error details
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('summary').innerHTML = `
            <div class="summary-item">
                <div class="number" style="color: #ef4444;">Error</div>
                <div class="label">Processing Failed</div>
            </div>
        `;
        document.getElementById('details').innerHTML = `
            <div style="padding: 20px; color: #991b1b; background: #fee2e2; border-radius: 8px;">
                <strong>Error Details:</strong><br>
                ${error.message}
                <br><br>
                <strong>Troubleshooting Tips:</strong>
                <ul style="margin-top: 10px; margin-left: 20px;">
                    <li>Verify that the source path exists and contains image files</li>
                    <li>Ensure you have write permissions for the output directory</li>
                    <li>Check that your Google Gemini API key is properly configured</li>
                    <li>Make sure the server is running and accessible</li>
                </ul>
            </div>
        `;
    } finally {
        isProcessing = false;
        updateUI('idle');
    }
}

function stopProcessing() {
    if (currentRequest) {
        currentRequest.abort();
        currentRequest = null;
    }
    
    isProcessing = false;
    updateUI('idle');
    updateStatus('⏹️ Processing stopped by user', false);
    addLogEntry('Processing stopped by user', 'warning');
}

function updateUI(state) {
    const processBtn = document.getElementById('processBtn');
    const stopBtn = document.getElementById('stopBtn');
    const container = document.querySelector('.container');
    
    if (state === 'processing') {
        processBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
        container.classList.add('processing');
        document.getElementById('logSection').style.display = 'block';
    } else {
        processBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
        container.classList.remove('processing');
    }
    
    validatePaths();
}

function updateStatus(message, showProgress) {
    const statusText = document.getElementById('statusText');
    const progress = document.getElementById('progress');
    
    statusText.textContent = message;
    progress.style.display = showProgress ? 'block' : 'none';
    
    if (showProgress) {
        // Simulate progress for better UX
        let progressValue = 0;
        const progressBar = document.getElementById('progressBar');
        const progressInterval = setInterval(() => {
            progressValue += Math.random() * 10;
            if (progressValue >= 90) {
                progressValue = 90;
                clearInterval(progressInterval);
            }
            progressBar.style.width = progressValue + '%';
        }, 500);
        
        // Store interval to clear it later
        updateStatus.progressInterval = progressInterval;
    } else {
        if (updateStatus.progressInterval) {
            clearInterval(updateStatus.progressInterval);
            updateStatus.progressInterval = null;
        }
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = '100%';
        setTimeout(() => {
            progress.style.display = 'none';
            progressBar.style.width = '0%';
        }, 1000);
    }
}

function addLogEntry(message, type = 'info') {
    const logContainer = document.getElementById('logContainer');
    const timestamp = new Date().toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    
    let icon = '';
    switch (type) {
        case 'success': icon = '✅'; break;
        case 'error': icon = '❌'; break;
        case 'warning': icon = '⚠️'; break;
        case 'info': icon = 'ℹ️'; break;
        default: icon = '•';
    }
    
    logEntry.innerHTML = `[${timestamp}] ${icon} ${message}`;
    logContainer.appendChild(logEntry);
    
    // Auto-scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Limit log entries to prevent memory issues
    const entries = logContainer.querySelectorAll('.log-entry');
    if (entries.length > 100) {
        entries[0].remove();
    }
}

function displayResults(results) {
    const resultsSection = document.getElementById('resultsSection');
    const summary = document.getElementById('summary');
    const details = document.getElementById('details');
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Display summary
    summary.innerHTML = `
        <div class="summary-item">
            <div class="number">${results.processedCount}</div>
            <div class="label">Successfully Processed</div>
        </div>
        <div class="summary-item">
            <div class="number">${results.skippedCount}</div>
            <div class="label">Skipped Files</div>
        </div>
        <div class="summary-item">
            <div class="number">${results.errors?.length || 0}</div>
            <div class="label">Errors</div>
        </div>
        <div class="summary-item">
            <div class="number">${results.processedCount + results.skippedCount}</div>
            <div class="label">Total Files</div>
        </div>
    `;
    
    // Display detailed results
    if (results.progress && results.progress.length > 0) {
        let detailsHTML = '';
        results.progress.forEach(item => {
            const statusClass = item.status.toLowerCase().includes('success') ? 'success' : 
                              item.status.toLowerCase().includes('error') ? 'error' : 'skipped';
            
            detailsHTML += `
                <div class="detail-item">
                    <div class="original">${item.filename}</div>
                    <div class="new">${item.newFilename || 'N/A'}</div>
                    <div class="status ${statusClass}">${item.status}</div>
                </div>
            `;
        });
        details.innerHTML = detailsHTML;
    } else {
        details.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280;">No detailed results available</div>';
    }
    
    // Add log entries for all processed files
    results.progress?.forEach(item => {
        const logType = item.status.toLowerCase().includes('success') ? 'success' : 
                       item.status.toLowerCase().includes('error') ? 'error' : 'warning';
        addLogEntry(`${item.filename} → ${item.status}`, logType);
    });
}

// Utility function to format file paths for display
function formatPath(path) {
    if (path.length > 50) {
        return '...' + path.substring(path.length - 47);
    }
    return path;
}

// Handle window beforeunload to warn about ongoing process
window.addEventListener('beforeunload', function(e) {
    if (isProcessing) {
        const message = 'Image processing is still in progress. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
    }
});

// Handle errors globally
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    addLogEntry(`Unexpected error: ${e.error?.message || 'Unknown error'}`, 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    addLogEntry(`Promise rejection: ${e.reason?.message || e.reason}`, 'error');
}); 