/**
 * Type definitions and documentation for the 'express-fileupload' module.
 *
 * This module exposes a factory function to create the express-fileupload middleware
 * and an UploadedFile shape describing a single uploaded file object attached to
 * the request (typically as part of req.files).
 *
 * @packageDocumentation
 *
 * UploadedFile
 * ------------
 * Represents a single file uploaded via the express-fileupload middleware.
 *
 * - name: The original filename provided by the client.
 * - mimetype: The detected MIME type of the uploaded file (e.g. "image/png").
 * - size: The size of the file in bytes.
 * - mv(path, cb): Move the file to a destination path on the file system.
 *   The callback is invoked with an optional error when the move completes.
 * - data?: Optional in-memory Buffer or binary data containing the file contents
 *   (present when temporary files are not used or when data is kept in memory).
 * - tempFilePath?: Optional path to a temporary file on disk (present when the
 *   middleware is configured to use temp files).
 *
 * fileUpload(options?: any): any
 * ------------------------------
 * Factory function that creates and returns the express-fileupload middleware.
 * The returned middleware parses multipart/form-data requests, populates the
 * request with uploaded file information (req.files), and provides UploadedFile
 * objects for each file.
 *
 * @param options - Optional configuration object for the middleware (see express-fileupload docs for available options).
 * @returns An Express-compatible middleware function that handles file uploads.
 *
 * @public
 */
declare module 'express-fileupload' {
  export interface UploadedFile {
    name: string;
    mimetype: string;
    size: number;
    mv: (path: string, cb: (err?: any) => void) => void;
    data?: any;
    tempFilePath?: string;
  }
  function fileUpload(options?: any): any;
  export default fileUpload;
}
