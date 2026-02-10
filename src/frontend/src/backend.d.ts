import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HeightMeasurement {
    id: bigint;
    heightCm: number;
    timestamp: bigint;
}
export interface FormulaResult {
    name: string;
    enabled: boolean;
    predictedHeightCm: number;
}
export interface UserProfile {
    age: number;
    currentHeightCm?: number;
    motherHeightCm: number;
    isMale: boolean;
    gender: string;
    fatherHeightCm: number;
}
export interface HeightPrediction {
    averageHeightCm: number;
    timestamp: bigint;
    predictionCounts: bigint;
    formulaResults: Array<FormulaResult>;
    activeFormulaCount: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGrowthLog(heightCm: number): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGrowthLog(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGrowthLogs(): Promise<Array<HeightMeasurement>>;
    getGrowthLogsChronological(): Promise<Array<HeightMeasurement>>;
    getSavedPredictions(): Promise<HeightPrediction | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePrediction(prediction: HeightPrediction): Promise<void>;
    updateGrowthLog(id: bigint, newHeight: number): Promise<void>;
}
