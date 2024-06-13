import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

@Injectable()
export class MusicService {
    private readonly logger = new Logger(MusicService.name);

    async getSimilarSongs(songName: string, artistName: string): Promise<any> {
        try {
            const command = `"C:/Python312/python.exe" ../AI/clustering/connection.py "${songName}" "${artistName}"`;
            const { stdout, stderr } = await execAsync(command);
            if (stderr) {
                this.logger.error('Error executing Python script:', stderr);
                return null;
            }
            return JSON.parse(stdout);
        } catch (error) {
            this.logger.error('Failed to execute Python script:', error);
            return null;
        }
    }
}
