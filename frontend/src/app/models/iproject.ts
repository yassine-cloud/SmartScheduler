export enum ProjectStatus {
    Active = 'Active',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}


export interface IProject {
    id ?: string;
    name: string;
    description: string;
    status: ProjectStatus | 'Active';
    budget: number;
    startDate: string;
    endDate: string;
    createdAt ?: string;
}
