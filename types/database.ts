// Custom types for Expo SQLite
export interface SQLTransaction {
    executeSql: (
        sqlStatement: string,
        args?: any[],
        success?: (tx: SQLTransaction, result: SQLResultSet) => void,
        error?: (tx: SQLTransaction, error: SQLError) => boolean
    ) => void;
}

export interface SQLResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: {
        length: number;
        item: (index: number) => any;
        _array: any[];
    };
}

export interface SQLError {
    code: number;
    message: string;
}

export interface Prayer {
    prayer_number: number;
    prayer_category: string;
    prayer: string;
    prayer_scripture: string;
    featured: number;
}

export interface Category {
    prayer_category: string;
}