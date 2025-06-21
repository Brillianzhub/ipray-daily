// db/hymns.ts
export interface BasicHymn {
    id: number;
    title: string;
    author: string | null;
    year: number | null;
    has_chorus: boolean;
    chorus: string | null;
    favorite: boolean;
}

export interface Stanza {
    stanza_number: number;
    text: string;
}

export interface HymnWithStanzas extends BasicHymn {
    stanzas: Stanza[];
}
