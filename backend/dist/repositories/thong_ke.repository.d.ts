export declare const layThongKeTongHopRepo: (userId: string) => Promise<{
    coCauLoaiTu: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.WordGroupByOutputType, "pos"[]> & {
        _count: {
            id: number;
        };
    })[];
    tienDoLeitner: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.WordProgressGroupByOutputType, "box"[]> & {
        _count: {
            id: number;
        };
    })[];
    duLieuHeatmap: {
        id: string;
        userId: string;
        date: Date;
        sessionsCount: number;
        wordsStudied: number;
        studyTimeSeconds: number;
    }[];
    thoiGianOnTap: {
        timeSeconds: number | null;
        startedAt: Date;
    }[];
}>;
export declare const layLichSuHocTapRepo: (userId: string) => Promise<({
    folder: {
        name: string;
    };
} & {
    id: string;
    userId: string;
    folderId: number;
    mode: import("@prisma/client").$Enums.StudyMode;
    totalWords: number;
    correctCount: number;
    accuracy: number;
    maxStreak: number;
    timeSeconds: number | null;
    bestRecord: boolean;
    startedAt: Date;
    completedAt: Date;
})[]>;
export declare const ghiNhanHeartbeatRepo: (userId: string, seconds: number) => Promise<{
    id: string;
    userId: string;
    date: Date;
    sessionsCount: number;
    wordsStudied: number;
    studyTimeSeconds: number;
}>;
//# sourceMappingURL=thong_ke.repository.d.ts.map