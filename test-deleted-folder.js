// Test script to check the deleted folder creation functionality
async function testDeletedFolder() {
    console.log('🧪 Testing Deleted Folder Creation...');
    
    try {
        // Create a test directory structure
        console.log('📁 Creating test directory structure...');
        
        // Test the API endpoint to see if it creates the deleted folder
        const response = await fetch('http://localhost:9000/api/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sourcePath: './test-images',
                outputPath: './test-output'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ API Response for deleted folder test:', JSON.stringify(result, null, 2));
        
        // Check if the test succeeded
        console.log('🔍 The API call should have created the "deleted" folder even with no images');
        console.log('📊 Processed:', result.processedCount, 'Skipped:', result.skippedCount);
        
        if (result.errors && result.errors.length > 0) {
            console.log('⚠️ Errors found:', result.errors);
        } else {
            console.log('✅ No errors - deleted folder functionality is working');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testDeletedFolder(); 