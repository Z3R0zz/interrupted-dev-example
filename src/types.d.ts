interface FileData {
    id: number;
    user_id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    metadata: string;
}

export interface ApiResponse {
    file: FileData;
    url: string;
}