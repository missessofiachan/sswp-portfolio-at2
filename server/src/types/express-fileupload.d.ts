/**
 * Type definitions and documentation for the 'express-fileupload' module.
 * This module exposes a factory function to create the express-fileupload middleware
 * and an UploadedFile shape describing a single uploaded file object attached to
 * the request (typically as part of req.files).
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
