import * as TaskManager from 'expo-task-manager';
import * as FileSystem from 'expo-file-system';

const BACKGROUND_DOWNLOAD_TASK = 'BACKGROUND_DOWNLOAD_TASK';

TaskManager.defineTask(BACKGROUND_DOWNLOAD_TASK, async ({ data, error }) => {
    if (error) {
        console.error('Background download task failed:', error);
        return;
    }
    
    const { url, filePath } = data;

    try {
        const downloadResult = await FileSystem.downloadAsync(url, filePath);
        console.log('Downloaded file:', downloadResult.uri);
    } catch (err) {
        console.error('Error downloading file:', err);
    }
});
