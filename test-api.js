// Test script to check the API functionality
async function testAPI() {
    console.log('🧪 Testing AI Image Renamer API...');
    
    try {
        // Test the API endpoint with empty directories (should not crash)
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
        console.log('✅ API Response:', JSON.stringify(result, null, 2));
        
        if (result.errors && result.errors.length > 0) {
            console.log('⚠️ Errors found:', result.errors);
        } else {
            console.log('✅ No errors in API response');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testAPI(); 