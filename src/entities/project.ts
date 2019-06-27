export interface IProject {
    nom: string;
    description: string;
    equipe: string;
    date: string;
    idx?: number;
}
export interface IProjectStatus {
    status: Number;
    commentaire: String;
    date: String;
}