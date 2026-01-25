export interface IDocument {
  _id?: string;           // MongoDB unique identifier
  userId: string;         // Reference to the user who uploaded it
  name: string;           // Original filename (e.g., "resume.pdf")
  size: string;           // Formatted size (e.g., "1.2 MB")
  type: string;           // File extension or MIME category (e.g., "PDF", "PNG")
  notes?: string;         // Optional user-provided description
  url: string;            // The accessible path/link to the file
  uploadedAt: string;     // ISO Date string for sorting
}