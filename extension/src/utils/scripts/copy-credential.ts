import { logger } from '../lib/logger';

export function generateCopyAllText({
  userName,
  accessKey,
}: {
  userName: string;
  accessKey: string;
}) {
  return `SecondView - Profile Sync\nUsername: ${userName}\nAccess Key: ${accessKey}\nKeep this information secure. You'll need both to sync your profile to other devices.`;
}

export function generateCredentialsFile({
  userName,
  accessKey,
}: {
  userName: string;
  accessKey: string;
}): { success: true; errorMessage?: null } | { success: false; errorMessage: string } {
  try {
    const content = `SecondView - Sync Information
  Generated at: ${new Date().toString()} 
  
  Username: ${userName}
  Access Key: ${accessKey}
  
  IMPORTANT:
  - Keep this file secure
  - You need BOTH values to sync your profile
  - Never share your access key with anyone
  - Store this in a safe location (password manager, encrypted storage)
  
  To sync on another device:
  1. Install the SecondView extension
  2. Click "Use Existing Profile"
  3. Enter your username and access key`;
    const blob = new Blob([content], { type: 'text/plain' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `second-view-sync-${userName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    const errorMessage = 'Something went wrong while creating credentials file';
    logger.error(errorMessage, error);
    return { success: false, errorMessage };
  }
}
