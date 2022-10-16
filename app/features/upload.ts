import type { ChangeEvent, DragEvent } from "react";
import * as Signature from "~/models/signature";
import * as PDF from "~/models/pdf";
import { clone } from "~/models/file";

type Event = ChangeEvent | DragEvent;

function isDropbox(event: Event): event is DragEvent {
  return "dataTransfer" in event;
}

function isFileInput(event: Event): event is ChangeEvent<HTMLInputElement> {
  return "files" in event.target;
}

function getFilesFromEvent(event: Event): File[] {
  // check is dropbox
  if (isDropbox(event) && event.dataTransfer.files) {
    return Array.from(event.dataTransfer.files);
  }

  // check is file input
  if (isFileInput(event) && event.target.files) {
    return Array.from(event.target.files);
  }

  throw new Error(`doesn't support this event: ${event.type}`);
}

const repositories = {
  signature: Signature.insertOne,
  pdf: PDF.insertOne,
};
type FileType = keyof typeof repositories;

/**
 * upload flow:
 *   - handle change event and drop event, and get all files should be upload
 *   - decide which repository should be used to saving files depends on file type
 *   - if single file then return string
 *   - if multiple file then return string[]
 * @param type specify which file type should be upload
 * @param multiple support multiple file upload
 * @returns file uuid in database
 */
function upload(
  type: FileType,
  multiple?: boolean
): (event: Event) => Promise<string>;
function upload(
  type: FileType,
  multiple: false
): (event: Event) => Promise<string>;
function upload(
  type: FileType,
  multiple: true
): (event: Event) => Promise<string[]>;
function upload(
  type: FileType,
  multiple?: boolean
): (event: Event) => Promise<string> | Promise<string[]> {
  return function handle(event) {
    // get files from event
    const files = getFilesFromEvent(event).map(clone);

    // decide which repository should be store
    const repository = repositories[type];

    // save files into repository
    if (multiple) {
      return Promise.all(files.map(repository));
    }
    return repository(files[0]);
  };
}

export default upload;
