declare class OwnerDto {
    userId: string;
    role: 'primary' | 'secondary';
}
export declare class CreatePetDto {
    name: string;
    species: 'cat' | 'dog';
    breed?: string;
    dateOfBirth?: string;
    gender: 'male' | 'female';
    weight?: number;
    profilePhoto?: string;
    photos?: string[];
    owners?: OwnerDto[];
    health?: Record<string, unknown>;
    behaviour?: Record<string, unknown>;
    grooming?: Record<string, unknown>;
    isActive?: boolean;
}
export {};
