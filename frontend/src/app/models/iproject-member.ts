export enum ProjectMemberRole {
    'Owner', 
    'Project Manager', 
    'Developer', 
    'Tester/QA', 
    'Contributor', 
    'Observer'
}

export interface IProjectMember {
    id ?: string;
    projectId : string;
    userId : string;
    role : ProjectMemberRole;
}
